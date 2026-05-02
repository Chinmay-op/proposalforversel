# COMPONENT VISUAL REFERENCE
## Extracted from TerraTrack PDF Analysis

This file maps every visual pattern seen in the TerraTrack proposal to the component that implements it.
Use this as the ground truth for how each component must look.

---

## PAGE 1 — Cover (CoverPage)

```
┌──────────────────────────────────────────────────────────────┐
│ STRATEGIC PROPOSAL (11px small-caps, dark)   Sateroid Logo  │
│                                              Innovations      │
│                                              Pvt. Ltd.        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TerraTrack™                                                 │
│  Underground RTLS                                            │
│                     ← 52-56px bold, dark navy, lineH 1.15   │
│                                                              │
│  Eliminate Blind Spots. Ensure Every Miner Returns Home      │
│  Safely.            ← 20px medium, #64748B                  │
│                                                              │
│  [═══════]          ← 60px × 4px, accent/brand color        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  IMAGE (16:9)                          │  │
│  │      [WIRELESS COMMUNICATION NODES label callout]      │  │
│  │      [WEARABLE TRACKING SENSOR label callout]          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ⚡ EXECUTIVE SUMMARY    ← 11px uppercase, accent color  │  │
│  │                                                        │  │
│  │  When an incident occurs 2 kilometers underground,     │  │
│  │  the biggest enemy isn't the environment—it is time.   │  │
│  │  ...                  ← 14px, justified, #374151       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Key observations:**
- Badge text is very small (11px), no background, just letterSpacing
- Title can be multi-line using `\n` in the prop
- Divider is SHORT (60px), not full-width
- Executive summary card has light gray-blue background (#F8FAFC)
- Executive summary label has a small SVG icon before the text

---

## PAGE 2 — Challenge (SectionHeader + ChallengeCard × 3)

```
[════] DividerStrip (short, brand color)

SECTION 01              ← 11px uppercase, letterSpacing 2px, brand color
The Challenge           ← 36px bold, #0F172A
The High Cost of Total  ← 16px, #64748B
Disconnection

┌──────────────────────────────────────────────────────────┐
│  [⚠️]  The "Golden Hour" of Rescue                       │
│        ← 40×40px rounded square icon bg                  │
│                                                          │
│  At depths of 1–2 km, standard cellular networks        │
│  and GPS signals are completely dead...                  │
│                    ← 14px, #6B7280, lineH 1.75          │
└──────────────────────────────────────────────────────────┘  ← variant: outlined (white bg, border)

┌──────────────────────────────────────────────────────────┐
│  [ℹ️]  Operational Blindness                              │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  [📶]  The Failure of Legacy Systems                     │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘
```

**Key observations:**
- ChallengeCards are STACKED (full-width), not in a grid
- Each card has 24px padding, 12px border-radius
- Icon background is a light tint of the icon color
- Body text is justified in the PDF

---

## PAGE 3 — System Architecture (SectionHeader + SectionCalloutBox + WorkflowStep)

```
[════] DividerStrip

SECTION 02
System Architecture
The TerraTrack Independent Backbone

[Full-width intro paragraph]
"We do not fight the rock; we work around it..."

[NumberedDeliverable or WorkflowStep style:]
┌──────────────────────────────────────────────────────────┐
│ [⌚]  1. Smart Wearable Watches                           │
│      ← icon on left, number in title                     │
│                                                          │
│  Our IP67-rated smart wrist watches operate on...        │
│                                                          │
│  ┌───────────────┐ ┌──────────────────┐ ┌─────────────┐  │
│  │  💗 Pulse     │ │  🩸 Blood O2    │ │  ⚠️ Fall     │  │ ← ThreeColumnGrid of mini cards
│  │  Rate         │ │  (SpO₂)         │ │  Detection   │  │
│  └───────────────┘ └──────────────────┘ └─────────────┘  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ [📡]  2. Wireless Beacon Mesh                            │
│  Rugged, intrinsically safe beacons...                   │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ [🖥]  3. Edge Gateway & Control Room                      │
│  The underground mesh network feeds into...              │
└──────────────────────────────────────────────────────────┘
```

**Key observations:**
- Architecture numbered items use SectionCalloutBox style (icon left, content right)
- Sub-items use ThreeColumnGrid with small StatCard-like mini-cards
- Numbers are part of the title text (not the big circle number)
- No top divider on this page style

---

## PAGE 4 — Feature Spotlight: Spatial Monitoring (SectionHeader + ImagePlaceholder + TwoColumnGrid + SectionCalloutBox)

```
FEATURE SPOTLIGHT: SPATIAL MONITORING  ← 11px uppercase, brand color
Real-Time Spatial Monitoring           ← 36px bold

┌──────────────────────────────────────────────────────────┐
│                   IMAGE (16:9)                           │  ← ImagePlaceholder
│    [ULTRA-RUGGED MINING DISPATCH TABLET callout]         │
└──────────────────────────────────────────────────────────┘

Total Visibility. Zero Guesswork.      ← 18px bold
See your entire workforce mapped...    ← 14px body paragraph

┌──────────────────────┐ ┌──────────────────────────────┐
│ ✓ Automated          │ │ ✓ Zone-Level Accuracy         │  ← TwoColumnGrid of FeatureCards
│   Roll-Calls         │ │   Scalable accuracy based...  │
│   Eliminate manual...│ │                              │
└──────────────────────┘ └──────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ ✓  Evacuation Assurance                                  │  ← SectionCalloutBox (full-width)
│    During an emergency protocol, the dashboard...        │
└──────────────────────────────────────────────────────────┘
```

**Key observations:**
- SectionHeader has NO sectionLabel number ("SECTION XX") — uses custom label "FEATURE SPOTLIGHT: ..."
- Image placeholder is LARGE and above content
- Mix of TwoColumnGrid + full-width SectionCalloutBox at bottom
- FeatureCards have checkmark icons, not accent bars here

---

## PAGE 5 — Feature Spotlight: AI Analytics (TwoColumnGrid of FeatureCards + ImagePlaceholder + SectionCalloutBox)

```
FEATURE SPOTLIGHT: AI ANALYTICS
AI Analytics & Geofencing

┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ 📈 AI-Powered Analytics          │ │ ⚠️ Dynamic Geofencing            │  ← TwoColumnGrid
│   We don't just track; we        │ │   Supervisors can draw digital   │
│   analyze. The system's AI       │ │   perimeters directly on the     │
│   engine monitors historical...  │ │   control dashboard...           │
└──────────────────────────────────┘ └──────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                   IMAGE (16:9)                                       │  ← ImagePlaceholder (2nd on doc)
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Proactive Incident Prevention                                        │  ← SectionCalloutBox
│ Geofencing combined with AI analytics transitions your safety...     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 6 — Feature Spotlight: SOS Network (SectionHeader + ImagePlaceholder + SectionCalloutBox × 3)

```
FEATURE SPOTLIGHT: SOS NETWORK
Decentralized SOS Reliability

┌──────────────────────────────────────────────────────────────────────┐
│                   IMAGE (16:9) — 3rd image in document              │
└──────────────────────────────────────────────────────────────────────┘

A Network That Cannot Be Broken.       ← 18px bold
Traditional daisy-chained...           ← 14px body

┌──────────────────────────────────────────────────────────────────────┐
│ [📡]  Technology: Wireless Reconstructive Beacon Mesh                │  ← SectionCalloutBox
│       Unlike RFID which requires a miner to pass near...             │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ [🛡]  Instant Panic Alarms                                           │
│       A single physical button press on the smart watch...           │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ [📶]  Self-Healing Data Routing                                      │
│       If a tunnel section collapses...                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## PAGE 7 — Scope of Work (SectionHeader + NumberedDeliverable × 4)

```
SECTION 03
Scope of Work & Deliverables

┌──────┐ ┌────────────────────────────────────────────────────────────┐
│  01  │ │ Site Survey & Coverage Design                               │
│      │ │ Our engineering team maps your specific tunnel geometries...│
└──────┘ └────────────────────────────────────────────────────────────┘

┌──────┐ ┌────────────────────────────────────────────────────────────┐
│  02  │ │ Hardware Supply & Commissioning                             │
│      │ │ • Supply of IP67 ruggedized Wearable Smart Watches.        │
│      │ │ • Supply and mounting of Intrinsically Safe Mesh Beacons.  │
│      │ │ • Installation of Local Edge Gateways.                     │
└──────┘ └────────────────────────────────────────────────────────────┘

┌──────┐ ┌────────────────────────────────────────────────────────────┐
│  03  │ │ Dashboard & AI Integration                                  │
│      │ │ Deployment of the centralized software interface...        │
└──────┘ └────────────────────────────────────────────────────────────┘

┌──────┐ ┌────────────────────────────────────────────────────────────┐
│  04  │ │ Training & Lifecycle AMC                                    │
│      │ │ Comprehensive training provided to mine safety officers...  │
└──────┘ └────────────────────────────────────────────────────────────┘
```

**Key observations:**
- Number circles are OUTLINED (border, not filled) in this design
- The number text uses the accent color
- No body intro text — goes straight to deliverables
- Bullets use bullet points (•), not checkmarks here

---

## PAGE 8 — Strategic Value (SectionHeader + large headline + TwoColumnGrid + SectionCalloutBox + QuoteCallout)

```
SECTION 04
The Strategic Value

        Stop guessing.              ← 40px light weight, centered
        Start controlling.          ← 40px bold, accent color, centered

┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ Life-Saving Speed                │ │ Operational ROI                  │  ← TwoColumnGrid of FeatureCards
│ (accent color title)             │ │ (accent color title)             │
│ In emergencies, exact locations  │ │ Safety tech that pays for itself. │
│ are pushed to the surface...     │ │ Eliminate hours wasted daily...  │
└──────────────────────────────────┘ └──────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ ⚖️  Regulatory Compliance                                            │  ← SectionCalloutBox
│     TerraTrack generates automated shift reports...                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  "By adopting TerraTrack, you evolve from reactive emergency        │  ← QuoteCallout
│   scrambling to proactive, data-driven operational dominance."       │
└──────────────────────────────────────────────────────────────────────┘
```

**Key observations:**
- Large centered headline is NOT a component — it's styled text inside the page, OR a special variant
- FeatureCard titles use accent color here (not bold black)
- QuoteCallout is at the BOTTOM of the page

---

## PAGE 9 — About Us (SectionHeader + intro text + CredentialCard + TwoColumnGrid of FeatureCards)

```
[════]
SECTION 05
About Us & Proven Experience
Sateroid Innovations Pvt. Ltd.

We are Sateroid Innovations Pvt. Ltd., a Nagpur-based technology company...  ← intro text

┌──────────────────────────────────────────────────────────────────────┐
│ ⚡ Flagship Live Project: GEO-VECTRA          ← CredentialCard title │
│ ─────────────────────────────────────────── separator line           │
│ GEO-VECTRA (Geo-Sentinel Network) is an integrated slope stability... │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐  │
│ │  This project demonstrates our direct capability in ruggedized  │  │  ← highlightBox
│ │  sensor deployment, edge-to-dashboard data pipelines...         │  │
│ └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐ ┌──────────────────────────────────┐
│ 🔧 Core Technical Capabilities   │ │ ⚡ Why We're Different           │  ← TwoColumnGrid
│   • Ruggedized IoT sensor...     │ │   Unlike integrators who resell  │
│   • Independent wireless mesh... │ │   off-the-shelf products...      │
│   • AI-driven dashboards...      │ │                                  │
│   • Edge-to-cloud pipelines...   │ │                                  │
└──────────────────────────────────┘ └──────────────────────────────────┘
```

---

## PAGE 10 — Next Steps + Contact Footer

```
Next Steps                           ← no SECTION label, just heading
Let's map your mine.                 ← subheading

[body paragraph: "Every underground topology is unique..."]

┌──────────────────────────────────────────────────────────────────────┐
│ ? WHAT WE NEED FROM YOU         ← SectionCalloutBox or custom       │
│ ─────────────────────────────────────────────────────────────────── │
│ › Approximate tunnel length      › Existing fiber / power map       │
│ › Underground workforce headcount › Known hazard zones              │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ Proposed Implementation Roadmap  ← WorkflowStep                     │
│  1  RF Site Feasibility Assessment                                   │
│  2  Pilot Installation (Targeted Test Zone / Shaft)                 │
│  3  Full Mine Mesh Deployment & Dashboard Handoff                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ [Sateroid Logo]                    AUTHORIZED PARTNER [badge]        │
│ COMPANY INFORMATION                CONTACT DETAILS                  │
│                                    📞 +91 90280 00133               │
│ Sateroid Innovations               ✉️ sateroidinnovations@gmail.com  │
│ Pvt. Ltd.                          🌐 www.sateriod.com              │
│                                                                      │
│ © 2026 SATEROID INNOVATIONS PVT. LTD.           PAGE 10            │
└──────────────────────────────────────────────────────────────────────┘
```

**Key observations:**
- ContactFooter here uses `darkBg: false` (white background)
- Company logo is shown in the footer (LogoUrl prop)
- "AUTHORIZED PARTNER" badge is TagBadge style top-right
- Copyright and page number at very bottom

---

## COMPONENT USAGE FREQUENCY IN TERRATRACK

| Component | Pages Used | Count |
|---|---|---|
| SectionHeader | 2,3,7,8,9,10 | 6 |
| ChallengeCard | 2 | 3 |
| SectionCalloutBox | 3,4,5,6,8,9,10 | 9 |
| FeatureCard (in grid) | 4,5,8,9 | 8 |
| ImagePlaceholder | 1,4,5,6 | 3 (max!) |
| NumberedDeliverable | 7 | 4 |
| TwoColumnGrid | 4,5,8,9 | 4 |
| ThreeColumnGrid | 3 | 1 |
| WorkflowStep | 10 | 1 |
| QuoteCallout | 8 | 1 |
| CredentialCard | 9 | 1 |
| DividerStrip | 2,3,7,8,9 | 5 |
| TagBadge | 10 | 1 |
| CoverPage | 1 | 1 |
| ContactFooter | 10 | 1 |
| PersonnelCard | — | 0 (used in Hydro-Guard type) |
| CompetitorRow | — | 0 (used in competitive proposals) |
| StatCard | — | 0 in TerraTrack, used in B2B proposals |

---

## CRITICAL RENDERING RULES (from PDF analysis)

1. **Body text is justified** (`textAlign: 'justify'`) in TerraTrack — apply to all body paragraphs
2. **Font**: TerraTrack uses a geometric sans-serif. Use `font-family: 'Inter', -apple-system, sans-serif`
3. **Cover title font**: Bold, slightly condensed — use `fontWeight: 800`
4. **Section labels**: ALWAYS uppercase, letterSpacing 2-3px, tiny font (11px)
5. **Card gap**: 16px between cards in grids, 16px marginBottom on stacked cards
6. **Page content gap**: 24px between major sections (SectionHeader → content)
7. **Icon squares**: 40-44px, border-radius 10px, light tint background (not full opacity)
8. **Never use Tailwind** inside proposal components — inline styles only
9. **Page footer**: Every content page (not cover) has "PRODUCT PROPOSAL" + "PAGE 0N" bottom strip
10. **Colors are consistent**: All cards on the same page use the same accentColor from the plan
