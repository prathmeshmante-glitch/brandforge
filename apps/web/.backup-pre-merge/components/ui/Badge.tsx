import React from 'react';

export type StageStatus = 'pending' | 'running' | 'completed' | 'needs-review' | 'revision' | 'failed';

interface BadgeProps {
  status: StageStatus | string;
  label?: string;
  className?: string;
}

export const StageStatusBadge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'running':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse';
      case 'needs-review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'revision':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'failed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'pending':
      default:
        return 'bg-slate-800/50 text-slate-400 border-slate-700/50';
    }
  };

  const displayLabel = label || status.replace('-', ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'completed'
            ? 'bg-emerald-400'
            : status === 'running'
            ? 'bg-indigo-400 animate-ping'
            : status === 'needs-review'
            ? 'bg-amber-400'
            : status === 'revision'
            ? 'bg-purple-400'
            : status === 'failed'
            ? 'bg-rose-400'
            : 'bg-slate-500'
        }`}
      />
      {displayLabel}
    </span>
  );
};
