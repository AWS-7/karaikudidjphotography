import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Hardcoded admin credentials for testing
  const HARDCODED_ADMIN = {
    email: 'admin@djphoto.in',
    password: 'admin123'
  };

  const signIn = useCallback(async (email: string, password: string) => {
    // Check hardcoded credentials first
    if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
      // Create mock user
      const mockUser = {
        id: 'hardcoded-admin',
        email: HARDCODED_ADMIN.email,
        role: 'authenticated',
      } as User;
      setUser(mockUser);
      return { error: null };
    }

    // Fallback to Supabase auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    // Clear mock user if exists
    if (user?.id === 'hardcoded-admin') {
      setUser(null);
      return { error: null };
    }
    // Otherwise sign out from Supabase
    const { error } = await supabase.auth.signOut();
    return { error };
  }, [user]);

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}

// Check if user is admin
export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check if user has admin role
    const checkAdmin = async () => {
      const { data } = await supabase.rpc('is_admin');
      setIsAdmin(!!data);
      setLoading(false);
    };

    checkAdmin();
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
