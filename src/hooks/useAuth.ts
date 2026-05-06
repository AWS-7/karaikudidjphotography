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

  const signIn = useCallback(async (email: string, password: string) => {
    // Hardcoded admin for demo mode (Supabase auth server error - 500)
    if (email === 'admin@djphoto.in' && password === 'admin123') {
      const mockUser = {
        id: 'admin-user',
        email: 'admin@djphoto.in',
        role: 'authenticated',
      } as User;
      setUser(mockUser);
      setSession({
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      } as Session);
      return { error: null };
    }

    // Try Supabase auth for other users
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data?.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return { error };
  }, []);

  const signOut = useCallback(async () => {
    // Clear mock user if exists
    if (user?.id === 'admin-user') {
      setUser(null);
      setSession(null);
      return { error: null };
    }
    // Otherwise sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
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

    // Demo admin is always admin
    if (user.id === 'admin-user') {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Check if user has admin role via Supabase
    const checkAdmin = async () => {
      try {
        const { data } = await supabase.rpc('is_admin');
        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}
