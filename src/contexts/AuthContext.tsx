'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';
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

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
      });

      // Fetch profile with minimal data first
      const profilePromise = supabase
        .from('profiles')
        .select('id, handle, name, email, title, phone, bio')
        .eq('user_id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as { data: Profile | null; error: Error | null };

      if (error) {
        console.error('Profile fetch error:', error);
        setProfile(null);
        return;
      }

      if (data) {
        // Immediately set basic profile to improve perceived performance
        setProfile(data);

        // Fetch additional data in background
        try {
          const result = await getProfileWithSocialLinks(data.handle);
          
          if (result.profile) {
            // Update with complete profile if available
            setProfile(result.profile);
          }
        } catch (socialLinksError) {
          console.error('Background social links fetch failed:', socialLinksError);
        }
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
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
