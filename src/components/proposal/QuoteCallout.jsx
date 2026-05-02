import React from 'react'

export function QuoteCallout({ quote, accentColor }) {
  const accent = accentColor || '#1A56DB'
  const cleanQuote = quote ? quote.replace(/^["'\u201C\u201D\u2018\u2019]+|["'\u201C\u201D\u2018\u2019]+$/g, '').trim() : ''

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(248,250,252,0.95), rgba(241,245,249,0.8))`,
      borderRadius: '0 12px 12px 0',
      padding: '22px 28px 22px 26px',
      borderLeft: `3px solid ${accent}`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 2px 8px ${accent}06`,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Large decorative quote mark */}
      <div style={{
        position: 'absolute',
        top: -8,
        left: 12,
        fontSize: 72,
        fontWeight: 900,
        color: `${accent}08`,
        lineHeight: 1,
        fontFamily: 'Georgia, serif',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        &ldquo;
      </div>

      <p style={{
        fontSize: 15,
        fontStyle: 'italic',
        color: '#4B5563',
        lineHeight: 1.8,
        position: 'relative',
        zIndex: 1,
        fontWeight: 450,
      }}>
        &ldquo;{cleanQuote}&rdquo;
      </p>
    </div>
  )
}
