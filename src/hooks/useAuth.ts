import { useEffect, useState, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,
  });

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profile = null;
      if (session?.user) {
        profile = await fetchProfile(session.user.id);
      }
      
      setState({
        session,
        user: session?.user ?? null,
        profile,
        loading: false,
        initialized: true,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        let profile = null;
        if (session?.user) {
          profile = await fetchProfile(session.user.id);
        }
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          profile,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign up with email and password
  const signUp = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Profile is auto-created by database trigger
      const profile = await fetchProfile(data.user.id);
      setState(prev => ({ ...prev, profile, loading: false }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    return { error };
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setState(prev => ({ ...prev, loading: true }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setState(prev => ({ ...prev, loading: false }));
    return { error };
  };

  // Sign out
  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setState({
        user: null,
        session: null,
        profile: null,
        loading: false,
        initialized: true,
      });
    }
    return { error };
  };

  // Reset password
  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'proofit://reset-password',
    });
    return { error };
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!state.user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      // Refresh profile
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    }
  };

  return {
    user: state.user,
    session: state.session,
    profile: state.profile,
    loading: state.loading,
    initialized: state.initialized,
    isAuthenticated: !!state.session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };
}
