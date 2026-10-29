/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Split,
  Layers,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { ComparisonMatrix, VerifiedPaper } from '../types';

interface Props {
  comparison?: ComparisonMatrix;
  papers: VerifiedPaper[];
  researchQuestion: string;
  onGenerateComparison: () => Promise<void>;
  isLoading: boolean;
  onProceedToReport: () => void;
}

export const CompareTab: React.FC<Props> = ({
  comparison,
  papers,
  researchQuestion,
  onGenerateComparison,
  isLoading,
  onProceedToReport,
}) => {
  const selectedPapers = papers.filter((p) => p.selected);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Stage Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <Scale className="w-4 h-4" />
          <span>Stage 3: Comparative Abstract Analysis</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Abstract Evidence Matrix & Cross-Study Synthesis
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Systematic evaluation of methodology, empirical findings, declared limitations, and topical relevance.
            </p>
          </div>
          {comparison && (
            <button
              onClick={onGenerateComparison}
              disabled={isLoading || selectedPapers.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Analyze Abstracts</span>
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Abstract-Only Boundary Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-900 space-y-1">
          <h4 className="font-semibold text-amber-950 text-xs">
            Notice: Analysis is strictly abstract-based: full texts were not examined.
          </h4>
          <p className="leading-relaxed">
            All synthesized conclusions, methodological classifications, and limitations derive exclusively from published abstract records indexed in OpenAlex/Crossref. Specific hyperparameter values, dataset nuances, or hardware telemetry described inside paywalled manuscripts are marked as <em>"Insufficient evidence in abstract to determine"</em>.
          </p>
        </div>
      </div>

      {/* Empty State / Not Yet Analyzed */}
      {!comparison && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-semibold text-slate-900">
              Ready to Synthesize {selectedPapers.length} Selected Papers
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ResearchMate AI will analyze each verified abstract against your research question:
              <br />
              <span className="italic text-slate-700 font-serif block mt-1">"{researchQuestion || 'Specified Topic'}"</span>
            </p>
          </div>
          <button
            onClick={onGenerateComparison}
            disabled={isLoading || selectedPapers.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Comparing Abstract Evidence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Execute Comparative Analysis</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 animate-in fade-in">
          {/* Comparative Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Structured Comparative Matrix</span>
              </div>
              <span className="text-xs text-slate-500">
                {comparison.items?.length || 0} studies compared
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4 w-1/4">Paper & Verified Source</th>
                    <th className="py-3 px-4 w-1/5">Methodology</th>
                    <th className="py-3 px-4 w-1/4">Key Findings</th>
                    <th className="py-3 px-4 w-1/5">Reported Limitations</th>
                    <th className="py-3 px-4 w-1/5">Relevance to Inquiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {comparison.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors align-top">
                      {/* Paper Title & DOI */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-xs mb-1">
                          {item.paperTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 mb-1">
                          {item.authors} ({item.year})
                        </div>
                        {item.doiUrl && (
                          <a
                            href={item.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-indigo-600 hover:underline"
                          >
                            <span>DOI Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>

                      {/* Methodology */}
                      <td className="py-3.5 px-4 leading-relaxed">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 block w-fit mb-1">
                          Approach
                        </span>
                        {item.methodology}
                      </td>

                      {/* Key Findings */}
                      <td className="py-3.5 px-4 leading-relaxed">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block w-fit mb-1">
                          Reported Evidence
                        </span>
                        {item.keyFindings}
                      </td>

                      {/* Limitations */}
                      <td className="py-3.5 px-4 leading-relaxed text-slate-500">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 block w-fit mb-1">
                          Boundary
                        </span>
                        {item.limitations}
                      </td>

                      {/* Relevance */}
                      <td className="py-3.5 px-4 leading-relaxed text-indigo-950 font-medium">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 block w-fit mb-1">
                          Synthesis Fit
                        </span>
                        {item.relevanceToQuestion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commonalities & Divergences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commonalities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cross-Study Commonalities (Consensus)</span>
              </div>
              <ul className="space-y-2.5">
                {comparison.commonalities?.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divergences */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Split className="w-4 h-4 text-violet-600" />
                <span>Divergences & Methodological Trade-Offs</span>
              </div>
              <ul className="space-y-2.5">
                {comparison.divergences?.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action To Generate Full Report */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-950 text-sm">Next Step: Synthesize Full Research Report</h4>
                <p className="text-xs text-indigo-700">
                  Draft introduction, literature review, methodology suggestions, discussion, and verified bibliography.
                </p>
              </div>
            </div>
            <button
              onClick={onProceedToReport}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <span>Generate Full Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
