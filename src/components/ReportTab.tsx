/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Share2,
  RefreshCw,
  Printer,
} from 'lucide-react';
import { ResearchReport, VerifiedPaper, ComparisonMatrix } from '../types';

interface Props {
  report?: ResearchReport;
  papers: VerifiedPaper[];
  topic: string;
  researchQuestion: string;
  comparison?: ComparisonMatrix;
  onGenerateReport: () => Promise<void>;
  isLoading: boolean;
  onExportTxt: () => void;
  onExportJson: () => void;
  onShowNotice: (title: string, desc?: string) => void;
}

export const ReportTab: React.FC<Props> = ({
  report,
  papers,
  topic,
  researchQuestion,
  comparison,
  onGenerateReport,
  isLoading,
  onExportTxt,
  onExportJson,
  onShowNotice,
}) => {
  const [copied, setCopied] = useState(false);
  const selectedPapers = papers.filter((p) => p.selected);

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `# ${report.title}

*Synthesis Date: ${new Date(report.generatedAt).toLocaleDateString()} | Synthesized by ResearchMate AI*
*Notice: ${report.provenanceSummary}*

---

## Abstract
${report.abstract}

---

## 1. Introduction & Research Question
${report.introduction}

---

## 2. Literature Review
${report.literatureReview}

---

## 3. Methodology Suggestions
${report.methodologySuggestions?.map((m, i) => `${i + 1}. ${m}`).join('\n')}

---

## 4. Discussion & Synthesis
${report.discussion}

---

## 5. Potential Research Gaps (Tentative Hypotheses)
${report.potentialGaps?.map((g, i) => `### Gap ${i + 1}: ${g.title}\n- **Hypothesis:** ${g.hypothesis}\n- **Reasoning:** ${g.reasoning}\n- **Proposed Verification:** ${g.suggestedVerificationApproach}`).join('\n\n')}

---

## 6. Limitations
${report.limitations}

---

## 7. Conclusion
${report.conclusion}

---

## 8. Verified References
${report.references?.map((r, i) => `${i + 1}. ${r.fullCitation} DOI: ${r.doiUrl}`).join('\n\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    onShowNotice('Report copied to clipboard', 'Full Markdown text copied successfully.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Stage Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <FileCheck2 className="w-4 h-4 text-indigo-600" />
          <span>Stage 4: Synthesis & Research Report</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Academic Research Report
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Comprehensive scholarly report citing only verified sources. Gaps formulated as tentative hypotheses.
            </p>
          </div>

          {report && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy MD'}</span>
              </button>
              <button
                onClick={onExportTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>.TXT</span>
              </button>
              <button
                onClick={onExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>.JSON</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                title="Print Report"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty State / Not Yet Generated */}
      {!report && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-semibold text-slate-900">
              Synthesize Research Report from {selectedPapers.length} Verified Sources
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ResearchMate AI will generate a complete academic manuscript: Abstract, Introduction, Literature Review, Methodology Suggestions, Discussion, Tentative Gap Hypotheses, and Verified References with DOIs.
            </p>
          </div>
          <button
            onClick={onGenerateReport}
            disabled={isLoading || selectedPapers.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Synthesizing Academic Report with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Generate Research Report</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated Academic Report Document */}
      {report && (
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          {/* Document Header */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                Academic Research Report
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Synthesized on {new Date(report.generatedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {report.references?.length || 0} Verified Citations
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
              {report.title}
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Epistemic Provenance:</strong> {report.provenanceSummary}
            </p>
          </div>

          <div className="p-8 space-y-8 text-sm leading-relaxed divide-y divide-slate-100">
            {/* Abstract */}
            <section className="space-y-3 pt-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Abstract
              </h3>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 font-serif italic text-slate-700 text-sm leading-relaxed">
                {report.abstract}
              </div>
            </section>

            {/* 1. Introduction */}
            <section className="space-y-3 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">01.</span>
                <span>Introduction & Problem Formulation</span>
              </h3>
              <div className="text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                {report.introduction}
              </div>
            </section>

            {/* 2. Literature Review */}
            <section className="space-y-3 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">02.</span>
                <span>Literature Review & Evidence Synthesis</span>
              </h3>
              <div className="text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                {report.literatureReview}
              </div>
            </section>

            {/* 3. Methodology Suggestions */}
            <section className="space-y-4 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">03.</span>
                <span>Methodological Proposals for Future Empirical Work</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.methodologySuggestions?.map((sug, i) => (
                  <div key={i} className="p-4 rounded-xl bg-violet-50/50 border border-violet-100 space-y-2">
                    <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-800 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {sug}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Discussion */}
            <section className="space-y-3 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">04.</span>
                <span>Discussion & Cross-Study Critical Analysis</span>
              </h3>
              <div className="text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                {report.discussion}
              </div>
            </section>

            {/* 5. Potential Gaps (Tentative Hypotheses) */}
            <section className="space-y-4 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-amber-600 font-mono text-sm">05.</span>
                  <span>Identified Research Gaps (Tentative Hypotheses)</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Hypotheses, Not Facts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Due to the abstract-based nature of this review, the following research gaps are formulated strictly as falsifiable scientific hypotheses requiring empirical validation:
              </p>

              <div className="space-y-3">
                {report.potentialGaps?.map((gap, i) => (
                  <div
                    key={gap.id || i}
                    className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <h4 className="font-semibold text-slate-900 text-sm">{gap.title}</h4>
                    </div>

                    <div className="pl-7 space-y-2 text-xs">
                      <div>
                        <strong className="text-amber-900 block font-semibold mb-0.5">Testable Hypothesis:</strong>
                        <p className="text-slate-800 italic bg-white/70 p-2.5 rounded-lg border border-amber-100">
                          "{gap.hypothesis}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <strong className="text-slate-700 block font-semibold mb-0.5">Empirical Rationale:</strong>
                          <p className="text-slate-600">{gap.reasoning}</p>
                        </div>
                        <div>
                          <strong className="text-slate-700 block font-semibold mb-0.5">Proposed Testing Protocol:</strong>
                          <p className="text-slate-600">{gap.suggestedVerificationApproach}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Limitations */}
            <section className="space-y-3 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">06.</span>
                <span>Limitations of the Abstract-Based Synthesis</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {report.limitations}
              </div>
            </section>

            {/* 7. Conclusion */}
            <section className="space-y-3 pt-8">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="text-violet-600 font-mono text-sm">07.</span>
                <span>Conclusion & Forward Agenda</span>
              </h3>
              <div className="text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                {report.conclusion}
              </div>
            </section>

            {/* 8. Verified References */}
            <section className="space-y-4 pt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600 font-mono text-sm">08.</span>
                  <span>Verified Bibliographic References</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  All Sources Verifiable
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Every citation listed below corresponds to an authenticated peer-reviewed record indexed in OpenAlex or Crossref with active registered DOIs:
              </p>

              <ol className="space-y-3 pt-2">
                {report.references?.map((ref, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="font-mono text-slate-400 font-semibold shrink-0">[{i + 1}]</span>
                    <div className="space-y-1">
                      <p className="leading-relaxed">{ref.fullCitation}</p>
                      {ref.doiUrl && (
                        <a
                          href={ref.doiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <span>{ref.doiUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Footer Action Bar */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              ResearchMate AI • Scientific Synthesis Agent • Epistemic Traceability Maintained
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
              >
                Copy Markdown
              </button>
              <button
                onClick={onExportTxt}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
              >
                Download .TXT Report
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};
