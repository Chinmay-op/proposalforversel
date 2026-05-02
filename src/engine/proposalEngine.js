// ═══════════════════════════════════════════════════════════════════════
//  PROPOSAL ENGINE — Layout Intelligence System v4
//  Two-Phase Groq Pipeline with One-Section-Per-Page + 40% Merge
// ═══════════════════════════════════════════════════════════════════════

import { VALID_COMPONENT_NAMES } from '../components/registry'

// ─────────────────────────────────────────────────────────────────────
//  HEIGHT ESTIMATION MAP (px) — used for 40% merge calculations
// ─────────────────────────────────────────────────────────────────────

const COMPONENT_HEIGHT_MAP = {
  SectionHeader: 100,
  ChallengeCard: 150,
  FeatureCard: 140,
  NumberedDeliverable: 160,
  CredentialCard: 150,
  PersonnelCard: 160,
  SectionCalloutBox: 95,
  StatCard: 120,
  QuoteCallout: 85,
  BulletList: 30,       // per item, will be multiplied
  WorkflowStep: 60,     // per step, will be multiplied
  ImagePlaceholder: 210,
  ContactFooter: 190,
  CoverPage: 9999,      // never merge cover
  DividerStrip: 20,
  LargeQuoteHero: 170,
  CompetitorRow: 180,
  DataTable: 220,       // conservative — tables are dense
  TagBadge: 30,
  BiometricMiniCard: 80,
  TwoColumnGrid: 160,
  ThreeColumnGrid: 140,
  PageFooterBar: 30,
}

// Safe content zone after header + footer + padding in px
const SAFE_CONTENT_HEIGHT = 935

// ─────────────────────────────────────────────────────────────────────
//  CONTEXTUAL ENRICHMENT — section-aware filler content
// ─────────────────────────────────────────────────────────────────────

function getContextualEnrichments(page, accentColor) {
  const header = page.sections.find(s => s.componentType === 'SectionHeader')
  const context = ((header?.props?.heading || '') + ' ' + (header?.props?.subheading || '')).toLowerCase()

  const makeCallout = (icon, title, body) => ({
    componentType: 'SectionCalloutBox',
    props: { icon, iconBg: `${accentColor}15`, title, body, accentColor }
  })
  const makeQuote = (quote) => ({
    componentType: 'QuoteCallout',
    props: { quote, accentColor }
  })

  if (/challeng|problem|pain|issue|gap|risk/.test(context)) {
    return [
      makeCallout('alert', 'Why This Matters Now',
        'Delaying action compounds these challenges exponentially. Organizations that address these pain points proactively see significantly faster time-to-value and reduced remediation costs.'),
      makeQuote('"The cost of inaction in addressing systemic operational challenges grows 3x annually, making early intervention the most cost-effective strategy."')
    ]
  }
  if (/solution|architect|approach|system|platform|design/.test(context)) {
    return [
      makeCallout('bolt', 'Architecture Philosophy',
        'Our solution is designed around modularity, resilience, and future-proofing — ensuring each component can scale independently while maintaining system-wide coherence.'),
      makeQuote('"Well-architected systems reduce total cost of ownership by up to 60% over five years through reduced maintenance, simplified scaling, and improved developer productivity."')
    ]
  }
  if (/feature|capabilit|function|module|key/.test(context)) {
    return [
      makeCallout('star', 'Built for Real-World Impact',
        'Each feature is designed to solve a specific operational challenge while integrating seamlessly with the broader system, delivering measurable value from day one.'),
      makeQuote('"The most effective features are those that reduce friction, automate repetitive tasks, and surface actionable insights without requiring manual intervention."')
    ]
  }
  if (/secur|compli|privacy|protect|encrypt|trust/.test(context)) {
    return [
      makeCallout('shield-check', 'Security-First Architecture',
        'Every layer of the system is built with defense-in-depth principles, ensuring data protection at rest and in transit while maintaining compliance with industry standards.'),
      makeQuote('"Organizations with proactive security architectures experience 82% fewer data breach incidents and achieve compliance certifications 3x faster."')
    ]
  }
  if (/scope|deliver|phase|milestone|sprint|timeline/.test(context)) {
    return [
      makeCallout('target', 'Delivery Commitment',
        'Each deliverable undergoes rigorous quality assurance and stakeholder review before advancing to the next phase, ensuring alignment with project objectives at every stage.'),
      makeQuote('"Iterative delivery with defined milestones reduces project risk by 45% and increases stakeholder satisfaction through continuous visibility into progress."')
    ]
  }
  if (/value|metric|impact|roi|benefit|result|outcome/.test(context)) {
    return [
      makeCallout('trending-up', 'Measurable Business Outcomes',
        'Our approach is designed to deliver quantifiable improvements in efficiency, cost reduction, and operational excellence — with clear KPIs tracked from day one.'),
      makeQuote('"Data-driven organizations are 23x more likely to acquire customers and 19x more likely to be profitable than their peers."')
    ]
  }
  if (/team|personnel|expert|staff|resource/.test(context)) {
    return [
      makeCallout('users', 'Domain Expertise',
        'Our team brings deep domain expertise combined with hands-on experience in delivering high-stakes projects, ensuring technical excellence and strategic alignment.'),
      makeQuote('"The quality of technical leadership directly correlates with project success rates — teams with domain-expert leads see 67% higher on-time delivery."')
    ]
  }
  if (/credential|experience|portfolio|track|case|proven/.test(context)) {
    return [
      makeCallout('trophy', 'Proven Track Record',
        'Our portfolio demonstrates consistent delivery of complex, mission-critical systems across industries — each project reinforcing our methodology and technical capabilities.'),
      makeQuote('"Past performance is the strongest predictor of future success. Our completion rate exceeds 97% across all engagement types."')
    ]
  }
  // Default
  return [
    makeCallout('check', 'Strategic Advantage',
      'This capability provides a measurable competitive edge in operational efficiency and compliance readiness, positioning the organization for long-term scalability.'),
    makeQuote('"Organizations that adopt proactive data-driven systems see a 340% improvement in incident response times and a 67% reduction in operational downtime."')
  ]
}

// ─────────────────────────────────────────────────────────────────────
//  PHASE 1 — Structural Planner (CoT + ReAct + One-Section-Per-Page)
// ─────────────────────────────────────────────────────────────────────

const PHASE1_SYSTEM_PROMPT = `You are an expert proposal architect. Your role is to analyze a client brief, reason through the best document structure, and produce a layout plan in JSON format.

Please think through each of the following questions before producing the plan. Prefix each reasoning step with "THOUGHT:" so the UI can display your thinking process.

Questions to consider:
THOUGHT: What is the primary domain and industry?
THOUGHT: Who is the target audience - B2B, B2G, or B2C?
THOUGHT: What is the core problem this solution solves?
THOUGHT: What tone is best - formal, startup, or technical?
THOUGHT: What are the official brand colors for this company? If the company is well-known (e.g., BMW, Google, Tesla), use their actual brand hex codes. If unknown, pick colors that best represent this industry/domain. Provide primary (main brand), accent (complementary), and dark (deep variant) hex values.
THOUGHT: What depth does this proposal require - Compact (5-7 pages), Standard (6-8), or Enterprise (8-10)?
THOUGHT: What is the most compelling cover tagline in under 12 words?
THOUGHT: What 3 challenge cards best frame the problem?
THOUGHT: Should architecture use WorkflowStep or FeatureCards?
THOUGHT: Features section - TwoColumnGrid or ThreeColumnGrid?
THOUGHT: Does the value section need StatCards, SectionCalloutBox, or both?
THOUGHT: Image placements - cover always first, then which feature pages? Max 3, never 2 on same page.
THOUGHT: What are the 3-4 deliverables for scope of work?
THOUGHT: What 3 domain-authentic metrics should StatCards show?
THOUGHT: What should the CTA and next steps say?
THOUGHT: Does this need a team/personnel section?
THOUGHT: Does this need a competitor analysis?
THOUGHT: For the Problem page, what creative component layout should I use?
THOUGHT: For the Solution/Architecture page, what layout variation should I use?
THOUGHT: For the Features page, what uncommon combination would look fresh?
THOUGHT: For the Value/Metrics page, what layout variation should I use?
THOUGHT: For the Scope page, how should I vary the deliverables layout?
THOUGHT: Have I ensured that no two content pages use the exact same component combination?

After completing all reasoning steps, please provide the plan as a JSON object.

--- Page Layout Guidelines ---

Each logical section of the proposal should be assigned to its own dedicated page.
- Page 1: CoverPage (full-page cover with executive summary).
- Pages 2 through N-1: Each page contains one main thematic section (e.g., "Challenges", "Solution Architecture", "Key Features", "Value Metrics", "Scope of Work", "Team").
- Last page: closing content with ContactFooter.

If a section would produce very little content, mark it as "lightweight": true. Lightweight sections may be merged with an adjacent section during post-processing.

--- Structured Outline Mode ---
If the user provides an explicit structured outline, that outline takes priority. Preserve all section numbers and ordering exactly as given.

If no outline is provided, follow these defaults based on pageMode:
- "compact" (5-8 pages): CoverPage, Problem/Challenges, Solution/Architecture, Key Features, Value/Metrics, Scope of Work, Next Steps + ContactFooter
- "standard" (8-10 pages): Add dedicated features page, validation page, credentials page
- "enterprise" (10-14 pages): Add feature spotlights, deeper architecture, roadmap, competitor analysis, credentials, team

--- JSON Schema ---
{
  "domain": string,
  "audience": "B2B" | "B2G" | "B2C",
  "tone": "formal" | "startup" | "technical",
  "theme": string (a descriptive theme name like "TechBlue", "BMWBlue", "CyanIndustrial", etc.),
  "brandColors": {
    "primary": string (hex - main brand color, e.g. "#0066B1" for BMW, "#00BCD4" for cyan),
    "accent": string (hex - complementary accent color),
    "dark": string (hex - dark variant for headers/backgrounds)
  },
  "pageMode": "compact" | "standard" | "enterprise",
  "pageCount": number (5-14),
  "coverTagline": string (max 12 words),
  "companyName": string,
  "imagePlacements": ["cover", ...max 3 total, no two on same page],
  "sections": [
    {
      "id": string (slug),
      "pageNumber": number (1-based),
      "label": string (e.g. "SECTION 01"),
      "heading": string,
      "subheading": string,
      "primaryComponent": string (component name from the allowed list),
      "supportingComponents": string[],
      "layout": "full-width" | "two-column" | "three-column" | "stacked",
      "itemCount": number,
      "lightweight": boolean,
      "needsImage": boolean,
      "imagePlacementId": string | null,
      "colorAccent": string (hex - should match brandColors.primary)
    }
  ],
  "reasoning_trace": string[] (all THOUGHT lines, minimum 15)
}

--- Guidelines ---
1. sections[0] should have id="cover", primaryComponent="CoverPage"
2. Last section should have primaryComponent="ContactFooter"
3. Allowed primaryComponent values: CoverPage, SectionHeader, ChallengeCard, FeatureCard, NumberedDeliverable, StatCard, QuoteCallout, ImagePlaceholder, TwoColumnGrid, ThreeColumnGrid, WorkflowStep, TagBadge, ContactFooter, DividerStrip, SectionCalloutBox, CredentialCard, PageFooterBar, BiometricMiniCard, LargeQuoteHero, BulletList, PersonnelCard, CompetitorRow, DataTable
4. imagePlacements starts with "cover", max 3, avoid two on the same pageNumber
5. Each section should have its own unique pageNumber
6. reasoning_trace should have roughly 22 items
7. All sections should use the same colorAccent hex value for a cohesive visual theme
8. COMPONENT HEIGHT AND PAGE DENSITY LIMITS (50% RULE):
   - Every component has an estimated height cost measured as a percentage of a single page.
   - Before assigning components to a page you must mentally calculate the total height cost of all components on that page.
   - If any single component has an estimated height cost greater than 50% of the page, that component MUST be the ONLY content component on that page apart from the SectionHeader and the page footer. No additional components may be added to a page that is already more than 50% full from a single component.
   - Height costs: ImagePlaceholder(16:9)=38%, ImagePlaceholder(4:3)=30%, TwoColumnGrid w/ 4 TeamMemberCards=55% (must be alone!), WorkflowStep(5 steps)=48%, WorkflowStep(4 steps)=38%, WorkflowStep(3 steps)=28%, ThreeColumnGrid w/ 3 StatCards=22%, TwoColumnGrid w/ 2 ChallengeCards=30%, single full-width ChallengeCard=18%, SectionHeader w/ subheading=14%, DataTable(4 rows)=20%, DataTable(8 rows)=30%, SectionHeader w/o subheading=10%, QuoteCallout=12%, NumberedDeliverable w/ bullets=20%, NumberedDeliverable w/o bullets=14%, DarkCalloutBox=12%, MarketStatBlock=18%, CTABlock=15%, ContactFooter=16%, SectionCalloutBox=14%, CredentialCard=16%.
   - Sum the height costs of all assigned components. If the sum exceeds 75%, stop adding components to that page and start a new page. This 75% ceiling leaves a 25% buffer for spacing and text overflow. NEVER exceed this ceiling.
9. Please respond with the JSON plan object`

// ─────────────────────────────────────────────────────────────────────
//  PHASE 2 — Content Generator with One-Section-Per-Page Density
// ─────────────────────────────────────────────────────────────────────

const PHASE2_SYSTEM_PROMPT = `You are a professional proposal copywriter. Your task is to transform a structural plan into a complete, polished proposal document in JSON format, suitable for rendering by a React component system.

--- Priorities ---
1. Stability: produce valid, renderable JSON.
2. Content preservation: retain user-provided names, numbers, titles, awards, section headings, and company names.
3. Layout quality: pages should look intentional, balanced, and professional.
4. Factual integrity: base statistics or claims on provided research or standard domain knowledge.
5. Non-duplication: avoid repeating the same content across pages unless requested.

--- Color Theme Consistency ---
Every component on every page should use the same accentColor hex value derived from the plan's theme.
- CoverPage.dividerColor, SectionHeader.accentColor, FeatureCard.accentColor, ChallengeCard.iconColor, StatCard.accentColor, WorkflowStep.accentColor, NumberedDeliverable.accentColor, BulletList.accentColor, QuoteCallout.accentColor, SectionCalloutBox.accentColor, LargeQuoteHero.accentColor, CredentialCard.accentColor, PersonnelCard.accentColor, CompetitorRow.accentColor, DataTable.accentColor should all use the same hex color.
- The iconBg fields should use a lightened version of this same accent (e.g., accent + "15" or accent + "20" for transparency).

--- Layout Variety ---
Cover page (page 1) and closing/contact page (last page) can follow a standard template structure.
However, every content page (pages 2 through N-1) should use a unique component combination that differs from every other page.

Variation strategies:
- Alternate between TwoColumnGrid and ThreeColumnGrid layouts
- Mix grid-based pages with stacked linear layouts
- Combine primary components with different supporting components
- Use QuoteCallout on some pages and LargeQuoteHero on others
- Incorporate a DataTable for ANY dense structured data: comparisons, pricing tiers, specifications, feature matrices, implementation timelines, or high-density metrics
- Add ImagePlaceholder, DividerStrip, TagBadge as secondary visual accents selectively

--- Page Structure & Density (50% RULE) ---
Each page (except page 1) should contain one thematic section:
1. SectionHeader (first on every content page)
2. Content components that develop this section's theme
3. COMPONENT HEIGHT AND PAGE DENSITY LIMITS (50% RULE):
   - Every component has an estimated height cost.
   - Mentally calculate the total height cost of all components on a page.
   - If ANY component costs >50%, it MUST be the ONLY component on that page (besides SectionHeader).
   - Height costs: ImagePlaceholder(16:9)=38%, ImagePlaceholder(4:3)=30%, TwoColumnGrid w/ 4 TeamMemberCards=55% (must be alone!), WorkflowStep(5 steps)=48%, WorkflowStep(4 steps)=38%, WorkflowStep(3 steps)=28%, ThreeColumnGrid w/ 3 StatCards=22%, TwoColumnGrid w/ 2 ChallengeCards=30%, single full-width ChallengeCard=18%, SectionHeader w/ subheading=14%, DataTable(4 rows)=20%, DataTable(8 rows)=30%, SectionHeader w/o subheading=10%, QuoteCallout=12%, NumberedDeliverable w/ bullets=20%, NumberedDeliverable w/o bullets=14%, DarkCalloutBox=12%, MarketStatBlock=18%, CTABlock=15%, ContactFooter=16%, SectionCalloutBox=14%, CredentialCard=16%.
   - If the sum exceeds 75%, move remaining components to the next page. NEVER exceed 75% total visual height.

Page combination examples (vary creatively):
- Problem page: SectionHeader + 3 ChallengeCards or TwoColumnGrid of ChallengeCards + SectionCalloutBox
- Solution page: SectionHeader + WorkflowStep (4-5 steps) + SectionCalloutBox
- Features page: SectionHeader + TwoColumnGrid/ThreeColumnGrid of FeatureCards + QuoteCallout
- Value/Metrics page: SectionHeader + ThreeColumnGrid of StatCards + QuoteCallout + SectionCalloutBox
- Scope page: SectionHeader + 3-4 NumberedDeliverables
- Team page: SectionHeader + TwoColumnGrid of PersonnelCards
- Credentials page: SectionHeader + 2-3 CredentialCards
- Competitor page: SectionHeader + CompetitorRow + SectionCalloutBox
- Closing page: SectionHeader + BulletList + LargeQuoteHero or QuoteCallout + ContactFooter

--- Content Guidelines ---
- Preserve user-provided names rather than using placeholders.
- Include all planned sections and retain user-defined section numbers if provided.
- Avoid repeating the same quote, metric, or stat card on multiple pages.
- Keep the summary on page 1 concise.
- Use qualitative wording if a factual number is not present in the user brief.
- Each page should introduce new information rather than restating previous points.
- If the user provides an outline, please follow it closely.
- Prefer rich layouts (cards, grids) over plain text or simple bullet lists.

--- Component Placement Rules ---

Page 1: CoverPage component (contains badge, title, tagline, image, executive summary)
Content pages (2+): should start with SectionHeader (sectionLabel, heading, subheading, accentColor, showDivider: true)
SectionCalloutBox: should appear at full-width, not nested inside TwoColumnGrid or ThreeColumnGrid
StatCards: should appear inside ThreeColumnGrid (always groups of 3)
TwoColumnGrid: expects exactly 2 children
ThreeColumnGrid: expects exactly 3 children
Last section of last page: ContactFooter

--- Component Prop Reference ---

CoverPage: { badgeText, companyName, title (use newline characters for line breaks), tagline, dividerColor, imageId, executiveSummary (3-4 sentences, MAX 80 WORDS), coverImagePrompt (a highly specific AI image prompt showing the company's actual product or system in a visually stunning hero shot - e.g., for a water monitoring proposal: "A gleaming HYDROGUARD IoT sensor array mounted on an underground water main in a modern utility tunnel, with real-time holographic data overlays showing flow rates and pressure readings, cyan LED accents, cinematic industrial photography, 16:9") }
SectionHeader: { sectionLabel ("SECTION 01"), heading, subheading, accentColor, showDivider: true }
ChallengeCard: { icon (ICON KEY string), iconBg, iconColor, title, body (2-3 sentences, MAX 50 WORDS), variant ("outlined"|"filled") }
FeatureCard: { icon (ICON KEY string), iconBg, iconColor, title, body (2-3 sentences, MAX 40 WORDS), showBorder: true, accentColor }
SectionCalloutBox: { icon (ICON KEY string), iconBg, title, body (2-3 sentences, MAX 50 WORDS), accentColor }
NumberedDeliverable: { number, title, body (2-3 sentences, MAX 40 WORDS), bullets (string[], MAX 4 items), variant, accentColor }
StatCard: { metric ("99.7%"), label ("Mesh Uptime"), body (1 sentence), accentColor, cardBg }
WorkflowStep: { steps: [{stepNumber, title, description (1-2 sentences, MAX 30 WORDS)}], accentColor, MAX 5 STEPS }
QuoteCallout: { quote (1-2 powerful sentences in quotes), accentColor }
ImagePlaceholder: { id (unique), label, aspectRatio ("16/9"), rounded: true, imagePrompt (A refined AI image prompt based STRICTLY on the surrounding text. If it requires technical representation like software or architecture, describe a clean "infographic" or "UI dashboard". Otherwise, describe REAL-LIFE USAGE of the product in its actual environment, e.g., "A field worker in safety gear analyzing the HYDROGUARD tablet interface next to a roaring municipal pipeline".) }
TwoColumnGrid: { children: [{componentType, props}, {componentType, props}] }
ThreeColumnGrid: { children: [{componentType, props}, {componentType, props}, {componentType, props}] }
LargeQuoteHero: { line1 (light weight text), line2 (bold accent text), accentColor }
BulletList: { items: ["point 1", "point 2", ...], iconStyle ("check"|"chevron"), accentColor }
CredentialCard: { icon (ICON KEY string), title, badge, body, highlightBox, url, accentColor }
ContactFooter: { companyName, phone, email, website, darkBg: true, tagline, copyrightText }
DividerStrip: { width ("short"), color, marginY: 8 }
PersonnelCard: { name, role, accolade, bio, accentColor }
CompetitorRow: { competitors: [{name, description, weakness}], ourAdvantage, accentColor }
BiometricMiniCard: { icon (ICON KEY string), label, caption }
DataTable: { headers: ["Column 1", "Column 2", "Column 3"], rows: [["cell", "cell", "cell"]], accentColor, caption (optional). CRITICAL: Maximum 5 rows and 4 columns to avoid page overflow. Keep cell text concise (under 10 words per cell). }
TagBadge: { text, color, textColor, size ("sm"|"md") }

--- Icon Keys ---
For any component that requires an "icon" prop, use one of these semantic icon keys (the app resolves them automatically):
- Alerts: "warning", "alert", "check", "check-simple", "info"
- Security: "shield", "shield-check", "lock", "key", "fingerprint"
- Business: "chart", "trending-up", "currency", "briefcase", "presentation"
- Technology: "bolt", "cpu", "server", "wifi", "signal", "cloud", "cog", "database"
- Communication: "globe", "users", "user", "chat", "phone", "email"
- Navigation: "target", "rocket", "flag", "star", "light", "clock", "calendar"
- Nature: "leaf", "sun", "water", "fire", "mountain"
- Medical: "heart", "pulse", "medical", "stethoscope"
- Documents: "document", "clipboard", "folder"
- Building: "building", "home", "map", "location"
- Arrows: "arrow-right", "arrow-up", "refresh", "download", "link"
- Misc: "wrench", "puzzle", "scale", "trophy"

--- Output Format ---
Please provide the document as a JSON object with this structure:

{
  "meta": { "title": string, "tagline": string, "companyName": string, "proposalType": string, "date": string, "theme": string },
  "validation": {
    "namesPreserved": boolean,
    "sectionsPreserved": boolean,
    "orderCorrect": boolean,
    "noPlaceholderNames": boolean,
    "noDuplicateQuotes": boolean,
    "page1FitsCleanly": boolean,
    "imageCountValid": boolean,
    "factsSourcedOrUserProvided": boolean
  },
  "pages": [
    {
      "pageId": string,
      "pageType": "cover" | "content" | "closing",
      "sections": [
        { "componentType": string, "props": {} }
      ]
    }
  ]
}`

// ─────────────────────────────────────────────────────────────────────
//  JSON EXTRACTION & THOUGHT PARSING
// ─────────────────────────────────────────────────────────────────────

function extractJSON(text) {
  let clean = text.replace(/```json[\s\S]*?```/g, m => m.slice(7, -3)).replace(/```/g, '').trim()
  const jsonStart = clean.indexOf('{')
  if (jsonStart === -1) throw new Error('No JSON object found in response')

  let depth = 0
  let jsonEnd = -1
  let inString = false
  let escapeNext = false

  for (let i = jsonStart; i < clean.length; i++) {
    const ch = clean[i]
    if (escapeNext) { escapeNext = false; continue }
    if (ch === '\\') { escapeNext = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') depth++
    if (ch === '}') depth--
    if (depth === 0) { jsonEnd = i + 1; break }
  }

  if (jsonEnd === -1) throw new Error('Malformed JSON — unclosed braces')
  let jsonStr = clean.slice(jsonStart, jsonEnd)

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    // Attempt repair: common LLM JSON mistakes
    const repaired = jsonStr
      .replace(/,\s*}/g, '}')
      .replace(/,\s*\]/g, ']')
      .replace(/[\x00-\x1F\x7F]/g, c => c === '\n' || c === '\r' || c === '\t' ? c : '') // strip control chars
    try {
      return JSON.parse(repaired)
    } catch (e2) {
      console.error('[Engine] JSON parse failed after repair. First 800 chars:', jsonStr.slice(0, 800))
      throw new Error('Failed to parse AI response as JSON. Please retry.')
    }
  }
}

function extractThoughts(text) {
  return text.split('\n')
    .filter(l => l.trim().startsWith('THOUGHT:'))
    .map(l => l.trim().replace('THOUGHT:', '').trim())
}

// ─────────────────────────────────────────────────────────────────────
//  AZURE OPENAI CONFIGURATION (gpt-5-chat)
// ─────────────────────────────────────────────────────────────────────

const AI_CONFIG = {
  endpoint: "https://coder-resource.services.ai.azure.com/openai/v1/chat/completions",
  model: "gpt-5-chat",
  apiKey: import.meta.env.VITE_AZURE_API_KEY
};



async function callAI(systemPrompt, userMessage, maxTokens = 8000, onRetryMessage = null, temperature = 0.7) {
  let attempts = 0
  const maxAttempts = 3 // Standard retries for Azure

  while (attempts < maxAttempts) {
    attempts++

    if (onRetryMessage && attempts > 1) {
      onRetryMessage(`[Engine] Retrying Azure API (Attempt ${attempts})...`)
    }

    try {
      const response = await fetch(AI_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
        },
          body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: temperature,
          max_tokens: maxTokens,
          // Only enforce JSON if the prompt explicitly asks for it
          ...(systemPrompt.toLowerCase().includes('json') ? { response_format: { type: 'json_object' } } : {})
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        let isRateLimit = response.status === 429
        
        if (isRateLimit && attempts < maxAttempts) {
          console.warn(`[Engine] Rate limit reached. Retrying...`)
          if (onRetryMessage) {
            onRetryMessage(`⏳ Rate limit! Retrying...`)
          }
          await new Promise(r => setTimeout(r, 2000))
          continue
        }
        throw new Error(`AI API error (${response.status}): ${err}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message) {
        throw new Error('Empty response from AI API')
      }
      return data.choices[0].message.content

    } catch (fetchError) {
      if (attempts >= maxAttempts) throw fetchError
      console.error('[Engine] Fetch error:', fetchError)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
//  HEIGHT ESTIMATION for 40% merge rule
// ─────────────────────────────────────────────────────────────────────

function estimatePageHeight(page) {
  let totalHeight = 0

  for (const section of (page.sections || [])) {
    const type = section.componentType
    const props = section.props || {}

    if (type === 'BulletList') {
      totalHeight += (props.items?.length || 3) * COMPONENT_HEIGHT_MAP.BulletList
    } else if (type === 'WorkflowStep') {
      totalHeight += (props.steps?.length || 3) * COMPONENT_HEIGHT_MAP.WorkflowStep
    } else if (type === 'CompetitorRow') {
      totalHeight += (props.competitors?.length || 2) * 60 + 80
    } else if (type === 'DataTable') {
      totalHeight += (props.rows?.length || 4) * 38 + 80  // header + padding + safety
    } else if (type === 'TwoColumnGrid' || type === 'ThreeColumnGrid') {
      // Estimate from children
      const children = props.children || []
      let childMax = 0
      for (const child of children) {
        const childH = COMPONENT_HEIGHT_MAP[child?.componentType] || 140
        childMax = Math.max(childMax, childH)
      }
      totalHeight += childMax + 16
    } else {
      totalHeight += COMPONENT_HEIGHT_MAP[type] || 100
    }
  }

  return totalHeight
}

// ─────────────────────────────────────────────────────────────────────
//  40% MERGE POST-PROCESSOR
// ─────────────────────────────────────────────────────────────────────

function mergeUnderfillPages(doc) {
  const MERGE_THRESHOLD = SAFE_CONTENT_HEIGHT * 0.45 // ≈ 421px — catches more sparse pages
  const issues = []

  // Never merge page 0 (cover) or the last page (closing)
  let i = 1
  while (i < doc.pages.length - 1) {
    const page = doc.pages[i]
    const height = estimatePageHeight(page)

    if (height <= MERGE_THRESHOLD && i + 1 < doc.pages.length) {
      const nextPage = doc.pages[i + 1]
      const nextHeight = estimatePageHeight(nextPage)

      // Check if combined height would fit — conservative ceiling prevents
      // overstuffed merges that later create ugly lonely spillover pages
      if (height + nextHeight <= SAFE_CONTENT_HEIGHT * 0.78) {
        // Merge: append next page's sections into current page
        issues.push(`Merged P${i + 1} (${height}px) with P${i + 2} (${nextHeight}px) — both below or combinable within safe zone`)

        // Add a visual divider between merged sections
        page.sections.push({
          componentType: 'DividerStrip',
          props: { width: 'full', color: '#E2E8F0', marginY: 12 }
        })

        // Append all sections from next page
        page.sections.push(...nextPage.sections)

        // Remove the next page
        doc.pages.splice(i + 1, 1)

        // Don't increment i — re-check current page with merged content
        continue
      }
    }

    i++
  }

  // Re-assign pageIds after merge
  doc.pages.forEach((p, idx) => {
    p.pageId = `page-${idx + 1}`
  })

  return issues
}

// ─────────────────────────────────────────────────────────────────────
//  TEXT LENGTH CLAMPING — deterministic safety net
// ─────────────────────────────────────────────────────────────────────

function clampText(text, maxChars) {
  if (!text || typeof text !== 'string') return text
  if (text.length <= maxChars) return text
  const truncated = text.slice(0, maxChars)
  const lastPeriod = truncated.lastIndexOf('.')
  if (lastPeriod > maxChars * 0.6) {
    return truncated.slice(0, lastPeriod + 1)
  }
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '.' : truncated + '.'
}

function clampTextLengths(doc) {
  const issues = []
  const MAX_BODY = 300
  const MAX_EXEC_SUMMARY = 500
  const MAX_STEP_DESC = 180
  const MAX_BULLETS = 4
  const MAX_STEPS = 5
  const MAX_TABLE_ROWS = 6
  const MAX_TABLE_COLS = 4

  const clampSection = (section, pageNum) => {
    if (!section?.props) return
    const p = section.props
    const type = section.componentType

    if (p.body && typeof p.body === 'string' && p.body.length > MAX_BODY) {
      p.body = clampText(p.body, MAX_BODY)
      issues.push(`P${pageNum}: clamped ${type}.body to ${MAX_BODY} chars`)
    }

    if (p.executiveSummary && p.executiveSummary.length > MAX_EXEC_SUMMARY) {
      p.executiveSummary = clampText(p.executiveSummary, MAX_EXEC_SUMMARY)
      issues.push(`P${pageNum}: clamped executiveSummary to ${MAX_EXEC_SUMMARY} chars`)
    }

    if (type === 'WorkflowStep' && Array.isArray(p.steps)) {
      if (p.steps.length > MAX_STEPS) {
        p.steps = p.steps.slice(0, MAX_STEPS)
        issues.push(`P${pageNum}: capped WorkflowStep to ${MAX_STEPS} steps`)
      }
      p.steps.forEach(step => {
        if (step.description && step.description.length > MAX_STEP_DESC) {
          step.description = clampText(step.description, MAX_STEP_DESC)
        }
      })
    }

    if (type === 'NumberedDeliverable' && Array.isArray(p.bullets)) {
      if (p.bullets.length > MAX_BULLETS) {
        p.bullets = p.bullets.slice(0, MAX_BULLETS)
        issues.push(`P${pageNum}: capped bullets to ${MAX_BULLETS}`)
      }
    }

    if (type === 'BulletList' && Array.isArray(p.items)) {
      if (p.items.length > 6) {
        p.items = p.items.slice(0, 6)
        issues.push(`P${pageNum}: capped BulletList to 6 items`)
      }
    }

    if (type === 'DataTable') {
      if (Array.isArray(p.rows) && p.rows.length > MAX_TABLE_ROWS) {
        p.rows = p.rows.slice(0, MAX_TABLE_ROWS)
        issues.push(`P${pageNum}: capped DataTable to ${MAX_TABLE_ROWS} rows`)
      }
      if (Array.isArray(p.headers) && p.headers.length > MAX_TABLE_COLS) {
        p.headers = p.headers.slice(0, MAX_TABLE_COLS)
        if (Array.isArray(p.rows)) {
          p.rows = p.rows.map(row => row.slice(0, MAX_TABLE_COLS))
        }
        issues.push(`P${pageNum}: capped DataTable to ${MAX_TABLE_COLS} columns`)
      }
    }

    if (type === 'CompetitorRow' && Array.isArray(p.competitors)) {
      if (p.competitors.length > 4) {
        p.competitors = p.competitors.slice(0, 4)
        issues.push(`P${pageNum}: capped CompetitorRow to 4 competitors`)
      }
    }

    if (Array.isArray(p.children)) {
      p.children.forEach(child => clampSection(child, pageNum))
    }
  }

  doc.pages.forEach((page, pi) => {
    (page.sections || []).forEach(section => clampSection(section, pi + 1))
  })

  return issues
}

// ─────────────────────────────────────────────────────────────────────
//  OVERFLOW PAGE SPLITTING — move excess components to new pages
// ─────────────────────────────────────────────────────────────────────

function splitOverflowPages(doc) {
  const OVERFLOW_THRESHOLD = SAFE_CONTENT_HEIGHT * 0.82
  const issues = []

  // Helper: estimate height of a single component
  const singleHeight = (section) => {
    const type = section.componentType
    const props = section.props || {}
    if (type === 'BulletList') return (props.items?.length || 3) * COMPONENT_HEIGHT_MAP.BulletList
    if (type === 'WorkflowStep') return (props.steps?.length || 3) * COMPONENT_HEIGHT_MAP.WorkflowStep
    if (type === 'DataTable') return (props.rows?.length || 4) * 45 + 90
    if (type === 'TwoColumnGrid' || type === 'ThreeColumnGrid') {
      let childMax = 0
      for (const child of (props.children || [])) {
        childMax = Math.max(childMax, COMPONENT_HEIGHT_MAP[child?.componentType] || 120)
      }
      return childMax + 20
    }
    return COMPONENT_HEIGHT_MAP[type] || 120
  }

  let i = 1
  while (i < doc.pages.length) {
    const page = doc.pages[i]
    const height = estimatePageHeight(page)

    if (height > OVERFLOW_THRESHOLD) {
      const sections = page.sections || []

      // ── Strategy 1: Cap grid children to prevent overflow ──
      let redistributed = false
      for (const section of sections) {
        const type = section.componentType
        const props = section.props || {}
        if (type === 'ThreeColumnGrid' && Array.isArray(props.children) && props.children.length > 3) {
          props.children = props.children.slice(0, 3)
          redistributed = true
          issues.push(`P${i + 1}: capped ThreeColumnGrid to 3 children`)
        }
        if (type === 'TwoColumnGrid' && Array.isArray(props.children) && props.children.length > 2) {
          props.children = props.children.slice(0, 2)
          redistributed = true
          issues.push(`P${i + 1}: capped TwoColumnGrid to 2 children`)
        }
      }
      if (redistributed && estimatePageHeight(page) <= OVERFLOW_THRESHOLD) {
        continue // Fixed — re-check
      }

      // ── Strategy 2: Find the split point ──
      let accum = 0
      let splitIndex = -1
      for (let s = 0; s < sections.length; s++) {
        accum += singleHeight(sections[s])
        if (accum > OVERFLOW_THRESHOLD * 0.80 && s > 0 && sections[s].componentType !== 'SectionHeader') {
          splitIndex = s
          break
        }
      }

      if (splitIndex > 0 && splitIndex < sections.length) {
        const currentHeader = sections.find(s => s.componentType === 'SectionHeader')
        const accentColor = currentHeader?.props?.accentColor || '#1A56DB'

        // Count how many real content components would spill over
        const wouldSpill = sections.slice(splitIndex)
        const spillContentCount = wouldSpill.filter(
          s => s.componentType !== 'SectionHeader' && s.componentType !== 'DividerStrip'
        ).length

        // ── Strategy 3a: Lonely spillover → absorb into adjacent pages ──
        if (spillContentCount <= 2) {
          // Try absorbing into the NEXT page
          if (i + 1 < doc.pages.length) {
            const nextPage = doc.pages[i + 1]
            const nextHeight = estimatePageHeight(nextPage)
            const spillHeight = wouldSpill.reduce((h, s) => h + singleHeight(s), 0)

            if (nextHeight + spillHeight <= SAFE_CONTENT_HEIGHT * 0.82) {
              const actualSpill = sections.splice(splitIndex)
              const nextSections = nextPage.sections || []
              const insertIdx = nextSections[0]?.componentType === 'SectionHeader' ? 1 : 0
              const contentOnly = actualSpill.filter(s => s.componentType !== 'SectionHeader')
              nextSections.splice(insertIdx, 0, ...contentOnly)
              nextSections.splice(insertIdx, 0, {
                componentType: 'DividerStrip',
                props: { width: 'full', color: '#E2E8F0', marginY: 8 }
              })
              issues.push(`P${i + 1}: absorbed ${spillContentCount} lonely overflow into P${i + 2}`)
              continue
            }
          }

          // Try trimming the SOURCE page to make overflow fit
          // (remove enrichment-type components from the source page to make room)
          const trimmable = sections.filter((s, idx) =>
            idx > 0 && (s.componentType === 'QuoteCallout' || s.componentType === 'SectionCalloutBox')
          )
          if (trimmable.length > 0) {
            const lastTrimmable = trimmable[trimmable.length - 1]
            const trimIdx = sections.indexOf(lastTrimmable)
            if (trimIdx > 0) {
              sections.splice(trimIdx, 1)
              if (estimatePageHeight(page) <= OVERFLOW_THRESHOLD) {
                issues.push(`P${i + 1}: trimmed enrichment to avoid spillover`)
                continue
              }
            }
          }
        }

        // ── Strategy 3b: Create spillover page with CONTEXTUAL heading (no ugly "cont.") ──
        const actualSpill = sections.splice(splitIndex)
        const spilloverPage = {
          pageId: `page-spill-${i + 1}`,
          pageType: 'content',
          sections: []
        }

        if (actualSpill[0]?.componentType !== 'SectionHeader') {
          // Generate a smart contextual heading instead of "(cont.)"
          const originalHeading = (currentHeader?.props?.heading || '').toLowerCase()
          let spillHeading, spillSubheading

          if (/challeng|problem|pain|issue|risk/.test(originalHeading)) {
            spillHeading = 'Additional Considerations'
            spillSubheading = 'Further factors impacting project success'
          } else if (/solution|architect|approach|design/.test(originalHeading)) {
            spillHeading = 'Architecture Details'
            spillSubheading = 'Deeper technical specifications and design decisions'
          } else if (/feature|capabilit|function|module/.test(originalHeading)) {
            spillHeading = 'Extended Capabilities'
            spillSubheading = 'Additional features powering the solution'
          } else if (/scope|deliver|phase|timeline/.test(originalHeading)) {
            spillHeading = 'Delivery Roadmap'
            spillSubheading = 'Continued project milestones and deliverables'
          } else if (/team|personnel|expert/.test(originalHeading)) {
            spillHeading = 'Extended Team'
            spillSubheading = 'Supporting expertise and advisory roles'
          } else if (/secur|compli|privacy/.test(originalHeading)) {
            spillHeading = 'Compliance Framework'
            spillSubheading = 'Additional security measures and certifications'
          } else if (/value|metric|impact|roi/.test(originalHeading)) {
            spillHeading = 'Impact Analysis'
            spillSubheading = 'Measurable outcomes and projected returns'
          } else {
            spillHeading = 'Key Insights'
            spillSubheading = 'Critical factors for strategic success'
          }

          spilloverPage.sections.push({
            componentType: 'SectionHeader',
            props: {
              sectionLabel: currentHeader?.props?.sectionLabel || '',
              heading: spillHeading,
              subheading: spillSubheading,
              accentColor,
              showDivider: true,
            }
          })
        }

        spilloverPage.sections.push(...actualSpill)

        // If the spillover page is lonely, pad with contextual enrichment
        if (spillContentCount <= 2) {
          const enrichments = getContextualEnrichments(spilloverPage, accentColor)
          for (const enrichment of enrichments) {
            if (estimatePageHeight(spilloverPage) < SAFE_CONTENT_HEIGHT * 0.55) {
              spilloverPage.sections.push(enrichment)
            }
          }
          issues.push(`Split P${i + 1} → enriched spillover P${i + 2} (was ${spillContentCount} component(s))`)
        } else {
          issues.push(`Split P${i + 1} (${height}px) → overflow moved to new P${i + 2}`)
        }

        doc.pages.splice(i + 1, 0, spilloverPage)
        continue
      }
    }


    i++
  }

  doc.pages.forEach((p, idx) => {
    p.pageId = `page-${idx + 1}`
  })

  return issues
}

// ─────────────────────────────────────────────────────────────────────
//  DOCUMENT VALIDATION & ENRICHMENT
// ─────────────────────────────────────────────────────────────────────

function validateAndEnrichDocument(doc, plan) {
  const issues = []
  const accentColor = plan.sections?.[0]?.colorAccent || '#1A56DB'

  // ── Ensure meta exists ──
  if (!doc.meta) {
    doc.meta = {
      title: plan.companyName || 'Proposal',
      tagline: plan.coverTagline || '',
      companyName: plan.companyName || 'Company',
      proposalType: 'Strategic Proposal',
      date: new Date().toISOString().split('T')[0],
      theme: plan.theme || 'TechBlue',
    }
    issues.push('Injected missing meta')
  }

  // Ensure proposalType is always populated
  if (!doc.meta.proposalType) {
    doc.meta.proposalType = 'Strategic Proposal'
  }

  if (!doc.pages || !Array.isArray(doc.pages) || doc.pages.length === 0) {
    throw new Error('Document has no pages. Please retry.')
  }

  // ── Filter unknown components from every page ──
  let imgCounter = 0
  const seenImageIds = new Set()
  
  const ensureUniqueImageId = () => {
    imgCounter++
    return `img_${imgCounter}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  }

  const ensureImageIds = (components) => {
    if (!Array.isArray(components)) return
    components.forEach(comp => {
      if (!comp) return
      if (!comp.props) comp.props = {}

      if (comp.componentType === 'CoverPage') {
        const existingId = comp.props.imageId
        if (!existingId || seenImageIds.has(existingId)) {
          comp.props.imageId = ensureUniqueImageId()
        }
        seenImageIds.add(comp.props.imageId)
      } else if (comp.componentType === 'ImagePlaceholder') {
        const existingId = comp.props.id
        if (!existingId || seenImageIds.has(existingId)) {
          comp.props.id = ensureUniqueImageId()
        }
        seenImageIds.add(comp.props.id)
      }

      // Recurse into grid children
      if (comp.props.children && Array.isArray(comp.props.children)) {
        ensureImageIds(comp.props.children)
      }
    })
  }

  doc.pages.forEach((page, pi) => {
    if (!page.sections || !Array.isArray(page.sections)) {
      page.sections = []
    }
    const before = page.sections.length
    page.sections = page.sections.filter(s => {
      if (!s?.componentType) return false
      if (!VALID_COMPONENT_NAMES.includes(s.componentType)) {
        console.warn(`[Validation] Dropped unknown "${s.componentType}" on page ${pi + 1}`)
        return false
      }
      return true
    })
    
    // Auto-inject missing IDs for images so the prompt system can reference them
    ensureImageIds(page.sections)

    if (page.sections.length < before) {
      issues.push(`P${pi + 1}: dropped ${before - page.sections.length} invalid components`)
    }
  })

  // ── Ensure CoverPage is first ──
  if (!doc.pages[0].sections.length || doc.pages[0].sections[0].componentType !== 'CoverPage') {
    issues.push('CRITICAL: CoverPage missing from page 1')
  }

  // ── Ensure ContactFooter is last ──
  const lastPage = doc.pages[doc.pages.length - 1]
  const lastSec = lastPage.sections[lastPage.sections.length - 1]
  if (!lastSec || lastSec.componentType !== 'ContactFooter') {
    lastPage.sections.push({
      componentType: 'ContactFooter',
      props: {
        companyName: doc.meta.companyName || plan.companyName || 'Company',
        tagline: doc.meta.tagline || plan.coverTagline || '',
        phone: '+91 90280 00133',
        email: 'contact@company.com',
        website: 'www.company.com',
        darkBg: true,
        copyrightText: `© ${new Date().getFullYear()} ${doc.meta.companyName || 'Company'}. All rights reserved.`,
      },
    })
    issues.push('Injected missing ContactFooter')
  }

  // ── Ensure every content page starts with SectionHeader ──
  for (let pi = 1; pi < doc.pages.length; pi++) {
    const page = doc.pages[pi]
    if (page.sections.length > 0 && page.sections[0].componentType !== 'SectionHeader') {
      // Skip if it's only ContactFooter
      if (page.sections.length === 1 && page.sections[0].componentType === 'ContactFooter') continue

      page.sections.unshift({
        componentType: 'SectionHeader',
        props: {
          sectionLabel: `SECTION ${String(pi).padStart(2, '0')}`,
          heading: 'Key Insights',
          subheading: 'Critical factors for strategic success',
          accentColor,
          showDivider: true,
        },
      })
      issues.push(`P${pi + 1}: injected missing SectionHeader`)
    }
  }

  // ── TEXT CLAMPING (before height estimation) ──
  const clampIssues = clampTextLengths(doc)
  issues.push(...clampIssues)

  // ── ENRICHMENT: Pad very sparse content pages (contextual) ──
  for (let pi = 1; pi < doc.pages.length - 1; pi++) {
    const page = doc.pages[pi]
    const height = estimatePageHeight(page)

    // If a page is below 50% fill and NOT the closing page, enrich it
    if (height < SAFE_CONTENT_HEIGHT * 0.50) {
      const contentSections = page.sections.filter(s => s.componentType !== 'SectionHeader')
      if (contentSections.length < 2) {
        issues.push(`P${pi + 1}: only ${height}px estimated — contextual enriching`)

        const enrichments = getContextualEnrichments(page, accentColor)
        let enrichIdx = 0
        while (estimatePageHeight(page) < SAFE_CONTENT_HEIGHT * 0.55 && enrichIdx < enrichments.length) {
          page.sections.push(enrichments[enrichIdx])
          enrichIdx++
        }
      }
    }
  }

  // ── 40% MERGE POST-PROCESSING ──
  const mergeIssues = mergeUnderfillPages(doc)
  issues.push(...mergeIssues)

  // ── OVERFLOW SPLITTING (after merge — catch any overstuffed pages) ──
  const splitIssues = splitOverflowPages(doc)
  issues.push(...splitIssues)

  // ── POST-SPLIT ENRICHMENT: catch any sparse pages created by split ──
  for (let pi = 1; pi < doc.pages.length - 1; pi++) {
    const page = doc.pages[pi]
    const height = estimatePageHeight(page)
    if (height < SAFE_CONTENT_HEIGHT * 0.45) {
      const contentCount = page.sections.filter(
        s => s.componentType !== 'SectionHeader' && s.componentType !== 'DividerStrip'
      ).length
      if (contentCount <= 2) {
        const enrichments = getContextualEnrichments(page, accentColor)
        for (const enrichment of enrichments) {
          if (estimatePageHeight(page) < SAFE_CONTENT_HEIGHT * 0.55) {
            page.sections.push(enrichment)
          }
        }
        issues.push(`P${pi + 1}: post-split enrichment (${height}px → ${estimatePageHeight(page)}px)`)
      }
    }
  }

  // ── Image count check ──
  let imgCount = 0
  doc.pages.forEach(p => p.sections.forEach(s => { if (s.componentType === 'ImagePlaceholder') imgCount++ }))
  if (imgCount > 3) issues.push(`WARNING: ${imgCount} images (max 3)`)

  // ── Log results ──
  if (issues.length > 0) {
    console.log('[Validation] Issues found and repaired:', issues)
  }

  return { document: doc, issues }
}

// ─────────────────────────────────────────────────────────────────────
//  MAIN ENGINE EXPORT
// ─────────────────────────────────────────────────────────────────────

export const proposalEngine = {
  async generateProposal(prompt, onThought) {
    // ─── PHASE 1: Structural Planner ─────────────────────────────
    onThought({ phase: 1, text: 'Starting Phase 1 — Layout Intelligence Planning...' })

    const phase1Response = await callAI(PHASE1_SYSTEM_PROMPT, prompt, 4000, msg => onThought({ phase: 1, text: msg }), 0.85)

    const thoughts = extractThoughts(phase1Response)
    for (const t of thoughts) {
      onThought({ phase: 1, text: t })
    }

    const plan = extractJSON(phase1Response)
    const mode = plan.pageMode || (plan.pageCount <= 5 ? 'compact' : plan.pageCount <= 8 ? 'standard' : 'enterprise')
    plan.pageMode = mode

    onThought({ phase: 1, text: `✓ Plan: ${mode} mode → ${plan.pageCount} pages, theme: ${plan.theme}` })

    console.log('[Engine] Phase 1 Plan:', {
      mode, theme: plan.theme, pageCount: plan.pageCount,
      sections: plan.sections?.length, images: plan.imagePlacements,
    })

    // ─── PHASE 2: Content Generator ──────────────────────────────
    onThought({ phase: 2, text: `Starting Phase 2 — Writing ${mode} proposal (${plan.pageCount} pages)...` })

    // Variation seed ensures different layouts each generation
    const variationSeed = Math.floor(Math.random() * 10000)
    const layoutHints = [
      'Use TwoColumnGrid for the problem page with ChallengeCards side-by-side.',
      'Use ThreeColumnGrid for features and TwoColumnGrid for challenges.',
      'Place WorkflowStep + ImagePlaceholder together on the solution page.',
      'Mix standalone ChallengeCards with a SectionCalloutBox and QuoteCallout.',
      'Use LargeQuoteHero instead of QuoteCallout on one page for visual impact.',
      'Pair ThreeColumnGrid of StatCards with a DividerStrip and LargeQuoteHero.',
      'Combine BulletList + NumberedDeliverables on the scope page.',
      'Use BiometricMiniCards alongside FeatureCards in a TwoColumnGrid.',
      'Put CredentialCards with a QuoteCallout and TagBadge on the validation page.',
      'Use stacked ChallengeCards (no grid) with a standalone QuoteCallout below.',
      'Place PersonnelCards in a TwoColumnGrid with a SectionCalloutBox for team.',
      'Use CompetitorRow with TagBadges and a DividerStrip for competitive analysis.',
      'Lead with ThreeColumnGrid of StatCards on page 2, then challenges on page 3.',
      'Put ImagePlaceholder between two ChallengeCards in a stacked layout.',
      'Use WorkflowStep (5+ steps) alone on the solution page for maximum detail.',
      'Combine FeatureCards in ThreeColumnGrid with BiometricMiniCards below.',
    ]
    // Shuffle and pick 4 diverse hints
    const shuffled = [...layoutHints].sort(() => Math.random() - 0.5)
    const selectedHints = shuffled.slice(0, 4)
    const accentColor = plan.brandColors?.primary || plan.sections?.[0]?.colorAccent || '#1A56DB'

    // Seed-based ordering variation
    const orderingStyle = variationSeed % 3 === 0
      ? 'Lead with metrics/value on page 2, then challenges on page 3.'
      : variationSeed % 3 === 1
        ? 'Lead with challenges on page 2, solution on page 3, then features.'
        : 'Lead with solution architecture on page 2, then challenges, then features.'

    const phase2Message = `Here is the user's original brief for reference:
"""
${prompt}
"""

Here is the structural plan:
${JSON.stringify(plan, null, 2)}

Please generate exactly ${plan.pageCount} pages.
Mode: ${mode}
Theme accent: ${accentColor}
Company: ${plan.companyName}
Variation seed: ${variationSeed}

Color consistency: Use "${accentColor}" as the accentColor for all components on all pages. Use "${accentColor}15" or "${accentColor}20" for iconBg fields.

Layout variation hints for this generation:
- ${selectedHints[0]}
- ${selectedHints[1]}
- ${selectedHints[2]}
- ${selectedHints[3]}
- ${orderingStyle}
- Each content page should use a different component combination from every other page.

Image prompt rules:
- IMPORTANT: The LLM must intelligently refine the image concept based strictly on the surrounding textual content of the page.
- INFOGRAPHICS vs REAL-LIFE: If the image requires technological representation (e.g., system architecture, abstract software concepts, data analytics, network topologies), you MUST describe it as a detailed "infographic" or "UI dashboard visualization" with precise visual elements.
- OTHERWISE, EVERY OTHER IMAGE MUST depict REAL-LIFE USAGE of the product in its actual physical environment (e.g., workers operating the device on a construction site, surgeons using equipment, sensors mounted in a factory).
- Every coverImagePrompt should show the company's actual proposed product/system as a stunning hero shot or infographic depending on the rule above (not generic stock photos).
- Every ImagePlaceholder imagePrompt should visualize the product in context:
  - Challenges page: Real-life scenes of the problem or an infographic showing bottlenecks.
  - Solution/Features page: Real-life active deployment or an infographic of the architecture.
- Include the product name in the prompt when available.
- Use photorealistic, cinematic style for real-life images, and clean minimalist vector style for infographics.

Page structure: Each content page should contain one thematic section with a SectionHeader + 3-6 supporting components. Make each section visually robust to fill the page layout.

Please provide the final proposal document as a valid JSON object formatted for our renderer.`

    let rawDoc = null;
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      if (attempts > 1) {
        onThought({ phase: 2, text: `⚠ Validation failed. Regenerating proposal (Attempt ${attempts}/3)...` });
      }

      const phase2Response = await callAI(PHASE2_SYSTEM_PROMPT, phase2Message, 16000, msg => onThought({ phase: 2, text: msg }));
      onThought({ phase: 2, text: `Parsing document...` });
      try {
        rawDoc = extractJSON(phase2Response);

        // HARD VALIDATION CHECK
        const val = rawDoc.validation;
        if (val) {
          if (
            !val.namesPreserved ||
            !val.sectionsPreserved ||
            !val.orderCorrect ||
            !val.noPlaceholderNames ||
            !val.noDuplicateQuotes ||
            !val.page1FitsCleanly ||
            !val.imageCountValid ||
            !val.factsSourcedOrUserProvided
          ) {
            console.warn('[Engine] AI self-validation failed: ', val);
            if (attempts === 3) throw new Error("AI failed to pass self-validation after 3 attempts.");
            continue; // Retry
          }
        }
        break; // Parse and validation passed
      } catch (err) {
        if (attempts === 3) throw err; // Re-throw if out of attempts
      }
    }
    // ─── VALIDATION & DENSITY ENRICHMENT ─────────────────────────
    onThought({ phase: 2, text: 'Running density validation, enrichment & 40% merge...' })
    const { document, issues } = validateAndEnrichDocument(rawDoc, plan)

    if (issues.length > 0) {
      onThought({ phase: 2, text: `⚠ Repaired ${issues.length} issue(s)` })
      issues.forEach(i => console.log(`  → ${i}`))
    }

    // Final structure log
    const structureLog = document.pages.map((p, i) =>
      `P${i + 1}(${p.sections.length}): ${p.sections.map(s => s.componentType).join(' → ')}`
    )
    console.log('[Engine] Final Structure:\n' + structureLog.join('\n'))

    onThought({ phase: 2, text: `✓ Complete: ${document.pages.length} pages, one-section-per-page, all validated` })

    return { plan, document }
  },

  async refinePageContent(document, pageIndex, comment, plan, onThought) {
    onThought({ phase: 2, text: `Starting refinement for Page ${pageIndex + 1}...` })
    
    // Validate page exists
    if (!document || !document.pages || !document.pages[pageIndex]) {
      throw new Error(`Page ${pageIndex + 1} does not exist in the document.`)
    }

    const pageToRefine = document.pages[pageIndex]
    const maxTokens = 4000
    // Reuse some system constants via template string
    const systemPrompt = `You are a precision AI layout assistant modifying a single page of an A4 proposal document.
Your task is to analyze the user's requested changes, apply them smoothly to the given page content, and return a single valid JSON object representing the modified sections array for this exact page.

GUIDELINES:
1. Layout Balance: Please try to ensure the page doesn't visually spill over. One page has around ~935px of vertical safe space.
2. Text Scoping: Keep text reasonably concise so it fits easily.
3. Component Schema: Use the allowed components listed below.
4. User Requests: If a user asks to add or remove a component, please follow their instructions closely using the available schema.

You have access to these components:
CoverPage, SectionHeader, ChallengeCard, FeatureCard, NumberedDeliverable, StatCard, QuoteCallout, ImagePlaceholder, TwoColumnGrid, ThreeColumnGrid, WorkflowStep, TagBadge, ContactFooter, DividerStrip, SectionCalloutBox, CredentialCard, PageFooterBar, BiometricMiniCard, LargeQuoteHero, BulletList, PersonnelCard, CompetitorRow

ICON USE: use standard semantic keys (warning, alert, check, shield, chart, bolt, cpu, users, globe, target, clock, etc.). Avoid raw SVG data.

OUTPUT FORMAT:
The response must be a single, valid JSON object following the schema below.
{
  "sections": [
    { "componentType": "...", "props": {...} }
  ]
}
`

    const userMessage = `PROPOSAL METADATA:
Title: ${document.meta?.title}
Company: ${document.meta?.companyName}
Theme Accent: ${plan?.sections?.[0]?.colorAccent || '#1A56DB'}

CURRENT PAGE CONTENT (Page ${pageIndex + 1}):
${JSON.stringify(pageToRefine.sections, null, 2)}

USER REFINEMENT REQUEST:
"${comment}"

Please rewrite this page's sections based on the refinement request. Keep what works, change what's asked. Provide the updated page as a single JSON object containing a "sections" array. Ensure the first component is SectionHeader if this is not the Cover Page or Contact Footer page (unless user asks to delete it).`

    let newSections = null;
    let attempts = 0;

    while (attempts < 3) {
      attempts++;
      if (attempts > 1) {
        onThought({ phase: 2, text: `⚠ Validation failed. Regenerating page (Attempt ${attempts}/3)...` });
      }

      const response = await callAI(systemPrompt, userMessage, maxTokens, msg => onThought({ phase: 2, text: msg }));
      
      try {
        const parsed = extractJSON(response);
        if (!parsed.sections || !Array.isArray(parsed.sections)) {
          throw new Error('Response missing "sections" array');
        }

        // Validate generic components
        const validSections = parsed.sections.filter(s => {
          if (!s?.componentType) return false;
          if (!VALID_COMPONENT_NAMES.includes(s.componentType)) {
            console.warn(`[Refinement] Dropped unknown "${s.componentType}"`);
            return false;
          }
          return true;
        });

        if (validSections.length === 0) {
          throw new Error("No valid components were returned");
        }

        newSections = validSections;
        break; // Parse passed
      } catch (err) {
        if (attempts === 3) throw err;
      }
    }

    onThought({ phase: 2, text: `✓ Page ${pageIndex + 1} refined successfully with ${newSections.length} components.` })

    // Build the updated document
    const updatedDocument = JSON.parse(JSON.stringify(document)) // Deep clone 
    updatedDocument.pages[pageIndex].sections = newSections

    return updatedDocument
  },

  // ─────────────────────────────────────────────────────────────────
  //  FULL DOCUMENT REFINEMENT (Chat-style follow-up)
  // ─────────────────────────────────────────────────────────────────

  async refineDocument(document, plan, conversationHistory, followUpPrompt, onThought) {
    onThought({ phase: 2, text: `Starting full document refinement...` })
    onThought({ phase: 2, text: `Instruction: "${followUpPrompt.length > 100 ? followUpPrompt.slice(0, 100) + '...' : followUpPrompt}"` })

    const accentColor = plan?.brandColors?.primary || plan?.sections?.[0]?.colorAccent || '#1A56DB'

    const REFINE_SYSTEM_PROMPT = `You are a professional proposal editor. You receive an existing, fully structured proposal document (JSON) and a user's follow-up instruction. Your task is to apply the requested modifications and return the updated complete document.

--- Core Rules ---
1. PRESERVE everything the user doesn't ask to change. Don't rewrite content needlessly.
2. If the user asks to ADD a section/page, insert it at a logical position and create all required components.
3. If the user asks to REMOVE a section/page, remove it entirely and re-adjust page numbering.
4. If the user asks to CHANGE tone, content, or style — update ALL affected components consistently.
5. If the user DOES NOT ask to change aesthetics/colors, maintain the same accentColor (${accentColor}) across all components for visual consistency.
6. If the user DOES ask to change colors, theme, or aesthetics (e.g. "change background to black", "make it dark mode", "use red color"), you MUST output a "themeUpdates" object within the meta block. This allows overriding deep styling.
7. Keep CoverPage as page 1 and ContactFooter as the last component on the last page.
8. Every content page (not cover, not closing) must start with a SectionHeader component.

--- Component Prop Reference ---

CoverPage: { badgeText, companyName, title, tagline, dividerColor, imageId, executiveSummary, coverImagePrompt }
SectionHeader: { sectionLabel ("SECTION 01"), heading, subheading, accentColor, showDivider: true }
ChallengeCard: { icon (ICON KEY), iconBg, iconColor, title, body (3+ sentences), variant ("outlined"|"filled") }
FeatureCard: { icon (ICON KEY), iconBg, iconColor, title, body (2+ sentences), showBorder: true, accentColor }
SectionCalloutBox: { icon (ICON KEY), iconBg, title, body (2+ sentences), accentColor }
NumberedDeliverable: { number, title, body (2+ sentences), bullets (string[]), variant, accentColor }
StatCard: { metric, label, body, accentColor, cardBg }
WorkflowStep: { steps: [{stepNumber, title, description}], accentColor }
QuoteCallout: { quote, accentColor }
ImagePlaceholder: { id (unique), label, aspectRatio ("16/9"), rounded: true, imagePrompt }
TwoColumnGrid: { children: [{componentType, props}, {componentType, props}] }
ThreeColumnGrid: { children: [{componentType, props}, {componentType, props}, {componentType, props}] }
LargeQuoteHero: { line1, line2, accentColor }
BulletList: { items: ["point 1", ...], iconStyle ("check"|"chevron"), accentColor }
CredentialCard: { icon (ICON KEY), title, badge, body, highlightBox, url, accentColor }
ContactFooter: { companyName, phone, email, website, darkBg: true, tagline, copyrightText }
DividerStrip: { width ("short"), color, marginY: 8 }
PersonnelCard: { name, role, accolade, bio, accentColor }
CompetitorRow: { competitors: [{name, description, weakness}], ourAdvantage, accentColor }
BiometricMiniCard: { icon (ICON KEY or emoji), label, caption }
TagBadge: { text, color, textColor, size ("sm"|"md") }
PageFooterBar: (auto-rendered)

--- Icon Keys ---
warning, alert, check, check-simple, info, shield, shield-check, lock, key, fingerprint, chart, trending-up, currency, briefcase, presentation, bolt, cpu, server, wifi, signal, cloud, cog, database, globe, users, user, chat, phone, email, target, rocket, flag, star, light, clock, calendar, leaf, sun, water, fire, mountain, heart, pulse, medical, stethoscope, document, clipboard, folder, building, home, map, location, arrow-right, arrow-up, refresh, download, link, wrench, puzzle, scale, trophy

--- Page Height Density (50% Rule) ---
Do NOT overload pages. Component costs: ImagePlaceholder(16:9)=38%, WorkflowStep(5 steps)=48%, TwoColumnGrid w/ 4 cards=55%, ThreeColumnGrid w/ 3 StatCards=22%, ChallengeCard=18%, SectionHeader=14%, QuoteCallout=12%, NumberedDeliverable w/ bullets=20%, SectionCalloutBox=14%, ContactFooter=16%. Total must stay under 85%.

--- Output Format ---
Return a complete valid JSON document with this schema. If no theme changes are requested, omit "themeUpdates".
{
  "meta": { 
    "title": string, 
    "tagline": string, 
    "companyName": string, 
    "proposalType": string, 
    "date": string, 
    "theme": string,
    "themeUpdates": { "bg": string (hex), "text": string (hex), "primary": string (hex), "accent": string (hex), "mutedText": string (hex), "cardBg": string (hex) }
  },
  "validation": { "namesPreserved": true, "sectionsPreserved": true, "orderCorrect": true, "noPlaceholderNames": true, "noDuplicateQuotes": true, "page1FitsCleanly": true, "imageCountValid": true, "factsSourcedOrUserProvided": true },
  "pages": [
    {
      "pageId": string,
      "pageType": "cover" | "content" | "closing",
      "sections": [
        { "componentType": string, "props": {} }
      ]
    }
  ]
}`

    // Build conversation context string
    let conversationContext = ''
    if (conversationHistory.length > 0) {
      conversationContext = '\n--- Previous Conversation ---\n'
      for (const msg of conversationHistory) {
        const role = msg.role === 'user' ? 'USER' : 'ASSISTANT'
        conversationContext += `${role}: ${msg.content}\n`
      }
      conversationContext += '--- End of Conversation ---\n'
    }

    const userMessage = `CURRENT DOCUMENT (full JSON):
${JSON.stringify(document, null, 2)}

ORIGINAL PLAN CONTEXT:
- Domain: ${plan?.domain || 'N/A'}
- Company: ${plan?.companyName || document.meta?.companyName || 'N/A'}
- Theme: ${plan?.theme || 'TechBlue'}
- Accent Color: ${accentColor}
- Current Page Count: ${document.pages?.length || 0}
${conversationContext}
NEW USER INSTRUCTION:
"${followUpPrompt}"

Please apply the user's instruction to the document and return the complete updated JSON document. Preserve all content that the user didn't ask to change. If adding new pages, place them logically. If removing pages, ensure the remaining pages are well-connected.`

    let rawDoc = null
    let attempts = 0

    while (attempts < 3) {
      attempts++
      if (attempts > 1) {
        onThought({ phase: 2, text: `⚠ Parse failed. Retrying refinement (Attempt ${attempts}/3)...` })
      }

      const response = await callAI(REFINE_SYSTEM_PROMPT, userMessage, 16000, msg => onThought({ phase: 2, text: msg }))
      onThought({ phase: 2, text: 'Parsing refined document...' })

      try {
        rawDoc = extractJSON(response)

        if (!rawDoc.pages || !Array.isArray(rawDoc.pages) || rawDoc.pages.length === 0) {
          throw new Error('Refined document has no pages')
        }

        break // Success
      } catch (err) {
        if (attempts === 3) throw err
      }
    }

    // Run through the same validation pipeline
    onThought({ phase: 2, text: 'Running validation & enrichment on refined document...' })
    const { document: validatedDoc, issues } = validateAndEnrichDocument(rawDoc, plan)

    if (issues.length > 0) {
      onThought({ phase: 2, text: `⚠ Repaired ${issues.length} issue(s)` })
      issues.forEach(i => console.log(`  → ${i}`))
    }

    const structureLog = validatedDoc.pages.map((p, i) =>
      `P${i + 1}(${p.sections.length}): ${p.sections.map(s => s.componentType).join(' → ')}`
    )
    console.log('[Engine] Refined Structure:\n' + structureLog.join('\n'))

    onThought({ phase: 2, text: `✓ Refinement complete: ${validatedDoc.pages.length} pages, all validated` })

    return { document: validatedDoc, plan }
  },

  async analyzeRequirementsChat(chatHistory) {
    const CHAT_SYSTEM_PROMPT = `You are a professional Sales Engineer and expert proposal writer.
    
Your goal is to gather requirements from the user before generating an exhaustive project proposal.
Review the conversation history. If there are missing critical details like numbers, company name, specific objectives, or key pain points, ASK the user up to a few clarifying questions.

Output ONLY the text you want to say to the user. No markdown tags around everything, just plain conversational text. Do not generate the proposal layout yet.

CRITICAL INSTRUCTION:
If the user indicates they want to "skip", "just generate it", "no need", OR if you feel you have gathered enough information to generate a solid proposal on your own, you MUST output EXPLICTLY the EXACT string:
[READY_TO_GENERATE]
(and nothing else) to trigger the generator pipeline.`

    try {
      // Build a text based conversation log for the AI
      const conversationLog = chatHistory.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n')
      const userMsg = `Below is the conversation history. Please analyze it and provide your next response (clarifying question or [READY_TO_GENERATE]).\n\n${conversationLog}`

      // Use the internal callAI helper
      // We pass 1.0 temperature for maximum creativity in questions
      const response = await callAI(CHAT_SYSTEM_PROMPT, userMsg, 500, null, 1.0)
      return response.trim()
    } catch (e) {
      console.error('[Engine] analyzeRequirementsChat failed', e)
      throw e
    }
  }
}
