import React, { useState, useRef } from 'react'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Icon } from './Icon'

export function CoverPage({ badgeText, companyName, title, tagline, dividerColor, imageId, executiveSummary }) {
  const accent = dividerColor || '#1A56DB'
  const [logoUrl, setLogoUrl] = useState(null)
  const [logoScale, setLogoScale] = useState(100) // percentage 30-200
  const [showResizer, setShowResizer] = useState(false)
  const fileInputRef = useRef(null)

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setLogoUrl(ev.target.result)
        setLogoScale(100) // reset scale on new upload
        setShowResizer(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = (e) => {
    e.stopPropagation()
    setLogoUrl(null)
    setLogoScale(100)
    setShowResizer(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ padding: 0, position: 'relative' }}>
      {/* Decorative top accent stripe */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 140,
        height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}40)`,
        borderRadius: '0 2px 2px 0',
      }} />

      {/* Top row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 12,
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 2.5,
          color: accent,
          fontVariant: 'small-caps',
          background: `${accent}0A`,
          padding: '4px 12px',
          borderRadius: 999,
          border: `1px solid ${accent}15`,
          marginTop: 8,
        }}>
          {badgeText}
        </span>

        {/* Logo area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="logo-upload-area"
            style={{
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 180,
              maxWidth: 360,
              minHeight: 50,
            }}
            title={logoUrl ? 'Click to replace logo' : 'Click to insert company logo'}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Company Logo" 
                style={{
                  maxWidth: 360,
                  maxHeight: 140,
                  width: `${logoScale}%`,
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'width 0.15s ease',
                }} 
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
                width: '100%',
                minHeight: 60,
                border: '1px dashed transparent',
                transition: 'all 0.25s ease',
                padding: '6px 14px',
                borderRadius: 8,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.border = '1px dashed #94A3B8'
                e.currentTarget.style.background = '#F8FAFC'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.border = '1px dashed transparent'
                e.currentTarget.style.background = 'transparent'
              }}
              >
                {/* Upload hint icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: accent,
                  background: `${accent}0A`,
                  border: `1px solid ${accent}15`,
                  padding: '4px 12px',
                  borderRadius: 999,
                  textAlign: 'right',
                  letterSpacing: 2.5,
                  textTransform: 'uppercase',
                  fontVariant: 'small-caps',
                }}>
                  {companyName}
                </span>
              </div>
            )}
          </div>

          {/* Logo resize controls — shown only when logo is uploaded */}
          {logoUrl && (
            <div
              className="logo-resize-controls no-print"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 6,
                padding: '4px 8px',
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px solid #E8ECF1',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              {/* Shrink button */}
              <button
                onClick={(e) => { e.stopPropagation(); setLogoScale(s => Math.max(30, s - 10)) }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#64748B',
                  padding: 0,
                  lineHeight: 1,
                }}
                title="Shrink logo"
              >
                −
              </button>

              {/* Slider */}
              <input
                type="range"
                min="30"
                max="200"
                value={logoScale}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => { e.stopPropagation(); setLogoScale(Number(e.target.value)) }}
                style={{
                  width: 90,
                  height: 4,
                  accentColor: accent,
                  cursor: 'pointer',
                }}
                title={`Logo size: ${logoScale}%`}
              />

              {/* Grow button */}
              <button
                onClick={(e) => { e.stopPropagation(); setLogoScale(s => Math.min(200, s + 10)) }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#64748B',
                  padding: 0,
                  lineHeight: 1,
                }}
                title="Enlarge logo"
              >
                +
              </button>

              {/* Scale label */}
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#94A3B8',
                minWidth: 32,
                textAlign: 'center',
              }}>
                {logoScale}%
              </span>

              {/* Remove button */}
              <button
                onClick={handleRemoveLogo}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: '1px solid #FCA5A5',
                  background: '#FEF2F2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: '#EF4444',
                  padding: 0,
                  lineHeight: 1,
                }}
                title="Remove logo"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: 50,
        fontWeight: 900,
        color: '#0F172A',
        lineHeight: 1.1,
        marginTop: 28,
        letterSpacing: '-0.03em',
        textShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        {title && title.split('\\n').map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </React.Fragment>
        ))}
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: 19,
        fontWeight: 500,
        color: '#64748B',
        marginTop: 14,
        lineHeight: 1.55,
        maxWidth: '85%',
      }}>
        {tagline}
      </p>

      {/* Decorative Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 18,
      }}>
        <div style={{
          width: 48,
          height: 4,
          background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          borderRadius: 2,
        }} />
        <div style={{
          width: 8,
          height: 4,
          background: `${accent}40`,
          borderRadius: 2,
        }} />
        <div style={{
          width: 4,
          height: 4,
          background: `${accent}20`,
          borderRadius: 2,
        }} />
      </div>

      {/* Image */}
      {imageId && (
        <div style={{ marginTop: 24 }}>
          <ImagePlaceholder id={imageId} label="Cover Image" aspectRatio="16/9" rounded={true} />
        </div>
      )}

      {/* Executive Summary — Glassmorphism */}
      {executiveSummary && (
        <div style={{
          marginTop: 22,
          background: `linear-gradient(135deg, rgba(248,250,252,0.95), rgba(241,245,249,0.85))`,
          borderRadius: 14,
          padding: '22px 26px',
          border: `1px solid ${accent}12`,
          boxShadow: `0 2px 16px ${accent}08, 0 1px 3px rgba(0,0,0,0.04)`,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon icon="pulse" size={14} color={accent} strokeWidth={2.5} replaceable />
            </div>
            <span style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: 800,
              color: accent,
            }}>
              Executive Summary
            </span>
          </div>
          <p style={{
            fontSize: 13.5,
            color: '#334155',
            lineHeight: 1.8,
            marginTop: 12,
            textAlign: 'justify',
          }}>
            {executiveSummary}
          </p>
        </div>
      )}
    </div>
  )
}
