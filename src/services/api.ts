/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResearchPlan, VerifiedPaper, ComparisonMatrix, ResearchReport, SearchFilters } from '../types';

export class ApiError extends Error {
  details?: string;
  constructor(message: string, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

export async function generateResearchPlan(
  topic: string,
  fieldOfStudy?: string,
  researchAngle?: string
): Promise<ResearchPlan> {
  const res = await fetch('/api/gemini/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, fieldOfStudy, researchAngle }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ApiError(data.error || 'Failed to generate research plan', data.details);
  }
  return data.plan;
}

export async function searchScholarlyPapers(
  query: string,
  filters?: SearchFilters
): Promise<{
  count: number;
  papers: VerifiedPaper[];
  message?: string;
  suggestedQueries?: string[];
  sourceUsed?: string;
  retrievalDate?: string;
}> {
  const params = new URLSearchParams();
  params.set('q', query);
  if (filters?.fromYear) params.set('fromYear', String(filters.fromYear));
  if (filters?.toYear) params.set('toYear', String(filters.toYear));
  if (filters?.isOpenAccessOnly) params.set('oa', 'true');
  if (filters?.sortBy) params.set('sort', filters.sortBy);

  const res = await fetch(`/api/papers/search?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(data.error || 'Scholarly database search failed', data.details);
  }
  return data;
}

export async function analyzePaperAbstracts(
  researchQuestion: string,
  papers: VerifiedPaper[]
): Promise<ComparisonMatrix> {
  const res = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ researchQuestion, papers }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ApiError(data.error || 'Abstract comparative analysis failed', data.details);
  }
  return data.comparison;
}

export async function generateResearchReport(
  topic: string,
  researchQuestion: string,
  papers: VerifiedPaper[],
  comparison?: ComparisonMatrix
): Promise<ResearchReport> {
  const res = await fetch('/api/gemini/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, researchQuestion, papers, comparison }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ApiError(data.error || 'Research report generation failed', data.details);
  }
  return data.report;
}
