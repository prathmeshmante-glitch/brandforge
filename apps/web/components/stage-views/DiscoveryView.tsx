'use client';

import React, { useState } from 'react';
import { Compass, ArrowRight, RefreshCw, Target, Users, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

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

  // Canonical Schema Normalization
  const problemStatement =
    discoveryData.problem ||
    discoveryData.core_problem ||
    'Core problem being analyzed from initial founder input.';

  // Target users could be a list of UserSegment objects {segment, needs, pain_points} or strings
  const rawTargetUsers = Array.isArray(discoveryData.target_users)
    ? discoveryData.target_users
    : Array.isArray(discoveryData.target_audience)
    ? discoveryData.target_audience
    : typeof discoveryData.target_audience === 'string'
    ? [{ segment: discoveryData.target_audience, needs: [], pain_points: [] }]
    : [];

  const marketContext =
    discoveryData.context ||
    discoveryData.user_context ||
    'Market and vertical environment derived from discovery input.';

  const goals = Array.isArray(discoveryData.goals) ? discoveryData.goals : [];
  const assumptions = Array.isArray(discoveryData.assumptions) ? discoveryData.assumptions : [];
  const openQuestions = Array.isArray(discoveryData.open_questions) ? discoveryData.open_questions : [];

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
            {problemStatement}
          </p>
        </div>

        {/* Target Audience Segments */}
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
              PRIMARY AUDIENCE SEGMENTS
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rawTargetUsers.length > 0 ? (
              rawTargetUsers.map((user: any, idx: number) => {
                const segName = typeof user === 'string' ? user : user.segment || `Segment ${idx + 1}`;
                const needs = Array.isArray(user.needs) ? user.needs : [];
                const painPoints = Array.isArray(user.pain_points) ? user.pain_points : [];

                return (
                  <div key={idx} style={{ borderBottom: idx < rawTargetUsers.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '8px' }}>
                    <b style={{ color: '#fff', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      {segName}
                    </b>
                    {needs.length > 0 && (
                      <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '2px 0' }}>
                        <span style={{ color: 'var(--sage)' }}>Needs:</span> {needs.join(', ')}
                      </p>
                    )}
                    {painPoints.length > 0 && (
                      <p style={{ fontSize: '11px', color: 'var(--subtle)', margin: '2px 0' }}>
                        <span style={{ color: 'var(--coral)' }}>Pains:</span> {painPoints.join(', ')}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#f5f5f7', margin: 0 }}>
                Target audience identified in initial brief.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Market Context & Goals */}
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
            MARKET CONTEXT & ENVIRONMENT
          </span>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            {marketContext}
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
            {goals.length > 0 ? (
              goals.map((g: any, idx: number) => (
                <li key={idx} style={{ fontSize: '12px', color: '#d8d8df', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--indigo)' }}>•</span>
                  <span>{typeof g === 'string' ? g : JSON.stringify(g)}</span>
                </li>
              ))
            ) : (
              <li style={{ fontSize: '12px', color: 'var(--muted)' }}>No explicit goals recorded.</li>
            )}
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
            FOUNDATIONAL ASSUMPTIONS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assumptions.length > 0 ? (
              assumptions.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', color: 'var(--muted)' }}>
                  <AlertCircle size={13} color="var(--subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Assumptions pending validation.</span>
            )}
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
            OPEN STRATEGIC QUESTIONS
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {openQuestions.length > 0 ? (
              openQuestions.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '11px', color: 'var(--muted)' }}>
                  <HelpCircle size={13} color="var(--indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>None recorded.</span>
            )}
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
