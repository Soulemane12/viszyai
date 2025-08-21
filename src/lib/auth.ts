import { supabase } from './supabase';
import { Profile } from './supabase';

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

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// User registration (without profile)
export async function registerUser(data: UserRegistrationData) {
  try {
    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

// Sign up with profile creation
export async function signUp(data: SignUpData) {
  try {
    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          handle: data.handle,
          name: data.name,
          title: data.title,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
        });

      if (profileError) throw profileError;

      // Create social links if provided
      if (data.socialLinks && data.socialLinks.length > 0) {
        const { profile } = await getProfileByHandle(data.handle);
        if (profile) {
          const socialLinksData = data.socialLinks.map(link => ({
            profile_id: profile.id,
            platform: link.platform,
            url: link.url,
          }));

          const { error: socialError } = await supabase
            .from('social_links')
            .insert(socialLinksData);

          if (socialError) throw socialError;
        }
      }

      return { user: authData.user, error: null };
    }

    return { user: null, error: new Error('User creation failed') };
  } catch (error) {
    return { user: null, error };
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
export async function getProfileWithSocialLinks(handle: string) {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single();

    if (profileError) throw profileError;

    const { data: socialLinks, error: socialError } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profile.id);

    if (socialError) throw socialError;

    return { 
      profile, 
      socialLinks: socialLinks || [], 
      error: null 
    };
  } catch (error) {
    return { profile: null, socialLinks: [], error };
  }
}

// Update profile
export async function updateProfile(profileId: string, updates: Partial<Profile>) {
  try {
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
      const { error } = await supabase
    .from('profiles')
    .select('handle')
    .eq('handle', handle)
    .single();

    if (error && error.code === 'PGRST116') {
      // No rows returned, handle is available
      return { available: true, error: null };
    }

    if (error) throw error;

    // Handle exists
    return { available: false, error: null };
  } catch (error) {
    return { available: false, error };
  }
}
