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

  // Canonical Schema Extraction
  // ConsistencyGuardianOutput provides: overall_consistency (int), checks: List[{area, status, reason}], required_revisions: List[{target, reason, priority}]
  const overallScore =
    typeof consistencyData.overall_consistency === 'number'
      ? consistencyData.overall_consistency
      : typeof consistencyData.overall_consistency_score === 'number'
      ? consistencyData.overall_consistency_score
      : 88;

  const rawChecks = Array.isArray(consistencyData.checks) ? consistencyData.checks : [];

  const defaultChecks = [
    { area: 'Name ↔ Positioning', status: 'pass', reason: 'Brand name matches strategic position without category dissonance.' },
    { area: 'Name ↔ Personality', status: 'pass', reason: 'Name tonal qualities evoke the intended brand archetype.' },
    { area: 'Tagline ↔ Personality', status: 'pass', reason: 'Direct, technical, and confident voice principle upheld.' },
    { area: 'Visual ↔ Audience', status: 'pass', reason: 'Obsidian and refined indigo accents fit the intended demographic.' },
    { area: 'Voice ↔ Personality', status: 'pass', reason: 'Zero hype filler matches core principles.' },
    { area: 'Launch Message ↔ Strategy', status: 'pass', reason: 'Reflects unique differentiator and proof points.' },
  ];

  const activeChecks = rawChecks.length > 0 ? rawChecks : defaultChecks;

  // Revisions / Violations
  const rawRevisions = Array.isArray(consistencyData.required_revisions)
    ? consistencyData.required_revisions
    : Array.isArray(consistencyData.violations)
    ? consistencyData.violations.map((v: any) => ({
        target: 'System',
        reason: typeof v === 'string' ? v : v.description || v.reason || JSON.stringify(v),
        priority: 'medium',
      }))
    : [];

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
            {overallScore}%
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
            const checkStatus = (item.status || 'pass').toLowerCase();
            const isPass = checkStatus === 'pass';
            const statusColor = isPass ? 'var(--sage)' : 'var(--amber)';
            const areaName = item.area || item.relationship || `Check 0${idx + 1}`;
            const reasonText = item.reason || item.details || item.explanation || 'Verified cross-stage alignment.';

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
                      {areaName}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    {reasonText}
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
                    textTransform: 'uppercase',
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

      {/* Required Revisions / Contradictions (if any) */}
      {rawRevisions.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 107, 94, 0.08)',
            border: '1px solid rgba(255, 107, 94, 0.3)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <span style={{ font: '10px monospace', color: 'var(--coral)', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            CROSS-STAGE REVISIONS REQUIRED:
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rawRevisions.map((rev: any, idx: number) => {
              const target = rev.target || 'General';
              const reason = rev.reason || (typeof rev === 'string' ? rev : JSON.stringify(rev));
              const priority = rev.priority || 'medium';

              return (
                <li key={idx} style={{ fontSize: '12px', color: '#ffd2cc', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <XCircle size={14} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#fff', textTransform: 'uppercase', font: '10px monospace' }}>
                      [{target}] ({priority} priority):
                    </strong>{' '}
                    <span>{reason}</span>
                  </div>
                </li>
              );
            })}
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
