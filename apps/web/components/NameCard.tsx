import React from 'react';
import { Tag, Sparkles, AlertTriangle } from 'lucide-react';
import { NamingTerritory, NameOption } from '@packages/types/brand';

interface NameCardProps {
  territories: NamingTerritory[];
  onSelectName?: (name: NameOption) => void;
  selectedName?: string;
}

export const NameCard: React.FC<NameCardProps> = ({
  territories,
  onSelectName,
  selectedName,
}) => {
  return (
    <div className="space-y-6">
      {territories.map((territory, tIdx) => (
        <div key={tIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="w-4 h-4 text-purple-400" />
            <h4 className="text-base font-bold text-white tracking-wide">{territory.type}</h4>
          </div>
          <p className="text-xs text-slate-400 mb-4 font-sans">{territory.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {territory.names.map((nameOpt, nIdx) => (
              <div
                key={nIdx}
                onClick={() => onSelectName && onSelectName(nameOpt)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedName === nameOpt.name
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-black text-white">{nameOpt.name}</span>
                  {selectedName === nameOpt.name && (
                    <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{nameOpt.rationale}</p>
                <div className="space-y-1">
                  <div className="flex items-start space-x-1.5 text-xs text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5" />
                    <span>{nameOpt.strengths.join(', ')}</span>
                  </div>
                  {nameOpt.risks && nameOpt.risks.length > 0 && (
                    <div className="flex items-start space-x-1.5 text-xs text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
                      <span>{nameOpt.risks.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
