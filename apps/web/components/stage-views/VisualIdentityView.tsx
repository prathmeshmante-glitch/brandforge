'use client';

import React from 'react';
import { Palette, Type, Layout, ArrowRight, Layers, Sparkles, ShieldBan } from 'lucide-react';

interface VisualIdentityViewProps {
  visualData: any;
  brandName?: string;
  onAccept: () => void;
  isLoading?: boolean;
}

export const VisualIdentityView: React.FC<VisualIdentityViewProps> = ({
  visualData,
  brandName = 'BrandForge',
  onAccept,
  isLoading = false,
}) => {
  if (!visualData) {
    return (
      <div
        style={{
          background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
          border: '1px dashed var(--border)',
          borderRadius: '16px',
          padding: '60px 24px',
          textAlign: 'center',
          maxWidth: '520px',
          margin: '40px auto',
        }}
      >
        <Palette size={32} className={isLoading ? 'animate-spin' : ''} style={{ margin: '0 auto 12px', color: 'var(--sage)' }} />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px', color: '#fff' }}>
          {isLoading ? 'Creative Director Rendering...' : 'Visual Identity System Pending'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
          {isLoading
            ? 'Generating harmonized color palettes, typography hierarchies, and logo design directives...'
            : 'Run the 8-Agent Pipeline to materialize visual tokens grounded in your brand identity.'}
        </p>
      </div>
    );
  }

  // Canonical Schema Extraction
  // CreativeDirectorOutput has visual_direction and logo_direction
  const visDir = visualData.visual_direction || visualData;
  const logoDir = visualData.logo_direction || {};

  // Mood
  const moodList = Array.isArray(visDir.mood)
    ? visDir.mood
    : Array.isArray(visDir.visual_mood)
    ? visDir.visual_mood
    : typeof visDir.visual_mood === 'string'
    ? [visDir.visual_mood]
    : ['Neo-Editorial Obsidian', 'High-Tech Precision', 'Quiet Authority'];
  const visualMoodText = moodList.join(' • ');

  // Colors: Can be color_direction (hex strings) or color_palette (objects)
  const rawColors = Array.isArray(visDir.color_direction)
    ? visDir.color_direction
    : Array.isArray(visDir.color_palette)
    ? visDir.color_palette
    : ['#0A0A0C', '#15161C', '#7C5CFF', '#B4A5FF', '#F5F5F7'];

  const normalizedSwatches = rawColors.map((c: any, idx: number) => {
    if (typeof c === 'string') {
      const isHex = c.startsWith('#');
      return {
        hex: isHex ? c : '#7C5CFF',
        name: isHex ? `Swatch 0${idx + 1}` : c,
        role: idx === 0 ? 'Base / Canvas' : idx === 1 ? 'Surface' : idx === 2 ? 'Primary Accent' : 'Highlight',
      };
    } else if (c && typeof c === 'object') {
      return {
        hex: c.hex || '#7C5CFF',
        name: c.name || `Swatch 0${idx + 1}`,
        role: c.role || 'Accent',
        usage: c.usage || '',
      };
    }
    return { hex: '#7C5CFF', name: 'Accent', role: 'Primary' };
  });

  // Typography
  let headerFont = 'Editorial Serif (Georgia / Canela)';
  let bodyFont = 'Inter / Modern System Sans';

  if (Array.isArray(visDir.typography) && visDir.typography.length > 0) {
    headerFont = typeof visDir.typography[0] === 'string' ? visDir.typography[0] : headerFont;
    if (visDir.typography.length > 1) {
      bodyFont = typeof visDir.typography[1] === 'string' ? visDir.typography[1] : bodyFont;
    }
  } else if (visDir.typography && typeof visDir.typography === 'object') {
    headerFont = visDir.typography.header_font || headerFont;
    bodyFont = visDir.typography.body_font || bodyFont;
  }

  // Composition
  const compositionText = Array.isArray(visDir.composition)
    ? visDir.composition.join(' ')
    : typeof visDir.composition === 'string'
    ? visDir.composition
    : 'Structured grid layout with generous obsidian whitespace and subtle luminescence.';

  // Shape Language
  const shapeLanguageText = Array.isArray(visDir.shape_language)
    ? visDir.shape_language.join(' ')
    : typeof visDir.shape_language === 'string'
    ? visDir.shape_language
    : 'Refined 12px-18px corner radii with 1px frosted translucent borders.';

  // Logo Direction
  const logoConcept = typeof logoDir === 'string'
    ? logoDir
    : logoDir.concept || 'Precision geometric monogram with restrained letterspaced wordmark.';
  const logoRationale = typeof logoDir === 'object' && logoDir.rationale ? logoDir.rationale : '';

  // Avoid list
  const avoidList = Array.isArray(visDir.avoid) ? visDir.avoid : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="territory-heading">
        <div>
          <span className="section-index">STAGE 05 / AESTHETICS</span>
          <h2>Giving the idea a shape.</h2>
        </div>
        <p>
          Palette swatches, typography pairing, shape geometry,<br />
          and visual mood synthesized into a coherent world.
        </p>
      </div>

      {/* Visual Mood Banner */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 85% 15%, rgba(124, 92, 255, 0.15), transparent 50%), linear-gradient(135deg, #161522, #111217)',
          border: '1px solid rgba(124, 92, 255, 0.25)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '11px',
              background: 'rgba(124, 92, 255, 0.15)',
              color: '#b4a5ff',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(124, 92, 255, 0.3)',
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ font: '9px monospace', color: '#b4a5ff', letterSpacing: '0.12em', display: 'block', marginBottom: '2px' }}>
              DEFINED VISUAL MOOD
            </span>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#fff', margin: 0, fontWeight: 500 }}>
              {visualMoodText}
            </h3>
          </div>
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div>
        <div className="section-index" style={{ marginBottom: '14px' }}>
          COLOR PALETTE / {normalizedSwatches.length} DESIGN SWATCHES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          {normalizedSwatches.map((color: any, idx: number) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '84px',
                  backgroundColor: color.hex,
                  position: 'relative',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}
              >
                <span
                  style={{
                    font: '9px monospace',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {color.hex}
                </span>
              </div>
              <div style={{ padding: '14px' }}>
                <b style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '2px' }}>
                  {color.name}
                </b>
                <span style={{ font: '9px monospace', color: 'var(--subtle)', display: 'block' }}>
                  {color.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div>
        <div className="section-index" style={{ marginBottom: '14px' }}>
          TYPOGRAPHY SYSTEM / EDITORIAL PAIRING
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
              PRIMARY DISPLAY FONT
            </span>
            <div style={{ font: '11px monospace', color: '#b4a5ff', marginBottom: '14px' }}>
              {headerFont}
            </div>
            <div style={{ background: '#0a0a0c', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '30px', fontWeight: 500, letterSpacing: '-0.04em', margin: '0 0 6px', color: '#fff' }}>
                {brandName}
              </h1>
              <p style={{ font: '10px monospace', color: 'var(--subtle)', margin: 0 }}>
                Display Title Scale (30px Medium)
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
              BODY & UI FONT
            </span>
            <div style={{ font: '11px monospace', color: '#b4a5ff', marginBottom: '14px' }}>
              {bodyFont}
            </div>
            <div style={{ background: '#0a0a0c', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text)', margin: '0 0 8px' }}>
                BrandForge translates unstructured product concepts into coherent brand systems through staged AI reasoning.
              </p>
              <p style={{ font: '10px monospace', color: 'var(--subtle)', margin: 0 }}>
                Body Scale (13px Regular / 1.6 Line Height)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Composition, Shape Language & Logo Concept Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)', marginBottom: '8px' }}>
            <Layout size={15} />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              COMPOSITION RULES
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
            {compositionText}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '8px' }}>
            <Layers size={15} />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              SHAPE LANGUAGE
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
            {shapeLanguageText}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', marginBottom: '8px' }}>
            <Palette size={15} />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              LOGO CONCEPT
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.5, margin: '0 0 4px', fontWeight: 500 }}>
            {logoConcept}
          </p>
          {logoRationale && (
            <p style={{ fontSize: '11px', color: 'var(--subtle)', margin: 0, fontStyle: 'italic' }}>
              {logoRationale}
            </p>
          )}
        </div>
      </div>

      {/* Visual Clichés to Avoid (if present) */}
      {avoidList.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 107, 94, 0.04)',
            border: '1px solid rgba(255, 107, 94, 0.2)',
            borderRadius: '14px',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--coral)', marginBottom: '8px' }}>
            <ShieldBan size={15} />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              VISUAL CLICHÉS TO AVOID
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {avoidList.map((item: any, idx: number) => (
              <span
                key={idx}
                style={{
                  font: '10px monospace',
                  color: '#ffd2cc',
                  background: 'rgba(255, 107, 94, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                }}
              >
                ✕ {typeof item === 'string' ? item : JSON.stringify(item)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
          Visual identity is ready for adversarial Brand Battle / Critic testing.
        </p>

        <button onClick={onAccept} disabled={isLoading} className="button button-primary">
          Enter Brand Battle <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
