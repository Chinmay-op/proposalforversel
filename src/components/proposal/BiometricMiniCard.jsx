import React from 'react'
import { Icon } from './Icon'

export function BiometricMiniCard({ icon, label, caption }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid #E8ECF1',
      borderRadius: 10,
      padding: '14px 12px',
      textAlign: 'center',
      boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
      backdropFilter: 'blur(4px)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #EFF6FF, #F1F5F9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}>
        <Icon icon={icon} size={20} color="#1A56DB" componentType="BiometricMiniCard" replaceable />
      </div>
      <div style={{
        fontSize: 12,
        fontWeight: 750,
        color: '#1E293B',
        marginTop: 8,
      }}>
        {label}
      </div>
      {caption && (
        <div style={{
          fontSize: 11,
          color: '#64748B',
          marginTop: 3,
          lineHeight: 1.4,
        }}>
          {caption}
        </div>
      )}
    </div>
  )
}
