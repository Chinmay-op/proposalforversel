import React, { useState } from 'react'
import { useProposal } from '../../context/ProposalContext'
import { THEMES } from '../../themes/themes'

const THEME_META = {
  TechBlue:       { label: 'Tech Blue',       emoji: '💎', desc: 'Clean SaaS & AI' },
  MedTeal:        { label: 'Med Teal',        emoji: '🏥', desc: 'Healthcare & Pharma' },
  EarthGreen:     { label: 'Earth Green',     emoji: '🌿', desc: 'Agriculture & Mining' },
  UrbanSlate:     { label: 'Urban Slate',     emoji: '🏙️', desc: 'Smart City & Gov' },
  StartupViolet:  { label: 'Startup Violet',  emoji: '🚀', desc: 'Startup & FinTech' },
  OceanCyan:      { label: 'Ocean Cyan',      emoji: '🌊', desc: 'Maritime & Logistics' },
  RoyalIndigo:    { label: 'Royal Indigo',    emoji: '👑', desc: 'Enterprise & Legal' },
  SunsetCoral:    { label: 'Sunset Coral',    emoji: '🌅', desc: 'Creative & Media' },
  AmberGold:      { label: 'Amber Gold',      emoji: '⚡', desc: 'Energy & Finance' },
  ForestPine:     { label: 'Forest Pine',     emoji: '🌲', desc: 'Environment & NGO' },
  MidnightRose:   { label: 'Midnight Rose',   emoji: '🌸', desc: 'Beauty & Lifestyle' },
  SteelGray:      { label: 'Steel Gray',      emoji: '⚙️', desc: 'Industrial & Mfg' },
}

// Helper to get metadata for any theme name (including LLM-generated ones)
function getThemeMeta(name) {
  if (THEME_META[name]) return THEME_META[name]
  // For dynamically generated themes, create a friendly label
  const label = name.replace(/([A-Z])/g, ' $1').trim()
  return { label, emoji: '🤖', desc: 'AI-Generated Brand' }
}

export function ThemePanel() {
  const { document, activeThemeName, switchTheme } = useProposal()
  const [isExpanded, setIsExpanded] = useState(true)

  if (!document) return null

  const themeNames = Object.keys(THEMES)

  return (
    <div className="no-print-theme-panel" style={{
      position: 'fixed',
      top: 72,
      right: 16,
      zIndex: 1000,
      width: isExpanded ? 240 : 48,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
    }}>
      <style>{`
        @media print {
          .no-print-theme-panel {
            display: none !important;
          }
        }
      `}</style>
      <div style={{
        borderRadius: 16,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(51, 65, 85, 0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: isExpanded ? '14px 16px' : '14px 12px',
            cursor: 'pointer',
            borderBottom: isExpanded ? '1px solid rgba(51,65,85,0.4)' : 'none',
            transition: 'padding 0.2s',
          }}
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${THEMES[activeThemeName]?.primary || '#1A56DB'}, ${THEMES[activeThemeName]?.accent || '#06B6D4'})`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>
          {isExpanded && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#E2E8F0',
                letterSpacing: '-0.01em',
              }}>
                Theme & Colors
              </div>
              <div style={{
                fontSize: 10,
                color: '#64748B',
                marginTop: 1,
              }}>
                {getThemeMeta(activeThemeName)?.label || activeThemeName}
              </div>
            </div>
          )}
          {isExpanded && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points={isExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
          )}
        </div>

        {/* Theme Grid */}
        {isExpanded && (
          <div style={{
            padding: '12px 14px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto',
          }}>
            {themeNames.map((name) => {
              const t = THEMES[name]
              const meta = getThemeMeta(name)
              const isActive = name === activeThemeName

              return (
                <button
                  key={name}
                  onClick={() => switchTheme(name)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 5,
                    padding: '10px 10px 8px',
                    borderRadius: 10,
                    border: isActive
                      ? `2px solid ${t.primary}`
                      : '1px solid rgba(51,65,85,0.3)',
                    background: isActive
                      ? `${t.primary}12`
                      : 'rgba(30, 41, 59, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.4)'
                      e.currentTarget.style.borderColor = 'rgba(100,116,139,0.5)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)'
                      e.currentTarget.style.borderColor = 'rgba(51,65,85,0.3)'
                    }
                  }}
                >
                  {/* Color swatch bar */}
                  <div style={{
                    display: 'flex',
                    gap: 3,
                    width: '100%',
                  }}>
                    <div style={{
                      flex: 3,
                      height: 6,
                      borderRadius: 3,
                      background: t.primary,
                    }} />
                    <div style={{
                      flex: 2,
                      height: 6,
                      borderRadius: 3,
                      background: t.accent,
                    }} />
                    <div style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      background: t.highlight,
                    }} />
                  </div>

                  {/* Label */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    width: '100%',
                  }}>
                    <span style={{ fontSize: 11 }}>{meta.emoji}</span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#F1F5F9' : '#94A3B8',
                      letterSpacing: '-0.01em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Active check */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: t.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
