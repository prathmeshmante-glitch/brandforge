'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  Palette,
  Target,
  Flame,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../../lib/api';

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

export default function PublicSharePage() {
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  const [sharedData, setSharedData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function loadSharedKit() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await api.getPublicBrandKit(token);
        setSharedData(data);
      } catch (err: any) {
        setErrorMsg(err?.message || 'This shared brand kit is either invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSharedKit();
  }, [token]);

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
          color: 'var(--subtle)',
          padding: '24px',
        }}
      >
        <Sparkles size={28} className="animate-spin" style={{ color: 'var(--indigo)', marginBottom: '16px' }} />
        <p style={{ font: '11px monospace', letterSpacing: '0.12em' }}>RETRIEVING SHARED BRAND IDENTITY...</p>
      </div>
    );
  }

  if (errorMsg || !sharedData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse 55% 75% at 50% 30%, rgba(124, 92, 255, 0.08), transparent 70%), var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <Logo />
        <div
          style={{
            maxWidth: '480px',
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '40px 28px',
            marginTop: '32px',
          }}
        >
          <AlertCircle size={36} color="#ff857a" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: '0 0 10px', fontWeight: 500 }}>
            Shared Brand Kit Unavailable
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
            {errorMsg || 'The requested brand share link does not exist, has expired, or has been revoked by the founder.'}
          </p>
          <Link href="/" className="button button-primary" style={{ margin: '0 auto' }}>
            Explore BrandForge Studio <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const kit = sharedData.brand_kit || {};
  const positioning = kit.positioning || {};
  const personality = kit.personality || {};
  const visual = kit.visual_identity || {};
  const launch = kit.launch_kit || {};
  const consistency = kit.consistency || {};

  const brandName = sharedData.brand_name || kit.brand_name || 'Brand System';
  const tagline = kit.tagline || positioning.value_proposition || 'AI-Forged Brand Intelligence';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Logo />
          <span style={{ fontSize: '10px', color: 'var(--subtle)', fontFamily: 'monospace' }}>
            PUBLIC BRAND SPECIFICATION
          </span>
        </div>
        <Link href="/signup" className="button button-primary" style={{ fontSize: '11px', padding: '6px 14px' }}>
          Build your brand <ArrowRight size={13} />
        </Link>
      </header>

      {/* Hero Showcase */}
      <div
        style={{
          padding: '80px 24px 60px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 60% 80% at 50% 20%, rgba(124, 92, 255, 0.15), transparent 75%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '12px' }}>
          <span className="eyebrow-line" /> VERIFIED BRAND INTELLIGENCE
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            margin: '0 0 12px',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            color: '#fff',
          }}
        >
          {brandName}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '640px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          {tagline}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(124, 92, 255, 0.1)',
              border: '1px solid rgba(124, 92, 255, 0.3)',
              color: 'var(--accent)',
            }}
          >
            STAGE 08: LAUNCH KIT
          </span>
          {consistency.overall_score && (
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(92, 225, 160, 0.1)',
                border: '1px solid rgba(92, 225, 160, 0.3)',
                color: 'var(--sage)',
              }}
            >
              CONSISTENCY: {consistency.overall_score}/100
            </span>
          )}
        </div>
      </div>

      {/* Main Kit Sections */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '60px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Positioning & Value Proposition */}
        <section
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Target size={20} color="var(--indigo)" />
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: 0, fontWeight: 500 }}>
              Strategic Positioning
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>CATEGORY</span>
              <p style={{ fontSize: '14px', color: '#fff', margin: '4px 0 0', fontWeight: 500 }}>
                {positioning.category || 'Strategic Industry Space'}
              </p>
            </div>
            <div>
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>CORE VALUE PROPOSITION</span>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
                {positioning.value_proposition || positioning.statement || 'Positioned for maximum clarity and competitive differentiation.'}
              </p>
            </div>
          </div>
        </section>

        {/* Personality & Tone */}
        <section
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Flame size={20} color="var(--accent)" />
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: 0, fontWeight: 500 }}>
              Brand Personality & Tone
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>ARCHETYPE</span>
              <p style={{ fontSize: '14px', color: '#fff', margin: '4px 0 0', fontWeight: 500 }}>
                {personality.archetype || 'The Creator / Visionary'}
              </p>
            </div>
            <div>
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em' }}>TONE OF VOICE</span>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.5 }}>
                {personality.tone || personality.voice || 'Analytical, visionary, and unmistakably decisive.'}
              </p>
            </div>
          </div>
        </section>

        {/* Visual Identity Palette */}
        <section
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Palette size={20} color="var(--sage)" />
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: 0, fontWeight: 500 }}>
              Visual Identity & Swatches
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
            {(visual.color_palette || [
              { name: 'Primary Slate', hex: '#0B0C0E' },
              { name: 'Accent Indigo', hex: '#7C5CFF' },
              { name: 'Sage Signal', hex: '#5CE1A0' },
              { name: 'Subtle Fog', hex: '#8E919B' },
            ]).map((c: any, i: number) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    height: '50px',
                    borderRadius: '8px',
                    background: c.hex || '#7C5CFF',
                    marginBottom: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>{c.name || `Color ${i + 1}`}</div>
                <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--subtle)' }}>{c.hex || '#—'}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Launch Messaging */}
        <section
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '18px',
            padding: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Sparkles size={20} color="var(--accent)" />
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', margin: 0, fontWeight: 500 }}>
              Launch Pitch & Messaging
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: '#fff', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
            &ldquo;{launch.one_line_pitch || launch.headline || tagline}&rdquo;
          </p>
          {launch.social_copy && (
            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '12px',
                color: 'var(--muted)',
                lineHeight: 1.6,
              }}
            >
              {launch.social_copy}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '40px 24px',
          textAlign: 'center',
          marginTop: 'auto',
          background: 'rgba(12, 13, 16, 0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--subtle)', fontSize: '11px', marginBottom: '14px' }}>
          <ShieldCheck size={14} color="var(--sage)" />
          <span>Read-only shared brand specification generated by BrandForge AI Studio.</span>
        </div>
        <Link href="/" className="button button-outline" style={{ fontSize: '11px', padding: '6px 16px' }}>
          Create your own brand with BrandForge <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
