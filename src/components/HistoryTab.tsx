/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  FolderArchive,
  Download,
  Upload,
  Trash2,
  BookmarkCheck,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  Sparkles,
  CheckCircle2,
  Code,
} from 'lucide-react';
import { ResearchSession } from '../types';

interface Props {
  sessions: ResearchSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onExportSessionJson: (session: ResearchSession) => void;
  onExportSessionTxt: (session: ResearchSession) => void;
  onImportSessionJson: (imported: ResearchSession) => void;
  onClearAllSessions: () => void;
  onLoadDemo: () => void;
  onShowNotice: (title: string, desc?: string) => void;
}

export const HistoryTab: React.FC<Props> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onExportSessionJson,
  onExportSessionTxt,
  onImportSessionJson,
  onClearAllSessions,
  onLoadDemo,
  onShowNotice,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.topic) {
          onImportSessionJson(parsed);
          onShowNotice('Session Imported', `Loaded research on "${parsed.topic}"`);
        } else {
          onShowNotice('Import Error', 'Invalid ResearchMate AI session JSON schema.');
        }
      } catch (err) {
        onShowNotice('Import Error', 'Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalPapers = sessions.reduce((acc, s) => acc + (s.papers?.length || 0), 0);
  const totalReports = sessions.filter((s) => s.report).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Stage Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-violet-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <FolderArchive className="w-4 h-4 text-slate-600" />
          <span>Stage 5: Research Sessions & Data Export</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Saved Research Sessions
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Access previous research inquiries, reload sessions, export complete structured JSON records, and manage backups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            {sessions.length > 1 && (
              <button
                onClick={onClearAllSessions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Active & Saved Inquiries</span>
          <div className="text-2xl font-bold text-slate-900">{sessions.length}</div>
          <p className="text-[11px] text-slate-400">Stored in browser local storage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Total Verified Papers Retrieved</span>
          <div className="text-2xl font-bold text-emerald-700">{totalPapers}</div>
          <p className="text-[11px] text-slate-400">Indexed via OpenAlex & Crossref</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Generated Research Reports</span>
          <div className="text-2xl font-bold text-violet-700">{totalReports}</div>
          <p className="text-[11px] text-slate-400">Synthesized academic manuscripts</p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Research Sessions Catalog</h3>

        <div className="space-y-3">
          {sessions.map((session) => {
            const isCurrent = session.id === currentSessionId;
            return (
              <div
                key={session.id}
                className={`p-5 rounded-2xl border transition-all bg-white shadow-xs ${
                  isCurrent
                    ? 'border-indigo-400 ring-1 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-base truncate">
                        {session.topic || session.title}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          Active Session
                        </span>
                      )}
                      {session.isDemo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Illustrative Demo
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {session.fieldOfStudy ? `${session.fieldOfStudy} • ` : ''}
                      Last updated: {new Date(session.updatedAt || session.createdAt).toLocaleDateString()}
                    </p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                      <span className={`px-2 py-0.5 rounded-md font-medium ${session.plan ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                        {session.plan ? '✓ Research Plan Formulated' : 'No Plan'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-medium ${session.papers?.length ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}>
                        {session.papers?.length ? `${session.papers.length} Verified Papers` : '0 Papers'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-medium ${session.comparison ? 'bg-violet-50 text-violet-800 border border-violet-200' : 'bg-slate-100 text-slate-500'}`}>
                        {session.comparison ? '✓ Comparative Matrix' : 'No Matrix'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-medium ${session.report ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold' : 'bg-slate-100 text-slate-500'}`}>
                        {session.report ? '✓ Report Complete' : 'Report Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onExportSessionTxt(session)}
                      title="Download as TXT"
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => onExportSessionJson(session)}
                      title="Export as JSON"
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-indigo-700 text-xs font-medium transition-colors"
                    >
                      <Code className="w-4 h-4 text-indigo-600" />
                    </button>
                    {!isCurrent && (
                      <button
                        onClick={() => onSelectSession(session.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {sessions.length > 1 && (
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
