# High-Level Architecture
## AI Proposal Generator — Antigravity Framework
**Version:** 1.0 | **Date:** 2026-03-31

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (React SPA)                         │
│                                                                     │
│  ┌───────────────────┐          ┌───────────────────────────────┐   │
│  │    UI SHELL        │          │    PROPOSAL CANVAS            │   │
│  │                   │          │                               │   │
│  │  PromptInput      │          │  ProposalDocument             │   │
│  │  ThinkingPanel    │          │    └─ PageWrapper × N         │   │
│  │  ExportButton     │          │         └─ SectionRouter      │   │
│  │  Header           │          │              └─ Component      │   │
│  └────────┬──────────┘          └───────────────────────────────┘   │
│           │                                      ▲                  │
│           ▼                                      │                  │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │               ProposalContext (Global State)               │     │
│  │  { document, plan, theme, isLoading, error, thoughts }     │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
│                            │                                        │
│                            ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                  proposalEngine.js                         │     │
│  │   Phase 1: Architect  →  Phase 2: Copywriter               │     │
│  └─────────────────────────┬──────────────────────────────────┘     │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │  HTTPS POST
                             ▼
              ┌──────────────────────────┐
              │   Anthropic Claude API   │
              │  /v1/messages            │
              │  model: claude-sonnet-4  │
              └──────────────────────────┘
```

---

## Layer Descriptions

### 1. UI Shell (Left Panel, 380px)
- **PromptInput** — textarea + Generate button + loading state.
- **ThinkingPanel** — streams THOUGHT lines as they arrive; phase labels; collapsible.
- **ExportButton** — calls `window.print()`; hidden during print.
- **Header** — app title, export button.

### 2. Proposal Canvas (Right Panel, flex-1)
- **ProposalDocument** — reads from `ProposalContext`, injects CSS variables, maps pages.
- **PageWrapper** — 210 mm × 297 mm container, `pageBreakAfter: always`.
- **SectionRouter** — resolves `componentType` → Antigravity component via `COMPONENT_REGISTRY`. Handles recursive grid children.
- **20 Antigravity Components** — pure presentational, inline styles, CSS variables for theming.

### 3. Context & State
- **ProposalContext** — `document`, `plan`, `theme`, `isLoading`, `error`, `thoughts[]`.
- **ImageStore** — map of `imageId → base64DataURL`; updated by ImagePlaceholder click-upload.

### 4. Engine Layer
- **proposalEngine.js** — orchestrates two LLM calls, streams thoughts via `onThought` callback, returns parsed document JSON.

### 5. External API
- **Anthropic Claude API** (`/v1/messages`) — Phase 1 produces plan JSON, Phase 2 produces document JSON.

### 6. Theme System
- **themes.js** — exports 5 theme objects. ProposalContext resolves theme name → object. Unknown theme name → TechBlue fallback.

### 7. Print System
- **print.css** — `@media print` rules that hide UI, set `@page A4`, force colour printing.

---

## Data Flow (Happy Path)

```
User types prompt
       │
       ▼
PromptInput.handleGenerate()
       │
       ▼
ProposalContext.generateProposal(prompt)
       │
       ├─── sets isLoading = true, thoughts = []
       │
       ▼
proposalEngine.generateProposal(prompt, onThought)
       │
       ├─── PHASE 1: POST /v1/messages (Architect system prompt)
       │         ├── streams THOUGHT lines → onThought() → ThinkingPanel updates
       │         └── parses JSON plan from response
       │
       ├─── PHASE 2: POST /v1/messages (Copywriter system prompt + plan)
       │         ├── streams THOUGHT lines → onThought()
       │         └── parses JSON document from response
       │
       └─── returns { plan, document }
                │
                ▼
       ProposalContext updates:
         plan, document, theme, isLoading=false
                │
                ▼
       ProposalDocument re-renders
         → PageWrapper × pageCount
           → SectionRouter × sections
             → Antigravity Component
```

---

## Component Resolution Flow

```
SectionRouter receives { componentType: "FeatureCard", props: {...} }
       │
       ▼
COMPONENT_REGISTRY["FeatureCard"] → FeatureCard React component
       │
       ├── found → <FeatureCard {...props} />
       └── not found → console.warn("Unknown: FeatureCard") → return null
```

---

## Image Upload Flow

```
User clicks ImagePlaceholder
       │
       ▼
Hidden <input type="file"> triggered
       │
       ▼
FileReader.readAsDataURL(file)
       │
       ▼
ImageStore.uploadImage(id, dataURL)
       │
       ▼
ImagePlaceholder re-renders → <img src={dataURL} />
```

---

## Print Flow

```
User clicks Export PDF
       │
       ▼
ExportButton → window.print()
       │
       ▼
@media print CSS activates:
  - display:none on .ui-shell, .thinking-panel, header, .export-button
  - @page { size: A4; margin: 0; }
  - .page-wrapper { pageBreakAfter: always; width: 210mm; }
  - all elements: -webkit-print-color-adjust: exact
```

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Two-phase LLM calls | Phase 1 plans the structure (CoT); Phase 2 writes copy. Separating concerns improves quality and makes reasoning visible. |
| COMPONENT_REGISTRY | Single source of truth. Prevents hallucinated component names from crashing the renderer. |
| CSS Variables for theming | All 20 components read `var(--primary)` etc. Switching theme = re-injecting one style object. No component re-authoring needed. |
| Inline styles inside components | Avoids Tailwind purge issues for dynamically-named classes; keeps components truly self-contained. |
| ImageStore context | Decouples upload logic from render logic. Any component can read an image by ID. |
| window.print() for PDF | Zero dependency; leverages browser's native print-to-PDF. @media print gives full control. |
| temperature: 0.7 | Ensures every run has distinct copy, layout choices, and phrasing even for identical prompts. |
