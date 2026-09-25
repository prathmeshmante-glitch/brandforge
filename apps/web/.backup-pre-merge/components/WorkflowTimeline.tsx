import React from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';

export interface StageInfo {
  id: string;
  num: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface WorkflowTimelineProps {
  stages: StageInfo[];
  currentStageId: string;
  onSelectStage?: (stageId: string) => void;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  stages,
  currentStageId,
  onSelectStage,
}) => {
  const getStage = (id: string): StageInfo => {
    return stages.find((s) => s.id === id) || {
      id,
      num: '00',
      name: id,
      status: 'pending',
    };
  };

  const renderBadge = (status: 'completed' | 'active' | 'pending') => {
    if (status === 'completed') {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
          <Check className="w-3.5 h-3.5" />
        </span>
      );
    }
    if (status === 'active') {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/50 text-xs font-bold animate-pulse">
          ◉
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-xs">
        ○
      </span>
    );
  };

  const stage1 = getStage('discovery');
  const stage2 = getStage('positioning');
  const stage3 = getStage('personality');
  const stage4 = getStage('naming');
  const stage5 = getStage('visual');
  const stage6 = getStage('critique');
  const stage7 = getStage('consistency');
  const stage8 = getStage('launch');

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-6 mb-8 shadow-2xl backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 uppercase">
          BRAND FORGE
        </h2>
        <p className="text-xs tracking-widest text-slate-400 uppercase font-mono mt-1">
          From rough idea to launch-ready brand.
        </p>
      </div>

      {/* Row 1: 01 Discover -- 02 Position -- 03 Personality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative">
        {[stage1, stage2, stage3].map((s, idx) => (
          <div
            key={s.id}
            onClick={() => onSelectStage && onSelectStage(s.id)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${
              s.id === currentStageId
                ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-200">
              <span className="text-blue-400">{s.num}</span>
              <span>{s.name}</span>
            </div>
            <div className="mt-2">{renderBadge(s.status)}</div>
          </div>
        ))}
      </div>

      {/* Row 2: 04 Naming -- 05 Visualize -- 06 Battle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { ...stage4, name: 'Naming' },
          { ...stage5, name: 'Visualize' },
          { ...stage6, name: 'Battle' },
        ].map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectStage && onSelectStage(s.id)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${
              s.id === currentStageId
                ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-200">
              <span className="text-purple-400">{s.num}</span>
              <span>{s.name}</span>
            </div>
            <div className="mt-2">{renderBadge(s.status)}</div>
          </div>
        ))}
      </div>

      {/* Row 3: 07 Consistency ─────────────── 08 Launch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { ...stage7, name: 'Consistency' },
          { ...stage8, name: 'Launch' },
        ].map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectStage && onSelectStage(s.id)}
            className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer ${
              s.id === currentStageId
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-200">
              <span className="text-emerald-400">{s.num}</span>
              <span>{s.name}</span>
            </div>
            <div className="mt-2">{renderBadge(s.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
