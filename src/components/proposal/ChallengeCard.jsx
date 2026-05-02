import React from 'react'
import { Icon } from './Icon'

export function ChallengeCard({ icon, iconBg, iconColor, title, body, variant = 'outlined' }) {
  const isOutlined = variant === 'outlined'
  const accent = iconColor || '#1A56DB'

  return (
    <div style={{
      borderRadius: 14,
      padding: '22px 24px',
      marginBottom: 14,
      background: isOutlined
        ? 'rgba(255,255,255,0.9)'
        : `linear-gradient(135deg, ${iconBg || '#EFF6FF'}, ${iconBg || '#EFF6FF'}D0)`,
      border: isOutlined ? '1px solid #E5E7EB' : `1px solid ${accent}12`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
      position: 'relative',
      backdropFilter: 'blur(6px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Left accent gradient border */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 12,
        bottom: 12,
        width: 3,
        borderRadius: 2,
        background: `linear-gradient(180deg, ${accent}, ${accent}30)`,
      }} />

      {/* Icon */}
      <div style={{
        width: 42,
        height: 42,
        borderRadius: 11,
        background: `linear-gradient(135deg, ${iconBg || '#DBEAFE'}, ${iconBg || '#DBEAFE'}B0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 2px 8px ${accent}15`,
      }}>
        <Icon icon={icon} size={20} color={accent} componentType="ChallengeCard" replaceable />
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 17,
        fontWeight: 750,
        color: '#1E293B',
        marginTop: 14,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h3>

      {/* Body */}
      <p style={{
        fontSize: 13.5,
        color: '#64748B',
        lineHeight: 1.75,
        marginTop: 8,
        textAlign: 'justify',
      }}>
        {body}
      </p>
    </div>
  )
}
