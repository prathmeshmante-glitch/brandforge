import React from 'react';
import { Rocket, Download, Share2, Sparkles, Palette, Type, MessageSquare, Globe, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface LaunchBrandKitViewProps {
  launchData: any;
  brandState: any;
  onExportPDF: () => void;
  isLoading?: boolean;
}

export const LaunchBrandKitView: React.FC<LaunchBrandKitViewProps> = ({
  launchData,
  brandState,
  onExportPDF,
  isLoading = false,
}) => {
  const selectedName = brandState.selected_directions?.chosen_name || brandState.naming?.suggestions?.[0]?.name || 'BrandForge';
  const tagline = launchData?.tagline || 'From rough idea to launch-ready brand.';
  const pitch = launchData?.one_line_pitch || 'AI Brand Intelligence Studio that turns raw ideas into structured brand kits.';
  const personality = brandState.personality;
  const visual = brandState.visual_direction;
  const colors = visual?.color_palette || [];
  const landingCopy = launchData?.landing_page_copy || {};
  const socialPosts = launchData?.social_posts || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/10">
        <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Stage 08 — Launch Ready
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
          <Rocket className="w-6 h-6 text-white" />
        </div>

        <span className="text-xs font-mono tracking-widest text-indigo-300 uppercase block mb-1">
          Complete Brand System Guidelines
        </span>

        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">{selectedName}</h1>
        <p className="text-xl font-medium text-indigo-200 mb-4">{tagline}</p>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">{pitch}</p>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={onExportPDF} isLoading={isLoading}>
            <Download className="w-4 h-4" />
            Download Brand Kit PDF
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Brand Kit share link copied to clipboard!');
              }
            }}
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            Share Brand Kit
          </Button>
        </div>
      </div>

      {/* Brand Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Personality & Voice */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Brand Personality & Archetype
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-mono uppercase block mb-1">Archetype</span>
              <span className="text-sm font-bold text-white bg-purple-500/10 px-3 py-1 rounded border border-purple-500/20 inline-block">
                {personality?.archetype || 'Creator / Visionary'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-mono uppercase block mb-1">Key Traits</span>
              <div className="flex flex-wrap gap-1.5">
                {(personality?.traits || ['Innovative', 'Structured', 'Authoritative']).map((t: string, idx: number) => (
                  <span key={idx} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-mono uppercase block mb-1">Emotional Goal</span>
              <p className="text-slate-200 italic font-medium">"{personality?.emotional_goal || 'Empowered clarity'}"</p>
            </div>
          </div>
        </Card>

        {/* Visual Identity Swatches */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-4">
            <Palette className="w-4 h-4" /> Visual Identity Swatches
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {colors.map((c: any, idx: number) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-2 border border-slate-800 text-center">
                <div className="h-12 w-full rounded mb-1.5 shadow-sm" style={{ backgroundColor: c.hex }} />
                <span className="text-[10px] font-bold text-slate-200 block truncate">{c.name}</span>
                <span className="text-[9px] font-mono text-slate-400">{c.hex}</span>
              </div>
            ))}
          </div>

          {visual?.typography && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Header: <strong className="text-slate-200">{visual.typography.header_font}</strong></span>
              <span>Body: <strong className="text-slate-200">{visual.typography.body_font}</strong></span>
            </div>
          )}
        </Card>
      </div>

      {/* Landing Page Copy & Messaging */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-4">
          <Globe className="w-4 h-4" /> Recommended Landing Page Copy
        </div>

        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Hero Headline</span>
            <p className="text-xl font-bold text-white">{landingCopy.headline || `Build Next-Gen Brands with ${selectedName}`}</p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Subheadline</span>
            <p className="text-sm text-slate-300 leading-relaxed">
              {landingCopy.subheadline || 'Transform unstructured ideas into launch-ready brand identities through structured AI reasoning.'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Primary Call to Action</span>
            <span className="inline-block bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-lg">
              {landingCopy.cta || 'Get Started Now'}
            </span>
          </div>
        </div>
      </Card>

      {/* Social Content Snippets */}
      {socialPosts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-4">
            <MessageSquare className="w-4 h-4" /> Launch Social Copy Snippets
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPosts.map((post: any, idx: number) => (
              <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="font-mono text-[10px] text-indigo-400 uppercase block mb-1">
                  Platform: {post.platform || 'Twitter / X'}
                </span>
                <p className="text-slate-300 leading-relaxed italic">"{post.content || post.text}"</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Final Download Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Ready for deployment</h4>
          <p className="text-xs text-slate-400">
            Export vector brand assets, color specifications, and typography guidelines in high-resolution PDF format.
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={onExportPDF} isLoading={isLoading}>
          <Download className="w-4 h-4" />
          Export Brand Kit PDF
        </Button>
      </div>
    </div>
  );
};
