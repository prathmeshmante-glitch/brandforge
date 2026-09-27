'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Server, Key, EyeOff } from 'lucide-react';

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

export default function SecurityPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 13, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Logo />
          <div style={{ height: '18px', width: '1px', background: 'var(--border)' }} />
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--muted)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Back to BrandForge
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '60px 24px 80px' }}>
        <div className="eyebrow" style={{ marginBottom: '12px' }}>
          <span className="eyebrow-line" /> ARCHITECTURE & DEFENSE
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', margin: '0 0 16px', fontWeight: 500, letterSpacing: '-0.04em' }}>
          Security & Privacy Architecture
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '40px', lineHeight: 1.6 }}>
          How BrandForge protects your brand assets, prompts, and corporate identity across the stack.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldCheck size={24} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 6px', fontWeight: 500 }}>
                Row-Level Security (RLS) Tenant Isolation
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Database queries enforce strict ownership at the PostgreSQL engine level. Even if an attacker guesses a valid project UUID, the database layer automatically drops unauthorized access attempts without returning rows.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <Lock size={24} color="var(--indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 6px', fontWeight: 500 }}>
                Private Storage & Authorized Exports
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Generated brand kit PDFs and assets are stored in private Supabase Storage buckets. Download links require valid JWT authentication verified against project ownership before streaming file bytes.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <EyeOff size={24} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 6px', fontWeight: 500 }}>
                Zero AI Foundation Model Training
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Your startup concepts and strategic prompts are processed through enterprise API tiers with data processing agreements ensuring your text is never cached for training or fine-tuning foundation models.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <Server size={24} color="#ffb3ac" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', margin: '0 0 6px', fontWeight: 500 }}>
                Rate Limiting & DDoS Defense
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                Sliding-window IP and token-based rate limiting safeguard AI workflow and PDF rendering endpoints to prevent resource exhaustion, runaway costs, and credential brute-forcing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
