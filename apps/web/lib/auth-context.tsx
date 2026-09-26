'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseConfigStatus } from './supabase';

export function formatAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred.';
  const msg = error.message || String(error);
  const lower = msg.toLowerCase();

  if (lower.includes('supabase url is missing') || lower.includes('supabase public key is missing')) {
    return msg;
  }
  if (lower.includes('already registered') || lower.includes('user already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (
    lower.includes('email not confirmed') ||
    lower.includes('unconfirmed') ||
    lower.includes('not confirmed') ||
    lower.includes('email verification')
  ) {
    return 'Email has not been confirmed yet. Please check your inbox and click "Confirm email address".';
  }
  if (lower.includes('weak password') || lower.includes('password should be at least')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('over_email_send_rate_limit')) {
    return 'Rate limit reached. Please wait a few moments before requesting another confirmation email.';
  }
  if (lower.includes('token has expired') || lower.includes('link has expired') || lower.includes('expired')) {
    return 'This confirmation link has expired. Please request a new confirmation email below.';
  }
  if (lower.includes('invalid') && (lower.includes('token') || lower.includes('link') || lower.includes('code'))) {
    return 'Invalid or expired confirmation link. Please request a new confirmation email.';
  }
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('fetch failed') ||
    lower.includes('authretryablefetcherror')
  ) {
    return 'Unable to reach the authentication service. Please verify your internet connection and Supabase configuration.';
  }

  return msg;
}

export interface UserProfile {

  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  resendOtp: (email: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  resendVerification: (email: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const loadUserProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          name: data.name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Studio Founder',
          email: currentUser.email || '',
          avatar_url: data.avatar_url,
        });
        return;
      }
    } catch (e) {
      console.warn('Could not query profiles table, falling back to metadata:', e);
    }

    // Fallback from user object
    setProfile({
      id: currentUser.id,
      name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Studio Founder',
      email: currentUser.email || '',
      avatar_url: currentUser.user_metadata?.avatar_url,
    });
  };

  useEffect(() => {
    let mounted = true;
    const status = getSupabaseConfigStatus();

    if (!status.isConfigured) {
      setIsLoading(false);
      return;
    }

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setIsLoading(false);
    });

    // 2. Real-time auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    setIsLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        return { error: result.error };
      }
      if (result.data?.user && result.data?.session) {
        setUser(result.data.user);
        setSession(result.data.session);
        await loadUserProfile(result.data.user);
      }
      return { data: result.data };
    } catch (err: any) {
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

    setIsLoading(true);
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: name,
            name: name,
          },
        },
      });
      if (result.data?.user && result.data?.session) {
        setUser(result.data.user);
        setSession(result.data.session);
        await loadUserProfile(result.data.user);
      }
      return { data: result.data, error: result.error };
    } catch (err: any) {
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    setIsLoading(true);
    try {
      // First try 'signup' OTP type
      let result = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'signup',
      });

      // If 'signup' fails, fallback to 'email' OTP type
      if (result.error) {
        const emailResult = await supabase.auth.verifyOtp({
          email,
          token: token.trim(),
          type: 'email',
        });
        if (!emailResult.error) {
          result = emailResult;
        }
      }

      if (result.error) {
        return { error: result.error };
      }

      if (result.data?.user && result.data?.session) {
        setUser(result.data.user);
        setSession(result.data.session);
        await loadUserProfile(result.data.user);
      }

      return { data: result.data };
    } catch (err: any) {
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    const emailRedirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

    try {
      const result = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo,
        },
      });
      return { data: result.data, error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resendOtp = resendVerification;

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        verifyOtp,
        resendOtp,
        resendVerification,
        signOut,
        getToken,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
