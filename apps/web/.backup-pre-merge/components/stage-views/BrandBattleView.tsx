import React, { useState } from 'react';
import { Swords, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BrandBattleViewProps {
  critiqueData: any;
  onAccept: () => void;
  onRequestRevision: (feedback: string) => void;
  isLoading?: boolean;
}

export const BrandBattleView: React.FC<BrandBattleViewProps> = ({
  critiqueData,
  onAccept,
  onRequestRevision,
  isLoading = false,
}) => {
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!critiqueData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Swords className="w-8 h-8 mx-auto mb-2 animate-spin text-rose-400" />
        <p>Brand Battle / Critic Agent is stressing the brand system...</p>
      </div>
    );
  }

  const {
    overall_assessment,
    genericity_score,
    audience_fit,
    differentiation_rating,
    positioning_strength,
    personality_consistency,
    visual_strategy_fit,
    key_weaknesses,
    recommended_revisions,
    critique_items,
  } = critiqueData;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onRequestRevision(feedback);
    setShowRevisionInput(false);
    setFeedback('');
  };

  const getSeverityBadge = (severity: string) => {
    const s = (severity || 'medium').toLowerCase();
    if (s === 'high' || s === 'critical') {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    } else if (s === 'medium') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Brand Battle Header */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-purple-950/40 border border-rose-500/30 rounded-2xl p-6 shadow-xl shadow-rose-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-inner">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
                Stage 06 — AI Critic Matrix
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">BRAND BATTLE</h2>
            </div>
          </div>

          {overall_assessment && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Status</span>
              <span className="text-sm font-bold text-slate-200">{overall_assessment}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          The Critic Agent acts as an adversarial market challenger to test genericity, weak differentiation, and target audience friction before launch.
        </p>
      </div>

      {/* Evaluation Scorecards (If present in API backend) */}
      {(genericity_score || audience_fit || differentiation_rating) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {genericity_score && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Genericity</span>
              <span className="text-lg font-bold text-amber-400">{genericity_score}</span>
            </Card>
          )}
          {audience_fit && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Audience Fit</span>
              <span className="text-lg font-bold text-emerald-400">{audience_fit}</span>
            </Card>
          )}
          {differentiation_rating && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Differentiation</span>
              <span className="text-lg font-bold text-indigo-400">{differentiation_rating}</span>
            </Card>
          )}
          {positioning_strength && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Positioning</span>
              <span className="text-lg font-bold text-purple-400">{positioning_strength}</span>
            </Card>
          )}
          {personality_consistency && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Personality</span>
              <span className="text-lg font-bold text-cyan-400">{personality_consistency}</span>
            </Card>
          )}
          {visual_strategy_fit && (
            <Card className="p-3 text-center">
              <span className="text-[10px] uppercase text-slate-400 block">Visual Fit</span>
              <span className="text-lg font-bold text-emerald-400">{visual_strategy_fit}</span>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Critic Items */}
      {critique_items && critique_items.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Adversarial Market Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {critique_items.map((item: any, idx: number) => (
              <Card key={idx} className="p-4 bg-slate-900/60 border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-200">{item.category || item.area}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(item.severity)}`}>
                    {item.severity || 'Medium'} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">{item.finding || item.issue}</p>
                {item.explanation && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/80">
                    "{item.explanation}"
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Key Weaknesses & Recommended Revisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5 bg-rose-950/20 border-rose-500/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Key Weaknesses Identified
          </h4>
          <ul className="space-y-2 text-xs text-rose-200/90">
            {(key_weaknesses || []).map((w: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-purple-950/20 border-purple-500/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-400" /> Recommended Revisions
          </h4>
          <ul className="space-y-2 text-xs text-purple-200/90">
            {(recommended_revisions || []).map((r: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Action Decision Buttons */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          Accept the critic's findings to enter Consistency Guardian or request a targeted revision.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowRevisionInput(!showRevisionInput)}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            Request Targeted Rerun
          </Button>

          <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
            <CheckCircle2 className="w-4 h-4" />
            Pass Brand Battle & Continue
          </Button>
        </div>
      </div>

      {showRevisionInput && (
        <form onSubmit={handleRevisionSubmit} className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-3">
          <label className="block text-xs font-medium text-purple-200">
            Provide feedback for targeted revision:
          </label>
          <textarea
            className="w-full bg-[#080c14] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            rows={3}
            placeholder="e.g. Sharpen positioning to sound less generic and address B2B enterprise differentiation..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowRevisionInput(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Trigger Rerun Chain
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
