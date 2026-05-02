import React from 'react'
import { Icon } from './Icon'
import { TagBadge } from './TagBadge'

export function CredentialCard({ icon, title, badge, body, highlightBox, url, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      border: '1px solid #E8ECF1',
      borderRadius: 14,
      padding: 22,
      background: `linear-gradient(135deg, rgba(250,250,250,0.95), rgba(248,250,252,0.85))`,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.025)',
      backdropFilter: 'blur(4px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Top accent gradient strip */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}40)`,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 2 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${accent}10`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon icon={icon} size={18} color={accent} componentType="CredentialCard" replaceable />
        </div>
        <span style={{ fontSize: 15, fontWeight: 750, color: '#1E293B', letterSpacing: '-0.01em' }}>{title}</span>
        {badge && <TagBadge text={badge} color={`${accent}15`} textColor={accent} size="sm" />}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${accent}15, transparent)`, margin: '12px 0' }} />

      {/* Body */}
      <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.7 }}>
        {body}
      </p>

      {/* Highlight box */}
      {highlightBox && (
        <div style={{
          background: `linear-gradient(135deg, #F1F5F9, #F8FAFC)`,
          borderRadius: 10,
          padding: 14,
          border: '1px solid #E2E8F0',
          fontSize: 13,
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#334155',
          marginTop: 12,
          boxShadow: `inset 0 1px 3px ${accent}06`,
        }}>
          {highlightBox}
        </div>
      )}

      {/* URL */}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{
          display: 'block',
          fontSize: 12,
          color: accent,
          marginTop: 10,
          textDecoration: 'none',
          fontWeight: 500,
        }}>
          {url}
        </a>
      )}
    </div>
  )
}
