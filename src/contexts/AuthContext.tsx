'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile, SocialLink } from '@/lib/database.types';
import { getProfileWithSocialLinks } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Starting initial session retrieval');
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

        // Check if user has "Remember me" enabled
        const rememberMe = localStorage.getItem('viszy_remember_me') === 'true';
        console.log('Remember me enabled:', rememberMe);

        const { data, error } = await supabase.auth.getSession();

        console.log('Session retrieval response:', { data, error });

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        const { session } = data;
        console.log('Retrieved session:', session);
        console.log('Session user:', session?.user);
        console.log('Session access token:', session?.access_token ? 'Present' : 'Missing');

        if (session?.user) {
          console.log('User found in session:', session.user.id);
          console.log('User email:', session.user.email);
          console.log('User email confirmed:', session.user.email_confirmed_at);
          setUser(session.user);

          // Don't wait for profile - fetch it in background
          fetchProfile(session.user.id).catch((profileError) => {
            console.error('Error fetching profile:', profileError);
          });
        } else {
          console.log('No user in session');
          setUser(null);
          setProfile(null);
        }
      } catch (catchError) {
        console.error('Unexpected error in getInitialSession:', catchError);
      } finally {
        setLoading(false);
        console.log('Initial session retrieval complete');
      }
    };

    // Initial session retrieval with timeout
    const timeoutId = setTimeout(() => {
      console.log('Session retrieval timeout - forcing loading to false');
      setLoading(false);
    }, 10000); // 10 second timeout

    getInitialSession().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        try {
          if (session?.user) {
            console.log('User found in auth state change:', session.user.id);
            setUser(session.user);
            
            // Don't wait for profile - fetch it in background
            fetchProfile(session.user.id).catch((profileError) => {
              console.error('Error fetching profile during auth state change:', profileError);
            });
          } else {
            console.log('No user in auth state change');
            setUser(null);
            setProfile(null);
          }
        } catch (stateChangeError) {
          console.error('Error in auth state change handler:', stateChangeError);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!userId) {
      console.error('No user ID provided for profile fetch');
      setProfile(null);
      return;
    }

    try {
      console.log(`Fetching profile for user ID: ${userId}`);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Current user session exists:', !!supabase.auth.getUser());

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      // First, get the basic profile to get the handle
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as { data: Profile | null; error: any };

      console.log('Profile fetch response:', { data, error });
      console.log('Error details:', error ? {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      } : 'No error');

      if (error) {
        console.error('Error fetching profile:', error);

        // If the error suggests no profile exists, it might be a new user
        if (error.code === 'PGRST116') {
          console.log('No profile found for user - user needs to create profile');
          console.log('Profile fetch error details:', error);
          setProfile(null);
          return;
        }

        // Handle 406 errors (Not Acceptable) which might be due to headers
        if (error.code === 'PGRST301') {
          console.log('406 error - checking request headers and configuration');
          console.log('Profile fetch error details:', error);
          setProfile(null);
          return;
        }

        throw error;
      }

      if (data) {
        console.log('Profile fetched successfully:', data);
        
        // Type the data as Profile to ensure TypeScript knows about the handle property
        const profileData = data as Profile;
        
        // Now fetch the complete profile with social links
        try {
          console.log('Fetching complete profile with social links for handle:', profileData.handle);
          
          // Add timeout for social links fetch
          const socialLinksTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Social links fetch timeout')), 3000);
          });
          
          const socialLinksPromise = getProfileWithSocialLinks(profileData.handle);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { profile: completeProfile, socialLinks } = await Promise.race([socialLinksPromise, socialLinksTimeoutPromise]) as { profile: Profile | null; socialLinks: SocialLink[]; error: any };
          
          if (completeProfile) {
            console.log('Complete profile with social links fetched:', completeProfile);
            console.log('Social links count:', socialLinks?.length || 0);
            
            // Set the complete profile data
            setProfile(completeProfile);
          } else {
            console.log('No complete profile found, using basic profile data');
            setProfile(profileData);
          }
        } catch (socialLinksError) {
          console.error('Error fetching social links, using basic profile:', socialLinksError);
          // Fall back to basic profile data if social links fetch fails
          setProfile(profileData);
        }
      } else {
        console.log('No profile data found');
        setProfile(null);
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : String(error));
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        throw error;
      }
      
      console.log('AuthContext: Supabase sign out successful');
      setUser(null);
      setProfile(null);
      
      // Clear remember me preference on sign out
      localStorage.removeItem('viszy_remember_me');
      console.log('Signed out and cleared remember me preference');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw to let the calling function handle it
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
