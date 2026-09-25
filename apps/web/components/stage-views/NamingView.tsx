'use client';

import React from 'react';
import { Tag, Check, ArrowRight, Globe, ShieldCheck, Info } from 'lucide-react';

interface NamingViewProps {
  namingData: any;
  selectedName?: string;
  onSelectName: (name: string) => void;
  onAccept: () => void;
  isLoading?: boolean;
}

export const NamingView: React.FC<NamingViewProps> = ({
  namingData,
  selectedName,
  onSelectName,
  onAccept,
  isLoading = false,
}) => {
  if (!namingData || !namingData.suggestions) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Tag size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>NAMING ENGINE GENERATING CANDIDATES...</p>
      </div>
    );
  }

  const suggestions = namingData.suggestions || [];
  const territories = namingData.territories || [];
  const activeSelection = selectedName || suggestions[0]?.name;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Territory Heading */}
      <div className="territory-heading">
        <div>
          <span className="section-index">TERRITORIES / {territories.length || '03'}</span>
          <h2>Names that earn their place.</h2>
        </div>
        <p>
          Generated from positioning & personality.<br />
          Select a direction to ground the visual system.
        </p>
      </div>

      {/* Explored Territories Badges */}
      {territories.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {territories.map((t: string, idx: number) => (
            <span
              key={idx}
              style={{
                font: '9px monospace',
                color: '#ab9cff',
                background: 'rgba(124, 92, 255, 0.1)',
                border: '1px solid rgba(124, 92, 255, 0.25)',
                borderRadius: '999px',
                padding: '4px 10px',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* 3-Column Neo-Editorial Name Grid */}
      <div className="name-grid">
        {suggestions.map((item: any, i: number) => {
          const isSelected = item.name === activeSelection;

          return (
            <article
              key={item.name || i}
              className={`name-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectName(item.name)}
            >
              <div className="name-card-top">
                <span className="name-number">0{i + 1}</span>
                {isSelected && (
                  <span className="selected-badge">
                    <Check size={11} /> SELECTED
                  </span>
                )}
                <span className="more">···</span>
              </div>

              <h2>{item.name}</h2>
              <span className="territory-label">{item.territory || 'Brand Territory'}</span>
              <p>{item.rationale}</p>

              {/* Assessment Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0', padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={11} color="var(--indigo)" /> Domain Feasibility
                  </span>
                  <b style={{ font: '9px monospace', color: '#c3b5ff' }}>
                    {item.domain_assessment || item.domain_availability || 'Medium Risk'}
                  </b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--subtle)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={11} color="var(--sage)" /> Trademark Risk
                  </span>
                  <b style={{ font: '9px monospace', color: 'var(--sage)' }}>
                    {item.trademark_assessment || item.trademark_risk || 'Low Risk'}
                  </b>
                </div>
              </div>

              <div className="name-details">
                <div>
                  <span>STRENGTHS</span>
                  <b>{Array.isArray(item.strengths) ? item.strengths.join(' / ') : item.strengths || 'Distinctive, memorable'}</b>
                </div>
                <div>
                  <span>WATCH FOR</span>
                  <b>{Array.isArray(item.risks) ? item.risks.join(' / ') : item.risks || item.risk || 'None identified'}</b>
                </div>
              </div>

              <button className="select-button">
                {isSelected ? 'Selected' : 'Select direction'} <ArrowRight size={13} />
              </button>
            </article>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          fontSize: '11px',
          color: 'var(--subtle)',
        }}
      >
        <Info size={14} color="var(--indigo)" style={{ flexShrink: 0 }} />
        <span>
          AI trademark & domain indicators are preliminary heuristic evaluations. Legal trademark registration search is advised prior to formal filings.
        </span>
      </div>

      {/* Confirmation Bar */}
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
          Selected brand name: <strong style={{ color: '#fff', letterSpacing: '0.04em' }}>{activeSelection}</strong> will ground the visual identity.
        </div>
        <button onClick={onAccept} disabled={isLoading} className="button button-primary">
          Confirm Name & Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
