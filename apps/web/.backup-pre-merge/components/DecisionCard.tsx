import React, { useState } from 'react';
import { Check, RefreshCw, Sliders } from 'lucide-react';

interface DecisionCardProps {
  stageId: string;
  options?: Array<{ label: string; value: any }>;
  onAccept: () => void;
  onRevision: (feedback: string) => void;
  onSelectOption: (option: any) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  stageId,
  options,
  onAccept,
  onRevision,
  onSelectOption,
}) => {
  const [revisionText, setRevisionText] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<any>(null);

  const handleChoose = (opt: any) => {
    setSelectedOpt(opt);
    onSelectOption(opt);
  };

  const handleSendRevision = () => {
    if (revisionText.trim()) {
      onRevision(revisionText);
      setRevisionText('');
      setShowRevisionInput(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-5 mb-8 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Sliders className="w-5 h-5 text-blue-400" />
        <h4 className="text-base font-bold text-white tracking-wide uppercase font-mono">
          HUMAN DECISION CONTROLS
        </h4>
      </div>

      {options && options.length > 0 && (
        <div className="mb-5">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase">
            Select Preferred Direction [Choose]
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChoose(opt.value)}
                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                  selectedOpt === opt.value
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showRevisionInput && (
        <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <textarea
            value={revisionText}
            onChange={(e) => setRevisionText(e.target.value)}
            placeholder="Provide specific feedback or instructions for revision..."
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setShowRevisionInput(false)}
              className="px-3 py-1 rounded bg-slate-800 text-slate-400 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSendRevision}
              className="px-3 py-1 rounded bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
            >
              Submit Revision Instruction
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
        <button
          onClick={onAccept}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
        >
          <Check className="w-4 h-4" />
          <span>[Accept Direction]</span>
        </button>

        <button
          onClick={() => setShowRevisionInput(!showRevisionInput)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>[Request Revision]</span>
        </button>
      </div>
    </div>
  );
};
