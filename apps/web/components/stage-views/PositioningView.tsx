'use client';

import React from 'react';
import { Target, Check, ArrowRight, ShieldCheck, Zap, Award, Compass } from 'lucide-react';

interface PositioningViewProps {
  positioningData: any;
  selectedDirection?: string;
  onSelectDirection?: (directionName: string) => void;
  onAccept: () => void;
  isLoading?: boolean;
}

export const PositioningView: React.FC<PositioningViewProps> = ({
  positioningData,
  selectedDirection,
  onSelectDirection,
  onAccept,
  isLoading = false,
}) => {
  if (!positioningData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Target size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>POSITIONER AGENT EVALUATING STRATEGIC ANGLES...</p>
      </div>
    );
  }

  // Canonical Schema Handling
  const hasCanonicalFields = Boolean(
    positioningData.positioning_statement ||
    positioningData.value_proposition ||
    positioningData.category
  );

  const directions = Array.isArray(positioningData.directions) ? positioningData.directions : [];

  // If directions array is present, support selection; otherwise render the canonical Positioning Thesis
  const category = positioningData.category || 'Strategic Market Category';
  const coreProblem = positioningData.core_problem || 'Core problem definition';
  const valueProposition = positioningData.value_proposition || 'Compelling, distinct value proposition';
  const differentiators = Array.isArray(positioningData.differentiators)
    ? positioningData.differentiators
    : [];
  const competitiveAngle = positioningData.competitive_angle || 'Strategic competitive angle';
  const positioningStatement = positioningData.positioning_statement || valueProposition;
  const proofPoints = Array.isArray(positioningData.proof_points) ? positioningData.proof_points : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="territory-heading">
        <div>
          <span className="section-index">STAGE 02 / STRATEGY</span>
          <h2>Finding your sharpest angle.</h2>
        </div>
        <p>
          Strategic positioning framework creating<br />
          uncompromising differentiation in your category.
        </p>
      </div>

      {/* Main Canonical Positioning Framework */}
      {hasCanonicalFields && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hero Statement Card */}
          <div
            style={{
              background: 'radial-gradient(ellipse at 85% 15%, rgba(124, 92, 255, 0.16), transparent 50%), linear-gradient(135deg, #161423, #101117)',
              border: '1px solid rgba(124, 92, 255, 0.3)',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff' }}>
                <Target size={16} />
                <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  CANONICAL POSITIONING STATEMENT
                </span>
              </div>
              <span
                style={{
                  font: '9px monospace',
                  background: 'rgba(124, 92, 255, 0.12)',
                  color: '#d6cdff',
                  border: '1px solid rgba(124, 92, 255, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}
              >
                {category}
              </span>
            </div>

            <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', lineHeight: 1.5, color: '#f5f5f7', margin: '0 0 16px', fontStyle: 'italic' }}>
              "{positioningStatement}"
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  VALUE PROPOSITION
                </span>
                <b style={{ color: '#fff', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>
                  {valueProposition}
                </b>
              </div>
              <div>
                <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  COMPETITIVE ANGLE
                </span>
                <b style={{ color: 'var(--indigo)', fontSize: '13px', lineHeight: 1.4, display: 'block' }}>
                  {competitiveAngle}
                </b>
              </div>
            </div>
          </div>

          {/* Differentiators & Proof Points Bento */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '14px' }}>
                <Zap size={16} />
                <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  KEY DIFFERENTIATORS
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {differentiators.map((diff: any, idx: number) => {
                  const text = typeof diff === 'string' ? diff : diff.name || diff.differentiator || JSON.stringify(diff);
                  return (
                    <li key={idx} style={{ fontSize: '12px', color: '#e2dcff', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--amber)', fontWeight: 700 }}>0{idx + 1}.</span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage)', marginBottom: '14px' }}>
                <Award size={16} />
                <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
                  SUPPORTING PROOF POINTS
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {proofPoints.length > 0 ? (
                  proofPoints.map((pt: any, idx: number) => {
                    const text = typeof pt === 'string' ? pt : JSON.stringify(pt);
                    return (
                      <li key={idx} style={{ fontSize: '12px', color: '#d8d8df', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--sage)' }}>✓</span>
                        <span>{text}</span>
                      </li>
                    );
                  })
                ) : (
                  <li style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Proof points established through targeted verification and execution reliability.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Multi-Direction Grid (if directions array is present) */}
      {directions.length > 0 && (
        <div>
          <div className="section-index" style={{ marginBottom: '14px' }}>
            STRATEGIC DIRECTIONS / {directions.length} ALTERNATIVES EVALUATED
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
            {directions.map((dir: any, idx: number) => {
              const dirName = dir.name || `Direction 0${idx + 1}`;
              const isSelected = selectedDirection ? selectedDirection === dirName : idx === 0;

              return (
                <article
                  key={idx}
                  className={`name-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectDirection && onSelectDirection(dirName)}
                  style={{ cursor: onSelectDirection ? 'pointer' : 'default' }}
                >
                  <div className="name-card-top">
                    <span className="name-number">0{idx + 1}</span>
                    {isSelected && (
                      <span className="selected-badge">
                        <Check size={11} /> SELECTED
                      </span>
                    )}
                  </div>
                  <h2>{dirName}</h2>
                  <p>{dir.value_proposition || dir.positioning_statement}</p>
                </article>
              );
            })}
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
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
          Positioning will govern brand personality, naming territories, and launch tone.
        </div>
        <button onClick={onAccept} disabled={isLoading} className="button button-primary">
          Confirm Strategy & Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
