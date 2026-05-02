# Low-Level Architecture
## AI Proposal Generator — Antigravity Framework
**Version:** 1.0 | **Date:** 2026-03-31

---

## 1. Directory Structure

```
antigravity/
├── public/
├── src/
│   ├── components/
│   │   ├── antigravity/              ← 20 pre-built proposal components
│   │   │   ├── CoverPage.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── ChallengeCard.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── NumberedDeliverable.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── QuoteCallout.jsx
│   │   │   ├── ImagePlaceholder.jsx
│   │   │   ├── TwoColumnGrid.jsx
│   │   │   ├── ThreeColumnGrid.jsx
│   │   │   ├── WorkflowStep.jsx
│   │   │   ├── TagBadge.jsx
│   │   │   ├── ContactFooter.jsx
│   │   │   ├── DividerStrip.jsx
│   │   │   ├── SectionCalloutBox.jsx
│   │   │   ├── CredentialCard.jsx
│   │   │   ├── PageFooterBar.jsx
│   │   │   ├── BiometricMiniCard.jsx
│   │   │   ├── LargeQuoteHero.jsx
│   │   │   └── BulletList.jsx
│   │   ├── renderer/
│   │   │   ├── ProposalDocument.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   ├── SectionRouter.jsx
│   │   │   └── COMPONENT_REGISTRY.js
│   │   └── ui/
│   │       ├── PromptInput.jsx
│   │       ├── ThinkingPanel.jsx
│   │       └── ExportButton.jsx
│   ├── context/
│   │   ├── ProposalContext.jsx
│   │   └── ImageStore.jsx
│   ├── engine/
│   │   ├── proposalEngine.js
│   │   ├── phase1Prompt.js
│   │   └── phase2Prompt.js
│   ├── themes/
│   │   └── themes.js
│   ├── styles/
│   │   └── print.css
│   └── App.jsx
├── .env
├── .env.example
├── package.json
└── vite.config.js
```

---

## 2. Engine Layer

### 2.1 `proposalEngine.js`

```js
// Pseudo-code — implement in full
export async function generateProposal(prompt, onThought) {

  // ── PHASE 1 ──────────────────────────────────────────────────────
  onThought({ phase: 1, text: "Analysing domain and structure…" });

  const phase1Response = await callClaude({
    system: PHASE1_SYSTEM_PROMPT,
    user: prompt,
    max_tokens: 3000,
    temperature: 0.7,
  });

  // Extract THOUGHT lines and stream to UI
  const thoughtLines = extractThoughts(phase1Response);
  thoughtLines.forEach(t => onThought({ phase: 1, text: t }));

  // Strip thoughts, parse JSON plan
  const planJSON = extractJSON(phase1Response);
  const plan = JSON.parse(planJSON);        // throws on invalid JSON → caller catches

  // ── PHASE 2 ──────────────────────────────────────────────────────
  onThought({ phase: 2, text: "Writing proposal copy…" });

  const phase2System = buildPhase2System(plan);
  const phase2User = `Here is the proposal plan:\n${planJSON}\n\nGenerate the complete document now. Output only valid raw JSON, no markdown fences.`;

  const phase2Response = await callClaude({
    system: phase2System,
    user: phase2User,
    max_tokens: 6000,
    temperature: 0.7,
  });

  const thought2Lines = extractThoughts(phase2Response);
  thought2Lines.forEach(t => onThought({ phase: 2, text: t }));

  const documentJSON = extractJSON(phase2Response);
  const document = JSON.parse(documentJSON);   // throws on invalid JSON

  return { plan, document };
}

async function callClaude({ system, user, max_tokens, temperature }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      temperature,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

function extractThoughts(text) {
  return text
    .split("\n")
    .filter(l => l.trim().startsWith("THOUGHT:"))
    .map(l => l.replace("THOUGHT:", "").trim());
}

function extractJSON(text) {
  // Strip markdown fences if present
  return text
    .replace(/```json[\s\S]*?```/g, m => m.slice(7, -3))
    .replace(/```/g, "")
    .trim()
    // Extract the first { } block
    .match(/\{[\s\S]*\}/)?.[0] ?? text.trim();
}
```

### 2.2 `phase1Prompt.js` — Phase 1 System Prompt

```
You are an expert proposal architect. When given a topic, reason step by step using the ReAct framework before producing a plan.

Think through each question explicitly using lines starting with THOUGHT:

THOUGHT: What is the primary domain and industry?
THOUGHT: What is the core problem this solution solves?
THOUGHT: What tone is best — formal, startup, or technical?
THOUGHT: Which theme fits — TechBlue (IoT/SaaS/AI/Software), MedTeal (Healthcare/Pharma/Biotech), EarthGreen (Agriculture/Mining/Environment), UrbanSlate (Smart City/Infrastructure/Government), StartupViolet (Startup/EdTech/FinTech)?
THOUGHT: How many pages are needed (target 7–10, never fewer than 7)?
THOUGHT: What is the most compelling cover tagline in ≤12 words?
THOUGHT: What 3 challenge cards best frame the problem?
THOUGHT: Does the architecture section use a numbered WorkflowStep or FeatureCards with an image?
THOUGHT: Features section — TwoColumnGrid for long descriptions or ThreeColumnGrid for short?
THOUGHT: Does the value section need StatCards, benefit cards, or both?
THOUGHT: Where should the 2–3 ImagePlaceholders go (cover always first; never 2 on same page)?
THOUGHT: What are the 3–4 deliverables for scope of work?
THOUGHT: What should the CTA and next steps say?
THOUGHT: Which sections benefit from a QuoteCallout for emotional impact?
THOUGHT: Should a LargeQuoteHero be used for the value section?
THOUGHT: Is a CredentialCard / About section warranted for this domain?
THOUGHT: What icon SVG paths (Heroicons 24px style) best match the domain?

After ALL thoughts output ONLY a valid JSON object with NO markdown fences, NO explanation, NO backticks.

JSON schema:
{
  "domain": string,
  "tone": "formal" | "startup" | "technical",
  "theme": "TechBlue" | "MedTeal" | "EarthGreen" | "UrbanSlate" | "StartupViolet",
  "pageCount": number (7–10),
  "coverTagline": string (≤12 words),
  "imagePlacements": string[] (starts with "cover", max 3, no 2 on same page),
  "sections": [
    {
      "id": string (slug),
      "pageNumber": number (1-based),
      "label": string (e.g. "SECTION 01"),
      "heading": string,
      "subheading": string,
      "primaryComponent": string (exact Antigravity component name),
      "layout": "full-width" | "two-column" | "three-column" | "stacked",
      "itemCount": number,
      "needsImage": boolean,
      "imagePlacementId": string | null,
      "colorAccent": string (hex)
    }
  ],
  "reasoning_trace": string[] (all THOUGHT strings, ≥15 items)
}

STRICT RULES:
- sections[0] must always have id "cover" and primaryComponent "CoverPage"
- Last section must always have primaryComponent "ContactFooter"
- primaryComponent must be exactly one of: CoverPage, SectionHeader, ChallengeCard, FeatureCard, NumberedDeliverable, StatCard, QuoteCallout, ImagePlaceholder, TwoColumnGrid, ThreeColumnGrid, WorkflowStep, TagBadge, ContactFooter, DividerStrip, SectionCalloutBox, CredentialCard, PageFooterBar, BiometricMiniCard, LargeQuoteHero, BulletList
- imagePlacements must start with "cover" and have max 3 items
- SectionCalloutBox must NEVER appear inside a grid
- reasoning_trace must have ≥15 items
- Output raw JSON only, no markdown
```

### 2.3 `phase2Prompt.js` — Phase 2 System Prompt Builder

```js
export function buildPhase2System(plan) {
  return `
You are a world-class proposal copywriter. Using the plan in the user message, generate a complete proposal document as JSON.

WRITING RULES:
- Write compelling, domain-authentic copy throughout. Zero generic filler.
- Use real-sounding metrics: e.g. "reduces response time from 47 min to 4 min".
- Every ChallengeCard, FeatureCard, SectionCalloutBox needs an icon as SVG path string (24×24 Heroicons/Lucide style).
- StatCards: 3 impactful metrics relevant to the domain.
- Include one QuoteCallout per document — a powerful italic summary statement.
- Use ImagePlaceholder where needsImage is true; give each a descriptive label.
- Use the theme accent color consistently in all accentColor props.
- Make output unique — even for repeated domains, vary the angle, stats, and phrasing.
- ContactFooter must be the last section of the last page.
- Include PageFooterBar as the final section in EVERY page's sections array.

COMPONENT PROP REFERENCE:
CoverPage: { badgeText, companyName, title, tagline, dividerColor, imageId, executiveSummary }
SectionHeader: { sectionLabel, heading, subheading, accentColor, showDivider }
ChallengeCard: { icon, iconBg, iconColor, title, body, variant ("outlined"|"filled") }
FeatureCard: { icon, iconBg, iconColor, title, body, showBorder, accentColor }
SectionCalloutBox: { icon, iconBg, title, body, accentColor }
NumberedDeliverable: { number, title, body, bullets, variant ("numbered"|"arrow"), accentColor }
StatCard: { metric, label, body, accentColor, cardBg }
WorkflowStep: { steps: [{stepNumber, title, description}], accentColor, variant }
QuoteCallout: { quote, accentColor }
ImagePlaceholder: { id, label, aspectRatio ("16/9"|"4/3"|"1/1"), rounded }
TwoColumnGrid: { children: [{componentType, props}] }
ThreeColumnGrid: { children: [{componentType, props}] }
TagBadge: { text, color, textColor, size ("sm"|"md") }
CredentialCard: { icon, title, badge, body, url, highlightBox, accentColor }
ContactFooter: { companyName, phone, email, website, darkBg, tagline }
DividerStrip: { variant ("short"|"full"), color }
PageFooterBar: { proposalName, pageNumber, totalPages, accentColor }
BiometricMiniCard: { icon, label, caption }
LargeQuoteHero: { line1, line2, accentColor }
BulletList: { items: string[], iconStyle ("chevron"|"check"), accentColor }

ICON SVG PATHS (use or adapt):
- warning: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.95 3.374h14.71c1.733 0 2.813-1.874 1.95-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
- check-circle: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10.812C3 16.68 6.31 21.53 12 23c5.691-1.47 9-6.32 9-12.188 0-1.506-.232-2.963-.598-4.381L12 2.714z"
- bar-chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
- shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
- wifi: "M1.41421 8.58579C4.65857 5.34143 9.09378 3.5 12.5 3.5C15.9062 3.5 20.3414 5.34143 23.5858 8.58579L21.4645 10.7071C18.781 8.02368 15.7062 6.5 12.5 6.5C9.29378 6.5 6.21896 8.02368 3.53553 10.7071L1.41421 8.58579Z"

OUTPUT: Raw JSON only, no markdown, no backticks, no preamble.
Structure:
{
  "meta": { "title", "tagline", "companyName", "proposalType", "date", "theme" },
  "pages": [
    {
      "pageId": string,
      "pageType": "cover" | "content" | "closing",
      "sections": [
        { "componentType": string, "props": {} }
      ]
    }
  ]
}
`;
}
```

---

## 3. Renderer Layer

### 3.1 `COMPONENT_REGISTRY.js`

```js
import CoverPage from '../antigravity/CoverPage';
import SectionHeader from '../antigravity/SectionHeader';
import ChallengeCard from '../antigravity/ChallengeCard';
import FeatureCard from '../antigravity/FeatureCard';
import NumberedDeliverable from '../antigravity/NumberedDeliverable';
import StatCard from '../antigravity/StatCard';
import QuoteCallout from '../antigravity/QuoteCallout';
import ImagePlaceholder from '../antigravity/ImagePlaceholder';
import TwoColumnGrid from '../antigravity/TwoColumnGrid';
import ThreeColumnGrid from '../antigravity/ThreeColumnGrid';
import WorkflowStep from '../antigravity/WorkflowStep';
import TagBadge from '../antigravity/TagBadge';
import ContactFooter from '../antigravity/ContactFooter';
import DividerStrip from '../antigravity/DividerStrip';
import SectionCalloutBox from '../antigravity/SectionCalloutBox';
import CredentialCard from '../antigravity/CredentialCard';
import PageFooterBar from '../antigravity/PageFooterBar';
import BiometricMiniCard from '../antigravity/BiometricMiniCard';
import LargeQuoteHero from '../antigravity/LargeQuoteHero';
import BulletList from '../antigravity/BulletList';

export const COMPONENT_REGISTRY = {
  CoverPage,
  SectionHeader,
  ChallengeCard,
  FeatureCard,
  NumberedDeliverable,
  StatCard,
  QuoteCallout,
  ImagePlaceholder,
  TwoColumnGrid,
  ThreeColumnGrid,
  WorkflowStep,
  TagBadge,
  ContactFooter,
  DividerStrip,
  SectionCalloutBox,
  CredentialCard,
  PageFooterBar,
  BiometricMiniCard,
  LargeQuoteHero,
  BulletList,
};
```

### 3.2 `SectionRouter.jsx`

```jsx
import { COMPONENT_REGISTRY } from './COMPONENT_REGISTRY';

export default function SectionRouter({ section }) {
  const { componentType, props = {}, children } = section;
  const Component = COMPONENT_REGISTRY[componentType];

  if (!Component) {
    console.warn(`[SectionRouter] Unknown componentType: "${componentType}" — skipping.`);
    return null;
  }

  // Grid components need to recursively render their children
  if (componentType === 'TwoColumnGrid' || componentType === 'ThreeColumnGrid') {
    const renderedChildren = (props.children || []).map((child, i) => (
      <SectionRouter key={i} section={child} />
    ));
    return <Component {...props}>{renderedChildren}</Component>;
  }

  return <Component {...props} />;
}
```

### 3.3 `PageWrapper.jsx`

```jsx
export default function PageWrapper({ page, theme, pageNumber, totalPages }) {
  return (
    <div
      className="page-wrapper"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        backgroundColor: theme.bg,
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {page.sections.map((section, i) => (
        <SectionRouter key={i} section={section} />
      ))}
    </div>
  );
}
```

### 3.4 `ProposalDocument.jsx`

```jsx
import { useContext } from 'react';
import { ProposalContext } from '../../context/ProposalContext';
import { THEMES } from '../../themes/themes';
import PageWrapper from './PageWrapper';

export default function ProposalDocument() {
  const { document, theme: themeName } = useContext(ProposalContext);
  const theme = THEMES[themeName] || THEMES.TechBlue;

  if (!document) return <EmptyState />;

  const cssVars = {
    '--primary': theme.primary,
    '--accent': theme.accent,
    '--dark': theme.dark,
    '--bg': theme.bg,
    '--card-bg': theme.cardBg,
    '--highlight': theme.highlight,
    '--text': theme.text,
    '--muted': theme.mutedText,
    '--divider': theme.divider,
  };

  return (
    <div style={cssVars}>
      {document.pages.map((page, i) => (
        <PageWrapper
          key={page.pageId}
          page={page}
          theme={theme}
          pageNumber={i + 1}
          totalPages={document.pages.length}
        />
      ))}
    </div>
  );
}
```

---

## 4. Context Layer

### 4.1 `ProposalContext.jsx`

```jsx
const ProposalContext = createContext();

export function ProposalProvider({ children }) {
  const [document, setDocument] = useState(null);
  const [plan, setPlan] = useState(null);
  const [theme, setTheme] = useState('TechBlue');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thoughts, setThoughts] = useState([]);

  async function generateProposal(prompt) {
    setIsLoading(true);
    setError(null);
    setThoughts([]);
    setDocument(null);

    try {
      const { plan, document } = await proposalEngine.generateProposal(
        prompt,
        (thought) => setThoughts(prev => [...prev, thought])
      );
      setPlan(plan);
      setTheme(plan.theme || 'TechBlue');
      setDocument(document);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ProposalContext.Provider value={{ document, plan, theme, isLoading, error, thoughts, generateProposal }}>
      {children}
    </ProposalContext.Provider>
  );
}
```

### 4.2 `ImageStore.jsx`

```jsx
const ImageStoreContext = createContext();

export function ImageStoreProvider({ children }) {
  const [images, setImages] = useState({});  // { [id]: base64DataURL }

  function uploadImage(id, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages(prev => ({ ...prev, [id]: e.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function getImage(id) {
    return images[id] || null;
  }

  return (
    <ImageStoreContext.Provider value={{ uploadImage, getImage }}>
      {children}
    </ImageStoreContext.Provider>
  );
}
```

---

## 5. Antigravity Component Specs

### `CoverPage.jsx`
```
Layout (top to bottom):
  Row: badgeText (11px small-caps, letter-spacing 2px) — left  |  companyName (12px bold) — right
  Title: 48–56px bold, near-black, font-family serif-ish or heavy sans
  Tagline: 20px, color var(--muted)
  DividerStrip: 60px × 4px, color var(--accent)
  ImagePlaceholder: 100% width, aspectRatio 16/9, id=imageId
  ExecutiveSummaryCard:
    background: var(--card-bg)
    border-radius: 12px
    padding: 20px 24px
    Label: "⚡ EXECUTIVE SUMMARY" 11px small-caps var(--accent)
    Border-bottom: 1px solid var(--highlight)
    Body: 14px line-height 1.8 var(--text)
```

### `SectionHeader.jsx`
```
sectionLabel: 11px uppercase letter-spacing 3px, color var(--accent)
heading: 32–36px bold var(--text)
subheading: 16px var(--muted)
DividerStrip (if showDivider): 60px × 3px var(--accent)
margin-bottom: 24px
```

### `ChallengeCard.jsx`
```
border-radius: 12px
outlined: background white, border 1px solid #E2E8F0
filled: background var(--highlight), border none
padding: 24px
Icon square: 40×40px border-radius 8px, bg=iconBg, SVG path inside in iconColor
Title: 18px bold var(--text) margin-top 16px
Body: 14px line-height 1.7 var(--muted)
margin-bottom: 16px
```

### `FeatureCard.jsx`
```
padding: 20px
background: white
border: 1px solid #F1F5F9 (if showBorder)
border-radius: 10px
border-left: 3px solid accentColor
Icon circle: 44px diameter, bg=iconBg, SVG inside in iconColor
Title: 16px bold var(--text)
Body: 14px var(--muted)
```

### `NumberedDeliverable.jsx`
```
Layout: row — left: 48px circle | right: content
numbered variant: circle bg=var(--highlight), number color=var(--primary), 20px bold
arrow variant: circle bg=#DBEAFE, chevron icon inside
Content: title 18px bold, body 14px var(--muted)
bullets: BulletList component if present
border: 1px solid #E2E8F0, border-radius 10px, padding 20px 24px
margin-bottom: 16px
```

### `StatCard.jsx`
```
background: var(--card-bg)
border-radius: 12px
padding: 24px
text-align: center
metric: 48px bold, color: accentColor
label: 14px bold var(--text) margin-top 8px
body: 12px var(--muted)
```

### `WorkflowStep.jsx`
```
Each step:
  - 32px circle badge: bg=accentColor, white number 14px bold
  - title: 16px bold var(--text)
  - description: 14px var(--muted)
  - dotted vertical connector between steps (not after last)
  border-left: 2px dashed var(--highlight)
  padding-left: 16px
  margin-left: 15px  (centres on the badge)
```

### `QuoteCallout.jsx`
```
background: var(--card-bg)
border-left: 3px solid accentColor
border-radius: 0 10px 10px 0
padding: 20px 24px
quote: 16px italic var(--muted), wrapped in " "
```

### `ImagePlaceholder.jsx`
```
No image uploaded:
  border: 2px dashed #D1D5DB
  background: #F9FAFB
  border-radius: if rounded then 12px else 0
  display: flex, align-items: center, justify-content: center
  cursor: pointer
  Upload SVG icon + label text in var(--muted)
  
Image uploaded:
  <img> with width:100%, height:100%, object-fit:cover
  border-radius: if rounded then 12px else 0

onClick → refs hidden <input type="file" accept="image/*">
```

### `SectionCalloutBox.jsx`
```
background: var(--card-bg)
border-radius: 12px
padding: 20px 24px
display: flex, flex-direction: row, gap: 16px
Icon square: 40×40px border-radius 8px, bg=iconBg
Right: title 16px bold, body 14px var(--muted)
ALWAYS full-width — never inside a grid
```

### `LargeQuoteHero.jsx`
```
text-align: center
padding: 32px 16px
line1: 40px, color: var(--muted), font-weight: 300
line2: 44px bold, color: accentColor
margin-bottom: 32px
```

### `PageFooterBar.jsx`
```
position: absolute, bottom: 10mm, left: 16mm, right: 16mm
display: flex, justify-content: space-between
proposalName: 10px small-caps var(--muted)
pageNumber: 10px var(--muted)  e.g. "PAGE 02"
border-top: 1px solid var(--highlight)
padding-top: 6px
```

### `BiometricMiniCard.jsx`
```
background: white
border: 1px solid #F1F5F9
border-radius: 8px
padding: 12px
text-align: center
icon: 24px centred (emoji or SVG)
label: 12px bold var(--text)
caption: 11px var(--muted)
```

### `ContactFooter.jsx`
```
darkBg=true:  background var(--dark), all text white
darkBg=false: background white, border-top 1px solid #E2E8F0

Two-column layout:
  Left: companyName 20px bold | tagline 13px
  Right: 
    phone row: phone SVG icon 16px + phone text 13px
    email row: email SVG icon 16px + email text 13px  
    website row: globe SVG icon 16px + website text 13px (blue, underline)
padding: 28px 32px
```

---

## 6. Theme Object Shape (`themes.js`)

```js
export const THEMES = {
  TechBlue: {
    primary: '#1A56DB',
    accent:  '#06B6D4',
    dark:    '#1E3A5F',
    bg:      '#F8FAFF',
    cardBg:  '#EFF6FF',
    highlight:'#DBEAFE',
    text:    '#1E293B',
    mutedText:'#64748B',
    divider: '#1A56DB',
  },
  MedTeal: {
    primary: '#0E7490',
    accent:  '#10B981',
    dark:    '#164E63',
    bg:      '#F0FDFA',
    cardBg:  '#ECFDF5',
    highlight:'#CCFBF1',
    text:    '#134E4A',
    mutedText:'#6B7280',
    divider: '#0E7490',
  },
  EarthGreen: {
    primary: '#166534',
    accent:  '#D97706',
    dark:    '#14532D',
    bg:      '#F7FEE7',
    cardBg:  '#ECFCCB',
    highlight:'#D9F99D',
    text:    '#1A2E05',
    mutedText:'#6B7280',
    divider: '#D97706',
  },
  UrbanSlate: {
    primary: '#334155',
    accent:  '#3B82F6',
    dark:    '#0F172A',
    bg:      '#F8FAFC',
    cardBg:  '#F1F5F9',
    highlight:'#E2E8F0',
    text:    '#0F172A',
    mutedText:'#64748B',
    divider: '#3B82F6',
  },
  StartupViolet: {
    primary: '#7C3AED',
    accent:  '#F43F5E',
    dark:    '#4C1D95',
    bg:      '#FAF5FF',
    cardBg:  '#F3E8FF',
    highlight:'#EDE9FE',
    text:    '#1E1B4B',
    mutedText:'#6B7280',
    divider: '#F43F5E',
  },
};
```

---

## 7. Print CSS (`print.css`)

```css
@media print {
  .ui-shell,
  .thinking-panel,
  .prompt-input,
  .export-button,
  header {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 0;
  }

  body {
    margin: 0;
    background: white;
  }

  .page-wrapper {
    width: 210mm;
    min-height: 297mm;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    padding: 14mm 16mm;
    box-sizing: border-box;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  h1, h2, h3 {
    page-break-after: avoid;
  }

  .image-placeholder:not(.has-image) {
    background: #f0f0f0 !important;
    border: 1px solid #ccc !important;
  }
}
```

---

## 8. App Shell Layout (`App.jsx`)

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER  [AI Proposal Generator]          [Export PDF]       │
├─────────────────────┬────────────────────────────────────────┤
│  LEFT PANEL 380px   │  RIGHT PANEL flex-1                    │
│                     │                                        │
│  PromptInput        │  ProposalDocument                      │
│  ─────────────────  │    (scrollable, white bg)             │
│  ThinkingPanel      │                                        │
│  (collapsible)      │                                        │
│                     │                                        │
└─────────────────────┴────────────────────────────────────────┘
```

---

## 9. Environment Setup

```
# .env
VITE_ANTHROPIC_API_KEY=sk-ant-...

# .env.example
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get a key at: https://console.anthropic.com

---

## 10. Build Order

1. `vite.config.js` + `package.json` (React 18, Tailwind for shell only)
2. `themes/themes.js`
3. `context/ImageStore.jsx`
4. `context/ProposalContext.jsx`
5. All 20 components in `components/antigravity/`
6. `components/renderer/COMPONENT_REGISTRY.js`
7. `components/renderer/SectionRouter.jsx`
8. `components/renderer/PageWrapper.jsx`
9. `components/renderer/ProposalDocument.jsx`
10. `engine/phase1Prompt.js` + `engine/phase2Prompt.js` + `engine/proposalEngine.js`
11. `components/ui/PromptInput.jsx` + `ThinkingPanel.jsx` + `ExportButton.jsx`
12. `App.jsx`
13. `styles/print.css`
14. Test: "Generate a proposal for an AI-powered smart city traffic management system"

---

## 11. Fallback Strategy (LLM Errors)

| Failure Mode | Handling |
|-------------|----------|
| Phase 1 JSON parse failure | Show error card: "Could not parse proposal plan. Please try again." + Retry button |
| Phase 2 JSON parse failure | Same as above |
| Unknown componentType in JSON | SectionRouter silently skips, logs warning to console |
| API network error | Show error card with error.message |
| Unknown theme name | Fall back to TechBlue |
| Missing imagePlacementId | ImagePlaceholder renders with empty id; ImageStore ignores duplicates |
