# ⚡ AI Proposal Generator — Unified Claude Codebase Context

This document is a comprehensive, high-fidelity developer context manual designed to be uploaded or pasted directly into **Claude** (or any other advanced AI coding assistant). It provides the complete system architecture, flow logic, component contracts, database schemas, and instructions on how to implement new features.

---

## 🌟 1. Core Platform Mission & Overview

The **AI Proposal Generator** is a premium corporate platform designed to turn vague, single-sentence requirements (e.g. "IoT underground mine safety") into beautiful, print-ready, multi-page consulting proposals.

### Key Problems Solved:
1. **Structural Formatting**: Solves the issue of LLMs writing generic, unstructured markdown by splitting the generation into two discrete stages: **Phase 1 (Structural Architect)** and **Phase 2 (Content Copywriter)**.
2. **Print Sizing & Layout Controls**: Prevents awkward line-wraps or blank spaces on paper pages using a **Page Density System** (estimated component heights, isolation thresholds, and underfill page merges).
3. **Responsive Aesthetics**: Utilizes 12 pre-built corporate themes and a dynamic white-mixing brand builder. Styles are injected dynamically on the client side using pure CSS variables and inline styles.

---

## 📂 2. Directory & Workspace Map

All core operations are encapsulated inside `src/`:

```
Proposal-Generation-Agent-main/Proposal-Generation-Agent-main/
├── docs/                             ← Detailed developer markdown deep-dives
├── firestore.rules                   ← Collection scoping & user access rules
├── firebase.json                     ← Vercel/Firebase settings
├── package.json                      ← React 18, Vite 6, Tailwind devDependencies
│
└── src/
    ├── App.jsx                       ← Root container with layouts & AuthGates
    ├── main.jsx                      ← React DOM entry mount
    ├── index.css                     ← Global styling override rules
    │
    ├── components/
    │   ├── registry.js               ← Maps visual component keys to React classes
    │   │
    │   ├── admin/
    │   │   └── AdminPanel.jsx        ← Back-office management tool for admins
    │   │
    │   ├── renderer/
    │   │   ├── ProposalDocument.jsx  ← Page loop, CSS variables injection
    │   │   ├── PageWrapper.jsx       ← A4 canvas, per-page refine click-overlay
    │   │   └── SectionRouter.jsx     ← Resolves component keys recursively
    │   │
    │   ├── proposal/                 ← 22 presentational UI components
    │   │   ├── CoverPage.jsx         ← Page 1 hero, executive summary card
    │   │   ├── FeatureCard.jsx       ← Grid cards with left-accent rules
    │   │   ├── StatCard.jsx          ...
    │   │   ├── DataTable.jsx         ...
    │   │   └── ContactFooter.jsx     ← Final page bottom block
    │   │
    │   └── ui/
    │       ├── PromptInput.jsx       ← Multiline chat textarea
    │       ├── ChatThread.jsx        ← Chat interface (bubbles, timestamps)
    │       ├── ThinkingPanel.jsx     ← Real-time CoT thought-stream list
    │       └── ThemePanel.jsx        ← Floating swapper (12 predefined layouts)
    │
    ├── context/
    │   ├── AuthContext.jsx           ← Scopes user login & admin access tokens
    │   ├── ProposalContext.jsx       ← Central engine state, chat & versions
    │   ├── ImageStore.jsx            ← Decoupled Base64 local image upload cache
    │   └── ImagePromptContext.jsx    ← Generates targeted Midjourney prompts
    │
    ├── engine/
    │   ├── proposalEngine.js         ← Planner, Writer, Refiner API pipeline
    │   └── geminiRefiner.js          ← Google Gemini pre-processor API
    │
    ├── themes/
    │   └── themes.js                 ← Predefined palettes & recolor utilities
    │
    └── utils/
        ├── firestoreStorage.js       ← Flat packing Firestore sync engine
        └── idbStorage.js             ← Offline IndexedDB backup storage
```

---

## 🏗️ 3. Software Architecture & Flow Pipelines

The application relies on four specialized operational data paths:

### Flow A: The Pre-Generation Requirements Chat
Before a proposal is built, a conversational requirement gathering phase can run:
1. User types in `PromptInput.jsx`.
2. `ProposalContext.jsx`'s `submitPrompt(text)` detects if no document exists yet.
3. Calls `proposalEngine.analyzeRequirementsChat(history)`.
4. If the AI replies with questions, they stream to `ChatThread.jsx`.
5. If the AI appends **`[READY_TO_GENERATE]`** to its response, `ProposalContext` automatically collects the entire chat history and starts the main generation engine.
6. **Shortcut Override**: If the user types "just generate" or "generate it", the engine bypasses questions and triggers execution immediately.

### Flow B: The Gemini Pre-Processor Refiner
If the user wants to refine their idea before execution:
1. Users enter a vague Problem Statement (PS) in `GemPromptPanel.jsx`.
2. `geminiRefiner.js` is triggered:
   - Communicates directly with the Google Gemini API.
   - Implements model fallback: tries `gemini-2.5-flash` ➔ `gemini-2.0-flash` ➔ `gemini-flash-latest`.
   - Incorporates a **2-second cool-down delay** if a 429 (Rate Limit) or 503 (Capacity) is encountered.
   - Outputs an expanded, highly structured 800+ word technical blueprint.

### Flow C: Two-Phase LLM Generation
When generation is triggered:
1. **Phase 1: Structural Planner**: Coordinates a prompt requesting a structural blueprint. The LLM streams **`THOUGHT:`** prefixed lines into `ThinkingPanel.jsx` to show real-time thinking. Returns a JSON outline mapping components to pages.
2. **Phase 2: Content Writer**: Takes the blueprint and writes copy. Maps correct props, selects semantic SVG icons, and ensures technical vocabulary accuracy.
3. **Post-Processing**: Coordinates height budgets, combines underfilled pages using the **40% Merge Rule**, and strips damaged tags.

### Flow D: Conversational & Targeted Refinement
Proposals can be refined in two ways post-generation:
1. **Conversational Document-Wide Refinement**: Users enter feedback in the chat. The context calls `proposalEngine.refineDocument(document, plan, chat, feedback)`. It returns a fully updated proposal and saves it as a new version node (e.g. `v2`, `v3`) in `documentVersions`.
2. **Targeted Single-Page Refinement**: Users hover over a page and click "Refine page". They submit a comment, triggering `proposalEngine.refinePageContent(doc, pageIndex, comment, plan)`. This updates only the targeted page, leaving the rest of the proposal unchanged.

---

## 🧩 4. Presentational Components & Sizing Specs

All components in `/proposal/` are presentational. They read style parameters via CSS variables.

### The Page Sizing & Slicing Algorithm
Standard A4 print templates are 210mm wide × 297mm high. To prevent text clipping during print, the engine assigns an estimated height weight to each component:

| Component Name | Height Weight | Max Per Page | Layout and Placement Boundaries |
| :--- | :--- | :--- | :--- |
| `CoverPage` | **100%** | 1 | Restricted to page 1, section 1. |
| `SectionHeader` | **12%** | 2 | Top of new content sections. |
| `ChallengeCard` | **18%** | 3 | Can be stacked or inside grid components. |
| `FeatureCard` | **14%** | 4 | Grid-friendly component. |
| `NumberedDeliverable` | **18%** | 3 | Full-width item; can wrap a BulletList. |
| `StatCard` | **12%** | 3 | Must sit inside a ThreeColumnGrid. |
| `DataTable` | **25%** | 2 | Displays comparing data grids. |
| `WorkflowStep` | **38%** | 1 | Stacked process workflow. |
| `QuoteCallout` | **12%** | 2 | Full-width callout panel. |
| `ImagePlaceholder` | **35%** | 1 | Max 3 per document; never 2 on a single page. |
| `ContactFooter` | **16%** | 1 | Last section on the final page of the document. |

### The Assembly Rules
- **50% Rule**: Any component $\ge 50\%$ height weight is isolated on its own page.
- **85% Ceiling**: Total component height per page must never exceed $85\%$. Anything higher forces a page break.
- **40% Merge**: Pages below $40\%$ space utilization are automatically combined with adjacent pages during post-processing.

---

## 🎨 5. Style & Theme Architecture

The system uses **12 predefined HSL color schemes** (defined in `themes.js`). 

### Dynamic Recoloring Utilities
1. **`recolorDocument(doc, newAccentColor)`**: Recursively walks the proposal JSON, replacing all colors with the selected accent, and background elements with the accent color appended with `'15'` (an 8% opacity tint). This allows live theme switching *after* generation.
2. **`buildThemeFromColors(primary, accent, dark)`**: Lightens base brand colors mathematically using a white-mixing function to calculate `bg` ($4\%$ color), `cardBg` ($8\%$ color), and `highlight` ($15\%$ color) values dynamically.

---

## 🗄️ 6. Data Storage & Serialization

The platform uses a hybrid storage architecture:

### Firebase/Firestore (Authenticated)
Firestore restricts documents to **1 MB**. The system divides data to stay within this limit:
- **Metadata Document** (`/users/{uid}/sessions/{sessionId}`): Contains only light details (id, title, pageCount, activeThemeName). Used for fast sidebar rendering.
- **Data Payload Document** (`/users/{uid}/sessionData/{sessionId}`): The large objects (`document`, `plan`, `versions`) are serialized using `JSON.stringify()` (packed) and saved in string fields (`documentJson`, `planJson`, `documentVersionsJson`). This keeps the Firestore schema flat and optimized.

### Local IndexedDB (Offline)
When offline, the system falls back to `idbStorage.js`. It writes full session payloads into a single local object store named `sessions` under the database `ProposalGeneratorDB`.

---

## 🛠️ 7. Core Developer Code Snippets

### A. The Components Router (`SectionRouter.jsx`)
```jsx
import { COMPONENT_REGISTRY } from './COMPONENT_REGISTRY';

export default function SectionRouter({ section }) {
  const { componentType, props = {}, children } = section;
  const Component = COMPONENT_REGISTRY[componentType];

  if (!Component) return null;

  if (componentType === 'TwoColumnGrid' || componentType === 'ThreeColumnGrid') {
    const renderedChildren = (props.children || []).map((child, i) => (
      <SectionRouter key={i} section={child} />
    ));
    return <Component {...props}>{renderedChildren}</Component>;
  }

  return <Component {...props} />;
}
```

### B. Core Proposal Engine Hook (`ProposalContext.jsx` slice)
```javascript
const executeGeneration = useCallback(async (promptContext) => {
  setIsLoading(true); setThoughts([]); setError(null);
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2,8)}`;
  setCurrentSessionId(newSessionId);

  try {
    const onThought = (t) => setThoughts(prev => [...prev, t]);
    const result = await proposalEngine.generateProposal(promptContext, onThought);
    setPlan(result.plan); setDocument(result.document);

    const { resolvedTheme, resolvedThemeName } = resolveThemeFromPlan(result.plan);
    setTheme(resolvedTheme); setActiveThemeName(resolvedThemeName);

    const now = Date.now();
    const version = {
      id: 'v1', document: result.document, plan: result.plan, theme: resolvedTheme, timestamp: now
    };
    setDocumentVersions([version]); setActiveVersionIndex(0);

    const sessionData = {
      id: newSessionId, title: result.document.meta?.companyName || 'Proposal', document: result.document,
      plan: result.plan, theme: resolvedTheme, documentVersions: [version], activeVersionIndex: 0
    };
    if (uid) await firestoreStorage.saveSession(uid, sessionData);
    loadSessionsList();
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}, [uid]);
```

---

## 🚀 8. How to Implement New Features (Instructions for Claude)

When the user asks you to implement a new feature, follow these guidelines:

### A. Adding a New Presentational Component
1. Create a new file in `src/components/proposal/` (e.g. `MyNewCard.jsx`).
2. Use **inline styles only**, consuming CSS variables like `var(--primary)`, `var(--text)`, or `var(--card-bg)`.
3. Export the component and register it in `src/components/registry.js`.
4. Document the component's estimated height weight. Update `proposalEngine.js` height configurations if needed.
5. In Phase 2 system instructions, update the prop reference list to let the copywriter LLM know how to map it.

### B. Adding a New Predefined Theme
1. Open `src/themes/themes.js`.
2. Add a new key to the `THEMES` dictionary containing primary, accent, dark, bg, cardBg, highlight, and text hex values.
3. Update `src/components/ui/ThemePanel.jsx` to render the new button option.
4. Update the Phase 1 Prompt instructions in the engine so the Architect LLM knows this new theme is an available option.

### C. Adding a New Field to the Firestore Payload
1. Open `src/utils/firestoreStorage.js`.
2. If it is lightweight metadata, add the field directly inside the `metaRef` save block.
3. If it is a heavy payload, pack it inside `dataRef` (`saveSession`) and unpack it inside `getSession` to ensure it stays below the 1 MB Firestore limit.
