import React from 'react';
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';

interface RevisionBannerProps {
  targetStage: string;
  reason: string;
  isExecuting?: boolean;
}

export const RevisionBanner: React.FC<RevisionBannerProps> = ({
  targetStage,
  reason,
  isExecuting = false,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 rounded-xl p-4 mb-6 shadow-lg shadow-purple-500/10">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-purple-200 tracking-wide">REVISION REQUIRED</h4>
            {isExecuting && (
              <span className="flex items-center gap-1.5 text-xs text-purple-400 font-medium animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                AI Rerun in progress...
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-slate-300 space-y-1">
            <p>
              <span className="text-slate-400 font-medium">Affected Target Stage: </span>
              <span className="font-semibold text-purple-300 capitalize">{targetStage}</span>
            </p>
            <p className="text-slate-400 italic">"{reason}"</p>
          </div>

          <div className="mt-3 pt-3 border-t border-purple-500/20 flex items-center gap-2 text-[11px] text-purple-300">
            <span>Dependency Chain Rerun:</span>
            <span className="font-mono bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
              {targetStage} <ArrowRight className="w-3 h-3 inline" /> visualize <ArrowRight className="w-3 h-3 inline" /> battle <ArrowRight className="w-3 h-3 inline" /> consistency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
