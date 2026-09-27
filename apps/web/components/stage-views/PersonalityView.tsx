'use client';

import React from 'react';
import { Sparkles, Heart, Shield, Ban, ArrowRight, MessageSquare, Check } from 'lucide-react';

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
        <Sparkles size={32} className={isLoading ? 'animate-spin' : ''} style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px', color: '#fff' }}>
          {isLoading ? 'Brand Strategist Defining Archetype...' : 'Personality & Voice Pending'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
          {isLoading
            ? 'Sculpting brand archetype, behavioral traits, and editorial tone guides...'
            : 'Run the 8-Agent Pipeline to define how your brand speaks, feels, and acts.'}
        </p>
      </div>
    );
  }

  // Canonical Schema Normalization
  const archetype =
    personalityData.brand_archetype ||
    personalityData.archetype ||
    'Creator / Visionary';

  const emotionalGoal =
    personalityData.emotional_goal ||
    'Empowered engineering clarity and trust';

  // personality can be a list of PersonalityTrait {trait, reason} or strings, or traits array
  const rawTraits = Array.isArray(personalityData.personality)
    ? personalityData.personality
    : Array.isArray(personalityData.traits)
    ? personalityData.traits
    : [];

  // tone can be ToneGuide {do: string[], avoid: string[]} or an array of strings
  let toneDo: string[] = [];
  let toneAvoid: string[] = [];

  if (personalityData.tone && typeof personalityData.tone === 'object' && !Array.isArray(personalityData.tone)) {
    toneDo = Array.isArray(personalityData.tone.do) ? personalityData.tone.do : [];
    toneAvoid = Array.isArray(personalityData.tone.avoid) ? personalityData.tone.avoid : [];
  } else if (Array.isArray(personalityData.tone)) {
    toneDo = personalityData.tone;
  }

  // avoid_traits can be provided separately or from tone.avoid
  const avoidTraits = Array.isArray(personalityData.avoid_traits)
    ? personalityData.avoid_traits
    : toneAvoid.length > 0
    ? toneAvoid
    : ['Corporate jargon', 'Aggressive urgency', 'Vague buzzwords'];

  // principles can be principles or brand_principles
  const principles = Array.isArray(personalityData.principles)
    ? personalityData.principles
    : Array.isArray(personalityData.brand_principles)
    ? personalityData.brand_principles
    : ['Uncompromising clarity', 'Technical precision', 'Radical transparency'];

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
            "{emotionalGoal}"
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
              KEY PERSONALITY TRAITS & STRATEGIC REASONS
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rawTraits.map((t: any, idx: number) => {
              const traitName = typeof t === 'string' ? t : t.trait || `Trait ${idx + 1}`;
              const traitReason = typeof t === 'object' ? t.reason : '';

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        font: '10px monospace',
                        color: '#d6cdff',
                        background: 'rgba(124, 92, 255, 0.12)',
                        border: '1px solid rgba(124, 92, 255, 0.25)',
                        borderRadius: '999px',
                        padding: '4px 10px',
                      }}
                    >
                      {traitName}
                    </span>
                  </div>
                  {traitReason && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)', paddingLeft: '4px' }}>
                      {traitReason}
                    </span>
                  )}
                </div>
              );
            })}
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
              COMMUNICATION GUIDELINES (DO)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {toneDo.map((t: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#c2b8ff' }}>
                <Check size={14} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{t}</span>
              </div>
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
            {principles.map((principle: any, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#e2dcff', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--sage)' }}>•</span>
                <span>{typeof principle === 'string' ? principle : JSON.stringify(principle)}</span>
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
            {avoidTraits.map((avoid: any, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#eed2cf', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--coral)' }}>✕</span>
                <span>{typeof avoid === 'string' ? avoid : JSON.stringify(avoid)}</span>
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
