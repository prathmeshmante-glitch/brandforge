'use client';

import React, { useState } from 'react';
import { Swords, Check, ArrowRight, ShieldAlert, RefreshCw, XCircle, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

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
        <Swords size={32} className={isLoading ? 'animate-spin' : ''} style={{ margin: '0 auto 12px', color: 'var(--coral)' }} />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', margin: '0 0 8px', color: '#fff' }}>
          {isLoading ? 'Adversarial Critic Testing...' : 'Adversarial Critique Pending'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
          {isLoading
            ? 'Stress-testing brand against market clichés, positioning contradictions, and audience mismatches...'
            : 'Run the 8-Agent Pipeline to challenge assumptions before the market does.'}
        </p>
      </div>
    );
  }

  // Canonical Schema Extraction
  // CriticOutput provides: issues[], genericity_checks[], audience_mismatch[], contradictions[], revised_options[]
  const rawIssues = Array.isArray(critiqueData.issues)
    ? critiqueData.issues
    : Array.isArray(critiqueData.critique_items)
    ? critiqueData.critique_items
    : [];

  const genericityChecks = Array.isArray(critiqueData.genericity_checks)
    ? critiqueData.genericity_checks
    : [];

  const audienceMismatches = Array.isArray(critiqueData.audience_mismatch)
    ? critiqueData.audience_mismatch
    : [];

  const contradictions = Array.isArray(critiqueData.contradictions)
    ? critiqueData.contradictions
    : [];

  const revisedOptions = Array.isArray(critiqueData.revised_options)
    ? critiqueData.revised_options
    : Array.isArray(critiqueData.recommended_revisions)
    ? critiqueData.recommended_revisions.map((r: any) => ({
        area: 'Strategy',
        suggestion: typeof r === 'string' ? r : r.suggestion || JSON.stringify(r),
      }))
    : [];

  // Severity tallies
  const highSeverityCount = rawIssues.filter((i: any) => (i.severity || '').toLowerCase() === 'high').length;
  const medSeverityCount = rawIssues.filter((i: any) => (i.severity || '').toLowerCase() === 'medium').length;

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

          <div style={{ textAlign: 'right' }}>
            <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block' }}>
              CRITIC VERDICT
            </span>
            <span style={{ font: '11px monospace', color: highSeverityCount > 0 ? '#ff8a7a' : '#c7f1d8', fontWeight: 600 }}>
              {highSeverityCount > 0 ? `${highSeverityCount} High-Risk Flags` : 'System Battle Tested'}
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, marginTop: '16px', maxWidth: '720px' }}>
          The adversarial AI critic deliberately attacks positioning genericity, surface-level buzzwords, and audience friction before you meet the real market.
        </p>
      </div>

      {/* Adversarial Scorecards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Issues', val: rawIssues.length.toString(), color: rawIssues.length > 3 ? 'var(--coral)' : 'var(--amber)' },
          { label: 'High Severity', val: highSeverityCount.toString(), color: highSeverityCount > 0 ? 'var(--coral)' : 'var(--sage)' },
          { label: 'Medium Severity', val: medSeverityCount.toString(), color: 'var(--amber)' },
          { label: 'Genericity Checks', val: genericityChecks.length.toString(), color: 'var(--indigo)' },
          { label: 'Contradictions', val: contradictions.length.toString(), color: contradictions.length > 0 ? 'var(--coral)' : 'var(--sage)' },
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
            <b style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: stat.color, fontWeight: 500 }}>
              {stat.val}
            </b>
          </div>
        ))}
      </div>

      {/* Market Challenges & Critique Issues Grid */}
      {rawIssues.length > 0 && (
        <div>
          <div className="section-index" style={{ marginBottom: '12px' }}>
            CRITIQUE ISSUES / {rawIssues.length} ADVERSARIAL CHALLENGES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
            {rawIssues.map((item: any, idx: number) => {
              const sev = (item.severity || 'Medium').toLowerCase();
              const sevColor = sev === 'high' || sev === 'critical' ? 'var(--coral)' : sev === 'medium' ? 'var(--amber)' : 'var(--sage)';
              const target = item.target || item.area || 'General';
              const problem = item.problem || item.finding || item.issue || 'Strategic tension noted.';
              const evidence = item.evidence || item.explanation || '';
              const suggestion = item.suggestion || item.recommendation || '';

              return (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
                    border: `1px solid ${sev === 'high' ? 'rgba(255, 107, 94, 0.35)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ font: '10px monospace', color: '#b4a5ff', fontWeight: 600, letterSpacing: '0.08em' }}>
                        TARGET: {target.toUpperCase()}
                      </span>
                      <span
                        style={{
                          font: '9px monospace',
                          color: sevColor,
                          background: `${sevColor}1a`,
                          border: `1px solid ${sevColor}40`,
                          borderRadius: '999px',
                          padding: '2px 8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {sev} severity
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5, margin: '8px 0', fontWeight: 500 }}>
                      {problem}
                    </p>

                    {evidence && (
                      <p style={{ fontSize: '11px', color: 'var(--muted)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', margin: '8px 0' }}>
                        <span style={{ color: 'var(--subtle)' }}>Evidence:</span> {evidence}
                      </p>
                    )}

                    {suggestion && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '10px', fontSize: '12px', color: '#c7f1d8' }}>
                        <Lightbulb size={14} color="var(--sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Genericity, Contradictions & Revised Options Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
        {/* Genericity Checks */}
        <div
          style={{
            background: 'radial-gradient(ellipse at 90% 10%, rgba(245, 165, 36, 0.08), transparent 50%), #121319',
            border: '1px solid rgba(245, 165, 36, 0.25)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '12px' }}>
            <Zap size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              GENERICITY & DIFFERENTIATION FLAGS
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {genericityChecks.length > 0 ? (
              genericityChecks.map((item: any, idx: number) => (
                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#ffebc4' }}>
                  <span style={{ color: 'var(--amber)', fontWeight: 700 }}>•</span>
                  <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                </li>
              ))
            ) : (
              <li style={{ fontSize: '12px', color: 'var(--muted)' }}>No critical genericity traps flagged.</li>
            )}
          </ul>
        </div>

        {/* Revised Options */}
        <div
          style={{
            background: 'radial-gradient(ellipse at 90% 10%, rgba(124, 92, 255, 0.08), transparent 50%), #121319',
            border: '1px solid rgba(124, 92, 255, 0.25)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b4a5ff', marginBottom: '12px' }}>
            <Lightbulb size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              RECOMMENDED REVISIONS
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {revisedOptions.length > 0 ? (
              revisedOptions.map((opt: any, idx: number) => {
                const area = opt.area || 'Strategy';
                const sugg = opt.suggestion || (typeof opt === 'string' ? opt : JSON.stringify(opt));

                return (
                  <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', color: '#d8d2df' }}>
                    <span style={{ color: 'var(--indigo)', fontWeight: 700 }}>•</span>
                    <div>
                      <strong style={{ color: '#fff' }}>[{area}]:</strong> {sugg}
                    </div>
                  </li>
                );
              })
            ) : (
              <li style={{ fontSize: '12px', color: 'var(--muted)' }}>Ready for Consistency Guardian evaluation.</li>
            )}
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
