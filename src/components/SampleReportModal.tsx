/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Copy, Download, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCopyNotice?: () => void;
}

export const SampleReportModal: React.FC<Props> = ({ isOpen, onClose, onCopyNotice }) => {
  const [copied, setCopied] = React.useState(false);
  const [reportText, setReportText] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/research_report.txt')
        .then((res) => res.text())
        .then((text) => {
          setReportText(text);
          setLoading(false);
        })
        .catch(() => {
          setReportText('Sample report could not be loaded directly from static path.');
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    onCopyNotice?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ResearchMate_Sample_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-50 text-violet-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-lg">Illustrative Sample Research Report</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-violet-100 text-violet-800 rounded-full">
                  Sample Dataset
                </span>
              </div>
              <p className="text-xs text-slate-500">Traceable references with real DOIs: Short-Term Solar PV Forecasting</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download .TXT
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/60 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap select-text">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <span>Loading illustrative sample report...</span>
            </div>
          ) : (
            reportText
          )}
        </div>

        <div className="bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Source file: <code className="text-slate-700">research_report.txt</code> • Traceable scholarly citations only</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
