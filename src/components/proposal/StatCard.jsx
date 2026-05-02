import React from 'react'

export function StatCard({ metric, label, body, accentColor, cardBg }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      background: cardBg || '#EFF6FF',
      borderRadius: 14,
      padding: '20px 20px 18px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
      border: `1px solid ${accent}10`,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Top accent gradient bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}50)`,
      }} />

      {/* Metric */}
      <div style={{
        fontSize: 44,
        fontWeight: 900,
        color: accent,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        marginTop: 4,
      }}>
        {metric}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 13,
        fontWeight: 750,
        color: '#1E293B',
        marginTop: 8,
        letterSpacing: '0.01em',
      }}>
        {label}
      </div>

      {/* Body */}
      {body && (
        <p style={{
          fontSize: 11.5,
          color: '#64748B',
          marginTop: 6,
          lineHeight: 1.5,
        }}>
          {body}
        </p>
      )}
    </div>
  )
}
