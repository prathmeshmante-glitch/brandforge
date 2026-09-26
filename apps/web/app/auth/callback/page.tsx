'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getSupabaseClient, getSupabaseConfigStatus } from '../../../lib/supabase';
import { formatAuthErrorMessage, useAuth } from '../../../lib/auth-context';
import type { EmailOtpType } from '@supabase/supabase-js';

function Logo() {
  return (
    <Link href="/" className="logo">
      <div className="brand-mark">
        <span />
      </div>
      <span>BRANDFORGE</span>
    </Link>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, user } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function processAuthCallback() {
      const config = getSupabaseConfigStatus();
      if (!config.isConfigured) {
        if (active) {
          setStatus('error');
          setErrorMessage(config.errorMessage || 'Supabase configuration is missing.');
        }
        return;
      }

      const supabase = getSupabaseClient();

      // 1. Check for errors passed in URL query or hash params
      const urlError = searchParams.get('error') || searchParams.get('error_description');
      const errorCode = searchParams.get('error_code');

      if (urlError) {
        if (active) {
          setStatus('error');
          setErrorMessage(
            formatAuthErrorMessage(
              new Error(searchParams.get('error_description') || urlError || errorCode || 'Authentication link error')
            )
          );
        }
        return;
      }

      // Check hash fragment for errors (e.g. #error=access_denied&error_description=...)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error') || hashParams.get('error_description');
        if (hashError) {
          if (active) {
            setStatus('error');
            setErrorMessage(
              formatAuthErrorMessage(
                new Error(hashParams.get('error_description') || hashError)
              )
            );
          }
          return;
        }
      }

      // 2. PKCE Code Exchange flow (?code=...)
      const code = searchParams.get('code');
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (active) {
              setStatus('error');
              setErrorMessage(formatAuthErrorMessage(error));
            }
            return;
          }

          if (data?.session && active) {
            setStatus('success');
            setTimeout(() => {
              router.push('/dashboard');
            }, 600);
            return;
          }
        } catch (err: any) {
          if (active) {
            setStatus('error');
            setErrorMessage(formatAuthErrorMessage(err));
          }
          return;
        }
      }

      // 3. Token Hash flow (?token_hash=...&type=...)
      const tokenHash = searchParams.get('token_hash');
      const typeParam = searchParams.get('type') as EmailOtpType | null;
      if (tokenHash) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: typeParam || 'signup',
          });

          if (error) {
            if (active) {
              setStatus('error');
              setErrorMessage(formatAuthErrorMessage(error));
            }
            return;
          }

          if (data?.session && active) {
            setStatus('success');
            setTimeout(() => {
              router.push('/dashboard');
            }, 600);
            return;
          }
        } catch (err: any) {
          if (active) {
            setStatus('error');
            setErrorMessage(formatAuthErrorMessage(err));
          }
          return;
        }
      }

      // 4. Implicit Grant Flow (hash fragment contains access_token) or existing active session
      // Since detectSessionInUrl: true is enabled in supabase client, it automatically parses window.location.hash
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        if (active) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 600);
        }
        return;
      }

      // 5. Fallback listener: wait up to 3 seconds for auth state change
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, currentSession) => {
        if (currentSession?.user && active) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 600);
        }
      });

      const timer = setTimeout(async () => {
        if (!active) return;
        const { data: retryData } = await supabase.auth.getSession();
        if (retryData?.session) {
          setStatus('success');
          router.push('/dashboard');
        } else {
          setStatus('error');
          setErrorMessage('Confirmation link could not be verified or has expired. Please try signing in or request a new confirmation email.');
        }
      }, 3500);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    }

    processAuthCallback();

    return () => {
      active = false;
    };
  }, [searchParams, router]);

  // If user is already authenticated via AuthContext, redirect immediately
  useEffect(() => {
    if (session || user) {
      setStatus('success');
      const timer = setTimeout(() => router.push('/dashboard'), 400);
      return () => clearTimeout(timer);
    }
  }, [session, user, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 55% 75% at 50% 30%, rgba(124, 92, 255, 0.12), transparent 70%), var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <div>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span className="eyebrow-line" /> STUDIO ACCESS CONFIRMATION
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              {status === 'verifying' && 'Confirming Studio Access'}
              {status === 'success' && 'Email Confirmed'}
              {status === 'error' && 'Verification Unsuccessful'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px', lineHeight: 1.6 }}>
              {status === 'verifying' && 'Verifying your confirmation token with Supabase and establishing your session...'}
              {status === 'success' && 'Your studio identity is authenticated. Launching your workspace dashboard...'}
              {status === 'error' && 'We could not complete the email confirmation process.'}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '32px 28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            textAlign: 'center',
          }}
        >
          {status === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '12px 0' }}>
              <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--indigo)' }} />
              <div style={{ font: '10px monospace', color: 'var(--subtle)', letterSpacing: '0.12em' }}>
                ESTABLISHING SECURE SUPABASE SESSION...
              </div>
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(124, 203, 154, 0.12)',
                  border: '1px solid rgba(124, 203, 154, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sage)',
                }}
              >
                <CheckCircle2 size={26} />
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 500, margin: 0 }}>
                  Authentication successful
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>
                  Entering the BrandForge studio environment...
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="button button-primary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Enter Dashboard Now <ArrowRight size={14} />
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 107, 94, 0.1)',
                  border: '1px solid rgba(255, 107, 94, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#ff857a',
                  fontSize: '11px',
                  textAlign: 'left',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage || 'This confirmation link is invalid or has expired.'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/login"
                  className="button button-primary"
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  Sign In to Studio <ArrowRight size={14} />
                </Link>

                <Link
                  href="/signup"
                  className="button button-outline"
                  style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  Create New Account
                </Link>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
          <ShieldCheck size={14} color="var(--sage)" />
          <span>Encrypted with Supabase Auth & PostgreSQL Row-Level Security.</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--subtle)', font: '10px monospace' }}>
            <RefreshCw size={14} className="animate-spin" />
            <span>CONFIRMING SESSION...</span>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
