/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Search,
  Scale,
  FileCheck2,
  FolderArchive,
  PlusCircle,
  Sparkles,
  HelpCircle,
  Database,
  Trash2,
  BookmarkCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { ResearchSession } from '../types';

export type ActiveTab = 'formulate' | 'search' | 'compare' | 'report' | 'history';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentSession: ResearchSession;
  sessions: ResearchSession[];
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onLoadDemo: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenMethodology: () => void;
  onOpenSampleReport: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  currentSession,
  sessions,
  onSelectSession,
  onNewSession,
  onLoadDemo,
  onDeleteSession,
  onOpenMethodology,
  onOpenSampleReport,
}) => {
  const paperCount = currentSession.papers?.length || 0;
  const hasPlan = Boolean(currentSession.plan);
  const hasComparison = Boolean(currentSession.comparison);
  const hasReport = Boolean(currentSession.report);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 select-none">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-950/20">
            <BookOpen className="w-5 h-5 text-violet-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">ResearchMate</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 uppercase tracking-wide">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500">Academic Research Agent</p>
          </div>
        </div>

        {/* New Session & Demo Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onNewSession}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:shadow"
          >
            <PlusCircle className="w-4 h-4 text-violet-400" />
            <span>New Research Topic</span>
          </button>
          <button
            onClick={onLoadDemo}
            className="flex items-center justify-center gap-2 w-full py-1.5 px-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-medium border border-violet-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Load Demo Workspace</span>
          </button>
        </div>
      </div>

      {/* Navigation Steps */}
      <div className="px-3 py-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Research Pipeline
            </span>
            {currentSession.isDemo && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Demo
              </span>
            )}
          </div>

          <nav className="space-y-1">
            {/* Step 1: Formulate */}
            <button
              onClick={() => onTabChange('formulate')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'formulate'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    activeTab === 'formulate'
                      ? 'bg-violet-500 text-white'
                      : hasPlan
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {hasPlan ? '✓' : '1'}
                </span>
                <span>Topic & Objectives</span>
              </div>
              {hasPlan && (
                <CheckCircle className={`w-3.5 h-3.5 ${activeTab === 'formulate' ? 'text-violet-300' : 'text-emerald-500'}`} />
              )}
            </button>

            {/* Step 2: Search */}
            <button
              onClick={() => onTabChange('search')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    activeTab === 'search'
                      ? 'bg-violet-500 text-white'
                      : paperCount > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {paperCount > 0 ? '✓' : '2'}
                </span>
                <span>Literature Search</span>
              </div>
              {paperCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    activeTab === 'search' ? 'bg-slate-800 text-violet-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {paperCount} {paperCount === 1 ? 'paper' : 'papers'}
                </span>
              )}
            </button>

            {/* Step 3: Compare */}
            <button
              onClick={() => onTabChange('compare')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'compare'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    activeTab === 'compare'
                      ? 'bg-violet-500 text-white'
                      : hasComparison
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {hasComparison ? '✓' : '3'}
                </span>
                <span>Abstract Analysis</span>
              </div>
              {hasComparison && (
                <CheckCircle className={`w-3.5 h-3.5 ${activeTab === 'compare' ? 'text-violet-300' : 'text-emerald-500'}`} />
              )}
            </button>

            {/* Step 4: Report */}
            <button
              onClick={() => onTabChange('report')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'report'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    activeTab === 'report'
                      ? 'bg-violet-500 text-white'
                      : hasReport
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {hasReport ? '✓' : '4'}
                </span>
                <span>Research Report</span>
              </div>
              {hasReport && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    activeTab === 'report' ? 'bg-slate-800 text-violet-300' : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  Ready
                </span>
              )}
            </button>

            {/* Step 5: Sessions / History */}
            <button
              onClick={() => onTabChange('history')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderArchive className="w-4 h-4 text-slate-400" />
                <span>Saved Sessions</span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  activeTab === 'history' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sessions.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Recent Sessions Quick Access */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Inquiries
            </span>
          </div>
          <div className="space-y-1">
            {sessions.slice(0, 4).map((session) => {
              const isSelected = session.id === currentSession.id;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/70 border border-indigo-200 text-indigo-950 font-medium'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookmarkCheck className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{session.topic || session.title}</span>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      title="Delete session"
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info & Verification Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>OpenAlex & Crossref Live</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Gemini 3.8</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onOpenMethodology}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-indigo-600" />
            <span>Methodology</span>
          </button>
          <button
            onClick={onOpenSampleReport}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors"
          >
            <FileCheck2 className="w-3 h-3 text-violet-600" />
            <span>Sample TXT</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
