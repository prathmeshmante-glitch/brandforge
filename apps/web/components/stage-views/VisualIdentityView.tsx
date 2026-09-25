'use client';

import React from 'react';
import { Palette, Type, Layout, ArrowRight, Layers, Sparkles } from 'lucide-react';

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
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Palette size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--sage)' }} />
        <p style={{ font: '11px monospace' }}>CREATIVE DIRECTOR RENDERING VISUAL IDENTITY & PALETTE...</p>
      </div>
    );
  }

  const {
    color_palette = [],
    typography = {},
    composition = 'Structured grid layout with generous obsidian whitespace and subtle luminescence.',
    shape_language = 'Refined 12px-18px corner radii with 1px frosted translucent borders.',
    logo_direction = 'Diamond geometric spark mark with letterspaced serif wordmark.',
    visual_mood = 'Neo-Editorial Dark Obsidian & High-Tech Precision',
  } = visualData;

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
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', color: '#fff', margin: 0, fontWeight: 500 }}>
              {visual_mood}
            </h3>
          </div>
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div>
        <div className="section-index" style={{ marginBottom: '14px' }}>
          COLOR PALETTE / {color_palette.length} CURATED SWATCHES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {color_palette.map((color: any, idx: number) => (
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
                  height: '90px',
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
                <b style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '2px' }}>
                  {color.name}
                </b>
                <span style={{ font: '9px monospace', color: 'var(--subtle)', display: 'block', marginBottom: '6px' }}>
                  ROLE: {color.role || 'Accent'}
                </span>
                {color.usage && (
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.4, margin: 0 }}>
                    {color.usage}
                  </p>
                )}
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
              {typography.header_font || 'Editorial Serif (Georgia / Canela)'}
            </div>
            <div style={{ background: '#0a0a0c', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 500, letterSpacing: '-0.04em', margin: '0 0 6px', color: '#fff' }}>
                {brandName}
              </h1>
              <p style={{ font: '10px monospace', color: 'var(--subtle)', margin: 0 }}>
                Display Title Scale (32px Medium)
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
              {typography.body_font || 'Inter Sans / Modern System UI'}
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

      {/* Composition & Shape Geometry */}
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
            {composition}
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
            {shape_language}
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
              LOGO DIRECTION
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
            {logo_direction}
          </p>
        </div>
      </div>

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
