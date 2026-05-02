import React from 'react'

export function LargeQuoteHero({ line1, line2, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      textAlign: 'center',
      padding: '36px 20px',
      marginBottom: 24,
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Decorative background shapes */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 38,
        color: '#94A3B8',
        fontWeight: 300,
        lineHeight: 1.25,
        position: 'relative',
        zIndex: 1,
      }}>
        {line1}
      </div>
      <div style={{
        fontSize: 42,
        fontWeight: 900,
        color: accent,
        lineHeight: 1.2,
        marginTop: 6,
        letterSpacing: '-0.02em',
        textShadow: `0 2px 4px ${accent}15`,
        position: 'relative',
        zIndex: 1,
      }}>
        {line2}
      </div>
    </div>
  )
}
