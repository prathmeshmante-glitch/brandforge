import React from 'react';
import { Palette, Type, Image as ImageIcon, Layout, CheckCircle2, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface VisualIdentityViewProps {
  visualData: any;
  brandName?: string;
  onAccept: () => void;
  isLoading?: boolean;
}

export const VisualIdentityView: React.FC<VisualIdentityViewProps> = ({
  visualData,
  brandName = 'BrandForge',
  onAccept,
  isLoading = false,
}) => {
  if (!visualData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Palette className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-400" />
        <p>Creative Director Agent is rendering visual direction & color palette...</p>
      </div>
    );
  }

  const { color_palette, typography, imagery_direction, composition, shape_language, logo_direction, visual_mood } = visualData;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" /> Stage 05 — Creative Director Agent
          </div>
          <h2 className="text-2xl font-bold text-white">Visual Identity & Aesthetic Direction</h2>
          <p className="text-sm text-slate-400 mt-1">
            Color palette swatches, typography scale hierarchy, composition rules, and logo guidance.
          </p>
        </div>
      </div>

      {/* Visual Mood Badge */}
      {visual_mood && (
        <Card className="p-4 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Defined Visual Mood
          </div>
          <p className="text-base font-bold text-white">{visual_mood}</p>
        </Card>
      )}

      {/* Color Palette Swatches */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-4">
          <Palette className="w-4 h-4" /> Brand Color Palette Swatches
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(color_palette || []).map((color: any, idx: number) => (
            <div key={idx} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group">
              <div
                className="h-24 w-full shadow-inner flex items-end p-2 transition-transform group-hover:scale-105"
                style={{ backgroundColor: color.hex }}
              >
                <span className="text-[10px] font-mono font-bold bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded">
                  {color.hex}
                </span>
              </div>
              <div className="p-3">
                <span className="font-bold text-slate-200 text-xs block">{color.name}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                  Role: {color.role || 'Accent'}
                </span>
                {color.usage && (
                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">{color.usage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Typography Scale Preview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-4">
          <Type className="w-4 h-4" /> Typography System Preview
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Header Font</span>
            <p className="text-xl font-extrabold text-white mb-2">
              {typography?.header_font || 'Inter Display'}
            </p>
            <div className="p-3 bg-[#080c14] rounded-lg border border-slate-800">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {brandName} — Future of AI Intelligence
              </h1>
              <p className="text-xs text-slate-400 mt-1">Sample Display Scale (24px Bold)</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Body Font</span>
            <p className="text-xl font-semibold text-slate-300 mb-2">
              {typography?.body_font || 'Inter Sans'}
            </p>
            <div className="p-3 bg-[#080c14] rounded-lg border border-slate-800">
              <p className="text-sm text-slate-300 leading-relaxed">
                BrandForge translates unstructured product concepts into coherent brand systems through staged AI reasoning.
              </p>
              <p className="text-xs text-slate-400 mt-1">Sample Body Scale (14px Regular)</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Composition, Shape Language, Logo Direction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Layout className="w-4 h-4" /> Composition Rules
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{composition}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" /> Shape Language
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{shape_language}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <ImageIcon className="w-4 h-4" /> Logo Direction
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{logo_direction}</p>
        </Card>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Visual Identity is ready for Brand Battle / Critic evaluation.
        </p>

        <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
          <CheckCircle2 className="w-4 h-4" />
          Accept Visual Direction & Start Brand Battle
        </Button>
      </div>
    </div>
  );
};
