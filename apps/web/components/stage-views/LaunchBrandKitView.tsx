'use client';

import React from 'react';
import { Rocket, Download, Share2, Sparkles, Palette, Globe, MessageSquare, Check, Mic, Newspaper } from 'lucide-react';

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
  // Resolve brand name
  const selectedName =
    launchData?.brand_name ||
    brandState.selected_directions?.chosen_name ||
    brandState.selected_directions?.name?.name ||
    (typeof brandState.selected_directions?.name === 'string' ? brandState.selected_directions?.name : null) ||
    brandState.naming?.territories?.[0]?.names?.[0]?.name ||
    brandState.naming?.suggestions?.[0]?.name ||
    brandState.name ||
    'BrandForge';

  const tagline = launchData?.tagline || 'From rough idea to launch-ready brand.';
  const pitch =
    launchData?.one_line_pitch ||
    'AI Brand Intelligence Studio that turns raw ideas into structured brand kits.';

  // Personality extraction
  const personality = brandState.personality || {};
  const archetype = personality.brand_archetype || personality.archetype || 'Creator / Visionary';
  const emotionalGoal = personality.emotional_goal || 'Empowered engineering clarity';
  const rawTraits = Array.isArray(personality.personality)
    ? personality.personality
    : Array.isArray(personality.traits)
    ? personality.traits
    : ['Innovative', 'Authoritative', 'Minimalist'];

  // Visual extraction
  const visual = brandState.visual_direction || brandState.visual || {};
  const rawColors = Array.isArray(visual.color_direction)
    ? visual.color_direction
    : Array.isArray(visual.color_palette)
    ? visual.color_palette
    : ['#0A0A0C', '#15161C', '#7C5CFF', '#B4A5FF', '#F5F5F7'];

  const normalizedColors = rawColors.map((c: any, idx: number) => {
    if (typeof c === 'string') {
      const isHex = c.startsWith('#');
      return {
        hex: isHex ? c : '#7C5CFF',
        name: isHex ? `Swatch 0${idx + 1}` : c,
      };
    } else if (c && typeof c === 'object') {
      return {
        hex: c.hex || '#7C5CFF',
        name: c.name || `Swatch 0${idx + 1}`,
      };
    }
    return { hex: '#7C5CFF', name: 'Accent' };
  });

  // Typography extraction
  let headerFont = 'Editorial Serif (Georgia / Canela)';
  let bodyFont = 'Inter / Modern System Sans';
  if (Array.isArray(visual.typography) && visual.typography.length > 0) {
    headerFont = typeof visual.typography[0] === 'string' ? visual.typography[0] : headerFont;
    if (visual.typography.length > 1) {
      bodyFont = typeof visual.typography[1] === 'string' ? visual.typography[1] : bodyFont;
    }
  } else if (visual.typography && typeof visual.typography === 'object') {
    headerFont = visual.typography.header_font || headerFont;
    bodyFont = visual.typography.body_font || bodyFont;
  }

  // Canonical Landing Page Copy
  const landingCopy = launchData?.landing_page || launchData?.landing_page_copy || {};
  const headline = landingCopy.headline || `From rough idea to launch-ready brand with ${selectedName}`;
  const subheadline = landingCopy.subheadline || 'Transform unstructured ideas into coherent brand systems through structured AI reasoning, human decisions, critique, and consistency.';
  const cta = landingCopy.cta || 'Start building';

  // Canonical Social Copy
  const socialData = launchData?.social || {};
  const instagramCopy = socialData.instagram || '';
  const linkedinCopy = socialData.linkedin || '';
  const rawSocialPosts = Array.isArray(launchData?.social_posts) ? launchData.social_posts : [];

  // Voice Samples & Launch Message
  const voiceSamples = Array.isArray(launchData?.brand_voice_samples) ? launchData.brand_voice_samples : [];
  const launchMessage = launchData?.launch_message || '';

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
          "{tagline}"
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
                {archetype}
              </b>
            </div>

            <div>
              <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                KEY TRAITS
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {rawTraits.map((t: any, idx: number) => {
                  const traitName = typeof t === 'string' ? t : t.trait || `Trait ${idx + 1}`;
                  return (
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
                      {traitName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                EMOTIONAL RESONANCE
              </span>
              <p style={{ fontSize: '12px', color: '#c0b7dd', fontStyle: 'italic', margin: 0 }}>
                "{emotionalGoal}"
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
            {normalizedColors.map((c: any, idx: number) => (
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

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
            <span>Header: <strong style={{ color: '#fff' }}>{headerFont}</strong></span>
            <span>Body: <strong style={{ color: '#fff' }}>{bodyFont}</strong></span>
          </div>
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
              {headline}
            </h3>
          </div>

          <div>
            <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
              SUBHEADLINE
            </span>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
              {subheadline}
            </p>
          </div>

          <div>
            <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
              PRIMARY CTA
            </span>
            <span style={{ display: 'inline-block', background: 'var(--indigo)', color: '#fff', font: '10px monospace', padding: '6px 14px', borderRadius: '999px', letterSpacing: '0.08em' }}>
              {cta}
            </span>
          </div>
        </div>
      </div>

      {/* Social Content Snippets */}
      {(instagramCopy || linkedinCopy || rawSocialPosts.length > 0) && (
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
            {instagramCopy && (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ font: '9px monospace', color: '#ab9cff', display: 'block', marginBottom: '8px' }}>
                  PLATFORM / INSTAGRAM
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                  "{instagramCopy}"
                </p>
              </div>
            )}

            {linkedinCopy && (
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ font: '9px monospace', color: '#ab9cff', display: 'block', marginBottom: '8px' }}>
                  PLATFORM / LINKEDIN
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                  "{linkedinCopy}"
                </p>
              </div>
            )}

            {rawSocialPosts.map((post: any, idx: number) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ font: '9px monospace', color: '#ab9cff', display: 'block', marginBottom: '8px' }}>
                  PLATFORM / {post.platform || `CHANNEL 0${idx + 1}`}
                </span>
                <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{post.content || post.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Voice Samples & Launch Message */}
      {(voiceSamples.length > 0 || launchMessage) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {voiceSamples.length > 0 && (
            <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)', marginBottom: '14px' }}>
                <Mic size={16} />
                <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  BRAND VOICE SAMPLES
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {voiceSamples.map((sample: string, idx: number) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#e2dcff', margin: 0, fontStyle: 'italic', borderLeft: '2px solid var(--indigo)', paddingLeft: '10px' }}>
                    "{sample}"
                  </p>
                ))}
              </div>
            </div>
          )}

          {launchMessage && (
            <div style={{ background: 'linear-gradient(145deg, #15161cdd, #101116cc)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', marginBottom: '14px' }}>
                <Newspaper size={16} />
                <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  FOUNDER LAUNCH STATEMENT
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                {launchMessage}
              </p>
            </div>
          )}
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
