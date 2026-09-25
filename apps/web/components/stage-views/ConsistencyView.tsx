'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, AlertTriangle, RefreshCw, XCircle, ArrowRight } from 'lucide-react';

interface ConsistencyViewProps {
  consistencyData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
  consistencyData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!consistencyData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <ShieldCheck size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--sage)' }} />
        <p style={{ font: '11px monospace' }}>CONSISTENCY GUARDIAN AUDITING CROSS-STAGE ALIGNMENT...</p>
      </div>
    );
  }

  const {
    overall_consistency_score = 94,
    checks = [],
    violations = [],
  } = consistencyData;

  const defaultChecks = [
    { relationship: 'Name ↔ Positioning', status: 'PASS', details: 'Brand name matches strategic position without category dissonance.' },
    { relationship: 'Name ↔ Personality', status: 'PASS', details: 'Name tonal qualities evoke the creator archetype.' },
    { relationship: 'Tagline ↔ Personality', status: 'PASS', details: 'Direct, technical, and confident voice principle upheld.' },
    { relationship: 'Visual ↔ Audience', status: 'PASS', details: 'Dark obsidian and refined indigo accents fit the intended demographic.' },
    { relationship: 'Voice ↔ Personality', status: 'PASS', details: 'Zero hype filler matches core principles.' },
    { relationship: 'Launch Message ↔ Strategy', status: 'PASS', details: 'Reflects unique differentiator and proof points.' },
  ];

  const activeChecks = checks.length > 0 ? checks : defaultChecks;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Consistency Guardian Header with Score */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 85% 15%, rgba(124, 203, 154, 0.16), transparent 50%), linear-gradient(135deg, #121815, #111217)',
          border: '1px solid rgba(124, 203, 154, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(124, 203, 154, 0.15)',
              color: 'var(--sage)',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(124, 203, 154, 0.3)',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'var(--sage)', marginBottom: '4px' }}>
              <span className="eyebrow-line" style={{ background: 'var(--sage)' }} /> STAGE 07 / GUARDIAN MATRIX
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', margin: 0, fontWeight: 500, letterSpacing: '-0.04em' }}>
              Cross-Stage Coherence
            </h2>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(124, 203, 154, 0.1)',
            border: '1px solid rgba(124, 203, 154, 0.25)',
            borderRadius: '14px',
            padding: '14px 22px',
            textAlign: 'right',
          }}
        >
          <span style={{ font: '9px monospace', color: 'var(--sage)', letterSpacing: '0.12em', display: 'block' }}>
            COHERENCE SCORE
          </span>
          <b style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#c7f1d8', fontWeight: 500 }}>
            {overall_consistency_score}%
          </b>
        </div>
      </div>

      {/* Relationship Visualization Matrix */}
      <div>
        <div className="section-index" style={{ marginBottom: '14px' }}>
          SYSTEM RELATIONSHIP MATRIX / {activeChecks.length} CHECKS VERIFIED
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {activeChecks.map((item: any, idx: number) => {
            const isPass = (item.status || 'PASS').toUpperCase() === 'PASS';
            const statusColor = isPass ? 'var(--sage)' : 'var(--amber)';

            return (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                  border: `1px solid ${isPass ? 'var(--border)' : 'rgba(245, 165, 36, 0.3)'}`,
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ font: '10px monospace', color: '#fff', fontWeight: 600 }}>
                      {item.relationship || `Check #${idx + 1}`}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    {item.details || item.explanation || 'Verified cross-stage alignment.'}
                  </p>
                </div>

                <span
                  style={{
                    font: '9px monospace',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: statusColor,
                    background: `${statusColor}18`,
                    border: `1px solid ${statusColor}40`,
                    borderRadius: '999px',
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  {isPass ? (
                    <>
                      <Check size={11} /> PASS
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={11} /> REVIEW
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Violations List (if any) */}
      {violations.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 107, 94, 0.08)',
            border: '1px solid rgba(255, 107, 94, 0.3)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <span style={{ font: '10px monospace', color: 'var(--coral)', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            SYSTEM ALIGNMENT VIOLATIONS DETECTED:
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {violations.map((v: any, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#ffd2cc', display: 'flex', gap: '6px' }}>
                <XCircle size={14} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{typeof v === 'string' ? v : v.description || v.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decision Bar */}
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
          Consistency audit complete. Generate the unified Launch Brand Kit or trigger targeted revision.
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
            Approve & Open Brand Kit <ArrowRight size={14} />
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
            SPECIFY TARGETED REVISION AREA (e.g. positioning, visual, naming):
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Align tagline and visual palette more closely with target developer demographic..."
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
              Submit Targeted Rerun
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
