'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !session) {
      router.replace('/login');
    }
  }, [user, session, isLoading, router]);

  if (isLoading) {
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
          VERIFYING STUDIO ACCESS...
        </span>
      </div>
    );
  }

  if (!user && !session) {
    return null;
  }

  return <>{children}</>;
}

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (user || session)) {
      router.replace('/dashboard');
    }
  }, [user, session, isLoading, router]);

  if (isLoading) {
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
