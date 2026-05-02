import React from 'react'

export function SectionHeader({ sectionLabel, heading, subheading, accentColor, showDivider }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{ marginBottom: 10, width: '100%', boxSizing: 'border-box' }}>
      {/* Top accent bar + label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Decorative vertical accent bar (Always visible) */}
        <div style={{
          width: 4,
          height: 44,
          borderRadius: 2,
          background: `linear-gradient(180deg, ${accent}, ${accent}40)`,
          flexShrink: 0,
        }} />

        <div>
          {/* Section label as a pill badge */}
          {sectionLabel && (
            <span style={{
              display: 'inline-block',
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: 2.5,
              color: accent,
              fontWeight: 800,
              background: `${accent}0A`,
              padding: '4px 14px',
              borderRadius: 999,
              border: `1px solid ${accent}18`,
            }}>
              {sectionLabel}
            </span>
          )}

          {/* Heading */}
          <h2 style={{
            fontSize: 34,
            fontWeight: 900,
            color: '#0F172A',
            marginTop: 8,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textShadow: '0 1px 1px rgba(0,0,0,0.03)',
          }}>
            {heading}
          </h2>
        </div>
      </div>

      {/* Subheading */}
      {subheading && (
        <p style={{
          fontSize: 15,
          color: '#64748B',
          marginTop: 8,
          lineHeight: 1.6,
          paddingLeft: 16,
        }}>
          {subheading}
        </p>
      )}


    </div>
  )
}
