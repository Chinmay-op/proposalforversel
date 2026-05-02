export const THEMES = {
  TechBlue: {
    primary: '#1A56DB',
    accent: '#06B6D4',
    dark: '#1E3A5F',
    bg: '#F8FAFF',
    cardBg: '#EFF6FF',
    highlight: '#DBEAFE',
    text: '#1E293B',
    mutedText: '#64748B',
    divider: '#1A56DB',
  },
  MedTeal: {
    primary: '#0E7490',
    accent: '#10B981',
    dark: '#164E63',
    bg: '#F0FDFA',
    cardBg: '#ECFDF5',
    highlight: '#CCFBF1',
    text: '#134E4A',
    mutedText: '#6B7280',
    divider: '#0E7490',
  },
  EarthGreen: {
    primary: '#166534',
    accent: '#D97706',
    dark: '#14532D',
    bg: '#F7FEE7',
    cardBg: '#ECFCCB',
    highlight: '#D9F99D',
    text: '#1A2E05',
    mutedText: '#6B7280',
    divider: '#D97706',
  },
  UrbanSlate: {
    primary: '#334155',
    accent: '#3B82F6',
    dark: '#0F172A',
    bg: '#F8FAFC',
    cardBg: '#F1F5F9',
    highlight: '#E2E8F0',
    text: '#0F172A',
    mutedText: '#64748B',
    divider: '#3B82F6',
  },
  StartupViolet: {
    primary: '#7C3AED',
    accent: '#F43F5E',
    dark: '#4C1D95',
    bg: '#FAF5FF',
    cardBg: '#F3E8FF',
    highlight: '#EDE9FE',
    text: '#1E1B4B',
    mutedText: '#6B7280',
    divider: '#F43F5E',
  },
  OceanCyan: {
    primary: '#0891B2',
    accent: '#22D3EE',
    dark: '#155E75',
    bg: '#ECFEFF',
    cardBg: '#CFFAFE',
    highlight: '#A5F3FC',
    text: '#164E63',
    mutedText: '#6B7280',
    divider: '#0891B2',
  },
  RoyalIndigo: {
    primary: '#4F46E5',
    accent: '#818CF8',
    dark: '#3730A3',
    bg: '#EEF2FF',
    cardBg: '#E0E7FF',
    highlight: '#C7D2FE',
    text: '#1E1B4B',
    mutedText: '#64748B',
    divider: '#4F46E5',
  },
  SunsetCoral: {
    primary: '#E11D48',
    accent: '#FB923C',
    dark: '#9F1239',
    bg: '#FFF1F2',
    cardBg: '#FFE4E6',
    highlight: '#FECDD3',
    text: '#1C1917',
    mutedText: '#6B7280',
    divider: '#E11D48',
  },
  AmberGold: {
    primary: '#B45309',
    accent: '#F59E0B',
    dark: '#78350F',
    bg: '#FFFBEB',
    cardBg: '#FEF3C7',
    highlight: '#FDE68A',
    text: '#1C1917',
    mutedText: '#6B7280',
    divider: '#F59E0B',
  },
  ForestPine: {
    primary: '#065F46',
    accent: '#34D399',
    dark: '#064E3B',
    bg: '#ECFDF5',
    cardBg: '#D1FAE5',
    highlight: '#A7F3D0',
    text: '#064E3B',
    mutedText: '#6B7280',
    divider: '#065F46',
  },
  MidnightRose: {
    primary: '#9333EA',
    accent: '#EC4899',
    dark: '#581C87',
    bg: '#FDF4FF',
    cardBg: '#FAE8FF',
    highlight: '#F5D0FE',
    text: '#1E1B4B',
    mutedText: '#64748B',
    divider: '#EC4899',
  },
  SteelGray: {
    primary: '#475569',
    accent: '#94A3B8',
    dark: '#1E293B',
    bg: '#F8FAFC',
    cardBg: '#F1F5F9',
    highlight: '#E2E8F0',
    text: '#0F172A',
    mutedText: '#64748B',
    divider: '#475569',
  },
}

/**
 * Updates all accent/color-related props throughout a document JSON tree
 * without touching any text, layout, or structural data.
 */
export function recolorDocument(doc, newAccentColor) {
  if (!doc?.pages) return doc

  const clone = JSON.parse(JSON.stringify(doc)) // deep clone

  const colorKeys = new Set([
    'accentColor', 'iconColor', 'dividerColor', 'color',
  ])
  const bgKeys = new Set(['iconBg', 'cardBg'])

  const lightAccent = newAccentColor + '15'

  const walkAndRecolor = (obj) => {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) {
      obj.forEach(walkAndRecolor)
      return
    }

    for (const key of Object.keys(obj)) {
      const val = obj[key]

      // Replace accent color props
      if (colorKeys.has(key) && typeof val === 'string' && val.startsWith('#')) {
        obj[key] = newAccentColor
      }
      // Replace icon/card bg with light version
      if (key === 'iconBg' && typeof val === 'string' && val.startsWith('#')) {
        obj[key] = lightAccent
      }
      // Recurse into nested objects/arrays
      if (val && typeof val === 'object') {
        walkAndRecolor(val)
      }
    }
  }

  clone.pages.forEach(page => {
    if (page.sections) walkAndRecolor(page.sections)
  })

  return clone
}

/**
 * Generates a complete theme object from LLM-provided brand colors.
 * This allows any hex color to become a full visual theme without
 * requiring a predefined entry in the THEMES map.
 *
 * @param {string} primary - Primary brand color hex (e.g., '#0066B1' for BMW)
 * @param {string} accent  - Accent/secondary color hex
 * @param {string} dark    - Dark variant hex (used for deep backgrounds)
 * @returns {object} A full theme object compatible with ProposalDocument
 */
export function buildThemeFromColors(primary, accent, dark, overrides = {}) {
  // Parse hex to RGB
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '')
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    }
  }

  // Mix a color with white at a given ratio (0 = full white, 1 = full color)
  const lighten = (hex, ratio) => {
    const { r, g, b } = hexToRgb(hex)
    const lr = Math.round(r + (255 - r) * (1 - ratio))
    const lg = Math.round(g + (255 - g) * (1 - ratio))
    const lb = Math.round(b + (255 - b) * (1 - ratio))
    return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`
  }

  return {
    primary: primary,
    accent: accent || lighten(primary, 0.5),
    dark: dark || lighten(primary, 0.85),
    bg: overrides.bg || lighten(primary, 0.04),      // Very light tint of brand color
    cardBg: overrides.cardBg || lighten(primary, 0.08),  // Slightly deeper for cards
    highlight: overrides.highlight || lighten(primary, 0.15), // Noticeable highlight
    text: overrides.text || '#1E293B',
    mutedText: overrides.mutedText || '#64748B',
    divider: primary,
  }
}
