import React from 'react'
import { TagBadge } from './TagBadge'

export function ContactFooter({ companyName, tagline, phone, email, website, darkBg = true, logoUrl, badgeText, copyrightText, pageNumber }) {
  const bg = darkBg ? 'linear-gradient(135deg, #0F172A, #1E293B)' : '#FFFFFF'
  const titleColor = darkBg ? '#FFFFFF' : '#0F172A'
  const subColor = darkBg ? '#94A3B8' : '#64748B'
  const accentColor = darkBg ? '#06B6D4' : '#1A56DB'
  const borderTop = darkBg ? 'none' : '2px solid #E2E8F0'

  return (
    <div style={{
      width: '100%',
      padding: '28px 32px',
      background: bg,
      borderTop,
      borderRadius: darkBg ? 14 : 0,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Subtle decorative accent glow */}
      {darkBg && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
        }} />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {/* Left */}
        <div>
          {badgeText && (
            <div style={{ marginBottom: 10 }}>
              <TagBadge text={badgeText} color={darkBg ? 'rgba(6,182,212,0.12)' : '#DBEAFE'} textColor={accentColor} size="sm" />
            </div>
          )}
          <h3 
            contentEditable={true} 
            suppressContentEditableWarning={true}
            style={{
            fontSize: 22,
            fontWeight: 900,
            color: titleColor,
            letterSpacing: '-0.02em',
            textShadow: darkBg ? `0 0 30px ${accentColor}10` : 'none',
          }}>
            {companyName}
          </h3>
          <p 
            contentEditable={true} 
            suppressContentEditableWarning={true}
            style={{
            fontSize: 13,
            color: subColor,
            marginTop: 5,
            lineHeight: 1.55,
          }}>
            {tagline}
          </p>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${accentColor}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <span contentEditable={true} suppressContentEditableWarning={true} style={{ fontSize: 13, color: subColor, fontWeight: 450, outline: 'none', borderBottom: '1px dashed transparent', transition: 'border 0.2s', padding: '0 4px', borderRadius: 2 }} onFocus={(e) => e.target.style.borderBottom = `1px dashed ${accentColor}`} onBlur={(e) => e.target.style.borderBottom = '1px dashed transparent'}>{phone}</span>
            </div>
          )}
          {email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${accentColor}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span contentEditable={true} suppressContentEditableWarning={true} style={{ fontSize: 13, color: subColor, fontWeight: 450, outline: 'none', borderBottom: '1px dashed transparent', transition: 'border 0.2s', padding: '0 4px', borderRadius: 2 }} onFocus={(e) => e.target.style.borderBottom = `1px dashed ${accentColor}`} onBlur={(e) => e.target.style.borderBottom = '1px dashed transparent'}>{email}</span>
            </div>
          )}
          {website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${accentColor}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <span contentEditable={true} suppressContentEditableWarning={true} style={{ fontSize: 13, color: subColor, fontWeight: 450, outline: 'none', borderBottom: '1px dashed transparent', transition: 'border 0.2s', padding: '0 4px', borderRadius: 2 }} onFocus={(e) => e.target.style.borderBottom = `1px dashed ${accentColor}`} onBlur={(e) => e.target.style.borderBottom = '1px dashed transparent'}>{website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar with gradient separator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 12,
        borderTop: `1px solid ${darkBg ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
      }}>
        <span style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          color: darkBg ? '#475569' : '#94A3B8',
          fontWeight: 500,
        }}>
          {copyrightText || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
        </span>
        {pageNumber && (
          <span style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: darkBg ? '#475569' : '#94A3B8',
            fontWeight: 500,
          }}>
            PAGE {String(pageNumber).padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  )
}
