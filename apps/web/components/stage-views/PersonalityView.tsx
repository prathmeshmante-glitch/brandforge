import React from 'react';
import { Sparkles, Heart, Shield, Ban, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PersonalityViewProps {
  personalityData: any;
  onAccept: () => void;
  isLoading?: boolean;
}

export const PersonalityView: React.FC<PersonalityViewProps> = ({
  personalityData,
  onAccept,
  isLoading = false,
}) => {
  if (!personalityData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Sparkles className="w-8 h-8 mx-auto mb-2 animate-spin text-purple-400" />
        <p>Brand Strategist Agent is crafting personality & voice principles...</p>
      </div>
    );
  }

  const { archetype, traits, tone, emotional_goal, brand_principles, avoid_traits } = personalityData;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Stage 03 — Brand Strategist Agent
          </div>
          <h2 className="text-2xl font-bold text-white">Brand Personality & Voice System</h2>
          <p className="text-sm text-slate-400 mt-1">
            Human attributes, tone of voice, archetype, and brand boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Brand Archetype */}
        <Card className="p-6 bg-gradient-to-br from-purple-950/30 to-slate-900 border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Core Brand Archetype
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2">{archetype}</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            The archetype defines the psychological persona and emotional baseline for all visual and verbal communication.
          </p>
        </Card>

        {/* Emotional Goal */}
        <Card className="p-6 bg-gradient-to-br from-indigo-950/30 to-slate-900 border-indigo-500/30">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4" /> Primary Emotional Goal
          </div>
          <p className="text-lg font-bold text-slate-100 mb-2">"{emotional_goal}"</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            The targeted feeling users experience when interacting with your brand across touchpoints.
          </p>
        </Card>
      </div>

      {/* Traits & Tone Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Key Personality Traits
          </h4>
          <div className="flex flex-wrap gap-2">
            {(traits || []).map((trait: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-medium shadow-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Tone of Voice Descriptors
          </h4>
          <div className="flex flex-wrap gap-2">
            {(tone || []).map((t: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Brand Principles & Avoid Traits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Core Brand Principles
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {(brand_principles || []).map((principle: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 bg-rose-950/10 border-rose-500/20">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
            <Ban className="w-3.5 h-3.5 text-rose-400" /> Avoid Traits (What Brand Is NOT)
          </h4>
          <ul className="space-y-2 text-xs text-rose-200/80">
            {(avoid_traits || []).map((avoid: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{avoid}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Personality principles will guide the Naming Agent and Brand Voice generator.
        </p>

        <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
          <CheckCircle2 className="w-4 h-4" />
          Accept Personality & Continue
        </Button>
      </div>
    </div>
  );
};
