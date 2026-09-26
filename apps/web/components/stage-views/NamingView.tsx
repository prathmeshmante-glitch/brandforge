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
  if (!namingData) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--subtle)' }}>
        <Tag size={28} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--indigo)' }} />
        <p style={{ font: '11px monospace' }}>NAMING ENGINE GENERATING CANDIDATES...</p>
      </div>
    );
  }

  // Canonical Schema Normalization
  // Backend returns territories: List[{type, description, names: List[{name, rationale, strengths, risks}]}]
  const rawTerritories = Array.isArray(namingData.territories) ? namingData.territories : [];
  
  // Flatten names across all territories while preserving territory context
  const flattenedNames: any[] = [];
  rawTerritories.forEach((t: any) => {
    const territoryType = typeof t === 'string' ? t : t.type || t.name || 'Core';
    const names = Array.isArray(t.names) ? t.names : [];
    names.forEach((n: any) => {
      if (typeof n === 'string') {
        flattenedNames.push({ name: n, territory: territoryType, rationale: '', strengths: [], risks: [] });
      } else if (n && typeof n === 'object') {
        flattenedNames.push({
          ...n,
          territory: territoryType,
          strengths: Array.isArray(n.strengths) ? n.strengths : [],
          risks: Array.isArray(n.risks) ? n.risks : [],
        });
      }
    });
  });

  // Fallback if suggestions array was provided directly
  const rawSuggestions = Array.isArray(namingData.suggestions) ? namingData.suggestions : [];
  const candidateNames = flattenedNames.length > 0 ? flattenedNames : rawSuggestions;

  const activeSelection = selectedName || candidateNames[0]?.name || 'BrandForge';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Territory Heading */}
      <div className="territory-heading">
        <div>
          <span className="section-index">TERRITORIES / {rawTerritories.length ? `0${rawTerritories.length}` : '03'}</span>
          <h2>Names that earn their place.</h2>
        </div>
        <p>
          Generated from positioning & personality.<br />
          Select a direction to ground the visual system.
        </p>
      </div>

      {/* Explored Territories Badges */}
      {rawTerritories.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {rawTerritories.map((t: any, idx: number) => {
            const label = typeof t === 'string' ? t : t.type || t.name || `Territory 0${idx + 1}`;
            const desc = typeof t === 'object' ? t.description : '';

            return (
              <span
                key={idx}
                title={desc}
                style={{
                  font: '9px monospace',
                  color: '#ab9cff',
                  background: 'rgba(124, 92, 255, 0.1)',
                  border: '1px solid rgba(124, 92, 255, 0.25)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  letterSpacing: '0.08em',
                }}
              >
                {label.toUpperCase()}
              </span>
            );
          })}
        </div>
      )}

      {/* 3-Column Neo-Editorial Name Grid */}
      <div className="name-grid">
        {candidateNames.map((item: any, i: number) => {
          const itemName = typeof item === 'string' ? item : item.name || `Candidate 0${i + 1}`;
          const isSelected = itemName === activeSelection;
          const territory = item.territory || 'Brand Territory';
          const rationale = item.rationale || 'Engineered for clear category positioning and cognitive recall.';
          const strengths = Array.isArray(item.strengths) ? item.strengths : ['Distinctive', 'Direct'];
          const risks = Array.isArray(item.risks) ? item.risks : ['None identified'];

          return (
            <article
              key={itemName + i}
              className={`name-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectName(itemName)}
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

              <h2>{itemName}</h2>
              <span className="territory-label">{territory}</span>
              <p>{rationale}</p>

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
                  <b>{strengths.join(' / ')}</b>
                </div>
                <div>
                  <span>WATCH FOR</span>
                  <b>{risks.join(' / ')}</b>
                </div>
              </div>

              <button className="select-button" type="button">
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
