import { supabase } from './supabase';
import { Profile, SocialLink } from './database.types';
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
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
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

    const { data: socialLinksData, error: socialError } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profileData.id);

    if (socialError) {
      console.error('Social links fetch error:', socialError);
      return { 
        profile: profileData, 
        socialLinks: [], 
        error: socialError 
      };
    }

    return { 
      profile: profileData, 
      socialLinks: socialLinksData || [], 
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error in getProfileWithSocialLinks:', error);
    return { profile: null, socialLinks: [], error };
  }
}

// Update profile
export async function updateProfile(profileId: string, updates: Partial<Profile>) {
  try {
    // Check rate limit
    if (!profileUpdateLimiter.canMakeRequest(profileId)) {
      throw new Error('Too many profile updates. Please wait a moment before trying again.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

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
