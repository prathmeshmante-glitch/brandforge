'use client';

import React, { useState } from 'react';
import { Swords, Check, ArrowRight, ShieldAlert, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';

interface BrandBattleViewProps {
  critiqueData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const BrandBattleView: React.FC<BrandBattleViewProps> = ({
  critiqueData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!critiqueData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Swords size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--coral)' }} />
        <p style={{ font: '11px monospace' }}>ADVERSARIAL CRITIC AGENT STRESS-TESTING BRAND SYSTEM...</p>
      </div>
    );
  }

  const {
    overall_assessment,
    genericity_score,
    audience_fit,
    differentiation_rating,
    positioning_strength,
    personality_consistency,
    visual_strategy_fit,
    key_weaknesses = [],
    recommended_revisions = [],
    critique_items = [],
  } = critiqueData;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Signature Brand Battle Header */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 85% 15%, rgba(255, 107, 94, 0.18), transparent 50%), linear-gradient(135deg, #18141c, #111217)',
          border: '1px solid rgba(255, 107, 94, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 107, 94, 0.15)',
                color: 'var(--coral)',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid rgba(255, 107, 94, 0.3)',
              }}
            >
              <Swords size={22} />
            </div>
            <div>
              <div className="eyebrow" style={{ color: 'var(--coral)', marginBottom: '4px' }}>
                <span className="eyebrow-line" style={{ background: 'var(--coral)' }} /> STAGE 06 / ADVERSARIAL CRITIC
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
                Brand Battle Arena
              </h2>
            </div>
          </div>

          {overall_assessment && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block' }}>
                CRITIC VERDICT
              </span>
              <span style={{ font: '11px monospace', color: '#ffd2cc', fontWeight: 600 }}>
                {overall_assessment}
              </span>
            </div>
          )}
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, marginTop: '16px', maxWidth: '720px' }}>
          The adversarial AI critic deliberately attacks positioning genericity, surface-level buzzwords, and audience friction before you meet the real market.
        </p>
      </div>

      {/* Adversarial Scorecards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Genericity', val: genericity_score || 'Low (2/10)', color: 'var(--amber)' },
          { label: 'Audience Fit', val: audience_fit || 'High (9/10)', color: 'var(--sage)' },
          { label: 'Differentiation', val: differentiation_rating || 'Strong', color: 'var(--indigo)' },
          { label: 'Positioning', val: positioning_strength || 'Solid', color: '#b4a5ff' },
          { label: 'Personality', val: personality_consistency || 'Consistent', color: '#c0b7dd' },
          { label: 'Visual Fit', val: visual_strategy_fit || 'High', color: 'var(--sage)' },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>
              {stat.label.toUpperCase()}
            </span>
            <b style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: stat.color, fontWeight: 500 }}>
              {stat.val}
            </b>
          </div>
        ))}
      </div>

      {/* Market Challenges Grid */}
      {critique_items.length > 0 && (
        <div>
          <div className="section-index" style={{ marginBottom: '12px' }}>
            CRITIQUE ITEMS / {critique_items.length} CHALLENGES IDENTIFIED
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {critique_items.map((item: any, idx: number) => {
              const sev = (item.severity || 'Medium').toLowerCase();
              const sevColor = sev === 'high' || sev === 'critical' ? 'var(--coral)' : sev === 'medium' ? 'var(--amber)' : 'var(--sage)';
              return (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ font: '10px monospace', color: '#fff', fontWeight: 600 }}>
                        {item.category || item.area || 'Market Friction'}
                      </span>
                      <span
                        style={{
                          font: '9px monospace',
                          color: sevColor,
                          background: `${sevColor}1a`,
                          border: `1px solid ${sevColor}40`,
                          borderRadius: '999px',
                          padding: '2px 8px',
                        }}
                      >
                        {item.severity || 'Medium'} Severity
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: '8px 0' }}>
                      {item.finding || item.issue}
                    </p>
                    {item.explanation && (
                      <p style={{ fontSize: '11px', color: '#c0b7dd', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', margin: '8px 0 0' }}>
                        "{item.explanation}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weaknesses & Revisions Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'radial-gradient(ellipse at 90% 10%, rgba(255, 107, 94, 0.08), transparent 50%), #121319',
            border: '1px solid rgba(255, 107, 94, 0.25)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--coral)', marginBottom: '12px' }}>
            <ShieldAlert size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              KEY VULNERABILITIES
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {key_weaknesses.map((w: string, idx: number) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#eed2cf' }}>
                <XCircle size={14} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: 'radial-gradient(ellipse at 90% 10%, rgba(124, 92, 255, 0.08), transparent 50%), #121319',
            border: '1px solid rgba(124, 92, 255, 0.25)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff', marginBottom: '12px' }}>
            <RefreshCw size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              STRATEGIC REVISIONS
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommended_revisions.map((r: string, idx: number) => (
              <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#d8d2df' }}>
                <span style={{ color: 'var(--indigo)', fontWeight: 700 }}>•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decision Bar & Rerun Input */}
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
          Accept findings to enter Consistency Guardian or trigger targeted refinement.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="button button-outline"
            onClick={() => setShowRevisionInput(!showRevisionInput)}
            disabled={isLoading}
          >
            <RefreshCw size={14} color="#b4a5ff" /> Request targeted rerun
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={onAccept}
            disabled={isLoading}
          >
            Pass Brand Battle & Continue <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {showRevisionInput && (
        <form
          onSubmit={handleRevisionSubmit}
          style={{
            background: 'linear-gradient(135deg, rgba(124, 92, 255, 0.12), rgba(18, 19, 25, 0.9))',
            border: '1px solid rgba(124, 92, 255, 0.35)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <label style={{ font: '10px monospace', color: '#b4a5ff', letterSpacing: '0.1em' }}>
            PROVIDE SPECIFIC FEEDBACK FOR TARGETED RERUN:
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Sharpen positioning to sound less generic and address B2B developer differentiation..."
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setShowRevisionInput(false)}
            >
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Trigger Rerun Loop
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
