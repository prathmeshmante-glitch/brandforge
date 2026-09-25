'use client';

import React, { useState } from 'react';
import { Compass, ArrowRight, RefreshCw, Target, Users, AlertCircle, HelpCircle } from 'lucide-react';

interface DiscoveryViewProps {
  discoveryData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  discoveryData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!discoveryData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Compass size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>DISCOVERER AGENT PARSING BRAND CONCEPT...</p>
      </div>
    );
  }

  const {
    core_problem,
    target_audience,
    user_context,
    goals = [],
    assumptions = [],
    open_questions = [],
  } = discoveryData;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="territory-heading">
        <div>
          <span className="section-index">STAGE 01 / FOUNDATIONS</span>
          <h2>Understanding the real problem.</h2>
        </div>
        <p>
          Your napkin concept parsed into audience realities,<br />
          core tensions, and foundational goals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {/* Core Problem */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)', marginBottom: '12px' }}>
            <Target size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              CORE PROBLEM STATEMENT
            </span>
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: 1.5, color: '#f5f5f7', margin: 0 }}>
            {core_problem}
          </p>
        </div>

        {/* Target Audience */}
        <div
          style={{
            background: 'linear-gradient(145deg, #15161cdd, #101116cc)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', marginBottom: '12px' }}>
            <Users size={16} />
            <span style={{ font: '10px monospace', letterSpacing: '0.12em', fontWeight: 700 }}>
              PRIMARY TARGET AUDIENCE
            </span>
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: 1.5, color: '#f5f5f7', margin: 0 }}>
            {target_audience}
          </p>
        </div>
      </div>

      {/* User Context & Strategic Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
            USER CONTEXT & ENVIRONMENT
          </span>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            {user_context}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
          }}
        >
          <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
            STRATEGIC BRAND GOALS
          </span>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {goals.map((g: string, idx: number) => (
              <li key={idx} style={{ fontSize: '12px', color: '#d8d8df', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--indigo)' }}>•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Assumptions & Open Questions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '10px' }}>
            MARKET ASSUMPTIONS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assumptions.map((item: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', color: 'var(--muted)' }}>
                <AlertCircle size={13} color="var(--subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px',
          }}
        >
          <span style={{ font: '9px monospace', color: 'var(--subtle)', letterSpacing: '0.12em', display: 'block', marginBottom: '10px' }}>
            OPEN QUESTIONS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {open_questions.map((item: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', color: 'var(--muted)' }}>
                <HelpCircle size={13} color="var(--indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Controls */}
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
          Accept foundations to proceed to Positioning, or request a targeted rerun.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="button button-outline"
            onClick={() => setShowRevisionInput(!showRevisionInput)}
            disabled={isLoading}
          >
            <RefreshCw size={14} color="#b4a5ff" /> Request revision
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={onAccept}
            disabled={isLoading}
          >
            Accept & Continue <ArrowRight size={14} />
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
            PROVIDE FEEDBACK FOR DISCOVERER AGENT:
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Focus more on B2B engineering platforms rather than general consumers..."
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
              Submit Revision Rerun
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
