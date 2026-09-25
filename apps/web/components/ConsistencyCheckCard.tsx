import React from 'react';
import { Activity, CheckCircle2, AlertOctagon } from 'lucide-react';
import { ConsistencyGuardianOutput } from '@packages/types/brand';

interface ConsistencyCheckCardProps {
  consistency: ConsistencyGuardianOutput;
}

export const ConsistencyCheckCard: React.FC<ConsistencyCheckCardProps> = ({
  consistency,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-red-400 border-red-500/40 bg-red-500/10';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              CONSISTENCY GUARDIAN
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">Brand System Alignment</h3>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border font-mono font-black text-2xl ${getScoreColor(consistency.overall_consistency)}`}>
          {consistency.overall_consistency} <span className="text-xs font-normal text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Cross-Artifact Relationship Checks
        </h4>
        {consistency.checks.map((check, idx) => (
          <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
            {check.status === 'pass' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertOctagon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            )}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">{check.area}</span>
              <p className="text-xs text-slate-400 leading-relaxed">{check.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {consistency.required_revisions && consistency.required_revisions.length > 0 && (
        <div className="border-t border-slate-800 pt-4">
          <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2">
            Targeted Revision Triggers ({consistency.required_revisions.length})
          </h4>
          <div className="space-y-2">
            {consistency.required_revisions.map((rev, idx) => (
              <div key={idx} className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-red-300 uppercase">
                  <span>Target: {rev.target}</span>
                  <span className="text-red-400">{rev.priority} Priority</span>
                </div>
                <p className="text-slate-300">{rev.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
