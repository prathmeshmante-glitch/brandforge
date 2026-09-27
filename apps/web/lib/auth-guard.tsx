'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from './auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, session, authState, authError, retryInit } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);

  // Fallback timer if initialization takes unexpectedly long
  useEffect(() => {
    if (authState === 'initializing') {
      const timer = setTimeout(() => setShowLongWaitMessage(true), 3500);
      return () => clearTimeout(timer);
    } else {
      setShowLongWaitMessage(false);
    }
  }, [authState]);

  useEffect(() => {
    if (authState === 'unauthenticated' && !user && !session) {
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const fullPath = pathname + search;
      const redirectUrl = `/login?redirectTo=${encodeURIComponent(fullPath)}`;
      router.replace(redirectUrl);
    }
  }, [authState, user, session, router, pathname]);

  // 1. Initializing state
  if (authState === 'initializing') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          className="brand-mark"
          style={{ animation: 'spin 2s linear infinite' }}
        >
          <span />
        </div>
        <span style={{ font: '10px monospace', color: 'var(--subtle)', letterSpacing: '0.14em' }}>
          VERIFYING STUDIO ACCESS...
        </span>

        {showLongWaitMessage && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '11px', maxWidth: '320px', lineHeight: 1.5 }}>
              Verification is taking longer than usual. You can retry establishing connection now.
            </p>
            <button
              type="button"
              onClick={retryInit}
              className="button button-outline"
              style={{ fontSize: '11px', padding: '6px 14px' }}
            >
              <RefreshCw size={12} style={{ marginRight: '6px' }} /> Retry Access Check
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Configuration error state
  if (authState === 'configuration_error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid rgba(255, 107, 94, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ color: '#ff857a', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px 0', color: '#fff' }}>
            Studio Configuration Notice
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.6, marginBottom: '20px' }}>
            {authError || 'Authentication service configuration is missing in this environment.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={retryInit}
              className="button button-primary"
            >
              <RefreshCw size={14} style={{ marginRight: '6px' }} /> Retry Connection
            </button>
            <Link href="/" className="button button-outline" style={{ textDecoration: 'none' }}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Network error state
  if (authState === 'network_error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'var(--indigo)', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <AlertCircle size={36} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px 0', color: '#fff' }}>
            Session Check Unavailable
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.6, marginBottom: '20px' }}>
            {authError || 'Unable to communicate with the authentication server. Please check your connection and retry.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexDirection: 'column' }}>
            <button
              type="button"
              onClick={retryInit}
              className="button button-primary"
              style={{ width: '100%' }}
            >
              <RefreshCw size={14} style={{ marginRight: '6px' }} /> Retry Session Verification
            </button>
            <Link
              href="/login"
              className="button button-outline"
              style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
            >
              Sign In to Studio <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Unauthenticated state (redirect in flight)
  if (!user && !session) {
    return null;
  }

  return <>{children}</>;
}

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, session, authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState === 'authenticated' && (user || session)) {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const redirectTo = params?.get('redirectTo');
      // Validate redirect destination is a safe relative path
      if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
        router.replace(redirectTo);
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, session, authState, router]);

  if (authState === 'initializing') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div
          className="brand-mark"
          style={{ animation: 'spin 2s linear infinite' }}
        >
          <span />
        </div>
        <span style={{ font: '10px monospace', color: 'var(--subtle)', letterSpacing: '0.14em' }}>
          VERIFYING SESSION...
        </span>
      </div>
    );
  }

  if (user || session) {
    return null;
  }

  return <>{children}</>;
}
