'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
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

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPasswordForEmail(email.trim());
      if (error) {
        setErrorMsg(formatAuthErrorMessage(error));
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        'Password recovery link has been dispatched to your email. Please check your inbox and follow the secure link.'
      );
      setCooldown(60);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err));
      setIsLoading(false);
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
        <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Logo />
            <div>
              <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                <span className="eyebrow-line" /> ACCESS RECOVERY
              </div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
                Reset Studio Password
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>
                Enter the email associated with your BrandForge studio account.
              </p>
            </div>
          </div>

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

            {successMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(92, 225, 160, 0.1)',
                  border: '1px solid rgba(92, 225, 160, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  color: '#82f7c0',
                  fontSize: '11px',
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                  ACCOUNT EMAIL ADDRESS
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

              <button
                type="submit"
                disabled={isLoading || cooldown > 0}
                className="button button-primary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                {isLoading ? (
                  'Dispatching link...'
                ) : cooldown > 0 ? (
                  `Resend link in ${cooldown}s`
                ) : (
                  <>
                    Send Recovery Link <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
              <Link
                href="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--muted)',
                  fontSize: '11px',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
            <ShieldCheck size={14} color="var(--sage)" />
            <span>Encrypted recovery token delivered via Supabase Auth.</span>
          </div>
        </div>
      </div>
    </GuestOnlyRoute>
  );
}
