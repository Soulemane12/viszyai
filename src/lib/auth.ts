import { supabase } from './supabase';
import { Profile, SocialLink, ProfileView, QRScan, ContactDownload, SocialClick } from './database.types';
import { signupLimiter, profileUpdateLimiter, handleCheckLimiter } from './rateLimit';

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

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
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
    // Check rate limit
    if (!handleCheckLimiter.canMakeRequest(handle)) {
      throw new Error('Too many handle checks. Please wait a moment before trying again.');
    }

    const { error } = await supabase
      .from('profiles')
      .select('handle')
      .eq('handle', handle)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows returned, handle is available
      return { available: true, error: null };
    }

    if (error) {
      console.error('Handle availability check error:', error);
      throw error;
    }

    // Handle exists
    return { available: false, error: null };
  } catch (error) {
    console.error('Handle availability check failed:', error);
    return { available: false, error };
  }
}

// Analytics functions
export async function trackProfileView(profileId: string, analyticsData: Partial<ProfileView>) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profile_views')
      .insert({
        profile_id: profileId,
        viewer_ip: analyticsData.viewer_ip,
        viewer_user_agent: analyticsData.viewer_user_agent,
        viewer_country: analyticsData.viewer_country,
        viewer_city: analyticsData.viewer_city,
        viewer_latitude: analyticsData.viewer_latitude,
        viewer_longitude: analyticsData.viewer_longitude,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('qr_scans')
      .insert({
        profile_id: profileId,
        scanner_ip: analyticsData.scanner_ip,
        scanner_user_agent: analyticsData.scanner_user_agent,
        scanner_country: analyticsData.scanner_country,
        scanner_city: analyticsData.scanner_city,
        scanner_latitude: analyticsData.scanner_latitude,
        scanner_longitude: analyticsData.scanner_longitude,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('contact_downloads')
      .insert({
        profile_id: profileId,
        downloader_ip: analyticsData.downloader_ip,
        downloader_user_agent: analyticsData.downloader_user_agent,
        downloader_country: analyticsData.downloader_country,
        downloader_city: analyticsData.downloader_city,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('social_clicks')
      .insert({
        profile_id: profileId,
        social_link_id: socialLinkId,
        clicker_ip: analyticsData.clicker_ip,
        clicker_user_agent: analyticsData.clicker_user_agent,
        clicker_country: analyticsData.clicker_country,
        clicker_city: analyticsData.clicker_city,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .rpc('get_profile_analytics', { profile_handle: profileHandle });

    if (error) throw error;
    
    if (data && data.length > 0) {
      const analytics = data[0];
      return {
        totalViews: analytics.total_views || 0,
        totalScans: analytics.total_scans || 0,
        totalDownloads: analytics.total_downloads || 0,
        totalSocialClicks: analytics.total_social_clicks || 0,
        uniqueVisitors: analytics.unique_visitors || 0,
        topCountries: analytics.top_countries || [],
        recentActivity: analytics.recent_activity || [],
        monthlyViews: analytics.monthly_views || [],
      };
    }
    
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
  } catch (error) {
    console.error('Error fetching analytics:', error);
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
}
