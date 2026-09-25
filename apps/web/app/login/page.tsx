'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('creator@brandforge.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate/store auth token for Supabase bearer
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', 'test-token-user1');
    }
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
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
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <div>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span className="eyebrow-line" /> STUDIO ACCESS
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              Sign in to BrandForge
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>
              Enter your studio workspace to access active brand worlds.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                WORK EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', color: 'var(--subtle)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em' }}>
                  PASSWORD
                </label>
                <a href="#" style={{ fontSize: '10px', color: 'var(--indigo)', textDecoration: 'none' }}>
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', color: 'var(--subtle)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="button button-primary" style={{ width: '100%', marginTop: '8px' }}>
              {isLoading ? 'Accessing studio...' : 'Sign In to Studio'} <ArrowRight size={14} />
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="button button-outline"
            style={{ width: '100%', gap: '8px', fontSize: '10px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.8-.7-1.4-1.6-1.7-2.7z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z" />
            </svg>
            Google Workspace OAuth
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
          <ShieldCheck size={14} color="var(--sage)" />
          <span>Protected by Supabase Auth with RLS tenant isolation.</span>
        </div>
      </div>
    </div>
  );
}
