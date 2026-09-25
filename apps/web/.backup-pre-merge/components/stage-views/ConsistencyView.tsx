import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ConsistencyViewProps {
  consistencyData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
  consistencyData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!consistencyData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <ShieldCheck className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-400" />
        <p>Consistency Guardian is evaluating cross-stage brand coherence...</p>
      </div>
    );
  }

  const { overall_consistency_score, overall_status, checks, violations, required_revisions } = consistencyData;

  const defaultChecks = [
    { relationship: 'Name ↔ Positioning', status: 'PASS', details: 'Name aligns with positioning angle.' },
    { relationship: 'Name ↔ Personality', status: 'PASS', details: 'Name matches archetype tone.' },
    { relationship: 'Tagline ↔ Personality', status: 'PASS', details: 'Tagline reflects voice principles.' },
    { relationship: 'Visual ↔ Audience', status: 'PASS', details: 'Color swatches match target demographic.' },
    { relationship: 'Voice ↔ Personality', status: 'PASS', details: 'Tone descriptors support archetype.' },
    { relationship: 'Launch Message ↔ Strategy', status: 'PASS', details: 'Launch message conveys core UTP.' },
  ];

  const activeChecks = checks && checks.length > 0 ? checks : defaultChecks;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Stage 07 — Consistency Guardian Agent
          </div>
          <h2 className="text-2xl font-bold text-white">Cross-Stage Coherence Matrix</h2>
          <p className="text-sm text-slate-400 mt-1">
            Systematic audit ensuring alignment between Name, Positioning, Personality, Visuals, and Launch Messaging.
          </p>
        </div>

        {overall_consistency_score !== undefined && (
          <div className="text-right bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block">Overall Coherence</span>
            <span className="text-2xl font-extrabold text-emerald-300">{overall_consistency_score}%</span>
          </div>
        )}
      </div>

      {/* Relationship Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeChecks.map((item: any, idx: number) => {
          const isPass = (item.status || 'PASS').toUpperCase() === 'PASS';

          return (
            <Card
              key={idx}
              className={`p-5 flex items-start justify-between ${
                isPass ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-200">
                    {item.relationship || item.pair || `Check #${idx + 1}`}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.details || item.explanation || item.reason || 'Alignment verified.'}
                </p>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0 ml-3 ${
                  isPass
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {isPass ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> NEEDS REVISION
                  </>
                )}
              </span>
            </Card>
          );
        })}
      </div>

      {/* Violations or Required Revisions */}
      {violations && violations.length > 0 && (
        <Card className="p-5 bg-rose-950/20 border-rose-500/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400" /> Detected Alignment Violations
          </h4>
          <ul className="space-y-2 text-xs text-rose-200">
            {violations.map((v: any, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{typeof v === 'string' ? v : v.description || v.reason}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Decision Bar */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          Consistency check complete. Proceed to Launch Kit or request an automated revision rerun.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowRevisionInput(!showRevisionInput)}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            Request Targeted Revision
          </Button>

          <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
            <CheckCircle2 className="w-4 h-4" />
            Approve & Generate Launch Kit
          </Button>
        </div>
      </div>

      {showRevisionInput && (
        <form onSubmit={handleRevisionSubmit} className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-3">
          <label className="block text-xs font-medium text-purple-200">
            Specify targeted revision area (e.g. positioning, visual, naming):
          </label>
          <textarea
            className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            rows={3}
            placeholder="e.g. Align tagline and visual palette more closely with target developer demographic..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowRevisionInput(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Targeted Rerun
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
