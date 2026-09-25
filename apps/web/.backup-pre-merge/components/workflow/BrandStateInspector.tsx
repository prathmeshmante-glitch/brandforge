import React from 'react';
import { Eye, CheckCircle, Tag, Palette, Sparkles, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

interface BrandStateInspectorProps {
  brandState: any;
  revisionCount?: number;
}

export const BrandStateInspector: React.FC<BrandStateInspectorProps> = ({
  brandState = {},
  revisionCount = 0,
}) => {
  const selectedPositioning = brandState.positioning?.directions?.find(
    (d: any) => d.name === brandState.selected_directions?.positioning_direction
  ) || brandState.positioning?.directions?.[0];

  const personality = brandState.personality;
  const naming = brandState.naming;
  const selectedName = brandState.selected_directions?.chosen_name || naming?.suggestions?.[0]?.name;
  const visual = brandState.visual_direction;
  const colors = visual?.color_palette || [];

  return (
    <aside className="w-80 bg-[#0b0f19] border-l border-slate-800/80 p-4 flex flex-col h-full overflow-y-auto flex-shrink-0 text-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span>Brand State Inspector</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Structured Schema
        </span>
      </div>

      <div className="space-y-4">
        {/* Revision Stats */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300 font-medium">Revision Counter</span>
          </div>
          <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {revisionCount} / 3 Max
          </span>
        </div>

        {/* Selected Brand Name */}
        <Card className="p-3 bg-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Brand Name</span>
          </div>
          {selectedName ? (
            <div className="font-bold text-base text-white tracking-wide">{selectedName}</div>
          ) : (
            <span className="text-slate-500 italic">Pending Naming stage...</span>
          )}
        </Card>

        {/* Positioning Direction */}
        <Card className="p-3 bg-slate-900/40">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Positioning Direction</span>
            </div>
            {selectedPositioning && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Selected
              </span>
            )}
          </div>
          {selectedPositioning ? (
            <div>
              <p className="font-semibold text-slate-200 text-xs mb-1">{selectedPositioning.name}</p>
              <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">
                {selectedPositioning.positioning_statement}
              </p>
            </div>
          ) : (
            <span className="text-slate-500 italic">Pending Positioning stage...</span>
          )}
        </Card>

        {/* Personality & Tone */}
        <Card className="p-3 bg-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Archetype & Traits</span>
          </div>
          {personality ? (
            <div>
              <div className="inline-block bg-purple-500/10 text-purple-300 font-medium text-[11px] px-2 py-0.5 rounded mb-2 border border-purple-500/20">
                {personality.archetype || 'Archetype'}
              </div>
              <div className="flex flex-wrap gap-1">
                {(personality.traits || []).map((trait: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-slate-500 italic">Pending Personality stage...</span>
          )}
        </Card>

        {/* Color Swatches */}
        <Card className="p-3 bg-slate-900/40">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-2">
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visual Color Swatches</span>
          </div>
          {colors.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="w-full h-8 rounded border border-slate-700 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-full">
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-500 italic">Pending Visual stage...</span>
          )}
        </Card>
      </div>
    </aside>
  );
};
