/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Download,
  Copy,
  Share2,
  ShieldCheck,
  Check,
  FileText,
  Code,
  Sparkles,
} from 'lucide-react';
import { ResearchSession } from '../types';

interface Props {
  session: ResearchSession;
  onExportTxt: () => void;
  onExportJson: () => void;
  onCopyAll: () => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<Props> = ({
  session,
  onExportTxt,
  onExportJson,
  onCopyAll,
  onOpenMethodology,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Topic Title & Breadcrumb */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-900 truncate">
              {session.topic || 'Untitled Academic Inquiry'}
            </h1>
            {session.isDemo && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                Illustrative Sample
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">
            {session.fieldOfStudy ? `${session.fieldOfStudy} • ` : ''}
            {session.papers?.length ? `${session.papers.length} verified sources retrieved` : 'Awaiting literature search'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Anti-Hallucination Tag */}
        <button
          onClick={onOpenMethodology}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Epistemic Grounding Guaranteed</span>
        </button>

        {/* Copy All */}
        <button
          onClick={handleCopy}
          title="Copy full research session as Markdown"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Export Dropdown / Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={onExportTxt}
            title="Download formatted research report as TXT"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>.TXT</span>
          </button>
          <button
            onClick={onExportJson}
            title="Export complete session metadata and verified papers as JSON"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-white hover:shadow-xs transition-all"
          >
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>.JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
