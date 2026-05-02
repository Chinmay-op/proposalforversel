import React from 'react'

export function BulletList({ items, iconStyle = 'check', accentColor }) {
  const accent = accentColor || '#1A56DB'
  const iconPaths = {
    check: 'M20 6L9 17l-5-5',
    chevron: 'M9 18l6-6-6-6',
  }
  const path = iconPaths[iconStyle] || iconPaths.check

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', boxSizing: 'border-box' }}>
      {(items || []).map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '8px 14px',
          borderRadius: 10,
          background: i % 2 === 0 ? 'rgba(248,250,252,0.6)' : 'transparent',
        }}>
          {/* Circular icon container */}
          <div style={{
            width: 22,
            height: 22,
            minWidth: 22,
            borderRadius: '50%',
            background: `${accent}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
            flexShrink: 0,
          }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={path} />
            </svg>
          </div>
          <span style={{
            fontSize: 14,
            color: '#374151',
            lineHeight: 1.6,
            fontWeight: 450,
          }}>
            {item}
          </span>
        </div>
      ))}
    </div>
  )
}
