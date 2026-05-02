import React from 'react'

export function DividerStrip({ width = 'short', height, color, marginY = 16 }) {
  const w = width === 'full' ? '100%' : 60
  const h = height || (width === 'full' ? 1 : 4)
  const accent = color || '#1A56DB'

  return (
    <div style={{
      width: w,
      height: h,
      background: width === 'full'
        ? `linear-gradient(90deg, ${accent}30, ${accent}10, transparent)`
        : `linear-gradient(90deg, ${accent}, ${accent}40)`,
      borderRadius: 2,
      marginTop: marginY,
      marginBottom: marginY,
    }} />
  )
}
