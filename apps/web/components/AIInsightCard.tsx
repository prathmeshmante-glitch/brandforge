import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  foundText: string;
  whyText: string;
  passedNextText: string;
  dataJson?: any;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  foundText,
  whyText,
  passedNextText,
  dataJson,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 mb-6 transition-all hover:border-slate-700 shadow-lg">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-bold text-slate-200">{title}</h4>
        </div>
        <button className="text-slate-400 hover:text-white p-1 rounded-md">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-slate-800/80 pt-4">
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              WHAT THE AI FOUND
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{foundText}</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1">
              WHY
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{whyText}</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/60">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
              <span>WHAT WAS PASSED TO THE NEXT AGENT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{passedNextText}</p>
          </div>

          {dataJson && (
            <details className="mt-2 text-xs font-mono text-slate-500">
              <summary className="cursor-pointer hover:text-slate-300">View Raw Structured Output JSON</summary>
              <pre className="mt-2 p-3 bg-slate-950 rounded border border-slate-800 text-slate-400 overflow-x-auto">
                {JSON.stringify(dataJson, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
