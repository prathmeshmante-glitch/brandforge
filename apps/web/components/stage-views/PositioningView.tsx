'use client';

import React from 'react';
import { Target, Check, ArrowRight } from 'lucide-react';

interface PositioningViewProps {
  positioningData: any;
  selectedDirection?: string;
  onSelectDirection: (directionName: string) => void;
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
  if (!positioningData || !positioningData.directions) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Target size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>POSITIONER AGENT EVALUATING STRATEGIC ANGLES...</p>
      </div>
    );
  }

  const directions = positioningData.directions || [];
  const activeSelection = selectedDirection || directions[0]?.name;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div className="territory-heading">
        <div>
          <span className="section-index">STAGE 02 / STRATEGY</span>
          <h2>Finding your sharpest angle.</h2>
        </div>
        <p>
          Select the strategic stance that creates<br />
          uncompromising differentiation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {directions.map((dir: any, idx: number) => {
          const isSelected = dir.name === activeSelection;

          return (
            <article
              key={idx}
              className={`name-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDirection(dir.name)}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div className="name-card-top">
                  <span className="name-number">0{idx + 1}</span>
                  {isSelected && (
                    <span className="selected-badge">
                      <Check size={11} /> SELECTED
                    </span>
                  )}
                  <span className="more">···</span>
                </div>

                <h2 style={{ fontSize: '26px', margin: '20px 0 8px' }}>{dir.name}</h2>

                <div
                  style={{
                    background: 'rgba(124, 92, 255, 0.08)',
                    border: '1px solid rgba(124, 92, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    margin: '12px 0 16px',
                  }}
                >
                  <span style={{ font: '8px monospace', color: '#ab9cff', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
                    POSITIONING STATEMENT
                  </span>
                  <p style={{ font: '12px/1.5 Georgia, serif', color: '#e2dcff', margin: 0, fontStyle: 'italic' }}>
                    "{dir.positioning_statement}"
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px', color: 'var(--muted)', margin: '14px 0' }}>
                  <div>
                    <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block' }}>
                      VALUE PROPOSITION
                    </span>
                    <b style={{ color: '#d8d8df', fontWeight: 500, fontSize: '11px' }}>{dir.value_proposition}</b>
                  </div>

                  <div>
                    <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block' }}>
                      DIFFERENTIATOR
                    </span>
                    <b style={{ color: 'var(--indigo)', fontWeight: 500, fontSize: '11px' }}>{dir.differentiator}</b>
                  </div>

                  {dir.proof_points && (
                    <div>
                      <span style={{ font: '8px monospace', color: 'var(--subtle)', letterSpacing: '0.1em', display: 'block' }}>
                        PROOF POINTS
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--subtle)' }}>
                        {Array.isArray(dir.proof_points) ? dir.proof_points.join(' • ') : dir.proof_points}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: '9px monospace', color: 'var(--subtle)' }}>
                  {isSelected ? 'Active direction' : 'Click to select'}
                </span>
                <button className="select-button" type="button">
                  {isSelected ? 'Selected' : 'Select direction'} <ArrowRight size={13} />
                </button>
              </div>
            </article>
          );
        })}
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
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
          Selected positioning: <strong style={{ color: '#fff' }}>{activeSelection}</strong>
        </div>
        <button onClick={onAccept} disabled={isLoading} className="button button-primary">
          Confirm Direction & Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
