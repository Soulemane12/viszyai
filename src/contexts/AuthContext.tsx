'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';

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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        const { session } = data;
        console.log('Retrieved session:', session);

        if (session?.user) {
          console.log('User found in session:', session.user.id);
          setUser(session.user);
          
          try {
            await fetchProfile(session.user.id);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
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

    // Initial session retrieval
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        try {
          if (session?.user) {
            console.log('User found in auth state change:', session.user.id);
            setUser(session.user);
            
            try {
              await fetchProfile(session.user.id);
            } catch (profileError) {
              console.error('Error fetching profile during auth state change:', profileError);
            }
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If the error suggests no profile exists, it might be a new user
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, setting profile to null');
          setProfile(null);
          return;
        }

        throw error;
      }

      if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      } else {
        console.log('No profile data found');
        setProfile(null);
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
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
