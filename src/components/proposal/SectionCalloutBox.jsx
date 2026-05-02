import React from 'react'
import { Icon } from './Icon'

export function SectionCalloutBox({ icon, iconBg, title, body, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      borderRadius: 14,
      padding: '20px 24px',
      border: `1px solid ${accent}15`,
      background: `linear-gradient(135deg, rgba(250,250,250,0.95), rgba(248,250,252,0.85))`,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 16,
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: `0 2px 12px ${accent}06, 0 1px 3px rgba(0,0,0,0.03)`,
      backdropFilter: 'blur(6px)',
      position: 'relative',
    }}>
      {/* Left accent stripe */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 10,
        bottom: 10,
        width: 3,
        borderRadius: 2,
        background: `linear-gradient(180deg, ${accent}80, ${accent}20)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 46,
        height: 46,
        minWidth: 46,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${iconBg || '#DBEAFE'}, ${iconBg || '#DBEAFE'}B0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 3px 10px ${accent}12`,
      }}>
        <Icon icon={icon} size={20} color={accent} componentType="SectionCalloutBox" replaceable />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontSize: 15,
          fontWeight: 750,
          color: '#1E293B',
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h4>
        <p style={{
          fontSize: 13.5,
          color: '#64748B',
          marginTop: 6,
          lineHeight: 1.75,
        }}>
          {body}
        </p>
      </div>
    </div>
  )
}
