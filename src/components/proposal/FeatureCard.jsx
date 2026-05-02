import React from 'react'
import { Icon } from './Icon'

export function FeatureCard({ icon, iconBg, iconColor, title, body, showBorder, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      position: 'relative',
      borderRadius: 12,
      padding: '20px 20px 20px 26px',
      border: showBorder ? '1px solid #E8ECF1' : '1px solid transparent',
      background: 'rgba(255,255,255,0.92)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.035), 0 1px 3px rgba(0,0,0,0.02)',
      backdropFilter: 'blur(4px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Left accent gradient bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        borderRadius: '3px 0 0 3px',
        background: `linear-gradient(180deg, ${accent}, ${accent}35)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${iconBg || '#DBEAFE'}, ${iconBg || '#DBEAFE'}B0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 2px 8px ${accent}12, inset 0 1px 1px rgba(255,255,255,0.5)`,
      }}>
        <Icon icon={icon} size={20} color={iconColor || accent} componentType="FeatureCard" replaceable />
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 15,
        fontWeight: 750,
        color: '#1E293B',
        marginTop: 12,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>

      {/* Body */}
      <p style={{
        fontSize: 13,
        color: '#64748B',
        lineHeight: 1.7,
        marginTop: 6,
      }}>
        {body}
      </p>
    </div>
  )
}
