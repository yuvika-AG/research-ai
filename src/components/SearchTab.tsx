/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  FileText,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Layers,
  Database,
} from 'lucide-react';
import { VerifiedPaper, SearchFilters } from '../types';

interface Props {
  papers: VerifiedPaper[];
  onSearch: (query: string, filters: SearchFilters) => Promise<void>;
  isLoading: boolean;
  activeQuery: string;
  onToggleSelectPaper: (id: string) => void;
  onSelectAllPapers: (selected: boolean) => void;
  onProceedToCompare: () => void;
  zeroResultsState?: {
    message: string;
    suggestedQueries?: string[];
  } | null;
}

export const SearchTab: React.FC<Props> = ({
  papers,
  onSearch,
  isLoading,
  activeQuery,
  onToggleSelectPaper,
  onSelectAllPapers,
  onProceedToCompare,
  zeroResultsState,
}) => {
  const [searchQuery, setSearchQuery] = useState(activeQuery);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const [fromYear, setFromYear] = useState<number | undefined>(2017);
  const [toYear, setToYear] = useState<number | undefined>(2026);
  const [isOpenAccessOnly, setIsOpenAccessOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'cited_by_count:desc' | 'publication_date:desc' | 'relevance_score:desc'>('cited_by_count:desc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    await onSearch(searchQuery.trim(), {
      fromYear,
      toYear,
      isOpenAccessOnly,
      sortBy,
    });
  };

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = papers.filter((p) => p.selected).length;
  const allSelected = papers.length > 0 && selectedCount === papers.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Stage Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Stage 2: Scholarly Literature Retrieval</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verified Scholarly Publications
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Query real, peer-reviewed literature indexed in OpenAlex and Crossref. Traceable DOIs and verified author records guaranteed.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Hallucination Retrieval</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Input Bar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic keywords, author, or research question..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showFilters || isOpenAccessOnly || fromYear !== 2017
                  ? 'bg-violet-50 border-violet-300 text-violet-800'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Querying Index...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Literature</span>
                </>
              )}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Publication Window</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={fromYear || ''}
                    onChange={(e) => setFromYear(Number(e.target.value) || undefined)}
                    placeholder="From"
                    className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="number"
                    value={toYear || ''}
                    onChange={(e) => setToYear(Number(e.target.value) || undefined)}
                    placeholder="To"
                    className="w-20 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Sort Order</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="cited_by_count:desc">Most Cited First (High Impact)</option>
                  <option value="publication_date:desc">Most Recent First</option>
                  <option value="relevance_score:desc">Relevance Match</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-center">
                <label className="font-semibold text-slate-700 block">Access Status</label>
                <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isOpenAccessOnly}
                    onChange={(e) => setIsOpenAccessOnly(e.target.checked)}
                    className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                  />
                  <span className="text-slate-700 font-medium">Open Access PDFs only</span>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Zero Results Handling (Behavioral Example 3) */}
      {zeroResultsState && papers.length === 0 && !isLoading && (
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-semibold text-amber-950 text-base">
                No Verified Scholarly Records Found
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {zeroResultsState.message ||
                  'No peer-reviewed papers matching your exact query criteria were indexed in OpenAlex or Crossref.'}
              </p>
              <div className="p-3 bg-white/70 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                <strong className="text-slate-900 block font-semibold">Epistemic Guarantee:</strong>
                <p>
                  ResearchMate AI <strong className="text-amber-900">will never fabricate citations</strong> or generate phantom references when literature does not exist. We maintain complete scientific honesty.
                </p>
              </div>
            </div>
          </div>

          {zeroResultsState.suggestedQueries && zeroResultsState.suggestedQueries.length > 0 && (
            <div className="pt-2 border-t border-amber-200/70">
              <span className="text-xs font-semibold text-amber-900 block mb-2">
                Recommended Query Adaptations & Broadened Keywords:
              </span>
              <div className="flex flex-wrap gap-2">
                {zeroResultsState.suggestedQueries.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(sug);
                      onSearch(sug, { fromYear, toYear, isOpenAccessOnly, sortBy });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-600" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Header with Selection Controls */}
      {papers.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectAllPapers(!allSelected)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    allSelected ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {allSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span>Select All ({papers.length})</span>
              </button>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-700">
                {selectedCount} of {papers.length} papers selected for synthesis
              </span>
            </div>

            {selectedCount > 0 && (
              <button
                onClick={onProceedToCompare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
              >
                <span>Compare Selected Abstracts ({selectedCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Papers Cards Grid */}
          <div className="space-y-3.5">
            {papers.map((paper) => {
              const isExpanded = Boolean(expandedAbstracts[paper.id]);
              return (
                <div
                  key={paper.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    paper.selected ? 'border-violet-300 ring-1 ring-violet-200' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={Boolean(paper.selected)}
                      onChange={() => onToggleSelectPaper(paper.id)}
                      className="w-4 h-4 mt-1 text-violet-600 rounded border-slate-300 focus:ring-violet-500 cursor-pointer"
                    />

                    {/* Paper Content */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified {paper.sourceName} Record</span>
                        </span>
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {paper.publicationYear}
                        </span>
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {paper.citedByCount.toLocaleString()} citations
                        </span>
                        {paper.isOpenAccess && (
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            Open Access
                          </span>
                        )}
                        <span className="text-slate-400 text-[10px]">
                          Retrieved: {new Date(paper.retrievalDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title & Journal */}
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 leading-snug group">
                          <a
                            href={paper.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 transition-colors inline-flex items-baseline gap-1"
                          >
                            <span>{paper.title}</span>
                            <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-60 group-hover:opacity-100" />
                          </a>
                        </h4>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-medium text-slate-800">
                            {paper.authors.length > 0 ? paper.authors.join(', ') : 'Authors unlisted in index'}
                          </span>
                          {paper.journalOrHost && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500 italic">{paper.journalOrHost}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Traceable DOI & PDF Outbound links */}
                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                        <a
                          href={paper.doiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>DOI: {paper.doi}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        {paper.pdfUrl && (
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-medium text-[11px]"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Direct PDF Link</span>
                          </a>
                        )}
                      </div>

                      {/* Abstract Snippet / Viewer */}
                      {paper.isAbstractAvailable ? (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                              <span>Author Abstract (Verified Record)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleAbstract(paper.id)}
                              className="text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1"
                            >
                              <span>{isExpanded ? 'Collapse' : 'Expand Abstract'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                          <p
                            className={`text-xs text-slate-600 leading-relaxed ${
                              isExpanded ? '' : 'line-clamp-2'
                            }`}
                          >
                            {paper.abstract}
                          </p>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                          Notice: Abstract text is not indexed in this record; title, citations, and metadata verified via {paper.sourceName}.
                        </div>
                      )}

                      {/* Concepts tags */}
                      {paper.concepts && paper.concepts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {paper.concepts.map((concept, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] border border-slate-200"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-950 text-sm">Next Step: Comparative Abstract Matrix</h4>
                <p className="text-xs text-indigo-700">
                  Analyze methodology, key findings, empirical limitations, and topical relevance for the {selectedCount} selected papers.
                </p>
              </div>
            </div>
            <button
              onClick={onProceedToCompare}
              disabled={selectedCount === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <span>Launch Comparative Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
