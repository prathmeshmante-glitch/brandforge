import React from 'react';
import { Palette, Type, Compass, Box } from 'lucide-react';
import { VisualDirection, LogoDirection } from '@packages/types/brand';

interface BrandDirectionCardProps {
  visualDirection: VisualDirection;
  logoDirection: LogoDirection;
}

export const BrandDirectionCard: React.FC<BrandDirectionCardProps> = ({
  visualDirection,
  logoDirection,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 shadow-xl space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-5 h-5 text-purple-400" />
          <h4 className="text-base font-bold text-white tracking-wide">Color Palette & Mood</h4>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {visualDirection.mood.map((m, idx) => (
            <span key={idx} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-xs font-mono">
              #{m}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visualDirection.color_direction.map((colorStr, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full border border-slate-700 shadow-inner"
                style={{ backgroundColor: colorStr.split(' ')[0] || '#3b82f6' }}
              />
              <span className="text-xs font-mono text-slate-300">{colorStr}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-5">
        <div className="flex items-center space-x-2 mb-3">
          <Type className="w-5 h-5 text-blue-400" />
          <h4 className="text-base font-bold text-white tracking-wide">Typography & Layout</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block mb-1">Typography Pairs:</span>
            <span>{visualDirection.typography.join(' / ')}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-500 block mb-1">Shape Language:</span>
            <span>{visualDirection.shape_language.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-5">
        <div className="flex items-center space-x-2 mb-3">
          <Compass className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-white tracking-wide">Logo Concept Direction</h4>
        </div>
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
          <h5 className="text-sm font-bold text-emerald-300 mb-1">{logoDirection.concept}</h5>
          <p className="text-xs text-slate-400 leading-relaxed">{logoDirection.rationale}</p>
        </div>
      </div>
    </div>
  );
};
