import React from 'react'
import { TagBadge } from './TagBadge'

export function PersonnelCard({ name, role, accolade, bio, accentColor }) {
  const accent = accentColor || '#1A56DB'
  const initial = name ? name.charAt(0).toUpperCase() : '?'

  return (
    <div style={{
      border: '1px solid #E8ECF1',
      borderRadius: 14,
      padding: 22,
      background: 'rgba(255,255,255,0.92)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.025)',
      backdropFilter: 'blur(4px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Avatar with gradient ring */}
      <div style={{
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${accent}20, ${accent}08)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${accent}25`,
        boxShadow: `0 3px 10px ${accent}10`,
      }}>
        <span style={{
          fontSize: 24,
          fontWeight: 800,
          color: accent,
        }}>
          {initial}
        </span>
      </div>

      {/* Name */}
      <h4 style={{
        fontSize: 16,
        fontWeight: 750,
        color: '#1E293B',
        marginTop: 14,
        letterSpacing: '-0.01em',
      }}>
        {name}
      </h4>

      {/* Role badge */}
      {role && (
        <div style={{ marginTop: 6 }}>
          <TagBadge text={role} color={`${accent}12`} textColor={accent} size="sm" />
        </div>
      )}

      {/* Accolade */}
      {accolade && (
        <p style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: accent,
          marginTop: 6,
          fontWeight: 500,
        }}>
          {accolade}
        </p>
      )}

      {/* Bio */}
      {bio && (
        <p style={{
          fontSize: 13,
          color: '#64748B',
          marginTop: 10,
          lineHeight: 1.65,
        }}>
          {bio}
        </p>
      )}
    </div>
  )
}
