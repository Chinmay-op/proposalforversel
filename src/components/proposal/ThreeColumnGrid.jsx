import React from 'react'
import { SectionRouter } from '../renderer/SectionRouter'

export function ThreeColumnGrid({ children, renderedChildren }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
    gap: 16,
    width: '100%',
    boxSizing: 'border-box',
  }

  if (renderedChildren) {
    return <div style={gridStyle}>{renderedChildren}</div>
  }

  return (
    <div style={gridStyle}>
      {(children || []).map((child, i) => (
        <SectionRouter key={i} section={child} />
      ))}
    </div>
  )
}
