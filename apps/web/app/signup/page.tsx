'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth, formatAuthErrorMessage } from '../../lib/auth-context';
import { GuestOnlyRoute } from '../../lib/auth-guard';

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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validations
    if (!name.trim()) {
      setErrorMsg('Please enter your full name or studio handle.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await signUp(name.trim(), email.trim(), password);

      if (error) {
        setErrorMsg(formatAuthErrorMessage(error));
        setIsSubmitting(false);
        return;
      }

      // Check if session was returned directly (e.g. if email confirmation is disabled)
      if (data?.session) {
        router.push('/dashboard');
        return;
      }

      // Otherwise, confirmation code was sent to email -> navigate to verify-email
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <GuestOnlyRoute>
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
                <span className="eyebrow-line" /> FOUNDER ONBOARDING
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
                Create your studio account
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>
                Join BrandForge to turn rough concepts into launch-ready brand identities.
              </p>
            </div>
          </div>

          {/* Signup Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              padding: '28px',
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
                  marginBottom: '18px',
                  color: '#ff857a',
                  fontSize: '11px',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                  YOUR NAME / STUDIO NAME
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', color: 'var(--subtle)' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
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
                    placeholder="alex@studio.ai"
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
                <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                  PASSWORD (MIN 8 CHARS)
                </label>
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

              <div>
                <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                  CONFIRM PASSWORD
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', color: 'var(--subtle)' }} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="button button-primary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                {isSubmitting ? 'Creating studio account...' : 'Create Studio Account'} <ArrowRight size={14} />
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>
                ALREADY HAVE AN ACCOUNT?
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <Link
              href="/login"
              className="button button-outline"
              style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
            >
              Sign In Instead
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
            <ShieldCheck size={14} color="var(--sage)" />
            <span>Encrypted with Supabase Auth & PostgreSQL Row-Level Security.</span>
          </div>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}
