'use client';

import React from 'react';
import { Rocket, Download, Share2, Sparkles, Palette, Globe, MessageSquare, Check } from 'lucide-react';

interface LaunchBrandKitViewProps {
  launchData: any;
  brandState: any;
  onExportPDF: () => void;
  isLoading?: boolean;
}

export const LaunchBrandKitView: React.FC<LaunchBrandKitViewProps> = ({
  launchData,
  brandState,
  onExportPDF,
  isLoading = false,
}) => {
  const selectedName =
    brandState.selected_directions?.chosen_name ||
    brandState.naming?.suggestions?.[0]?.name ||
    brandState.naming?.territories?.[0]?.names?.[0]?.name ||
    brandState.name ||
    'BrandForge';
  const tagline = launchData?.tagline || 'From rough idea to launch-ready brand.';
  const pitch =
    launchData?.one_line_pitch ||
    'AI Brand Intelligence Studio that turns raw ideas into structured brand kits.';
  const personality = brandState.personality;
  const visual = brandState.visual_direction;
  const colors = visual?.color_palette || [];
  const landingCopy = launchData?.landing_page_copy || {};
  const socialPosts = launchData?.social_posts || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      {/* Top Banner / Hero Presentation */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 85% 15%, rgba(124, 92, 255, 0.22), transparent 50%), linear-gradient(135deg, #171526, #111218)',
          border: '1px solid rgba(124, 92, 255, 0.35)',
          borderRadius: '20px',
          padding: '40px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', font: '9px monospace', color: 'var(--sage)', background: 'rgba(124, 203, 154, 0.12)', border: '1px solid rgba(124, 203, 154, 0.25)', padding: '4px 12px', borderRadius: '999px', marginBottom: '18px' }}>
          <Check size={11} /> STAGE 08 / LAUNCH READY BRAND BOOK
        </div>

        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 500, letterSpacing: '-0.05em', margin: '0 0 12px', color: '#fff' }}>
          {selectedName}
        </h1>
        <p style={{ font: '18px Georgia, serif', color: '#c0b7dd', margin: '0 0 14px', fontStyle: 'italic' }}>
          {tagline}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '580px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          {pitch}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={onExportPDF} disabled={isLoading} className="button button-primary">
            <Download size={14} /> Export Brand Kit PDF
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Brand Kit URL copied to clipboard.');
              }
            }}
            className="button button-ghost"
          >
            <Share2 size={14} /> Share brand kit
          </button>
        </div>
      </div>

      {/* Guidelines Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Personality & Tone */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff', marginBottom: '14px' }}>
            <Sparkles size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              BRAND ARCHETYPE & VOICE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                ARCHETYPE
              </span>
              <b style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff' }}>
                {personality?.archetype || 'Creator / Visionary'}
              </b>
            </div>

            <div>
              <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                KEY TRAITS
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(personality?.traits || ['Innovative', 'Authoritative', 'Minimalist']).map((t: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      font: '9px monospace',
                      color: '#d8d2df',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                EMOTIONAL RESONANCE
              </span>
              <p style={{ fontSize: '12px', color: '#c0b7dd', fontStyle: 'italic', margin: 0 }}>
                "{personality?.emotional_goal || 'Empowered engineering clarity'}"
              </p>
            </div>
          </div>
        </div>

        {/* Visual Identity Palette */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', marginBottom: '14px' }}>
            <Palette size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              PALETTE SPECIFICATION
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '8px', marginBottom: '16px' }}>
            {colors.map((c: any, idx: number) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: c.hex,
                    marginBottom: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <span style={{ font: '8px monospace', color: '#fff', display: 'block' }}>{c.name}</span>
                <span style={{ font: '8px monospace', color: 'var(--subtle)' }}>{c.hex}</span>
              </div>
            ))}
          </div>

          {visual?.typography && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
              <span>Header: <strong style={{ color: '#fff' }}>{visual.typography.header_font}</strong></span>
              <span>Body: <strong style={{ color: '#fff' }}>{visual.typography.body_font}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Launch Landing Copy */}
      <div
        style={{
          background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '26px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '16px' }}>
          <Globe size={16} />
          <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
            RECOMMENDED LANDING PAGE MESSAGING
          </span>
        </div>

        <div style={{ background: '#0a0a0c', border: '1px solid var(--border)', borderRadius: '12px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
              HERO HEADLINE
            </span>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', margin: 0, fontWeight: 500, color: '#fff' }}>
              {landingCopy.headline || `From rough idea to launch-ready brand with ${selectedName}`}
            </h3>
          </div>

          <div>
            <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
              SUBHEADLINE
            </span>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
              {landingCopy.subheadline || 'Transform unstructured ideas into coherent brand systems through structured AI reasoning, human decisions, critique, and consistency.'}
            </p>
          </div>

          <div>
            <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
              PRIMARY CTA
            </span>
            <span style={{ display: 'inline-block', background: 'var(--indigo)', color: '#fff', font: '10px monospace', padding: '6px 14px', borderRadius: '999px', letterSpacing: '0.08em' }}>
              {landingCopy.cta || 'Start building'}
            </span>
          </div>
        </div>
      </div>

      {/* Social Content Snippets */}
      {socialPosts.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '26px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff', marginBottom: '16px' }}>
            <MessageSquare size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              LAUNCH SOCIAL COPY
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {socialPosts.map((post: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <span style={{ font: '9px monospace', color: '#ab9cff', display: 'block', marginBottom: '8px' }}>
                  PLATFORM / {post.platform || 'X / TWITTER'}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{post.content || post.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <b style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff', display: 'block' }}>
            Brand System Finalized
          </b>
          <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>
            Download complete design tokens, guidelines, and vector assets.
          </p>
        </div>
        <button onClick={onExportPDF} disabled={isLoading} className="button button-primary">
          <Download size={14} /> Export Brand Kit PDF
        </button>
      </div>
    </div>
  );
};
