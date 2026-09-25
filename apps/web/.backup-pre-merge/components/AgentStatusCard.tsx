import React from 'react';
import { Cpu, ShieldCheck, Sparkles } from 'lucide-react';

interface AgentStatusCardProps {
  agentName: string;
  roleDescription: string;
  provider: string;
  status: 'running' | 'completed' | 'idle';
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  agentName,
  roleDescription,
  provider,
  status,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              CURRENT AI STAGE
            </span>
            <h3 className="text-xl font-bold text-white tracking-wide">{agentName}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-mono text-slate-300 capitalize">{provider} Provider</span>
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed font-sans">{roleDescription}</p>
    </div>
  );
};
