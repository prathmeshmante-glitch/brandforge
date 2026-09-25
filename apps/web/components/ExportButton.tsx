import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface ExportButtonProps {
  projectId: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ projectId }) => {
  const [exporting, setExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await api.exportBrandKit(projectId, 'pdf');
      setDownloadUrl(result.download_url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-md transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Download PDF Kit</span>
        </a>
      ) : (
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF Brand Kit</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
