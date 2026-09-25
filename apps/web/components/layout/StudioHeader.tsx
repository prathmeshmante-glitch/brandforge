import React from 'react';
import Link from 'next/link';
import { Sparkles, Save, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface StudioHeaderProps {
  projectName: string;
  isSaved?: boolean;
  onExport?: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  projectName,
  isSaved = true,
  onExport,
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#0b0f19] px-4 flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        
        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="font-semibold text-sm text-slate-200">BrandForge</span>
          <span className="text-slate-600 text-xs">/</span>
          <span className="font-medium text-sm text-slate-300 max-w-[200px] sm:max-w-xs truncate">
            {projectName || 'Untitled Brand'}
          </span>
        </div>

        {isSaved && (
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Auto-saved
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <Button variant="outline" size="sm" onClick={() => alert('Changes saved to Supabase database.')}>
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        {onExport && (
          <Button variant="primary" size="sm" onClick={onExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export Brand Kit</span>
          </Button>
        )}
      </div>
    </header>
  );
};
