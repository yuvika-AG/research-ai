/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Database, Sparkles, AlertTriangle, ExternalLink, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Epistemic Protocol & Architecture</h3>
              <p className="text-xs text-slate-500">How ResearchMate AI prevents AI hallucination in academic synthesis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-600">
          <section className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>1. Direct Scholarly Database Grounding</span>
            </div>
            <p className="leading-relaxed">
              ResearchMate AI does not generate citations from model memory. Literature is queried live from authoritative, open bibliometric repositories: <strong className="text-slate-800">OpenAlex</strong> (indexing over 250 million scholarly works) with automatic fallback to <strong className="text-slate-800">Crossref</strong>. Every record displays traceable DOIs, active links, publication years, and verified author affiliations.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>2. Strict Separation of Facts vs. AI Synthesis</span>
            </div>
            <p className="leading-relaxed">
              Every data element in ResearchMate AI is tagged with its provenance level:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1">Verified Fact</span>
                <p className="text-xs text-slate-700">Titles, authors, DOIs, publication year, and abstracts retrieved verbatim from OpenAlex/Crossref.</p>
              </div>
              <div className="p-3 rounded-xl border border-violet-200 bg-violet-50/50">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-violet-100 text-violet-800 mb-1">AI Synthesis</span>
                <p className="text-xs text-slate-700">Refined research questions, structured plans, comparative matrices, and report drafts generated via Gemini 3.8 Flash.</p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>3. Abstract-Based Analysis Boundary</span>
            </div>
            <p className="leading-relaxed">
              Unless full open-access texts are processed, all comparative syntheses and literature reviews are strictly <strong className="text-slate-800">abstract-based</strong>. When published abstracts omit experimental constants, computational runtimes, or sample sizes, the system explicitly reports: <em className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded font-medium">"Insufficient evidence in abstract to determine"</em>.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>4. Tentative Research Gaps (Hypotheses, Not Facts)</span>
            </div>
            <p className="leading-relaxed">
              Identified research gaps are always formulated as <strong className="text-slate-800">tentative hypotheses</strong> requiring empirical testing, rather than established dogmas. This prevents premature scientific conclusions and equips researchers with defensible research proposals.
            </p>
          </section>

          <section className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <p className="font-medium text-slate-700 mb-1">Scholarly APIs Utilized:</p>
            <div className="flex flex-wrap gap-2 text-indigo-600">
              <a href="https://openalex.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                OpenAlex API <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="https://www.crossref.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                Crossref REST API <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                Google Gemini API (gemini-3.8-flash) <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
