'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Shield,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Key,
  LogOut,
  Save,
  Trash2,
} from 'lucide-react';
import { useAuth, formatAuthErrorMessage } from '../../lib/auth-context';
import { ProtectedRoute } from '../../lib/auth-guard';

function Logo() {
  return (
    <Link href="/dashboard" className="logo">
      <div className="brand-mark">
        <span />
      </div>
      <span>BRANDFORGE</span>
    </Link>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updatePassword, signOut } = useAuth();

  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences' | 'danger'>('profile');

  // Security state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });

  // Danger zone state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [dangerStatus, setDangerStatus] = useState<string | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setPasswordStatus({ type: 'loading' });
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setPasswordStatus({ type: 'error', message: formatAuthErrorMessage(error) });
        return;
      }
      setPasswordStatus({ type: 'success', message: 'Password successfully updated.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: formatAuthErrorMessage(err) });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(12, 13, 16, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Logo />
            <div style={{ height: '18px', width: '1px', background: 'var(--border)' }} />
            <Link
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--muted)',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> Back to Studio
            </Link>
          </div>

          <button
            onClick={handleSignOut}
            className="button button-outline"
            style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </header>

        {/* Main Content Area */}
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px' }}>
          {/* Navigation Sidebar */}
          <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', marginBottom: '8px' }}>
              STUDIO SETTINGS
            </div>
            {[
              { id: 'profile', label: 'Founder Profile', icon: User },
              { id: 'security', label: 'Security & Access', icon: Shield },
              { id: 'preferences', label: 'Preferences', icon: Sliders },
              { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                    background: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--accent)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Section Panel */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', margin: 0, fontWeight: 500 }}>
                    Founder Profile
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
                    Your identity across BrandForge studio workspaces and generated brand kits.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile?.name || user?.user_metadata?.full_name || 'Studio Founder'}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: 'var(--muted)',
                        fontSize: '13px',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--subtle)', marginTop: '4px', display: 'block' }}>
                      Protected by Supabase Auth with RLS tenant isolation.
                    </span>
                  </div>

                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      STUDIO USER ID
                    </label>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: 'var(--subtle)',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {user?.id || 'Anonymous'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', margin: 0, fontWeight: 500 }}>
                    Security & Credentials
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
                    Manage access credentials and password security.
                  </p>
                </div>

                {passwordStatus.type === 'error' && (
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
                      fontSize: '12px',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                {passwordStatus.type === 'success' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(92, 225, 160, 0.1)',
                      border: '1px solid rgba(92, 225, 160, 0.3)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      marginBottom: '20px',
                      color: '#82f7c0',
                      fontSize: '12px',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      NEW PASSWORD (MIN. 8 CHARACTERS)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordStatus.type === 'loading'}
                    className="button button-primary"
                    style={{ alignSelf: 'flex-start', marginTop: '6px', fontSize: '12px' }}
                  >
                    <Key size={14} />
                    {passwordStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', margin: 0, fontWeight: 500 }}>
                    Studio Preferences
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
                    Configure workflow automation and intelligence defaults.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                    }}
                  >
                    <div>
                      <b style={{ fontSize: '13px', display: 'block' }}>Real-time SSE Streaming</b>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Stream live AI agent status transitions and stage progress.
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--sage)', fontFamily: 'monospace' }}>ENABLED</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                    }}
                  >
                    <div>
                      <b style={{ fontSize: '13px', display: 'block' }}>Human-in-the-Loop Decisions</b>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Explicit confirmation required for positioning and naming selections.
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--sage)', fontFamily: 'monospace' }}>ACTIVE</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                    }}
                  >
                    <div>
                      <b style={{ fontSize: '13px', display: 'block' }}>Editorial Dark Theme</b>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        High-contrast typography tuned for brand strategy review.
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'monospace' }}>DEFAULT</span>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone Section */}
            {activeSection === 'danger' && (
              <div
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 15, 15, 0.4), #101116cc)',
                  border: '1px solid rgba(255, 107, 94, 0.3)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', margin: 0, fontWeight: 500, color: '#ff857a' }}>
                    Danger Zone
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>
                    Irreversible actions affecting your studio account and project artifacts.
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 107, 94, 0.05)',
                    border: '1px solid rgba(255, 107, 94, 0.2)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div>
                    <b style={{ fontSize: '13px', color: '#ffb3ac', display: 'block' }}>
                      Delete Studio Account & Brand Data
                    </b>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                      This permanently deletes all your brand projects, generated artifacts, PDF export records, and chat history. This action cannot be undone.
                    </p>
                  </div>

                  <div>
                    <label style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
                      TYPE "DELETE MY ACCOUNT" TO CONFIRM
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255, 107, 94, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </div>

                  <button
                    disabled={deleteConfirmation !== 'DELETE MY ACCOUNT'}
                    onClick={() => {
                      alert('Account deletion requested. Please contact security@brandforge.ai to process full identity purge.');
                    }}
                    style={{
                      background: deleteConfirmation === 'DELETE MY ACCOUNT' ? 'rgba(255, 75, 75, 0.85)' : 'rgba(255, 75, 75, 0.2)',
                      color: deleteConfirmation === 'DELETE MY ACCOUNT' ? '#fff' : 'var(--muted)',
                      border: '1px solid rgba(255, 75, 75, 0.4)',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: deleteConfirmation === 'DELETE MY ACCOUNT' ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      alignSelf: 'flex-start',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Trash2 size={14} /> Purge Studio Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
