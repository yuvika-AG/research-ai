/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResearchPlan {
  refinedQuestion: string;
  questionRationale: string;
  objectives: string[];
  keywords: string[];
  phases: {
    phaseNumber: number;
    title: string;
    description: string;
    deliverables: string[];
  }[];
  suggestedMethodologies: string[];
}

export interface VerifiedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
  journalOrHost?: string;
  doi: string;
  doiUrl: string;
  citedByCount: number;
  isOpenAccess: boolean;
  pdfUrl?: string;
  abstract: string;
  isAbstractAvailable: boolean;
  sourceName: 'OpenAlex' | 'Crossref' | 'Scholarly Index';
  retrievalDate: string;
  concepts?: string[];
  selected?: boolean;
}

export interface PaperComparisonItem {
  paperId: string;
  paperTitle: string;
  authors: string;
  year: number;
  doiUrl: string;
  methodology: string;
  keyFindings: string;
  limitations: string;
  relevanceToQuestion: string;
}

export interface ComparisonMatrix {
  isAbstractBased: boolean;
  summaryNote: string;
  items: PaperComparisonItem[];
  commonalities: string[];
  divergences: string[];
  evidenceSufficiencyNotice: string;
}

export interface ResearchGap {
  id: string;
  title: string;
  hypothesis: string;
  reasoning: string;
  suggestedVerificationApproach: string;
}

export interface ResearchReport {
  title: string;
  abstract: string;
  introduction: string;
  literatureReview: string;
  methodologySuggestions: string[];
  discussion: string;
  limitations: string;
  conclusion: string;
  potentialGaps: ResearchGap[];
  references: {
    citationKey: string;
    fullCitation: string;
    doi: string;
    doiUrl: string;
  }[];
  generatedAt: string;
  isAbstractBasedOnly: boolean;
  provenanceSummary: string;
}

export interface ResearchSession {
  id: string;
  title: string;
  topic: string;
  fieldOfStudy: string;
  createdAt: string;
  updatedAt: string;
  plan?: ResearchPlan;
  papers: VerifiedPaper[];
  comparison?: ComparisonMatrix;
  report?: ResearchReport;
  isDemo?: boolean;
}

export interface SearchFilters {
  fromYear?: number;
  toYear?: number;
  isOpenAccessOnly?: boolean;
  sortBy?: 'cited_by_count:desc' | 'publication_date:desc' | 'relevance_score:desc';
}
