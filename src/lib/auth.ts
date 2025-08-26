import { supabase } from './supabase';
import { Profile, SocialLink, ProfileView, QRScan, ContactDownload, SocialClick } from './database.types';
import { signupLimiter, profileUpdateLimiter } from './rateLimit';

// Interface for geolocation data
interface GeolocationData {
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  ip?: string;
}

// Function to get location data from IP address (no permission required)
async function getLocationFromIP(): Promise<GeolocationData> {
  try {
    // Use a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    
    return {
      country: data.country_name || undefined,
      city: data.city || undefined,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      ip: data.ip || undefined,
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    // Return empty data on error - analytics will still work
    return {};
  }
}

// Function to upload profile photo to Supabase storage
export async function uploadProfilePhoto(file: File, userId: string): Promise<{ url: string; error: Error | null }> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Photo upload error:', error);
    return { url: '', error: error as Error };
  }
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  handle: string;
  title?: string;
  phone?: string;
  bio?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with profile creation
export async function signUp(data: SignUpData) {
  try {
    // Check rate limit
    if (!signupLimiter.canMakeRequest(data.email)) {
      throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
    }

    // Create user account with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm-email`,
      }
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      throw authError;
    }

    // If user is not null and email confirmation is required
    if (authData.user) {
      // Return a flag indicating email confirmation is needed
      return { 
        user: authData.user, 
        error: null, 
        needsEmailConfirmation: true 
      };
    }

    return { user: null, error: new Error('User creation failed'), needsEmailConfirmation: false };
  } catch (error) {
    console.error('Signup error:', error);
    return { user: null, error, needsEmailConfirmation: false };
  }
}

// Sign in
export async function signIn(data: SignInData & { rememberMe?: boolean }) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    
    // If remember me is enabled, ensure session persistence
    if (data.rememberMe) {
      // Supabase automatically handles session persistence with persistSession: true
      // But we can add additional logic here if needed
      console.log('Remember me enabled - session will persist');
    }
    
    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

// Get profile by handle
export async function getProfileByHandle(handle: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

// Get profile with social links
export async function getProfileWithSocialLinks(handle: string): Promise<{
  profile: Profile | null;
  socialLinks: SocialLink[];
  error: unknown;
}> {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { profile: null, socialLinks: [], error: profileError };
    }

    if (!profileData) {
      console.error('No profile found for handle:', handle);
      return { profile: null, socialLinks: [], error: null };
    }

    const typedProfileData = profileData as Profile;
    const { data: socialLinksData, error: socialError } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', typedProfileData.id);

    if (socialError) {
      console.error('Social links fetch error:', socialError);
      return {
        profile: typedProfileData,
        socialLinks: [],
        error: socialError
      };
    }

    return {
      profile: typedProfileData,
      socialLinks: socialLinksData || [],
      error: null
    };
  } catch (error) {
    console.error('Unexpected error in getProfileWithSocialLinks:', error);
    return { profile: null, socialLinks: [], error };
  }
}

// Create new profile (for new users)
export async function createProfile(userId: string, profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<{
  profile: Profile | null;
  error: unknown;
}> {
  try {
    console.log('createProfile called with:', { userId, profileData });
    
    // Check rate limit
    if (!profileUpdateLimiter.canMakeRequest(userId)) {
      throw new Error('Too many profile creation attempts. Please wait a moment before trying again.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    console.log('Supabase insert result:', { data, error });

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    return { profile: data, error: null };
  } catch (error) {
    console.error('createProfile error:', error);
    return { profile: null, error };
  }
}

// Update existing profile
export async function updateProfile(profileId: string, updates: Partial<Profile>): Promise<{
  profile: Profile | null;
  error: unknown;
}> {
  try {
    // Check rate limit
    if (!profileUpdateLimiter.canMakeRequest(profileId)) {
      throw new Error('Too many profile updates. Please wait a moment before trying again.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
}

// Check if handle is available
export async function isHandleAvailable(handle: string) {
  try {
    console.log('isHandleAvailable called with handle:', handle);
    
    // Check rate limit (temporarily disabled for debugging)
    // if (!handleCheckLimiter.canMakeRequest(handle)) {
    //   console.log('Rate limit hit for handle check');
    //   throw new Error('Too many handle checks. Please wait a moment before trying again.');
    // }

    console.log('Making Supabase query for handle:', handle);
    const { error } = await supabase
      .from('profiles')
      .select('handle')
      .eq('handle', handle)
      .single();

    console.log('Supabase handle check result:', { error });

    if (error && error.code === 'PGRST116') {
      // No rows returned, handle is available
      console.log('Handle is available (no rows found)');
      return { available: true, error: null };
    }

    if (error) {
      console.error('Handle availability check error:', error);
      throw error;
    }

    // Handle exists
    console.log('Handle is not available (found existing)');
    return { available: false, error: null };
  } catch (error) {
    console.error('Handle availability check failed:', error);
    return { available: false, error };
  }
}

// Social links functions
export async function createSocialLinks(profileId: string, socialLinks: Array<{ platform: string; url: string }>) {
  try {
    console.log('Creating social links for profile:', profileId, socialLinks);
    
    if (socialLinks.length === 0) {
      console.log('No social links to create');
      return { success: true, error: null };
    }

    // Filter out empty social links
    const validSocialLinks = socialLinks.filter(link => link.platform && link.url);
    
    if (validSocialLinks.length === 0) {
      console.log('No valid social links to create');
      return { success: true, error: null };
    }

    // Create social links data
    const socialLinksData = validSocialLinks.map(link => ({
      profile_id: profileId,
      platform: link.platform,
      url: link.url
    }));

    console.log('Social links data to insert:', socialLinksData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('social_links')
      .insert(socialLinksData);

    if (error) {
      console.error('Error creating social links:', error);
      throw error;
    }

    console.log('Social links created successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in createSocialLinks:', error);
    return { success: false, error };
  }
}

export async function updateSocialLinks(profileId: string, socialLinks: Array<{ platform: string; url: string }>) {
  try {
    console.log('Updating social links for profile:', profileId, socialLinks);
    
    // First, delete existing social links
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deleteError } = await (supabase as any)
      .from('social_links')
      .delete()
      .eq('profile_id', profileId);

    if (deleteError) {
      console.error('Error deleting existing social links:', deleteError);
      throw deleteError;
    }

    console.log('Existing social links deleted');

    // Then create new social links
    return await createSocialLinks(profileId, socialLinks);
  } catch (error) {
    console.error('Error in updateSocialLinks:', error);
    return { success: false, error };
  }
}

// Analytics functions
export async function trackProfileView(profileId: string, analyticsData: Partial<ProfileView>) {
  try {
    // Get location data from IP automatically
    const locationData = await getLocationFromIP();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profile_views')
      .insert({
        profile_id: profileId,
        viewer_ip: analyticsData.viewer_ip || locationData.ip,
        viewer_user_agent: analyticsData.viewer_user_agent,
        viewer_country: analyticsData.viewer_country || locationData.country,
        viewer_city: analyticsData.viewer_city || locationData.city,
        viewer_latitude: analyticsData.viewer_latitude || locationData.latitude,
        viewer_longitude: analyticsData.viewer_longitude || locationData.longitude,
        referrer: analyticsData.referrer,
        utm_source: analyticsData.utm_source,
        utm_medium: analyticsData.utm_medium,
        utm_campaign: analyticsData.utm_campaign,
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error tracking profile view:', error);
    return { success: false, error };
  }
}

export async function trackQRScan(profileId: string, analyticsData: Partial<QRScan>) {
  try {
    // Get location data from IP automatically
    const locationData = await getLocationFromIP();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('qr_scans')
      .insert({
        profile_id: profileId,
        scanner_ip: analyticsData.scanner_ip || locationData.ip,
        scanner_user_agent: analyticsData.scanner_user_agent,
        scanner_country: analyticsData.scanner_country || locationData.country,
        scanner_city: analyticsData.scanner_city || locationData.city,
        scanner_latitude: analyticsData.scanner_latitude || locationData.latitude,
        scanner_longitude: analyticsData.scanner_longitude || locationData.longitude,
        device_type: analyticsData.device_type,
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error tracking QR scan:', error);
    return { success: false, error };
  }
}

export async function trackContactDownload(profileId: string, analyticsData: Partial<ContactDownload>) {
  try {
    // Get location data from IP automatically
    const locationData = await getLocationFromIP();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contact_downloads')
      .insert({
        profile_id: profileId,
        downloader_ip: analyticsData.downloader_ip || locationData.ip,
        downloader_user_agent: analyticsData.downloader_user_agent,
        downloader_country: analyticsData.downloader_country || locationData.country,
        downloader_city: analyticsData.downloader_city || locationData.city,
        download_type: analyticsData.download_type,
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error tracking contact download:', error);
    return { success: false, error };
  }
}

export async function trackSocialClick(profileId: string, socialLinkId: string, analyticsData: Partial<SocialClick>) {
  try {
    // Get location data from IP automatically
    const locationData = await getLocationFromIP();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('social_clicks')
      .insert({
        profile_id: profileId,
        social_link_id: socialLinkId,
        clicker_ip: analyticsData.clicker_ip || locationData.ip,
        clicker_user_agent: analyticsData.clicker_user_agent,
        clicker_country: analyticsData.clicker_country || locationData.country,
        clicker_city: analyticsData.clicker_city || locationData.city,
      });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error tracking social click:', error);
    return { success: false, error };
  }
}

export async function getAnalytics(profileHandle: string) {
  try {
    console.log('Fetching analytics for profile handle:', profileHandle);
    
    // First, get the profile ID from the handle
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('handle', profileHandle)
      .single();

    if (profileError) {
      console.error('Error fetching profile for analytics:', profileError);
      // Return empty analytics when no profile exists
      return getEmptyAnalytics();
    }

    const profileId = (profileData as { id: string }).id;
    console.log('Profile ID for analytics:', profileId);

    // Query analytics data from different tables
    const [viewsResult, scansResult, downloadsResult, socialClicksResult] = await Promise.all([
      supabase.from('profile_views').select('*').eq('profile_id', profileId),
      supabase.from('qr_scans').select('*').eq('profile_id', profileId),
      supabase.from('contact_downloads').select('*').eq('profile_id', profileId),
      supabase.from('social_clicks').select('*').eq('profile_id', profileId)
    ]);

    // Calculate analytics
    const totalViews = viewsResult.data?.length || 0;
    const totalScans = scansResult.data?.length || 0;
    const totalDownloads = downloadsResult.data?.length || 0;
    const totalSocialClicks = socialClicksResult.data?.length || 0;
    
    // Calculate unique visitors (based on IP addresses)
    const uniqueIPs = new Set([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(viewsResult.data?.map((v: any) => v.viewer_ip).filter(Boolean) || []),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(scansResult.data?.map((s: any) => s.scanner_ip).filter(Boolean) || [])
    ]);
    const uniqueVisitors = uniqueIPs.size;

    // Get real data for countries and activity
    const topCountries = await getTopCountries(profileId);
    const recentActivity = await getRecentActivity(profileId);
    const monthlyViews = await getMonthlyViews(profileId);

    console.log('Analytics calculated:', {
      totalViews,
      totalScans,
      totalDownloads,
      totalSocialClicks,
      uniqueVisitors
    });

    return {
      totalViews,
      totalScans,
      totalDownloads,
      totalSocialClicks,
      uniqueVisitors,
      topCountries,
      recentActivity,
      monthlyViews,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return empty analytics on error
    return getEmptyAnalytics();
  }
}

// Helper function to return empty analytics data
function getEmptyAnalytics() {
  return {
    totalViews: 0,
    totalScans: 0,
    totalDownloads: 0,
    totalSocialClicks: 0,
    uniqueVisitors: 0,
    topCountries: [],
    recentActivity: [],
    monthlyViews: [],
  };
}

// Helper function to get real top countries data
async function getTopCountries(profileId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: viewsData } = await supabase
      .from('profile_views')
      .select('viewer_country')
      .eq('profile_id', profileId)
      .not('viewer_country', 'is', null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scansData } = await supabase
      .from('qr_scans')
      .select('scanner_country')
      .eq('profile_id', profileId)
      .not('scanner_country', 'is', null);

    // Count countries
    const countryCounts: { [key: string]: number } = {};
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [...(viewsData || []), ...(scansData || [])].forEach((item: any) => {
      const country = item.viewer_country || item.scanner_country;
      if (country && country !== 'Unknown' && country !== 'unknown') {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });

    // Convert to array and sort
    return Object.entries(countryCounts)
      .map(([country, views]) => ({ country, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching top countries:', error);
    return [];
  }
}

// Helper function to get real recent activity data
async function getRecentActivity(profileId: string) {
  try {
    const activities: Array<{ date: string; action: string; location: string }> = [];
    
    // Get recent profile views
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: viewsData } = await supabase
      .from('profile_views')
      .select('created_at, viewer_city, viewer_country')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent QR scans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scansData } = await supabase
      .from('qr_scans')
      .select('created_at, scanner_city, scanner_country')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent contact downloads
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: downloadsData } = await supabase
      .from('contact_downloads')
      .select('created_at, downloader_city, downloader_country')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Combine and format activities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [...(viewsData || []), ...(scansData || []), ...(downloadsData || [])].forEach((item: any) => {
      const date = new Date(item.created_at);
      const timeAgo = getTimeAgo(date);
      
      // Better location handling
      const city = item.viewer_city || item.scanner_city || item.downloader_city;
      const country = item.viewer_country || item.scanner_country || item.downloader_country;
      
      let location = 'Unknown location';
      if (city && country && city !== 'Unknown' && country !== 'Unknown') {
        location = `${city}, ${country}`;
      } else if (country && country !== 'Unknown') {
        location = country;
      } else if (city && city !== 'Unknown') {
        location = city;
      }
      
      let action = 'Profile viewed';
      if (item.scanner_city || item.scanner_country) {
        action = 'QR code scanned';
      } else if (item.downloader_city || item.downloader_country) {
        action = 'Contact downloaded';
      }

      activities.push({ date: timeAgo, action, location });
    });

    // Sort by date and return top 5
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

// Helper function to get real monthly views data
async function getMonthlyViews(profileId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: viewsData } = await supabase
      .from('profile_views')
      .select('created_at')
      .eq('profile_id', profileId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: scansData } = await supabase
      .from('qr_scans')
      .select('created_at')
      .eq('profile_id', profileId);

    // Group by month
    const monthlyCounts: { [key: string]: number } = {};
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [...(viewsData || []), ...(scansData || [])].forEach((item: any) => {
      const date = new Date(item.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // Convert to array and sort
    return Object.entries(monthlyCounts)
      .map(([month, views]) => ({ month, views }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  } catch (error) {
    console.error('Error fetching monthly views:', error);
    return [];
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
