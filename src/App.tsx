/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { FormulateTab } from './components/FormulateTab';
import { SearchTab } from './components/SearchTab';
import { CompareTab } from './components/CompareTab';
import { ReportTab } from './components/ReportTab';
import { HistoryTab } from './components/HistoryTab';
import { MethodologyModal } from './components/MethodologyModal';
import { SampleReportModal } from './components/SampleReportModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  generateResearchPlan,
  searchScholarlyPapers,
  analyzePaperAbstracts,
  generateResearchReport,
  ApiError,
} from './services/api';
import { ILLUSTRATIVE_DEMO_SESSION } from './data/demoData';
import { ResearchSession, SearchFilters, VerifiedPaper } from './types';

const STORAGE_KEY = 'researchmate_sessions_v2';

function createInitialSession(): ResearchSession {
  return {
    id: `session-${Date.now()}`,
    title: 'New Research Inquiry',
    topic: 'AI for sustainable agriculture',
    fieldOfStudy: 'Agricultural & Environmental Engineering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    papers: [],
  };
}

export default function App() {
  const [sessions, setSessions] = useState<ResearchSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load sessions from storage', e);
    }
    return [ILLUSTRATIVE_DEMO_SESSION, createInitialSession()];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || ILLUSTRATIVE_DEMO_SESSION.id;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('formulate');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [zeroResultsState, setZeroResultsState] = useState<{ message: string; suggestedQueries?: string[] } | null>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to sync sessions to localStorage', err);
    }
  }, [sessions]);

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0] || ILLUSTRATIVE_DEMO_SESSION;

  const showToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const updateCurrentSession = (updater: (prev: ResearchSession) => ResearchSession) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          const updated = updater(s);
          return { ...updated, updatedAt: new Date().toISOString() };
        }
        return s;
      })
    );
  };

  // 1. Generate Research Plan
  const handleGeneratePlan = async (topic: string, fieldOfStudy: string, researchAngle?: string) => {
    setIsLoading(true);
    try {
      const plan = await generateResearchPlan(topic, fieldOfStudy, researchAngle);
      updateCurrentSession((prev) => ({
        ...prev,
        topic,
        fieldOfStudy,
        title: plan.refinedQuestion.slice(0, 75) + '...',
        plan,
      }));
      showToast('success', 'Research Plan Formulated', 'Academic question and 5-phase roadmap generated.');
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Plan Formulation Failed', err.details || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Search Scholarly Papers
  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setZeroResultsState(null);
    try {
      const result = await searchScholarlyPapers(query, filters);
      if (result.count === 0 || result.papers.length === 0) {
        setZeroResultsState({
          message: result.message || 'No verified scholarly records were found in OpenAlex or Crossref for this query.',
          suggestedQueries: result.suggestedQueries,
        });
        updateCurrentSession((prev) => ({
          ...prev,
          papers: [],
        }));
        showToast('info', 'No Verified Records Found', 'Displayed alternative queries without fabricating references.');
      } else {
        updateCurrentSession((prev) => ({
          ...prev,
          papers: result.papers,
        }));
        showToast('success', `${result.papers.length} Verified Papers Retrieved`, `Directly verified via ${result.sourceUsed || 'OpenAlex'}.`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Scholarly Search Error', err.details || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Compare Abstract Evidence
  const handleGenerateComparison = async () => {
    const selected = currentSession.papers.filter((p) => p.selected);
    if (selected.length === 0) {
      showToast('error', 'Selection Required', 'Please select at least one paper in Literature Search.');
      return;
    }
    setIsLoading(true);
    try {
      const comparison = await analyzePaperAbstracts(
        currentSession.plan?.refinedQuestion || currentSession.topic,
        selected
      );
      updateCurrentSession((prev) => ({
        ...prev,
        comparison,
      }));
      showToast('success', 'Comparative Matrix Created', 'Abstracts synthesized across methodology and limitations.');
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Comparison Analysis Failed', err.details || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Generate Research Report
  const handleGenerateReport = async () => {
    const selected = currentSession.papers.filter((p) => p.selected);
    if (selected.length === 0) {
      showToast('error', 'Selection Required', 'Please select at least one paper before generating the report.');
      return;
    }
    setIsLoading(true);
    try {
      const report = await generateResearchReport(
        currentSession.topic,
        currentSession.plan?.refinedQuestion || currentSession.topic,
        selected,
        currentSession.comparison
      );
      updateCurrentSession((prev) => ({
        ...prev,
        report,
      }));
      showToast('success', 'Academic Report Generated', 'Complete report synthesized with verified citations only.');
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Report Synthesis Failed', err.details || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to Search tab with prefilled query
  const handleProceedToSearch = (queryToSearch: string) => {
    setActiveTab('search');
    handleSearch(queryToSearch, {
      fromYear: 2017,
      toYear: 2026,
      sortBy: 'cited_by_count:desc',
    });
  };

  // New Session
  const handleNewSession = () => {
    const newSession = createInitialSession();
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('formulate');
    setZeroResultsState(null);
    showToast('info', 'New Inquiry Workspace Created');
  };

  // Load Demo
  const handleLoadDemo = () => {
    const existing = sessions.find((s) => s.id === ILLUSTRATIVE_DEMO_SESSION.id);
    if (!existing) {
      setSessions((prev) => [ILLUSTRATIVE_DEMO_SESSION, ...prev]);
    }
    setCurrentSessionId(ILLUSTRATIVE_DEMO_SESSION.id);
    setActiveTab('report');
    showToast('success', 'Illustrative Demo Dataset Loaded', 'Solar PV Forecasting case study active.');
  };

  // Delete Session
  const handleDeleteSession = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sessions.length <= 1) {
      showToast('info', 'Cannot Delete', 'At least one research workspace must remain.');
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setCurrentSessionId(remaining[0]?.id);
    }
    showToast('info', 'Session Removed');
  };

  // Clear all
  const handleClearAllSessions = () => {
    if (window.confirm('Are you sure you want to delete all saved sessions?')) {
      const initial = createInitialSession();
      setSessions([initial]);
      setCurrentSessionId(initial.id);
      setActiveTab('formulate');
      showToast('info', 'All Sessions Cleared');
    }
  };

  // Export TXT
  const handleExportTxt = (targetSession: ResearchSession = currentSession) => {
    const r = targetSession.report;
    const txtContent = `================================================================================
RESEARCHMATE AI - SCHOLARLY RESEARCH REPORT
================================================================================
TOPIC: ${targetSession.topic}
FIELD OF STUDY: ${targetSession.fieldOfStudy || 'Interdisciplinary'}
REFINED QUESTION: ${targetSession.plan?.refinedQuestion || targetSession.topic}
DATE OF SYNTHESIS: ${new Date(targetSession.updatedAt).toLocaleDateString()}
ANALYSIS BOUNDARY: Abstract-based literature synthesis. Verified citations only.
================================================================================

TITLE:
${r?.title || targetSession.title}

1. ABSTRACT:
${r?.abstract || 'Report not yet generated.'}

2. INTRODUCTION & RESEARCH QUESTION:
${r?.introduction || targetSession.plan?.questionRationale || 'N/A'}

3. LITERATURE REVIEW (VERIFIED ABSTRACTS SYNTHESIS):
${r?.literatureReview || 'N/A'}

4. METHODOLOGICAL PROPOSALS:
${r?.methodologySuggestions?.map((m, i) => `${i + 1}. ${m}`).join('\n') || targetSession.plan?.suggestedMethodologies?.join('\n') || 'N/A'}

5. DISCUSSION & TENTATIVE GAPS:
${r?.discussion || 'N/A'}

TENTATIVE RESEARCH GAPS (HYPOTHESES, NOT FACTS):
${r?.potentialGaps?.map((g, i) => `[Gap ${i + 1}] ${g.title}\n- Hypothesis: ${g.hypothesis}\n- Reasoning: ${g.reasoning}\n- Verification Protocol: ${g.suggestedVerificationApproach}`).join('\n\n') || 'N/A'}

6. LIMITATIONS:
${r?.limitations || 'Notice: Analysis is strictly abstract-based: full texts were not examined.'}

7. CONCLUSION:
${r?.conclusion || 'N/A'}

8. VERIFIED REFERENCES (ALL SOURCES TRACEABLE VIA REGISTERED DOI):
${r?.references?.map((ref, i) => `${i + 1}. ${ref.fullCitation}\n   DOI: ${ref.doiUrl}`).join('\n\n') || targetSession.papers?.map((p, i) => `${i + 1}. ${p.authors.join(', ')} (${p.publicationYear}). ${p.title}. DOI: ${p.doiUrl}`).join('\n\n') || 'No verified citations recorded.'}
================================================================================
END OF RESEARCHMATE AI REPORT
================================================================================
`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResearchMate_${targetSession.topic.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'TXT Report Exported');
  };

  // Export JSON
  const handleExportJson = (targetSession: ResearchSession = currentSession) => {
    const jsonString = JSON.stringify(targetSession, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResearchMate_${targetSession.topic.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'JSON Session Exported');
  };

  // Copy Full Markdown
  const handleCopyAll = () => {
    const md = `# ${currentSession.report?.title || currentSession.topic}

**Topic:** ${currentSession.topic}
**Field of Study:** ${currentSession.fieldOfStudy}
**Refined Question:** ${currentSession.plan?.refinedQuestion || 'N/A'}

---

## Objectives
${currentSession.plan?.objectives?.map((o, i) => `${i + 1}. ${o}`).join('\n') || 'N/A'}

---

## Verified Scholarly Papers (${currentSession.papers?.length || 0})
${currentSession.papers?.map((p, i) => `### ${i + 1}. ${p.title}
- **Authors:** ${p.authors.join(', ')} (${p.publicationYear})
- **DOI:** ${p.doiUrl}
- **Source:** ${p.sourceName} (Verified)
- **Citations:** ${p.citedByCount}
- **Abstract Summary:** ${p.abstract ? p.abstract.slice(0, 300) + '...' : 'Abstract not available'}
`).join('\n\n') || 'No papers retrieved.'}

---

## Synthesis & Report
${currentSession.report?.abstract || ''}
${currentSession.report?.literatureReview || ''}
`;
    navigator.clipboard.writeText(md);
    showToast('success', 'Session Copied to Clipboard');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentSession={currentSession}
        sessions={sessions}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setZeroResultsState(null);
        }}
        onNewSession={handleNewSession}
        onLoadDemo={handleLoadDemo}
        onDeleteSession={handleDeleteSession}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenSampleReport={() => setIsSampleReportOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          session={currentSession}
          onExportTxt={() => handleExportTxt(currentSession)}
          onExportJson={() => handleExportJson(currentSession)}
          onCopyAll={handleCopyAll}
          onOpenMethodology={() => setIsMethodologyOpen(true)}
        />

        {/* Workspace Tab View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'formulate' && (
            <FormulateTab
              topic={currentSession.topic}
              fieldOfStudy={currentSession.fieldOfStudy}
              onUpdateTopic={(t, f) => {
                updateCurrentSession((prev) => ({ ...prev, topic: t, fieldOfStudy: f }));
              }}
              plan={currentSession.plan}
              onGeneratePlan={handleGeneratePlan}
              isLoading={isLoading}
              onProceedToSearch={handleProceedToSearch}
              onShowNotice={(title, desc) => showToast('info', title, desc)}
            />
          )}

          {activeTab === 'search' && (
            <SearchTab
              papers={currentSession.papers || []}
              onSearch={(q, filters) => handleSearch(q, filters)}
              isLoading={isLoading}
              activeQuery={currentSession.plan?.keywords?.[0] || currentSession.topic}
              onToggleSelectPaper={(paperId) => {
                updateCurrentSession((prev) => ({
                  ...prev,
                  papers: prev.papers.map((p) => (p.id === paperId ? { ...p, selected: !p.selected } : p)),
                }));
              }}
              onSelectAllPapers={(selected) => {
                updateCurrentSession((prev) => ({
                  ...prev,
                  papers: prev.papers.map((p) => ({ ...p, selected })),
                }));
              }}
              onProceedToCompare={() => {
                setActiveTab('compare');
                if (!currentSession.comparison) {
                  handleGenerateComparison();
                }
              }}
              zeroResultsState={zeroResultsState}
            />
          )}

          {activeTab === 'compare' && (
            <CompareTab
              comparison={currentSession.comparison}
              papers={currentSession.papers || []}
              researchQuestion={currentSession.plan?.refinedQuestion || currentSession.topic}
              onGenerateComparison={handleGenerateComparison}
              isLoading={isLoading}
              onProceedToReport={() => {
                setActiveTab('report');
                if (!currentSession.report) {
                  handleGenerateReport();
                }
              }}
            />
          )}

          {activeTab === 'report' && (
            <ReportTab
              report={currentSession.report}
              papers={currentSession.papers || []}
              topic={currentSession.topic}
              researchQuestion={currentSession.plan?.refinedQuestion || currentSession.topic}
              comparison={currentSession.comparison}
              onGenerateReport={handleGenerateReport}
              isLoading={isLoading}
              onExportTxt={() => handleExportTxt(currentSession)}
              onExportJson={() => handleExportJson(currentSession)}
              onShowNotice={(title, desc) => showToast('info', title, desc)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab
              sessions={sessions}
              currentSessionId={currentSession.id}
              onSelectSession={(id) => setCurrentSessionId(id)}
              onDeleteSession={(id) => handleDeleteSession(id)}
              onExportSessionJson={handleExportJson}
              onExportSessionTxt={handleExportTxt}
              onImportSessionJson={(imported) => {
                setSessions((prev) => [imported, ...prev]);
                setCurrentSessionId(imported.id);
                setActiveTab('report');
              }}
              onClearAllSessions={handleClearAllSessions}
              onLoadDemo={handleLoadDemo}
              onShowNotice={(title, desc) => showToast('info', title, desc)}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <MethodologyModal isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
      <SampleReportModal
        isOpen={isSampleReportOpen}
        onClose={() => setIsSampleReportOpen(false)}
        onCopyNotice={() => showToast('success', 'Sample Report Copied')}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
