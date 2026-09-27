'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth, formatAuthErrorMessage } from '../../lib/auth-context';

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMsg(formatAuthErrorMessage(error));
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Your password has been successfully updated. Directing to studio...');
      setIsLoading(false);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(formatAuthErrorMessage(err));
      setIsLoading(false);
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
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <div>
            <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <span className="eyebrow-line" /> CREDENTIAL UPDATE
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              Set New Password
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>
              Choose a strong password to protect your brand intellectual property.
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
                alignItems: 'center',
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
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                NEW PASSWORD (MIN. 8 CHARS)
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
                CONFIRM NEW PASSWORD
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
              disabled={isLoading || Boolean(successMsg)}
              className="button button-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {isLoading ? 'Updating password...' : 'Save New Password'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px' }}>
          <ShieldCheck size={14} color="var(--sage)" />
          <span>Updated securely via Supabase Auth API.</span>
        </div>
      </div>
    </div>
  );
}
