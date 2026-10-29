/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  Search,
  BookOpen,
  Layers,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { ResearchPlan } from '../types';

interface Props {
  topic: string;
  fieldOfStudy: string;
  onUpdateTopic: (topic: string, field: string) => void;
  plan?: ResearchPlan;
  onGeneratePlan: (topic: string, field: string, angle?: string) => Promise<void>;
  isLoading: boolean;
  onProceedToSearch: (queryToSearch: string) => void;
  onShowNotice: (title: string, desc?: string) => void;
}

const SAMPLE_TOPICS = [
  {
    title: 'AI for sustainable agriculture',
    field: 'Agricultural & Environmental Engineering',
    tag: 'Example 1',
  },
  {
    title: 'Renewable energy forecasting',
    field: 'Energy Systems & Computer Science',
    tag: 'Example 2',
  },
  {
    title: 'a topic with no available results (e.g. quantum-banana bio-teleportation)',
    field: 'Hypothetical / Zero-Record Benchmark',
    tag: 'Example 3',
  },
  {
    title: 'Transformer attention computational complexity',
    field: 'Computer Science & NLP',
    tag: 'Machine Learning',
  },
  {
    title: 'Marine bacterial microplastic biodegradation',
    field: 'Environmental Biotechnology',
    tag: 'Biomedical',
  },
];

const FIELDS_OF_STUDY = [
  'Computer Science & Artificial Intelligence',
  'Agricultural & Environmental Sciences',
  'Energy Systems & Electrical Engineering',
  'Biomedical Engineering & Medicine',
  'Environmental Science & Ecology',
  'Economics & Quantitative Social Sciences',
  'Physics & Materials Science',
  'Interdisciplinary Studies',
];

export const FormulateTab: React.FC<Props> = ({
  topic,
  fieldOfStudy,
  onUpdateTopic,
  plan,
  onGeneratePlan,
  isLoading,
  onProceedToSearch,
  onShowNotice,
}) => {
  const [inputTopic, setInputTopic] = useState(topic);
  const [selectedField, setSelectedField] = useState(fieldOfStudy || FIELDS_OF_STUDY[0]);
  const [researchAngle, setResearchAngle] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTopic.trim()) return;
    onUpdateTopic(inputTopic.trim(), selectedField);
    await onGeneratePlan(inputTopic.trim(), selectedField, researchAngle);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_TOPICS)[0]) => {
    setInputTopic(sample.title);
    setSelectedField(sample.field);
    onUpdateTopic(sample.title, sample.field);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowNotice('Copied to clipboard', text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Intro */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <Compass className="w-4 h-4" />
          <span>Stage 1: Formulation & Scoping</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Refine Research Topic & Formulate Objectives
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Input your initial exploratory research idea. ResearchMate AI uses domain-grounded prompt patterns to transform broad questions into publication-grade, answerable academic research questions with clear empirical objectives and structured phases.
        </p>
      </div>

      {/* Input Formulation Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Research Topic or Exploratory Idea <span className="text-violet-600">*</span>
              </label>
              <input
                id="topic-input"
                type="text"
                value={inputTopic}
                onChange={(e) => setInputTopic(e.target.value)}
                placeholder="e.g. AI for sustainable agriculture, Renewable energy forecasting..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="field-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Field of Study (Optional)
              </label>
              <select
                id="field-select"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm text-slate-900 bg-white"
              >
                {FIELDS_OF_STUDY.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="angle-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Specific Research Angle or Constraints (Optional)
            </label>
            <input
              id="angle-input"
              type="text"
              value={researchAngle}
              onChange={(e) => setResearchAngle(e.target.value)}
              placeholder="e.g. Focus on short-term horizons, compare deep learning vs numerical models, emphasize water conservation..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500 text-xs text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Sample Topic Chips */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested Benchmark Topics (Few-Shot Guidance Examples):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TOPICS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-900 text-slate-700 transition-colors"
                >
                  <span className="font-semibold text-violet-600">[{sample.tag}]</span>
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !inputTopic.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Academic Framework...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Generate Refined Question & Research Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Plan Section */}
      {plan && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Refined Question Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-200 border border-violet-400/30">
                  Refined Academic Question
                </span>
                <span className="text-xs text-slate-400">Publication Grade</span>
              </div>
              <button
                onClick={() => copyToClipboard(plan.refinedQuestion, 'refinedQuestion')}
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                {copiedKey === 'refinedQuestion' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'refinedQuestion' ? 'Copied' : 'Copy Question'}</span>
              </button>
            </div>
            <h3 className="text-xl font-serif font-medium leading-relaxed tracking-wide text-indigo-50">
              "{plan.refinedQuestion}"
            </h3>
            {plan.questionRationale && (
              <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-white/10 leading-relaxed">
                <strong className="text-violet-300">Rationale:</strong> {plan.questionRationale}
              </p>
            )}
          </div>

          {/* Objectives & Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objectives */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Specific Research Objectives</span>
                </div>
                <span className="text-xs text-slate-500">{plan.objectives?.length || 0} aims</span>
              </div>
              <ul className="space-y-3">
                {plan.objectives?.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Generated Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <Search className="w-4 h-4 text-violet-600" />
                  <span>Scholarly Search Keywords</span>
                </div>
                <span className="text-xs text-slate-500">Ready for OpenAlex</span>
              </div>
              <p className="text-xs text-slate-500">
                Click any keyword phrase to execute an instant verified paper search:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {plan.keywords?.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => onProceedToSearch(kw)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 text-xs font-medium text-slate-800 transition-colors"
                  >
                    <Search className="w-3 h-3 text-slate-400 group-hover:text-violet-600" />
                    <span>{kw}</span>
                  </button>
                ))}
              </div>

              {plan.suggestedMethodologies && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Suggested Methodological Paradigms
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {plan.suggestedMethodologies.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Structured Research Plan Roadmap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Structured 5-Phase Research Roadmap</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {plan.phases?.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md inline-block">
                      Phase {phase.phaseNumber}
                    </span>
                    <h5 className="font-semibold text-slate-900 text-xs leading-snug">{phase.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{phase.description}</p>
                  </div>
                  {phase.deliverables && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">Deliverable:</span> {phase.deliverables.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Proceed Next Step Action */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-950 text-sm">Next Step: Query Verified Scholarly Literature</h4>
                <p className="text-xs text-indigo-700">
                  Search OpenAlex and Crossref for genuine peer-reviewed publications using the formulated keywords.
                </p>
              </div>
            </div>
            <button
              onClick={() => onProceedToSearch(plan.keywords?.[0] || inputTopic)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <span>Search Literature</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
