import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Swords } from 'lucide-react';
import { CriticOutput } from '@packages/types/brand';

interface CritiqueCardProps {
  critique: CriticOutput;
}

export const CritiqueCard: React.FC<CritiqueCardProps> = ({ critique }) => {
  return (
    <div className="bg-slate-900 border border-red-950/60 rounded-xl p-6 mb-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">
          <Swords className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
            BRAND BATTLE / AI CRITIC
          </span>
          <h3 className="text-xl font-bold text-white tracking-wide">Rigor & Genericity Challenge</h3>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
          Detected Concerns ({critique.issues.length})
        </h4>

        {critique.issues.map((issue, idx) => (
          <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-300">
                Area: {issue.area} (Target: {issue.target})
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  issue.severity === 'high'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}
              >
                {issue.severity} Severity
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">{issue.problem}</p>
            <p className="text-xs text-slate-400 leading-relaxed"><span className="text-slate-500">Evidence:</span> {issue.evidence}</p>
            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-xs text-emerald-400">
              <span className="font-bold">Suggestion:</span> {issue.suggestion}
            </div>
          </div>
        ))}
      </div>

      {critique.genericity_checks && critique.genericity_checks.length > 0 && (
        <div className="border-t border-slate-800 pt-4">
          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
            Genericity & Cliché Evaluation
          </h4>
          <ul className="space-y-1 text-xs text-slate-400">
            {critique.genericity_checks.map((note, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
