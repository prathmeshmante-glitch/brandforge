'use client';

import React from 'react';
import { Sparkles, Heart, Shield, Ban, ArrowRight, MessageSquare } from 'lucide-react';

interface PersonalityViewProps {
  personalityData: any;
  onAccept: () => void;
  isLoading?: boolean;
}

export const PersonalityView: React.FC<PersonalityViewProps> = ({
  personalityData,
  onAccept,
  isLoading = false,
}) => {
  if (!personalityData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Sparkles size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>BRAND STRATEGIST DEFINING ARCHETYPE & VOICE...</p>
      </div>
    );
  }

  const {
    archetype = 'Creator / Visionary',
    traits = [],
    tone = [],
    emotional_goal = 'Empowered engineering clarity and trust',
    brand_principles = [],
    avoid_traits = [],
  } = personalityData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="territory-heading">
        <div>
          <span className="section-index">STAGE 03 / CHARACTER</span>
          <h2>Defining how it should feel.</h2>
        </div>
        <p>
          Archetype, emotional resonance, and voice principles<br />
          that protect against generic corporate tone.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {/* Core Brand Archetype */}
        <div
          style={{
            background: 'radial-gradient(ellipse at 85% 15%, rgba(124, 92, 255, 0.15), transparent 50%), linear-gradient(135deg, #171422, #111217)',
            border: '1px solid rgba(124, 92, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff', marginBottom: '8px' }}>
            <Sparkles size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              CORE BRAND ARCHETYPE
            </span>
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff', margin: '8px 0 10px', fontWeight: 500 }}>
            {archetype}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            Defines the cognitive presence and baseline posture for all visual and verbal expressions.
          </p>
        </div>

        {/* Primary Emotional Goal */}
        <div
          style={{
            background: 'radial-gradient(ellipse at 85% 15%, rgba(245, 165, 36, 0.12), transparent 50%), linear-gradient(135deg, #181512, #111217)',
            border: '1px solid rgba(245, 165, 36, 0.25)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '8px' }}>
            <Heart size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              PRIMARY EMOTIONAL GOAL
            </span>
          </div>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ffebc4', margin: '8px 0 10px', fontWeight: 500, fontStyle: 'italic' }}>
            "{emotional_goal}"
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            The target sensation the brand leaves with founders, users, and partners across every touchpoint.
          </p>
        </div>
      </div>

      {/* Traits & Tone Descriptors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--subtle)', marginBottom: '14px' }}>
            <Sparkles size={14} color="#b4a5ff" />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--muted)' }}>
              KEY PERSONALITY TRAITS
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {traits.map((trait: string, idx: number) => (
              <span
                key={idx}
                style={{
                  font: '10px monospace',
                  color: '#d6cdff',
                  background: 'rgba(124, 92, 255, 0.12)',
                  border: '1px solid rgba(124, 92, 255, 0.25)',
                  borderRadius: '999px',
                  padding: '5px 12px',
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--subtle)', marginBottom: '14px' }}>
            <MessageSquare size={14} color="var(--indigo)" />
            <span style={{ font: '9px monospace', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--muted)' }}>
              TONE OF VOICE DESCRIPTORS
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tone.map((t: string, idx: number) => (
              <span
                key={idx}
                style={{
                  font: '10px monospace',
                  color: '#c2b8ff',
                  background: 'rgba(124, 92, 255, 0.08)',
                  border: '1px solid rgba(124, 92, 255, 0.2)',
                  borderRadius: '999px',
                  padding: '5px 12px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Principles & Avoid Boundaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', marginBottom: '12px' }}>
            <Shield size={15} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              CORE BRAND PRINCIPLES
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brand_principles.map((principle: string, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#e2dcff', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--sage)' }}>•</span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: 'radial-gradient(ellipse at 90% 10%, rgba(255, 107, 94, 0.08), transparent 50%), #121319',
            border: '1px solid rgba(255, 107, 94, 0.2)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--coral)', marginBottom: '12px' }}>
            <Ban size={15} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              AVOID TRAITS (WHAT THE BRAND IS NOT)
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {avoid_traits.map((avoid: string, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#eed2cf', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--coral)' }}>✕</span>
                <span>{avoid}</span>
              </li>
            ))}
          </ul>
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
          Personality principles will govern naming territory boundaries and tone of voice.
        </p>

        <button onClick={onAccept} disabled={isLoading} className="button button-primary">
          Confirm Personality & Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
