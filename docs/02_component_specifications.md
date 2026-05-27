# 🧩 visual Component Reference Specification

This document provides a highly detailed developer catalog for all **22 pre-built Antigravity components** within the system. These components reside in `src/components/proposal/` and are resolved dynamically by `src/components/renderer/SectionRouter.jsx`.

---

## 🏗️ Design System Constraints & Hard Rules

To ensure consistent high-quality rendering, compatibility with native browser A4 PDF conversion, and resilience against AI hallucinations, these rules are enforced programmatically:

1. **Inline Styles Only**: Components MUST use inline styles or direct CSS variable injection via `style={{}}` attributes. Tailwind CSS classes are NOT used inside the presentational components to prevent compilation purge errors.
2. **Typography Hierarchy**: 
   - Font Family: `font-family: 'Inter', -apple-system, sans-serif`
   - Page Section Labels: `11px uppercase letter-spacing: 2px`
   - Body Copy: `14px line-height: 1.75 text-align: justify`
3. **Consistent Theme Colors**: All accent borders, numbers, and icons must reference CSS variables injected by the wrapper: `var(--primary)`, `var(--accent)`, `var(--highlight)`, etc.

---

## 🗂️ Component Directory & Prop Specs

### 1. `CoverPage`
- **Purpose**: Hero cover sheet representing the face of the proposal.
- **Estimated Height**: 100% (takes the entire first page).
- **React Props**:
```typescript
interface CoverPageProps {
  badgeText: string;          // 11px uppercase (e.g. "STRATEGIC PROPOSAL")
  companyName: string;        // Name of the delivering company
  title: string;              // Bold title (48-56px), can contain '\n'
  tagline: string;            // Secondary text (20px) in var(--muted)
  dividerColor?: string;      // Accent bar color (Hex/CSS Var)
  imageId: string;            // Unique identifier for the cover photo slot
  executiveSummary: string;   // Paragraph for the executive summary card
}
```

### 2. `SectionHeader`
- **Purpose**: Identifies a major chapter, establishing a new layout context.
- **Estimated Height**: 12%
- **React Props**:
```typescript
interface SectionHeaderProps {
  sectionLabel: string;       // Chapter prefix (e.g. "SECTION 01")
  heading: string;            // Primary title (32-36px)
  subheading?: string;        // Secondary descriptor text
  accentColor?: string;       // Underline or highlight color
  showDivider?: boolean;      // Displays a short 60px divider bar
}
```

### 3. `ChallengeCard`
- **Purpose**: Frames a particular pain point or obstacle within a callout panel.
- **Estimated Height**: 18%
- **React Props**:
```typescript
interface ChallengeCardProps {
  icon: string;               // SVG path identifier from library
  iconBg?: string;            // Background highlight tint
  iconColor?: string;         // Icon vector stroke color
  title: string;              // Short bold pain point description
  body: string;               // Explanatory paragraph text
  variant?: 'outlined' | 'filled'; // Outlined (white bg, border) vs Filled (tinted bg)
}
```

### 4. `FeatureCard`
- **Purpose**: Highlights a core product feature or technical solution block.
- **Estimated Height**: 14%
- **React Props**:
```typescript
interface FeatureCardProps {
  icon: string;               // SVG path
  iconBg?: string;            
  iconColor?: string;         
  title: string;              
  body: string;               
  showBorder?: boolean;       // Displays a light gray-blue contour
  accentColor?: string;       // Injects a 3px left border strip
}
```

### 5. `NumberedDeliverable`
- **Purpose**: Scope description with a large circular number block on the left side.
- **Estimated Height**: 18%
- **React Props**:
```typescript
interface NumberedDeliverableProps {
  number: string | number;    // Big identifier (e.g. "01", "02")
  title: string;              
  body: string;               
  bullets?: string[];         // Embedded BulletList items
  variant?: 'numbered' | 'arrow'; // Numbered (circle) vs Arrow (chevron indicator)
  accentColor?: string;       
}
```

### 6. `StatCard`
- **Purpose**: Heavy metric box emphasizing numeric results, growth, or savings.
- **Estimated Height**: 12%
- **React Props**:
```typescript
interface StatCardProps {
  metric: string;             // Large center text (e.g. "99.7%", "3.2x", "$2.4M")
  label: string;              // Middle title (e.g. "System Uptime")
  body: string;               // Supporting explanation
  accentColor?: string;       
  cardBg?: string;            
}
```

### 7. `DataTable`
- **Purpose**: Displays structured metrics, competitive dimensions, or cost items in a beautiful table format.
- **Estimated Height**: 25%
- **React Props**:
```typescript
interface DataTableProps {
  headers: string[];                     // Header columns
  rows: Array<Record<string, string>>;   // Key-value records matching columns
  accentColor?: string;                  
}
```

### 8. `WorkflowStep`
- **Purpose**: Illustrates process cycles, methodologies, or milestones in a vertical pipeline.
- **Estimated Height**: 38%
- **React Props**:
```typescript
interface WorkflowStepProps {
  steps: Array<{
    stepNumber: number | string;
    title: string;
    description: string;
  }>;
  accentColor?: string;
  variant?: 'solid' | 'dotted'; // Line style connecting nodes
}
```

### 9. `QuoteCallout`
- **Purpose**: Displays high-impact quotes or testimonials with an elegant accent border.
- **Estimated Height**: 12%
- **React Props**:
```typescript
interface QuoteCalloutProps {
  quote: string;              // Message to display
  accentColor?: string;       
}
```

### 10. `LargeQuoteHero`
- **Purpose**: Dramatic full-width centered text, perfect for separating major sections.
- **Estimated Height**: 18%
- **React Props**:
```typescript
interface LargeQuoteHeroProps {
  line1: string;              // Large light gray-blue typography (300 weight)
  line2: string;              // Larger bold accent typography
  accentColor?: string;       
}
```

### 11. `SectionCalloutBox`
- **Purpose**: Solid banner card containing a side-by-side icon and description.
- **Estimated Height**: 14%
- **React Props**:
```typescript
interface SectionCalloutBoxProps {
  icon: string;               
  iconBg?: string;            
  title: string;              
  body: string;               
  accentColor?: string;       
}
```

### 12. `CredentialCard`
- **Purpose**: Highlights portfolio projects, certifications, or trust factors.
- **Estimated Height**: 16%
- **React Props**:
```typescript
interface CredentialCardProps {
  icon: string;               
  title: string;              
  badge?: string;             // Small pill label (e.g. "LIVE FLAGSHIP")
  body: string;               
  url?: string;               // Optional website link
  highlightBox?: string;      // Injected bold-italic quote block
  accentColor?: string;       
}
```

### 13. `PersonnelCard`
- **Purpose**: Showcases individual key stakeholders or team bios with descriptions.
- **Estimated Height**: 16%
- **React Props**:
```typescript
interface PersonnelCardProps {
  name: string;               // Person name
  role: string;               // Job title/role
  bio: string;                // Short background description
  avatarUrl?: string;         // Picture/avatar URL
  accentColor?: string;       
}
```

### 14. `CompetitorRow`
- **Purpose**: Displays direct side-by-side comparisons of competitor alternatives.
- **Estimated Height**: 18%
- **React Props**:
```typescript
interface CompetitorRowProps {
  competitor: string;         // Competitor name
  theirWeakness: string;      // Issues with their solution
  ourAdvantage: string;       // Gritsama's technical superiority
  accentColor?: string;       
}
```

### 15. `ContactFooter`
- **Purpose**: Bottom plate summarizing delivery contacts and authority licensing.
- **Estimated Height**: 16%
- **React Props**:
```typescript
interface ContactFooterProps {
  companyName: string;        
  phone: string;              
  email: string;              
  website: string;            
  darkBg?: boolean;           // Dark Navy vs Clean White layout
  tagline?: string;           
}
```

### 16. `ImagePlaceholder`
- **Purpose**: Smart frame designed to accept local image uploads or AI descriptors.
- **Estimated Height**: 35%
- **React Props**:
```typescript
interface ImagePlaceholderProps {
  id: string;                 // Globally unique identifier
  label: string;              // Inferred image prompt description
  aspectRatio?: '16/9' | '4/3' | '1/1';
  rounded?: boolean;          
}
```

### 17. `BulletList`
- **Purpose**: Standard bullet blocks styled with chevron or checkmark icons.
- **Estimated Height**: ~3% per item
- **React Props**:
```typescript
interface BulletListProps {
  items: string[];            // List elements
  iconStyle?: 'chevron' | 'check';
  accentColor?: string;       
}
```

### 18. `TwoColumnGrid` & `ThreeColumnGrid`
- **Purpose**: CSS grid columns that recursively parse children using `SectionRouter`.
- **Estimated Height**: Matches children.
- **React Props**:
```typescript
interface GridProps {
  children: Array<{
    componentType: string;
    props: Record<string, any>;
  }>;
}
```

### 19. `DividerStrip`
- **Purpose**: Accent rule providing visual clearance between pages and panels.
- **Estimated Height**: 2%
- **React Props**:
```typescript
interface DividerStripProps {
  variant?: 'short' | 'full'; // Short (60px) vs Full width (100%)
  color?: string;             
}
```

### 20. `TagBadge`
- **Purpose**: Small rounded tag pill used inside cards for highlights.
- **Estimated Height**: 3%
- **React Props**:
```typescript
interface TagBadgeProps {
  text: string;               
  color?: string;             
  textColor?: string;         
  size?: 'sm' | 'md';         
}
```

### 21. `BiometricMiniCard`
- **Purpose**: Ultra-compact cards showing an emoji or tiny icon, label, and value.
- **Estimated Height**: 8%
- **React Props**:
```typescript
interface BiometricMiniCardProps {
  icon: string;               // Emoji or SVG character
  label: string;              
  caption: string;            
}
```

### 22. `PageFooterBar`
- **Purpose**: Prints page numbering and proposal details. Is always locked at the bottom.
- **Estimated Height**: 4% (sits in absolute positioning)
- **React Props**:
```typescript
interface PageFooterBarProps {
  proposalName: string;       
  pageNumber: number;         
  totalPages: number;         
  accentColor?: string;       
}
```

---

## 🛡️ Structural Rules and Combos

- **`CoverPage` Isolation**: Must be the first component of page 1, and no other component (except a cover background) is allowed on that page.
- **`ContactFooter` Placement**: Must be the final element on the very last page of the document.
- **`SectionCalloutBox` Restriction**: This component is structurally large and must NEVER sit nested inside a `TwoColumnGrid` or `ThreeColumnGrid`. It must always span full-width.
- **`ImagePlaceholder` Density**: You are allowed a maximum of **3** image placeholders per entire proposal, and you must never put two of them on the same page.
