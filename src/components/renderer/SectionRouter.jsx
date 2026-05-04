import React from 'react'
import { COMPONENT_REGISTRY } from '../registry'

const GRID_COMPONENTS = ['TwoColumnGrid', 'ThreeColumnGrid']

export function SectionRouter({ section }) {
  if (!section) return null

  const { componentType, props } = section
  const Component = COMPONENT_REGISTRY[componentType]

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SectionRouter] Unknown componentType: "${componentType}" — skipping`)
    }
    return null
  }

  // Grid components: render children recursively
  if (GRID_COMPONENTS.includes(componentType)) {
    const childSections = props?.children || []
    const renderedChildren = childSections.map((child, i) => (
      <SectionRouter key={i} section={child} />
    ))
    return <Component {...props} renderedChildren={renderedChildren} />
  }

  return <Component {...props} />
}
