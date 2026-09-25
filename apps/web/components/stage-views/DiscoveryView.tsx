import React, { useState } from 'react';
import { Compass, CheckCircle2, RefreshCw, HelpCircle, Target, Users, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DiscoveryViewProps {
  discoveryData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  discoveryData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!discoveryData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Compass className="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-400" />
        <p>Discoverer Agent is analyzing your brand idea...</p>
      </div>
    );
  }

  const { core_problem, target_audience, user_context, goals, assumptions, open_questions } = discoveryData;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> Stage 01 — Discoverer Agent
          </div>
          <h2 className="text-2xl font-bold text-white">Brand Intelligence Discovery</h2>
          <p className="text-sm text-slate-400 mt-1">
            Unstructured idea parsed into foundational problem spaces, target personas, and market goals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Problem */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
            <Target className="w-4 h-4" /> Core Problem Statement
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">{core_problem}</p>
        </Card>

        {/* Target Audience */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
            <Users className="w-4 h-4" /> Primary Target Audience
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">{target_audience}</p>
        </Card>
      </div>

      {/* User Context & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            User Context & Environment
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">{user_context}</p>
        </Card>

        <Card className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Strategic Brand Goals
          </h4>
          <ul className="space-y-1.5 text-sm text-slate-300">
            {(goals || []).map((goal: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Assumptions & Open Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-slate-900/40">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Market Assumptions
          </h4>
          <ul className="space-y-1.5 text-sm text-slate-400">
            {(assumptions || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-slate-900/40">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Open Questions
          </h4>
          <ul className="space-y-1.5 text-sm text-slate-400">
            {(open_questions || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Decision Controls */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          Review the discovery findings. Accept to proceed to Positioning or request a targeted revision.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowRevisionInput(!showRevisionInput)}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            Request Revision
          </Button>

          <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
            <CheckCircle2 className="w-4 h-4" />
            Accept & Continue
          </Button>
        </div>
      </div>

      {/* Revision Modal / Form */}
      {showRevisionInput && (
        <form onSubmit={handleRevisionSubmit} className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-3">
          <label className="block text-xs font-medium text-purple-200">
            Provide feedback for Discoverer Agent:
          </label>
          <textarea
            className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            rows={3}
            placeholder="e.g. Focus more on B2B enterprise creators rather than general consumer users..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowRevisionInput(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Revision Rerun
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
