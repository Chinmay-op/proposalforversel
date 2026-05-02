# Product Requirements Document
## AI Proposal Generator — Antigravity Framework
**Version:** 1.0 | **Date:** 2026-03-31 | **Owner:** Sateroid Innovations Pvt. Ltd.

---

## 1. Executive Summary

The AI Proposal Generator is a React application built on the **Antigravity** component framework. A user submits a natural-language prompt and the system returns a fully-rendered, A4-printable, multi-page professional proposal document. Every generation is **unique** — different layout, tone, colour theme, and copy — driven by a two-phase **CoT + ReAct reasoning pipeline**.

Reference quality bar: **TerraTrack™ Underground RTLS** — 10 pages, multiple image placeholders, rich typography, coloured icon cards, numbered deliverables, branded footer. Every output must match or exceed that standard.

---

## 2. Goals & Non-Goals

### Goals
- Accept any domain prompt → return a 7–10 page professional proposal.
- Visible CoT reasoning trace (Thinking Panel) streamed in real time.
- Render proposals using exclusively pre-built Antigravity components.
- PDF export via `window.print()` targeting A4.
- Clickable image placeholders → user uploads real photo.
- Every run produces visually distinct output (theme, layout, copy angle).

### Non-Goals (v1)
- Real-time collaboration, auth, backend persistence, custom logo upload.

---

## 3. User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|----------|
| US-01 | Sales consultant | Type a prompt → get a proposal in <90 s | Pitch without writing a doc from scratch |
| US-02 | Designer | See colourful, premium component layouts | Output feels human-designed, not AI-generic |
| US-03 | Business owner | Upload real photos into placeholders | Final PDF looks customised |
| US-04 | Presenter | Click Export PDF | Clean, UI-free A4 document |
| US-05 | Power user | Watch the AI's reasoning trace | Trust the output; debug bad results |
| US-06 | Developer | Submit a detailed multi-section prompt | AI respects explicit page-by-page instructions |

---

## 4. Functional Requirements

### 4.1 Prompt Input
- Multiline textarea (min 3 rows); "Generate" button disabled while loading.
- Loading spinner + phase status message ("Analysing domain…", "Writing copy…").
- Example prompts shown as placeholder when empty.

### 4.2 CoT + ReAct Reasoning Engine (Two-Phase LLM)

#### Phase 1 — Proposal Architect
The LLM outputs explicit THOUGHT lines before producing JSON:

```
THOUGHT: What is the primary domain and industry?
THOUGHT: What is the core problem this solution solves?
THOUGHT: What tone is best — formal, startup, or technical?
THOUGHT: Which colour theme fits — TechBlue / MedTeal / EarthGreen / UrbanSlate / StartupViolet?
THOUGHT: How many pages are needed (target 7–10)?
THOUGHT: What is the most compelling cover tagline (≤12 words)?
THOUGHT: What 3 challenge cards best frame the problem?
THOUGHT: Does the architecture section use numbered workflow or feature cards?
THOUGHT: Features section — 2-column for long copy or 3-column for short?
THOUGHT: Does the value section need StatCards, benefit cards, or both?
THOUGHT: Where should the 2–3 image placeholders go (cover always first)?
THOUGHT: What are the 3–4 deliverables for scope of work?
THOUGHT: What should the CTA / next steps say?
THOUGHT: Which sections benefit from a QuoteCallout for emotional punch?
THOUGHT: Should an About / Credentials section be included?
THOUGHT: Does this domain warrant a LargeQuoteHero (e.g. "Stop guessing. Start controlling.")?
THOUGHT: Which sections need a PageFooterBar and what text should it show?
```

Output: raw JSON only. Fields: `domain`, `theme`, `tone`, `pageCount`, `coverTagline`, `imagePlacements[]`, `sections[]`, `reasoning_trace[]`.

#### Phase 2 — Proposal Copywriter
Injects Phase 1 plan → generates full `document` JSON:
- `meta`: title, tagline, companyName, theme, proposalDate.
- `pages[]`: each page → `pageId`, `pageType` (cover/content/closing), `sections[]`.
- Each section → `componentType` (exact Antigravity name) + `props{}`.

### 4.3 Rendering Engine
- `ProposalDocument` maps `pages[]` → `PageWrapper` → `SectionRouter`.
- `SectionRouter` resolves `componentType` against `COMPONENT_REGISTRY`; unknown types silently skipped.
- CSS variables injected from selected THEME object at `ProposalDocument` root.
- `PageWrapper` = 210 mm × min-height 297 mm, `pageBreakAfter: always`.

### 4.4 Image Placeholders
- Max **3** per document; **never 2 on the same page**.
- Cover page always has exactly 1 at `id: "cover-hero"` (16:9 ratio).
- Click → hidden `<input type="file">` → FileReader → base64 → `ImageStore` context.
- Rendered as `<img style="object-fit:cover">` once uploaded.
- Dashed border + upload icon shown before upload.

### 4.5 PDF Export
- `window.print()` triggered by Export button.
- `@media print` hides: header, prompt panel, thinking panel, export button.
- `@page { size: A4; margin: 0; }`.
- `-webkit-print-color-adjust: exact` on all elements.

### 4.6 Thinking Panel
- Streams each THOUGHT line as it arrives.
- Phase 1 and Phase 2 clearly labelled with coloured dots.
- Collapsible. Auto-scrolls to latest entry.

### 4.7 Error Handling
- JSON parse failure → error card with "Retry" button.
- API error → friendly message.
- Unknown `componentType` → SectionRouter skips silently, logs warning.

---

## 5. Component Catalogue (20 Antigravity Components)

The LLM selects **only** from these. No invented component names accepted.

| # | Name | Description | Allowed Placement |
|---|------|-------------|-------------------|
| 01 | `CoverPage` | Badge + company name + logo area + giant title + tagline + DividerStrip + ImagePlaceholder(16:9) + ExecutiveSummary card | pages[0].sections[0] only |
| 02 | `SectionHeader` | Section label (e.g. SECTION 01) + large heading + subheading + optional DividerStrip | First section of any content page |
| 03 | `ChallengeCard` | 40px icon square + title 18px bold + body 14px. Variants: `outlined` (white bg), `filled` (tinted bg) | Stacked full-width or TwoColumnGrid |
| 04 | `FeatureCard` | 44px icon circle + title + body + optional 3px left-accent bar | TwoColumnGrid or ThreeColumnGrid |
| 05 | `NumberedDeliverable` | 48px number circle + title + body + optional bullet list. Variants: `numbered`, `arrow` | Stacked full-width |
| 06 | `StatCard` | 48px bold metric in accent colour + label + body. Light tinted bg, centred | ThreeColumnGrid only |
| 07 | `QuoteCallout` | 3px left border in accent + italic quote text 16px | Full-width only |
| 08 | `ImagePlaceholder` | Dashed border → real image after upload. Props: id (unique), label, aspectRatio, rounded | Full-width; max 3 per doc; max 1 per page |
| 09 | `TwoColumnGrid` | Equal 2-col CSS grid, 16px gap, renders children via SectionRouter | Layout wrapper |
| 10 | `ThreeColumnGrid` | Equal 3-col CSS grid, 16px gap | Layout wrapper |
| 11 | `WorkflowStep` | Numbered circles (accent bg) connected by dotted vertical line + title + description | Full-width stacked |
| 12 | `TagBadge` | Pill badge. Sizes: sm / md. Props: text, color, textColor | Inline inside any card |
| 13 | `ContactFooter` | Left: company name + tagline; Right: phone + email + website with icons. Variants: dark (navy bg) / light | Last section of last page only |
| 14 | `DividerStrip` | Coloured bar. Variants: `short` (60px × 4px) or `full` (100% × 1px) | Between sections |
| 15 | `SectionCalloutBox` | Full-width card: 40px icon square left + title + body right. NEVER inside a grid | Full-width only |
| 16 | `CredentialCard` | Icon + bold title + optional TagBadge + body paragraph + optional `highlightBox` (nested bold-italic block) + optional url | Stacked or TwoColumnGrid |
| 17 | `PageFooterBar` | "PROPOSAL NAME · PAGE XX" — fixed to bottom of each page | Per-page, last item in page.sections |
| 18 | `BiometricMiniCard` | Small icon (emoji or SVG path) + bold label + caption text | ThreeColumnGrid only |
| 19 | `LargeQuoteHero` | Centred 2-line statement: line1 light grey large, line2 bold accent large. No background. | Full-width only |
| 20 | `BulletList` | Chevron or checkmark prefixed list items. Props: items[], iconStyle | Full-width or inside NumberedDeliverable |

---

## 6. Theme System

| Theme | Primary | Accent | Dark | Use Case |
|-------|---------|--------|------|----------|
| `TechBlue` | `#1A56DB` | `#06B6D4` | `#1E3A5F` | IoT / SaaS / AI / Software |
| `MedTeal` | `#0E7490` | `#10B981` | `#164E63` | Healthcare / Pharma / Biotech |
| `EarthGreen` | `#166534` | `#D97706` | `#14532D` | Agriculture / Mining / Environment |
| `UrbanSlate` | `#334155` | `#3B82F6` | `#0F172A` | Smart City / Infrastructure / Gov |
| `StartupViolet` | `#7C3AED` | `#F43F5E` | `#4C1D95` | Startup / EdTech / FinTech |

CSS variables injected: `--primary`, `--accent`, `--dark`, `--bg`, `--card-bg`, `--highlight`, `--text`, `--muted`, `--divider`.

---

## 7. LLM Hard Rules

1. `componentType` must exactly match COMPONENT_REGISTRY key or it is silently skipped.
2. `pages[0].sections[0].componentType` must always be `"CoverPage"`.
3. Last section of last page must always be `"ContactFooter"`.
4. `imagePlacements[]` must start with `"cover"`, max 3 total, no two on the same page.
5. `SectionCalloutBox` must NEVER appear as a child inside TwoColumnGrid or ThreeColumnGrid.
6. `reasoning_trace[]` must have ≥15 items.
7. `pageCount` must be 7–10.
8. Every `ImagePlaceholder` must have a globally unique `id`.
9. On JSON parse failure: show error + retry; never partially render.
10. Temperature 0.7 ensures uniqueness across repeated runs.

---

## 8. Acceptance Criteria

| AC | Criterion |
|----|-----------|
| AC-01 | Prompt "Generate proposal for underground mining RTLS" → ≥7 pages, TerraTrack-quality |
| AC-02 | Cover always has one clickable image placeholder |
| AC-03 | ≤3 image placeholders; no two on same page |
| AC-04 | Same prompt twice → visually different theme/layout/copy |
| AC-05 | Export PDF → clean A4, no UI chrome visible |
| AC-06 | Clicking placeholder + uploading image → placeholder replaced |
| AC-07 | Thinking Panel shows ≥15 THOUGHT lines across both phases |
| AC-08 | Unknown componentType → no crash, only silent skip |
| AC-09 | All 5 themes correctly inject CSS variables |
| AC-10 | PageFooterBar shows correct page number on every page |
| AC-11 | Detailed Hydro-Guard style prompt → page-by-page structure respected |
