'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Mail, ShieldCheck, AlertCircle, RefreshCw, CheckCircle2, Inbox } from 'lucide-react';
import { useAuth, formatAuthErrorMessage } from '../../lib/auth-context';
import { getSupabaseClient } from '../../lib/supabase';

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

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, user, resendVerification } = useAuth();

  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Session detection: If user is authenticated or becomes confirmed, redirect to dashboard
  useEffect(() => {
    if (session || user) {
      router.push('/dashboard');
      return;
    }

    const supabase = getSupabaseClient();

    // 1. Listen for real-time auth changes (e.g. user confirmed email in another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (currentSession?.user) {
        setSuccessMsg('Email confirmed! Opening your studio dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      }
    });

    // 2. Poll periodically (every 3 seconds) in case confirmation occurred without event trigger
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setSuccessMsg('Email confirmed! Opening your studio dashboard...');
          clearInterval(pollInterval);
          setTimeout(() => {
            router.push('/dashboard');
          }, 600);
        }
      } catch (e) {
        // ignore background poll errors
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [session, user, router]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetEmail = email.trim();
    if (!targetEmail) {
      setErrorMsg('Email address is required to resend confirmation link.');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await resendVerification(targetEmail);
      if (error) {
        setErrorMsg(formatAuthErrorMessage(error));
      } else {
        setSuccessMsg('A fresh confirmation link has been dispatched to your email.');
        setCooldown(60); // 60s cooldown to respect rate limits
      }
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

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
      <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <div>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span className="eyebrow-line" /> FOUNDER SECURITY
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              Check your email
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
              We sent a confirmation link to:
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(124, 92, 255, 0.08)',
                border: '1px solid rgba(124, 92, 255, 0.25)',
                borderRadius: '8px',
                padding: '6px 14px',
                marginTop: '6px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <Mail size={14} style={{ color: 'var(--indigo)' }} />
              <span>{email || 'your email'}</span>
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '30px 28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          }}
        >
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 107, 94, 0.1)',
                border: '1px solid rgba(255, 107, 94, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                color: '#ff857a',
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(124, 203, 154, 0.1)',
                border: '1px solid rgba(124, 203, 154, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '20px',
                color: 'var(--sage)',
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Instructions Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(124, 92, 255, 0.1)',
                border: '1px solid rgba(124, 92, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--indigo)',
              }}
            >
              <Inbox size={22} />
            </div>

            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: '13px', fontWeight: 500 }}>
                Open your email and click:
              </p>
              <p
                style={{
                  margin: '6px 0 0 0',
                  color: 'var(--indigo)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                "Confirm email address"
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--subtle)',
                fontSize: '11px',
                marginTop: '4px',
              }}
            >
              <RefreshCw size={11} className="animate-spin" />
              <span>This page will automatically redirect once confirmed.</span>
            </div>
          </div>

          {/* Resend button */}
          <div style={{ marginTop: '22px' }}>
            <button
              type="button"
              disabled={cooldown > 0 || isResending}
              onClick={handleResend}
              className="button button-primary"
              style={{
                width: '100%',
                opacity: cooldown > 0 ? 0.7 : 1,
                cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isResending ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Sending confirmation link...</span>
                </>
              ) : cooldown > 0 ? (
                <span>Resend link in {cooldown}s</span>
              ) : (
                <>
                  <Mail size={14} />
                  <span>Resend verification email</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <Link
              href="/signup"
              style={{
                color: 'var(--subtle)',
                fontSize: '11px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Change email
            </Link>

            <Link
              href="/login"
              style={{
                color: 'var(--indigo)',
                fontSize: '11px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Already confirmed? Sign in <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
          <ShieldCheck size={14} color="var(--sage)" />
          <span>Verification is secured by Supabase Auth with encrypted tokens.</span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', placeItems: 'center' }}>
          <span style={{ font: '10px monospace', color: 'var(--subtle)' }}>LOADING VERIFICATION...</span>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
