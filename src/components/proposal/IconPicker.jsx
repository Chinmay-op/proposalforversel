import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { ICON_CATEGORIES, ICON_MAP } from './IconLibrary'

/**
 * IconPicker — A portal-based floating picker that renders at document.body level.
 * Supports both library icon selection and custom icon upload (SVG/PNG/JPG).
 * Never clipped by parent overflow or stacking contexts.
 */
export function IconPicker({ currentIcon, color = '#1A56DB', onSelect, onClose, anchorRect }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(ICON_CATEGORIES)[0])
  const [search, setSearch] = useState('')
  const panelRef = useRef(null)
  const fileInputRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Calculate position based on anchor rect, keeping picker in viewport
  useEffect(() => {
    if (!anchorRect) return

    const pickerWidth = 320
    const pickerHeight = 480
    const margin = 8
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = anchorRect.bottom + margin
    let left = anchorRect.left

    if (left + pickerWidth > vw - margin) {
      left = Math.max(margin, anchorRect.right - pickerWidth)
    }

    if (top + pickerHeight > vh - margin) {
      top = Math.max(margin, anchorRect.top - pickerHeight - margin)
    }

    left = Math.max(margin, Math.min(left, vw - pickerWidth - margin))
    top = Math.max(margin, top)

    setPosition({ top, left })
  }, [anchorRect])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on scroll
  useEffect(() => {
    const handler = () => onClose()
    window.addEventListener('scroll', handler, true)
    return () => window.removeEventListener('scroll', handler, true)
  }, [onClose])

  // Handle custom icon upload
  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      // Pass the data URL as the icon value — Icon.jsx will detect and render as <img>
      onSelect(ev.target.result)
      onClose()
    }
    reader.readAsDataURL(file)
  }

  // Filter icons by search
  const getFilteredIcons = () => {
    if (!search.trim()) return ICON_CATEGORIES[activeCategory] || []
    const q = search.toLowerCase()
    return Object.keys(ICON_MAP).filter(key => key.toLowerCase().includes(q))
  }

  const filteredIcons = getFilteredIcons()

  const pickerEl = (
    <div
      ref={panelRef}
      className="icon-picker-popover no-print"
      style={{
        position: 'fixed',
        zIndex: 99999,
        top: position.top,
        left: position.left,
        width: 320,
        background: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(16px)',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px 8px',
        borderBottom: '1px solid #F1F5F9',
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          color: '#64748B',
        }}>
          Choose Icon
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            color: '#94A3B8',
            fontSize: 16,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94A3B8' }}
        >
          ✕
        </button>
      </div>

      {/* Search input */}
      <div style={{ padding: '8px 14px' }}>
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: '7px 10px',
            fontSize: 12,
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            outline: 'none',
            background: '#F8FAFC',
            color: '#334155',
            boxSizing: 'border-box',
            transition: 'border 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = color }}
          onBlur={(e) => { e.target.style.borderColor = '#E2E8F0' }}
        />
      </div>

      {/* Category tabs — only when not searching */}
      {!search.trim() && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: '4px 14px 8px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {Object.keys(ICON_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontSize: 10,
                fontWeight: activeCategory === cat ? 700 : 500,
                padding: '3px 8px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: activeCategory === cat ? `${color}15` : 'transparent',
                color: activeCategory === cat ? color : '#64748B',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Icon grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
        padding: '10px 14px 10px',
        maxHeight: 200,
        overflowY: 'auto',
      }}>
        {filteredIcons.map((key) => {
          const isActive = key === currentIcon
          return (
            <button
              key={key}
              title={key}
              onClick={() => { onSelect(key); onClose() }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: isActive ? `2px solid ${color}` : '1px solid transparent',
                background: isActive ? `${color}10` : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transition: 'all 0.15s',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F1F5F9'
                  e.currentTarget.style.border = '1px solid #E2E8F0'
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.border = '1px solid transparent'
                }
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? color : '#475569'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'block' }}
              >
                <path d={ICON_MAP[key]} />
              </svg>
            </button>
          )
        })}
        {filteredIcons.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '16px 0',
            fontSize: 12,
            color: '#94A3B8',
          }}>
            No icons found
          </div>
        )}
      </div>

      {/* Upload custom icon */}
      <div style={{
        padding: '8px 14px 12px',
        borderTop: '1px solid #F1F5F9',
      }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/svg+xml,image/png,image/jpeg,image/webp,image/gif"
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 11,
            fontWeight: 600,
            color: color,
            background: `${color}08`,
            border: `1px dashed ${color}30`,
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = `${color}12`
            e.currentTarget.style.borderColor = `${color}50`
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = `${color}08`
            e.currentTarget.style.borderColor = `${color}30`
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Upload Custom Icon
        </button>
        <p style={{
          fontSize: 9,
          color: '#94A3B8',
          textAlign: 'center',
          marginTop: 4,
          marginBottom: 0,
        }}>
          SVG, PNG, JPG • Recommended: square, transparent bg
        </p>
      </div>
    </div>
  )

  // Render via portal at document.body so it's never clipped
  return ReactDOM.createPortal(pickerEl, document.body)
}
