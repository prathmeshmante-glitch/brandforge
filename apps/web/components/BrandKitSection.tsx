import React from 'react';
import { Rocket, FileText, Share2, Award, Check } from 'lucide-react';
import { LaunchAgentOutput } from '@packages/types/brand';

interface BrandKitSectionProps {
  launch: LaunchAgentOutput;
  artifactsMap: Record<string, any>;
  onExport: () => void;
}

export const BrandKitSection: React.FC<BrandKitSectionProps> = ({
  launch,
  artifactsMap,
  onExport,
}) => {
  return (
    <div className="bg-slate-900 border border-emerald-950/80 rounded-xl p-8 mb-8 shadow-2xl space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            FINAL DELIVERABLE
          </span>
          <h2 className="text-3xl font-black text-white tracking-wide">{launch.brand_name} Brand Kit</h2>
          <p className="text-sm text-slate-400 font-mono mt-1">{launch.tagline}</p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Export PDF Brand Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pitch & Strategy */}
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase">One-Line Pitch</span>
          <p className="text-base font-semibold text-white leading-relaxed">{launch.one_line_pitch}</p>
        </div>

        {/* Hero Landing Page Copy */}
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase">Landing Page Hero</span>
          <h4 className="text-lg font-bold text-white">{launch.landing_page.headline}</h4>
          <p className="text-xs text-slate-400">{launch.landing_page.subheadline}</p>
          <div className="pt-2">
            <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">
              CTA: {launch.landing_page.cta}
            </span>
          </div>
        </div>
      </div>

      {/* Social Launch Copy */}
      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center space-x-2">
          <Rocket className="w-4 h-4" />
          <span>Launch Content & Copy</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold block">Instagram Announcement</span>
            <p className="text-slate-300 leading-relaxed font-sans">{launch.social.instagram}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold block">LinkedIn Announcement</span>
            <p className="text-slate-300 leading-relaxed font-sans">{launch.social.linkedin}</p>
          </div>
        </div>
      </div>

      {/* Brand Voice Execution Samples */}
      {launch.brand_voice_samples && launch.brand_voice_samples.length > 0 && (
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase">Brand Voice Samples</span>
          <div className="flex flex-wrap gap-2">
            {launch.brand_voice_samples.map((sample, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-mono">
                "{sample}"
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
