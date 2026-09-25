import React from 'react';
import { Tag, CheckCircle2, ShieldCheck, Globe, AlertCircle, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

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
      <div className="p-8 text-center text-slate-500">
        <Tag className="w-8 h-8 mx-auto mb-2 animate-spin text-cyan-400" />
        <p>Naming Agent is generating brand name candidates...</p>
      </div>
    );
  }

  const suggestions = namingData.suggestions || [];
  const territories = namingData.territories || [];
  const activeSelection = selectedName || suggestions[0]?.name;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Stage 04 — Naming Agent Studio
          </div>
          <h2 className="text-2xl font-bold text-white">Brand Name Candidates & Territories</h2>
          <p className="text-sm text-slate-400 mt-1">
            Carefully curated name suggestions grouped by territory with AI risk assessments.
          </p>
        </div>
      </div>

      {/* Territories Overview */}
      {territories.length > 0 && (
        <Card className="p-4 bg-slate-900/40">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Explored Naming Territories
          </h4>
          <div className="flex flex-wrap gap-2">
            {territories.map((t: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Name Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {suggestions.map((item: any, idx: number) => {
          const isSelected = item.name === activeSelection;

          return (
            <Card
              key={idx}
              selected={isSelected}
              hoverable
              className="p-6 flex flex-col justify-between cursor-pointer relative"
              onClick={() => onSelectName(item.name)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.territory || 'Territory'}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chosen Name
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-white tracking-wide mb-2">{item.name}</h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.rationale}</p>

                {/* AI Assessment Badges (Mandatory Labeling) */}
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Globe className="w-3 h-3 text-cyan-400" /> Domain Feasibility
                    </span>
                    <span className="font-mono text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      AI Assessment: {item.domain_assessment || item.domain_availability || 'Medium Risk'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-purple-400" /> Trademark Check
                    </span>
                    <span className="font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                      AI Assessment: {item.trademark_assessment || item.trademark_risk || 'Low Risk'}
                    </span>
                  </div>
                </div>

                {/* Strengths & Risks */}
                <div className="space-y-2 text-xs">
                  {item.strengths && item.strengths.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Key Strengths</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {item.strengths.map((s: string, sIdx: number) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.risks && item.risks.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Potential Risks</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                        {item.risks.map((r: string, rIdx: number) => (
                          <li key={rIdx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {isSelected ? '✓ Selected active name' : 'Click to select'}
                </span>
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectName(item.name);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Name'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          Domain and trademark checks are probabilistic AI assessments. Official legal registration search recommended prior to trademark filing.
        </span>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Chosen name "{activeSelection}" will be passed to Creative Director for Visual Identity generation.
        </p>

        <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
          <CheckCircle2 className="w-4 h-4" />
          Confirm Selected Name & Continue
        </Button>
      </div>
    </div>
  );
};
