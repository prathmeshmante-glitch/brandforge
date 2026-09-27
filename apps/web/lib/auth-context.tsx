'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseConfigStatus } from './supabase';

export type AuthState =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'
  | 'configuration_error'
  | 'network_error';

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
    return 'This confirmation or reset link has expired. Please request a new one.';
  }
  if (lower.includes('invalid') && (lower.includes('token') || lower.includes('link') || lower.includes('code'))) {
    return 'Invalid or expired confirmation link. Please request a new one.';
  }
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('fetch failed') ||
    lower.includes('authretryablefetcherror')
  ) {
    return 'Unable to reach the authentication service. Please verify your internet connection and Supabase status.';
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
  authState: AuthState;
  authError: string | null;
  retryInit: () => void;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
  updatePassword: (password: string) => Promise<{ data?: any; error?: AuthError | Error | null }>;
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
  const [authState, setAuthState] = useState<AuthState>('initializing');
  const [authError, setAuthError] = useState<string | null>(null);
  const [initAttempt, setInitAttempt] = useState(0);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const loadUserProfile = useCallback(async (currentUser: User) => {
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

    setProfile({
      id: currentUser.id,
      name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Studio Founder',
      email: currentUser.email || '',
      avatar_url: currentUser.user_metadata?.avatar_url,
    });
  }, [supabase]);

  const retryInit = useCallback(() => {
    setAuthState('initializing');
    setAuthError(null);
    setInitAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    const configStatus = getSupabaseConfigStatus();

    if (!configStatus.isConfigured) {
      if (mounted) {
        setAuthState('configuration_error');
        setAuthError(configStatus.errorMessage);
      }
      return;
    }

    // Never allow auth initialization to hang indefinitely in production.
    let settled = false;
    const finishTimeout = setTimeout(() => {
      if (!mounted || settled) return;
      settled = true;
      console.warn('[BrandForge Auth]: Session initialization timed out.');
      setAuthState('network_error');
      setAuthError('Authentication verification timed out. Please check your Supabase URL, network connection, and deployment configuration.');
    }, 5000);

    const resolveSession = async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase session request timed out')), 4500)),
        ]);
        if (!mounted || settled) return;
        settled = true;
        clearTimeout(finishTimeout);
        const { data: { session: initialSession }, error } = result as any;
        if (error) {
          console.warn('[BrandForge Auth]: getSession returned error:', error);
          setAuthState('network_error');
          setAuthError(formatAuthErrorMessage(error));
          return;
        }
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          setAuthState('authenticated');
          setAuthError(null);
          void loadUserProfile(initialSession.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setAuthState('unauthenticated');
          setAuthError(null);
        }
      } catch (err: any) {
        if (!mounted || settled) return;
        settled = true;
        clearTimeout(finishTimeout);
        console.error('[BrandForge Auth]: session initialization failed:', err);
        setAuthState('network_error');
        setAuthError(formatAuthErrorMessage(err));
      }
    };

    void resolveSession();
    // Real-time auth subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        setAuthState('authenticated');
        setAuthError(null);
        await loadUserProfile(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setAuthState('unauthenticated');
      }
    });

    return () => {
      mounted = false;
      settled = true;
      clearTimeout(finishTimeout);
      subscription.unsubscribe();
    };
  }, [supabase, initAttempt, loadUserProfile]);

  const signIn = async (email: string, password: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        return { error: result.error };
      }
      if (result.data?.user && result.data?.session) {
        setUser(result.data.user);
        setSession(result.data.session);
        setAuthState('authenticated');
        setAuthError(null);
        await loadUserProfile(result.data.user);
      }
      return { data: result.data };
    } catch (err: any) {
      return { error: err };
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
        setAuthState('authenticated');
        setAuthError(null);
        await loadUserProfile(result.data.user);
      }
      return { data: result.data, error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined;

    try {
      const result = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      return { data: result.data, error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updatePassword = async (password: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    try {
      const result = await supabase.auth.updateUser({ password });
      return { data: result.data, error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const verifyOtp = async (email: string, token: string) => {
    const status = getSupabaseConfigStatus();
    if (!status.isConfigured) {
      return { error: new Error(status.errorMessage || 'Supabase configuration is missing.') };
    }

    try {
      let result = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'signup',
      });

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
        setAuthState('authenticated');
        setAuthError(null);
        await loadUserProfile(result.data.user);
      }

      return { data: result.data };
    } catch (err: any) {
      return { error: err };
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
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setAuthState('unauthenticated');
      setAuthError(null);
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

  const isLoading = authState === 'initializing';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        authState,
        authError,
        retryInit,
        signIn,
        signUp,
        resetPasswordForEmail,
        updatePassword,
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
