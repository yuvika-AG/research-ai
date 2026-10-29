# ResearchMate AI 🎓🔬

> **An AI Research Paper Agent for Students, Academics, and Scientists.**
> Grounded in real scholarly literature, free of fabricated citations, and architected with strict epistemic integrity.

[![Live Applet](https://img.shields.io/badge/Platform-Google%20AI%20Studio-blue)](https://ai.google.dev)
[![Engine](https://img.shields.io/badge/Model-Gemini%203.8%20Flash-violet)](https://ai.google.dev)
[![Scholarly Index](https://img.shields.io/badge/Literature-OpenAlex%20%7C%20Crossref-emerald)](https://openalex.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-slate)](LICENSE)

---

## 📌 Project Overview

**ResearchMate AI** is a full-stack, publication-grade academic research assistant engineered to eliminate the severe risks of AI hallucination in literature reviews and research proposals.

Standard commercial language models frequently invent fake journal citations, fabricate nonexistent DOIs, and misattribute empirical findings. **ResearchMate AI guarantees academic provenance** by:
1. Connecting directly to the **OpenAlex** global bibliographic index (>250M works) and **Crossref**.
2. Restricting evidence synthesis exclusively to **published author abstracts**.
3. Clearly distinguishing **verified facts** from **AI-generated formulation suggestions**.
4. Framing all identified research gaps as **tentative, testable hypotheses** rather than established facts.
5. Honoring **zero-result queries** without hallucinating citations when literature does not exist.

---

## 🚀 Key Features

### 1. Research Topic Refinement & Objective Scoping
- Takes exploratory ideas and fields of study (e.g., Computer Science, Agriculture, Renewable Energy, Medicine, Environmental Science).
- Leverages server-side **Gemini 3.8 Flash** with structured JSON output schemas to formulate a publication-grade, answerable academic research question with clear rationale.
- Generates 3–4 concrete research objectives, scholarly search keywords, and a structured 5-phase research roadmap.

### 2. Live Scholarly Literature Search & DOI Verification
- Executes real-time REST queries against the **OpenAlex API** with automatic fallback to **Crossref**.
- Dynamically reconstructs abstract text from `abstract_inverted_index` word token arrays.
- Surfaces verified author rosters, publication year, citation counts, open-access status, and direct clickable `https://doi.org/...` links.
- Employs exponential backoff retry (`fetchWithRetry`) to gracefully handle rate limits and transient network latency.

### 3. Abstract-Based Comparative Evidence Matrix
- Synthesizes retrieved papers side-by-side across:
  - **Methodology** (experimental setup, dataset scale, algorithm architecture).
  - **Key Findings** (quantified accuracy, metrics, reported savings).
  - **Reported Limitations** (untested conditions, sample constraints).
  - **Relevance to Inquiry** (direct alignment with user's research question).
- Mandatory Epistemic Banner: Declares that analysis is abstract-based and full paywalled manuscripts were not examined.
- Evaluates cross-study commonalities and methodological trade-offs.

### 4. Academic Research Report Generation
- Synthesizes a structured academic manuscript:
  - **Title & Abstract**
  - **Introduction & Problem Formulation**
  - **Literature Review** (citing only verified sources with in-text keys)
  - **Methodology Suggestions** for future empirical testing
  - **Discussion & Synthesis**
  - **Limitations Notice** (declaring abstract-only boundaries)
  - **Conclusion & Forward Agenda**
  - **Verified Bibliographic References** (with authentic DOIs)
- Formulates potential research gaps strictly as **tentative hypotheses** with proposed verification approaches.

### 5. Multi-Format Export & Session Management
- Automatically saves research sessions to browser storage (`localStorage`).
- Copy full report or plan as clean Markdown with one click.
- Download formatted **`.TXT`** research report.
- Export complete structured session records as **`.JSON`** files.
- Includes a built-in, clearly labelled **Illustrative Demo Workspace** (`solar-forecasting`) based on peer-reviewed papers from *Applied Energy* and *Renewable Energy*.

---

## 🧠 Few-Shot Prompting & Behavioral Guidance

ResearchMate AI implements the behavioral rules specified in [`prompts.json`](./prompts.json):

| Example | Input Topic | Governed Agent Behavior |
| :--- | :--- | :--- |
| **Example 1** | *AI for sustainable agriculture* | Suggests a focused question on machine learning-based automated irrigation recommendations and freshwater conservation; queries real OpenAlex records; summarizes only reported water savings present in abstracts. |
| **Example 2** | *Renewable energy forecasting* | Refines inquiry to short-term (1-6 hours ahead) solar PV generation forecasting comparing hybrid deep learning (CNN-LSTM) with numerical weather prediction; verifies citations with traceable DOIs; states when evidence is insufficient in abstract. |
| **Example 3** | *A topic with no available results* | When the catalog yields 0 records, the agent **never fabricates citations or invents papers**. It explicitly states zero records were found, provides query expansion guidance, and preserves scientific truth. |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Client                        │
│  React 19 + TypeScript + Vite + Tailwind CSS (Port 3000)    │
│  • FormulateTab     • SearchTab        • CompareTab         │
│  • ReportTab        • HistoryTab       • MethodologyModal   │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON API Requests (/api/*)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Backend (server.ts)                 │
│  • Secure server-side environment variables (GEMINI_API_KEY)│
│  • Vite dev middleware mounted                              │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│  ▼                           ▼                              ▼
│  Gemini 3.8 Flash SDK        OpenAlex API (v2)              Crossref REST API
│  • Question refinement       • Real-time works query        • Verified fallback
│  • Comparative matrix        • Abstract reconstruction      • DOI resolution
│  • Academic report synthesis • Citation count & OA status   • Author metadata
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
├── .env.example              # Environment variables template (GEMINI_API_KEY)
├── .gitignore                # Git ignore rules protecting keys and builds
├── index.html                # HTML entry point with synchronized metadata
├── metadata.json             # AI Studio metadata & server-side Gemini capability
├── package.json              # Node dependencies and full-stack scripts
├── prompts.json              # System instruction and few-shot examples (1, 2, 3)
├── research_report.txt       # Clearly labelled illustrative sample report
├── server.ts                 # Full-stack Express server with Gemini & OpenAlex APIs
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
└── src/
    ├── App.tsx               # Primary React state coordinator & tab router
    ├── index.css             # Tailwind CSS imports
    ├── main.tsx              # DOM mounting entry point
    ├── types/
    │   └── index.ts          # TypeScript domain interfaces
    ├── data/
    │   └── demoData.ts       # Illustrative demo dataset (Solar PV Forecasting)
    ├── services/
    │   └── api.ts            # Typed client API service for /api/* endpoints
    └── components/
        ├── Header.tsx        # Top navigation and export actions
        ├── Sidebar.tsx       # Research pipeline navigation & session list
        ├── FormulateTab.tsx  # Topic input, sample chips, and 5-phase plan
        ├── SearchTab.tsx     # Verified OpenAlex paper search with filters
        ├── CompareTab.tsx    # Abstract comparative evidence matrix
        ├── ReportTab.tsx     # Full academic report viewer with APA citations
        ├── HistoryTab.tsx    # Session manager, JSON/TXT import/export
        ├── MethodologyModal.tsx # Epistemic protocol & anti-hallucination modal
        ├── SampleReportModal.tsx# Formatted research_report.txt viewer
        └── Toast.tsx         # Notification toast container
```

---

## 🛠️ Setup & Local Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/researchmate-ai.git
cd researchmate-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is set to your Gemini API key in `.env`:
```env
GEMINI_API_KEY="AIzaSy..."
USER_EMAIL="your_email@domain.com"
```
*(In Google AI Studio Build, the `GEMINI_API_KEY` is automatically injected into the server runtime via the Settings > Secrets panel.)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ⚠️ Epistemic Boundaries & Scientific Limitations

1. **Abstract-Based Scope:** Unless an open-access full-text manuscript is downloaded and provided, the literature review and comparative matrix are based solely on published author abstracts indexed in OpenAlex/Crossref. Specific hyperparameter settings, proprietary dataset specifics, or unstated training runtimes may exist in full texts but are declared unverified.
2. **Tentative Gap Framing:** Research gaps identified by the agent are hypotheses derived from reported limitations, not confirmed consensus. Researchers must validate them through independent empirical studies.
3. **Scholarly Catalog Coverage:** While OpenAlex indexes over 250 million publications, preprint servers or very newly released articles (< 48 hours) might experience indexation delay.

---

## 📜 License

Licensed under the Apache License, Version 2.0. See LICENSE for details.
