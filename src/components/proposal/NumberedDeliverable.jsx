import React from 'react'

export function NumberedDeliverable({ number, title, body, bullets, variant, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      display: 'flex',
      gap: 20,
      padding: '20px 24px',
      border: '1px solid #E8ECF1',
      borderRadius: 14,
      marginBottom: 14,
      background: 'rgba(255,255,255,0.92)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.025)',
      backdropFilter: 'blur(4px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Number circle with gradient */}
      <div style={{
        width: 50,
        height: 50,
        minWidth: 50,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
        border: `2px solid ${accent}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${accent}10`,
      }}>
        <span style={{
          fontSize: 20,
          fontWeight: 800,
          color: accent,
        }}>
          {number}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontSize: 16,
          fontWeight: 750,
          color: '#1E293B',
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h4>
        {body && (
          <p style={{
            fontSize: 13.5,
            color: '#64748B',
            marginTop: 6,
            lineHeight: 1.7,
          }}>
            {body}
          </p>
        )}
        {bullets && bullets.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {bullets.map((bullet, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 18,
                  height: 18,
                  minWidth: 18,
                  borderRadius: '50%',
                  background: `${accent}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.55 }}>{bullet}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
