<![CDATA[# ⚡ AI Proposal Generator

> A premium, AI-powered proposal document generator that creates professional, multi-page PDF proposals from a single text prompt. Built with React 18, powered by a Two-Phase CoT+ReAct reasoning engine via Groq API.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLM-FF6B35?logo=ai&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

---

## 🎯 Overview

The AI Proposal Generator transforms a brief text description into a fully structured, visually stunning, print-ready PDF proposal document. It uses a **two-phase AI reasoning pipeline** — first planning the document architecture, then generating rich content — to produce proposals that rival hand-crafted consulting deliverables.

### Key Capabilities

- **One-Prompt Generation** — Describe your project and get a 8-12 page professional proposal
- **22 Visual Components** — Cards, grids, tables, charts, hero quotes, workflow diagrams, and more
- **12 Industry Themes** — Pre-built color palettes for Tech, Healthcare, Finance, Government, etc.
- **Live Theme Switching** — Change the entire document's color scheme instantly, post-generation
- **Interactive Icon System** — Click any icon to replace it from a 60+ semantic SVG library or upload custom icons
- **Dynamic Logo Upload** — Upload and resize company logos with manual scale controls
- **Smart Image Prompts** — AI generates context-aware image descriptions (infographics vs real-life photos)
- **Per-Page Refinement** — Click any page to add comments and regenerate just that page
- **Conversational Refinement** — Chat-based follow-up to modify tone, structure, or content
- **Session History** — Persistent IndexedDB storage with version navigation
- **Clean PDF Export** — One-click `Ctrl+P` export with all UI chrome hidden automatically

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)       │
├──────────────┬──────────────┬───────────────────────┤
│  Left Panel  │  Right Panel │   Floating UI         │
│  • Chat      │  • Document  │   • ThemePanel        │
│  • Prompt    │  • Pages     │   • IconPicker        │
│  • Thinking  │  • Footer    │   • Logo Controls     │
│  • Images    │              │                       │
├──────────────┴──────────────┴───────────────────────┤
│              PROPOSAL ENGINE (proposalEngine.js)     │
│  Phase 1: Structural Planner (CoT reasoning)        │
│  Phase 2: Content Generator (ReAct writing)         │
│  Post-processor: 40% merge + height validation      │
├─────────────────────────────────────────────────────┤
│              GROQ API (LLM inference)                │
│  Model: llama-3.3-70b-versatile (or configurable)   │
│  Multi-key rotation for rate limit resilience        │
└─────────────────────────────────────────────────────┘
```

### Two-Phase AI Pipeline

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1 — Planner** | Analyzes the prompt, selects components, plans page layout with height budgets | JSON structural blueprint |
| **Phase 2 — Writer** | Transforms the blueprint into rich, themed content with proper props for each component | Full document JSON |
| **Post-Processing** | Merges sparse pages (40% rule), validates heights, strips malformed sections | Final renderable document |

### Page Density System

Every component has an estimated height cost. The engine enforces:
- **50% Rule** — If any single component exceeds 50% of page height, it must be alone on that page
- **85% Ceiling** — Total component height on any page cannot exceed 85%
- **40% Merge** — Pages below 40% utilization are merged with adjacent pages

---

## 📁 Project Structure

```
src/
├── App.jsx                          # Root layout — left panel, right panel, floating UI
├── main.jsx                         # React entry point
├── index.css                        # Global styles
│
├── engine/
│   └── proposalEngine.js            # Two-phase AI pipeline, prompts, height estimation, merge logic
│
├── components/
│   ├── registry.js                  # Component registry — maps string names → React components
│   │
│   ├── renderer/
│   │   ├── ProposalDocument.jsx     # Iterates pages, resolves themes, renders PageWrappers
│   │   └── PageWrapper.jsx          # A4 page container with auto-scaling, headers, footers, refine overlays
│   │
│   ├── proposal/                    # 22 visual components (see Component Library below)
│   │   ├── CoverPage.jsx            # Hero cover with logo upload, executive summary
│   │   ├── SectionHeader.jsx        # Section labels with accent dividers
│   │   ├── FeatureCard.jsx          # Icon + title + body feature cards
│   │   ├── ChallengeCard.jsx        # Problem/challenge presentation cards
│   │   ├── StatCard.jsx             # Big metric number + label + body
│   │   ├── DataTable.jsx            # Themed comparison/data tables
│   │   ├── WorkflowStep.jsx         # Numbered process/workflow steps
│   │   ├── NumberedDeliverable.jsx  # Scope items with bullets
│   │   ├── QuoteCallout.jsx         # Quote accent strip
│   │   ├── LargeQuoteHero.jsx       # Full-width hero quote
│   │   ├── SectionCalloutBox.jsx    # Highlighted info box
│   │   ├── CredentialCard.jsx       # Certification/award cards
│   │   ├── PersonnelCard.jsx        # Team member bios
│   │   ├── CompetitorRow.jsx        # Competitive comparison rows
│   │   ├── ContactFooter.jsx        # Contact info footer block
│   │   ├── ImagePlaceholder.jsx     # AI image prompt placeholders
│   │   ├── BulletList.jsx           # Styled check/chevron bullet lists
│   │   ├── TwoColumnGrid.jsx        # 2-column layout wrapper
│   │   ├── ThreeColumnGrid.jsx      # 3-column layout wrapper
│   │   ├── DividerStrip.jsx         # Decorative divider line
│   │   ├── TagBadge.jsx             # Small label badges
│   │   ├── BiometricMiniCard.jsx    # Compact icon + label cards
│   │   ├── PageFooterBar.jsx        # Page-level footer bar
│   │   ├── Icon.jsx                 # Universal icon renderer (SVG library + custom uploads)
│   │   ├── IconPicker.jsx           # Portal-based icon replacement dropdown
│   │   └── IconLibrary.js           # 60+ semantic SVG icon paths
│   │
│   └── ui/
│       ├── PromptInput.jsx          # Chat input with send button
│       ├── ChatThread.jsx           # Conversation history display
│       ├── ThinkingPanel.jsx        # AI reasoning trace viewer
│       ├── ImagePromptPanel.jsx     # AI image prompt viewer/editor
│       ├── ThemePanel.jsx           # Floating theme switcher (12 themes)
│       ├── ExportButton.jsx         # PDF export trigger
│       └── HistorySidebar.jsx       # Session history drawer
│
├── context/
│   ├── ProposalContext.jsx          # Global state — document, versions, sessions, theme, refinement
│   ├── ImageStore.jsx               # Image blob storage context
│   └── ImagePromptContext.jsx       # AI image prompt generation context
│
├── themes/
│   └── themes.js                    # 12 theme definitions + recolor utility + dynamic theme builder
│
├── styles/
│   └── print.css                    # @media print rules — hides all UI, enforces A4 page breaks
│
└── utils/
    └── idbStorage.js                # IndexedDB wrapper for persistent session storage
```

---

## 🎨 Component Library (22 Components)

| Component | Purpose | Height Cost |
|-----------|---------|-------------|
| `CoverPage` | Hero cover with logo, title, executive summary | Full page |
| `SectionHeader` | Section label + heading + accent divider | 10-14% |
| `FeatureCard` | Icon + title + body feature presentation | 14% |
| `ChallengeCard` | Problem/challenge card (outlined or filled) | 18% |
| `StatCard` | Large metric number with label | 12% |
| `DataTable` | Themed data table (max 6 rows × 4 cols) | 20-30% |
| `WorkflowStep` | Process steps (3-5 steps) | 28-48% |
| `NumberedDeliverable` | Scope deliverable with optional bullets | 14-20% |
| `QuoteCallout` | Accent-bordered quote strip | 12% |
| `LargeQuoteHero` | Full-width dramatic quote | 18% |
| `SectionCalloutBox` | Highlighted info/CTA box | 14% |
| `CredentialCard` | Certification/award showcase | 16% |
| `PersonnelCard` | Team member bio card | 16% |
| `CompetitorRow` | Competitive comparison table | 18% |
| `ContactFooter` | Company contact information block | 16% |
| `ImagePlaceholder` | AI-prompted image slot | 30-38% |
| `BulletList` | Check/chevron bullet points | ~3% per item |
| `TwoColumnGrid` | 2-column layout container | Variable |
| `ThreeColumnGrid` | 3-column layout container | Variable |
| `DividerStrip` | Decorative accent line | 2% |
| `TagBadge` | Small label/tag pill | 3% |
| `BiometricMiniCard` | Compact icon + label | 8% |

---

## 🎭 Theme System (12 Themes)

| Theme | Industry | Primary | Accent |
|-------|----------|---------|--------|
| Tech Blue | SaaS, AI, Cloud | `#1A56DB` | `#06B6D4` |
| Med Teal | Healthcare, Pharma | `#0E7490` | `#10B981` |
| Earth Green | Agriculture, Mining | `#166534` | `#D97706` |
| Urban Slate | Smart City, Gov | `#334155` | `#3B82F6` |
| Startup Violet | Startup, FinTech | `#7C3AED` | `#F43F5E` |
| Ocean Cyan | Maritime, Logistics | `#0891B2` | `#22D3EE` |
| Royal Indigo | Enterprise, Legal | `#4F46E5` | `#818CF8` |
| Sunset Coral | Creative, Media | `#E11D48` | `#FB923C` |
| Amber Gold | Energy, Finance | `#B45309` | `#F59E0B` |
| Forest Pine | Environment, NGO | `#065F46` | `#34D399` |
| Midnight Rose | Beauty, Lifestyle | `#9333EA` | `#EC4899` |
| Steel Gray | Industrial, Manufacturing | `#475569` | `#94A3B8` |

Themes can be switched live after generation. The engine also supports **AI-generated brand themes** — if the LLM detects a known brand, it generates a matching custom palette dynamically.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A **Groq API key** (free tier available at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/Gritsama-Technologies/Proposal-Generation-Agent.git
cd Proposal-Generation-Agent

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Edit `.env` and add your Groq API key(s):

```env
VITE_GROQ_API_KEY=gsk_your_api_key_here
```

> **Tip:** For production use, configure multiple API keys separated by commas in the engine for automatic key rotation and rate-limit resilience.

### Development

```bash
# Start the dev server
npm run dev

# Opens at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The production bundle outputs to `dist/` and can be deployed to any static hosting service.

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the environment variable `VITE_GROQ_API_KEY` in the Vercel dashboard under **Settings → Environment Variables**.

### Azure Static Web Apps

1. Push code to your GitHub repository.
2. In the [Azure Portal](https://portal.azure.com/), create a new **Static Web App**.
3. Select **GitHub** as the source and choose your repository/branch.
4. Set **Build Presets** to `Vite`.
5. Set **App location** to `/` and **Output location** to `dist`.
6. **Important**: Go to your GitHub Repository **Settings > Secrets and variables > Actions**.
7. Create a new secret named `VITE_GROQ_API_KEY` with your key value.
8. Update the `.github/workflows/azure-static-web-apps-xxx.yml` file to include the secret:
   ```yaml
   with:
     azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
     repo_token: ${{ secrets.GITHUB_TOKEN }}
     action: "upload"
     app_location: "/"
     output_location: "dist"
   env:
     VITE_GROQ_API_KEY: ${{ secrets.VITE_GROQ_API_KEY }}
   ```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_GROQ_API_KEY
ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build --build-arg VITE_GROQ_API_KEY=gsk_xxx -t proposal-generator .
docker run -p 8080:80 proposal-generator
```

### Static Hosting (S3, Firebase, GH Pages)

```bash
npm run build
# Upload the contents of dist/ to your hosting provider
```

> **Note:** Since the Groq API key is embedded at build time via Vite's `import.meta.env`, it will be visible in the client bundle. For production, consider proxying API calls through a backend server.

---

## 📄 PDF Export

The app uses the browser's native `window.print()` API with comprehensive print CSS:

- All UI elements (ThemePanel, chat panel, refine overlays, icon picker, logo controls) are hidden
- Pages are formatted to exact A4 dimensions (210mm × 297mm)
- Colors are preserved via `-webkit-print-color-adjust: exact`
- Page breaks are enforced between each page wrapper
- No blank trailing pages

**To export:** Click the **Export PDF** button → Select "Save as PDF" in the print dialog → Save.

---

## 🔧 How It Works

### 1. User enters a prompt
> "Create a proposal for CloudMove Inc — an enterprise cloud migration service targeting retail companies"

### 2. Phase 1 — AI Plans the structure
The engine sends the prompt to the LLM with the full component catalog. The AI reasons through:
- How many pages to allocate
- Which components fit each section
- Height budgets per page
- Image placements
- Color theme selection

### 3. Phase 2 — AI Writes the content
The structural plan is sent back to the LLM with:
- Component prop schemas
- Icon key catalog
- Color consistency rules
- Image prompt rules (infographic vs real-life)
- Content guidelines (no duplication, preserve user names)

### 4. Post-Processing
The engine:
- Validates JSON structure
- Merges underfilled pages (40% rule)
- Strips malformed sections
- Resolves theme colors

### 5. Rendering
React components render each page with:
- Auto-scaling content to fit A4 boundaries
- Branded headers and footers
- Interactive refine overlays
- Live theme application

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18.3, Vanilla CSS, Vite 6.x |
| **AI Engine** | Groq API (llama-3.3-70b-versatile) |
| **State** | React Context API |
| **Storage** | IndexedDB (via `idbStorage.js`) |
| **Icons** | Custom 60+ SVG icon library |
| **PDF Export** | Native `window.print()` + custom print CSS |
| **Build** | Vite with React plugin |

---

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GROQ_API_KEY` | ✅ | Groq API key for LLM inference |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is proprietary software of **Gritsama Technologies**. All rights reserved.

---

<p align="center">
  Built with ⚡ by <strong>Gritsama Technologies</strong>
</p>
]]>
