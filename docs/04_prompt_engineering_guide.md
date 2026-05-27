# ⚡ Prompt Engineering & Custom Gemini Gems Guide

This document is the official prompt engineering guide for the **AI Proposal Generator**. It details how the two-phase LLM pipeline (Planner & Writer) is structured, explains safety constraints, and provides step-by-step instructions for configuring custom **Gemini Gems** to refine requirements.

---

## 1. Two-Phase Prompting Pipeline Overview

Single-prompt generation systems often fail because LLMs struggle to manage **structural placement** and **high-fidelity writing** simultaneously. The Antigravity framework solves this by separating these concerns into two distinct API calls:

```
                      ┌────────────────────────┐
                      │   Vague Client Idea    │
                      └───────────┬────────────┘
                                  │
                                  ▼
                ┌───────────────────────────────────┐
                │    Gemini Requirement Refiner     │  ◄── [GEM 1 / GEM 2]
                │   (Intakes and expands to 800w)   │
                └─────────────────┬─────────────────┘
                                  │
                                  ▼
                ┌───────────────────────────────────┐
                │     Phase 1: Structural Planner   │  ◄── [Architect LLM]
                │   (Generates 15+ CoT thoughts)    │
                └─────────────────┬─────────────────┘
                                  │
                                  ▼
                ┌───────────────────────────────────┐
                │      Phase 2: Content Writer      │  ◄── [Copywriter LLM]
                │   (Writes rich copy, maps props)  │
                └─────────────────┬─────────────────┘
                                  │
                                  ▼
                        [Beautiful PDF Doc]
```

---

## 2. Phase 1: The Structural Planner (Architect)

- **Objective**: Decide layout strategy, theme selection, page budget, deliverable count, and visual component arrangements.
- **Mechanism**: The prompt forces the LLM to output a series of explicit `THOUGHT:` prefixes. This forces the model to construct a visual plan *before* outputting raw JSON.
- **System Instructions**:
  - Reason through 15 specific architectural questions step-by-step.
  - Determine optimal colors matching the domain.
  - Allocate a page count between **7 to 10 pages**.
  - Output ONLY valid JSON containing the blueprint, avoiding markdown code fences or conversational text.

### Phase 1 Output JSON Schema:
```json
{
  "domain": "string",
  "tone": "formal | startup | technical",
  "theme": "TechBlue | MedTeal | EarthGreen | UrbanSlate | StartupViolet",
  "pageCount": 8,
  "coverTagline": "string (≤12 words)",
  "imagePlacements": ["cover", "page-4", "page-6"],
  "sections": [
    {
      "id": "cover",
      "pageNumber": 1,
      "label": "STRATEGIC PROPOSAL",
      "heading": "Project Title",
      "subheading": "Subtitle",
      "primaryComponent": "CoverPage",
      "layout": "full-width",
      "itemCount": 1,
      "needsImage": true,
      "imagePlacementId": "cover-hero",
      "colorAccent": "#1A56DB"
    }
  ],
  "reasoning_trace": [
    "THOUGHT: 1...",
    "THOUGHT: 2..."
  ]
}
```

---

## 3. Phase 2: The Content Copywriter

- **Objective**: Take the structural JSON blueprint and write high-impact, domain-authentic proposal copy with zero placeholders.
- **Mechanism**: Renders detailed prop structures, resolves checkmarks/icons, writes specific KPIs, and outputs the final page arrays.
- **Strict Guidelines**:
  - **No Placeholders**: Never write `[Insert Date]`, `[TBD]`, or `[Client Name]`. The LLM must make logical assumptions.
  - **Industry Specifics**: Must inject authentic terminology (e.g. "HL7 FHIR" in healthcare, "IP67" in hardware, "AES-256" in security).
  - **Component Sizing Validation**: Maintain height limits strictly within the budget ceiling.
  - **Icon Path Allocation**: Must select semantic SVG paths (Heroicons/Lucide styling) mapping to card actions.

---

## 4. Configuring Custom Gemini Gems

The system includes a pre-processing engine (`src/engine/geminiRefiner.js`) that connects to the Google Gemini API to clean vague requirements. You can also build **Custom Gems** directly inside the Google Gemini web application (Gemini Advanced) for manual prep work.

We have engineered two highly optimized Gem configurations:

---

### 💎 GEM 1: Requirements Refiner (Architect)

Create a Gem in the Gemini app and copy-paste these instructions to build a quick researcher:

```text
You are "GEM 1 (Architect)", an elite pre-sales engineer and technical proposal researcher. 

Your singular goal is to take a vague, one-line problem statement and expand it into a comprehensive, highly-structured blueprint.

INSTRUCTIONS:
1. Read the user's vague topic (e.g., "AI underground mine safety system").
2. Perform logical research:
   - Identify the core safety issues (dust, collapse, fragmentation).
   - Propose an open-source technical path (e.g., Wi-Fi Mesh network, OpenCV edge processing).
   - Design a realistic modern tech stack (React, Node.js, Python, PostgreSQL, PyTorch).
   - Estimate an Agile project timeline with 2-week sprints (typically 12-16 weeks total).
   - Propose 4 highly advanced technical features using real algorithms (e.g. YOLOv8 object detection, Haar Cascades, RAG).
3. Output the refined outline under clear headers (### Executive Context, ### Technical Challenges, ### Architecture workflow, ### Key Features, ### Tech Stack, ### Project Timeline).
4. Maintain a highly professional, consultative, and authoritative tone.
```

---

### 💎 GEM 2: Corporate Business Analyst

If you want the Gem to respect your company's actual capabilities, portfolio projects, and standard tech stacks, use this configuration:

> [!IMPORTANT]
> **Step 1: Download & Complete the Profile Template**
> Fill out the **[Company Context Template](file:///c:/Users/Chinm/Proposal-Generation-Agent-main/Proposal-Generation-Agent-main/Company_Context_Template.md)** with your team structure, core technologies, and past case studies (e.g., RadScribe AI, TerraTrack, SmartKey.AI, EcoGridIQ Pro, Geo-Sentinel, Green Enforcement System). Save this file as `Company_Context.txt` or export it to a PDF.

> [!IMPORTANT]
> **Step 2: Create the Gemini Gem**
> 1. Open Gemini Advanced, go to **Gems manager**, and click **New Gem**.
> 2. Name: `Gritsama Proposal BA`.
> 3. Instructions: Copy and paste the complete content of **[GEM2_Instructions.md](file:///c:/Users/Chinm/Proposal-Generation-Agent-main/Proposal-Generation-Agent-main/GEM2_Instructions.md)** into the Gem's instructions box.
> 4. Upload your completed `Company_Context` file directly into the **Knowledge** block of the Gem.
> 5. Click Save.

Now, whenever you receive a raw, single-sentence client email, you can paste it directly into this Gem. The Gem will automatically query your company context, match the ideal tech stack, pull relevant past projects, and write an expanded 800+ word technical prompt that you can paste directly into the **AI Proposal Generator** to create client-winning results!
