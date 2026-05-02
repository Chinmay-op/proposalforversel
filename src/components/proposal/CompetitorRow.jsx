import React from 'react'

export function CompetitorRow({ competitors, ourAdvantage, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      border: '1px solid #E8ECF1',
      borderRadius: 14,
      overflow: 'hidden',
      background: '#FFFFFF',
      boxShadow: '0 2px 10px rgba(0,0,0,0.025)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Table header with gradient */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1.5fr',
        padding: '14px 22px',
        background: `linear-gradient(135deg, #F8FAFC, #F1F5F9)`,
        borderBottom: '1px solid #E5E7EB',
        fontSize: 10,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#475569',
      }}>
        <span>Competitor</span>
        <span>Description</span>
        <span>Weakness</span>
      </div>

      {/* Competitor rows with alternating backgrounds */}
      {(competitors || []).map((comp, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1.5fr',
          padding: '14px 22px',
          borderBottom: '1px solid #F1F5F9',
          alignItems: 'flex-start',
          background: i % 2 === 1 ? 'rgba(248,250,252,0.5)' : 'transparent',
        }}>
          <span style={{ fontSize: 14, fontWeight: 750, color: '#1E293B', letterSpacing: '-0.01em' }}>{comp.name}</span>
          <span style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>{comp.description}</span>
          <span style={{
            fontSize: 12,
            color: '#DC2626',
            background: '#FEF2F2',
            padding: '5px 12px',
            borderRadius: 8,
            lineHeight: 1.5,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.007v.008H12v-.008z" />
            </svg>
            {comp.weakness}
          </span>
        </div>
      ))}

      {/* Our advantage bar */}
      {ourAdvantage && (
        <div style={{
          padding: '16px 22px',
          background: `linear-gradient(135deg, ${accent}08, ${accent}04)`,
          borderTop: `2px solid ${accent}40`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: `${accent}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span style={{
            fontSize: 14,
            fontWeight: 750,
            color: accent,
            letterSpacing: '-0.01em',
          }}>
            Our Advantage: {ourAdvantage}
          </span>
        </div>
      )}
    </div>
  )
}
