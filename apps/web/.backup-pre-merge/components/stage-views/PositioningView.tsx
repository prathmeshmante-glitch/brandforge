import React, { useState } from 'react';
import { Target, CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PositioningViewProps {
  positioningData: any;
  selectedDirection?: string;
  onSelectDirection: (directionName: string) => void;
  onAccept: () => void;
  isLoading?: boolean;
}

export const PositioningView: React.FC<PositioningViewProps> = ({
  positioningData,
  selectedDirection,
  onSelectDirection,
  onAccept,
  isLoading = false,
}) => {
  if (!positioningData || !positioningData.directions) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Target className="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-400" />
        <p>Positioner Agent is evaluating strategic directions...</p>
      </div>
    );
  }

  const directions = positioningData.directions || [];
  const activeSelection = selectedDirection || directions[0]?.name;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" /> Stage 02 — Positioner Agent
          </div>
          <h2 className="text-2xl font-bold text-white">Strategic Positioning Directions</h2>
          <p className="text-sm text-slate-400 mt-1">
            Select the positioning angle that best defines your market differentiation and competitive stance.
          </p>
        </div>
      </div>

      {/* Grid of Positioning Direction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {directions.map((dir: any, idx: number) => {
          const isSelected = dir.name === activeSelection;

          return (
            <Card
              key={idx}
              selected={isSelected}
              hoverable
              className="p-6 flex flex-col justify-between cursor-pointer relative"
              onClick={() => onSelectDirection(dir.name)}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-white p-1 rounded-full shadow-md shadow-indigo-500/50">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    Direction 0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">{dir.name}</h3>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Positioning Statement
                  </p>
                  <p className="text-sm text-indigo-200 font-medium leading-relaxed italic">
                    "{dir.positioning_statement}"
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Core Problem Addressed</span>
                    <p>{dir.core_problem}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Unique Value Proposition</span>
                    <p className="text-slate-200">{dir.value_proposition}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Differentiator</span>
                    <p className="text-indigo-300">{dir.differentiator}</p>
                  </div>

                  {dir.competitive_angle && (
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Competitive Angle</span>
                      <p className="text-slate-400">{dir.competitive_angle}</p>
                    </div>
                  )}

                  {dir.proof_points && dir.proof_points.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Proof Points</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                        {dir.proof_points.map((pt: string, pIdx: number) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {isSelected ? '✓ Selected as active direction' : 'Click to select this direction'}
                </span>
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDirection(dir.name);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Direction'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Chosen direction will anchor Personality, Naming, Visual Identity, and Brand Battle.
        </p>

        <Button variant="primary" onClick={onAccept} isLoading={isLoading}>
          <CheckCircle2 className="w-4 h-4" />
          Confirm Direction & Continue
        </Button>
      </div>
    </div>
  );
};
