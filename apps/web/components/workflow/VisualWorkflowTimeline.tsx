import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  Tag,
  Palette,
  Swords,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { StageStatusBadge, StageStatus } from '../ui/Badge';

export interface StageDefinition {
  id: string;
  number: string;
  name: string;
  agent: string;
  icon: React.ElementType;
}

export const WORKFLOW_STAGES: StageDefinition[] = [
  { id: 'discover', number: '01', name: 'Discover', agent: 'Discoverer', icon: Compass },
  { id: 'position', number: '02', name: 'Position', agent: 'Positioner', icon: Target },
  { id: 'persona', number: '03', name: 'Personality', agent: 'Brand Strategist', icon: Sparkles },
  { id: 'naming', number: '04', name: 'Naming', agent: 'Naming Agent', icon: Tag },
  { id: 'visualize', number: '05', name: 'Visualize', agent: 'Creative Director', icon: Palette },
  { id: 'critique', number: '06', name: 'Brand Battle', agent: 'Critic Agent', icon: Swords },
  { id: 'consistency', number: '07', name: 'Consistency', agent: 'Consistency Guardian', icon: ShieldCheck },
  { id: 'launch', number: '08', name: 'Launch Kit', agent: 'Launch Agent', icon: Rocket },
];

interface VisualWorkflowTimelineProps {
  currentStageId: string;
  stageStatuses: Record<string, StageStatus>;
  onSelectStage: (stageId: string) => void;
  revisionCount?: number;
}

export const VisualWorkflowTimeline: React.FC<VisualWorkflowTimelineProps> = ({
  currentStageId,
  stageStatuses,
  onSelectStage,
  revisionCount = 0,
}) => {
  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'running':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />;
      case 'needs-review':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'revision':
        return <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'pending':
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-slate-800/80 w-64 flex-shrink-0">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workflow Pipeline
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">8 Specialized AI Agents</p>
        </div>
        {revisionCount > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Rev #{revisionCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const status = stageStatuses[stage.id] || 'pending';
          const isActive = stage.id === currentStageId;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative">
              {/* Connector line between steps */}
              {idx < WORKFLOW_STAGES.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-2 ${
                    status === 'completed' ? 'bg-indigo-500/40' : 'bg-slate-800'
                  }`}
                />
              )}

              <button
                onClick={() => onSelectStage(stage.id)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 shadow-sm'
                    : 'hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">{stage.number}</span>
                      <span
                        className={`text-xs font-medium ${
                          isActive
                            ? 'text-white'
                            : status === 'completed'
                            ? 'text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[110px]">
                      {stage.agent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">{getStatusIcon(status)}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
