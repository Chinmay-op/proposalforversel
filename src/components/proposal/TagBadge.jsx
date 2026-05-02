import React from 'react'

export function TagBadge({ text, color, textColor, size = 'md' }) {
  const sizes = {
    sm: { fontSize: 10, padding: '4px 10px' },
    md: { fontSize: 12, padding: '5px 12px' },
  }
  const s = sizes[size] || sizes.md

  return (
    <span style={{
      display: 'inline-block',
      borderRadius: 999,
      fontSize: s.fontSize,
      padding: s.padding,
      fontWeight: 650,
      background: color || '#DBEAFE',
      color: textColor || '#1A56DB',
      letterSpacing: 0.3,
      border: `1px solid ${(textColor || '#1A56DB')}15`,
    }}>
      {text}
    </span>
  )
}
