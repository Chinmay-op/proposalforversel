import React, { useState, useCallback, useRef } from 'react'
import { resolveIconPath } from './IconLibrary'
import { IconPicker } from './IconPicker'

/**
 * Checks if a value is an uploaded image (data URL or http URL)
 */
function isImageUrl(value) {
  if (!value || typeof value !== 'string') return false
  return value.startsWith('data:image/') || value.startsWith('blob:') ||
    value.startsWith('http://') || value.startsWith('https://')
}

/**
 * Premium SVG Icon component with reliable rendering.
 * Accepts a semantic key ("shield", "bolt"), a raw SVG d= path, or an image URL.
 * Always renders a valid icon — falls back to component defaults or global default.
 *
 * When `replaceable` is true, clicking the icon opens an IconPicker portal
 * to swap the icon. Supports both library icons and uploaded custom images.
 */
export function Icon({ 
  icon,           // key string, raw SVG path, or image URL (data:image/...)
  size = 20, 
  color = '#1A56DB', 
  strokeWidth = 2,
  componentType,  // optional: used for default fallback selection
  style = {},
  replaceable = false,
  onIconChange,   // callback: (newIconKey) => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [currentIcon, setCurrentIcon] = useState(icon)
  const [anchorRect, setAnchorRect] = useState(null)
  const triggerRef = useRef(null)

  // Resolve the display value
  const displayIcon = replaceable ? currentIcon : icon
  const isUploadedImage = isImageUrl(displayIcon)
  const path = !isUploadedImage ? resolveIconPath(displayIcon, componentType) : null

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (pickerOpen) {
      setPickerOpen(false)
      return
    }
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setAnchorRect(rect)
    }
    setPickerOpen(true)
  }, [pickerOpen])

  const handleSelect = useCallback((newKey) => {
    setCurrentIcon(newKey)
    onIconChange?.(newKey)
    setPickerOpen(false)
  }, [onIconChange])

  const handleClose = useCallback(() => {
    setPickerOpen(false)
  }, [])

  // Render the icon element — either an image or SVG
  const iconEl = isUploadedImage ? (
    <img
      src={displayIcon}
      alt="icon"
      width={size}
      height={size}
      style={{
        display: 'block',
        flexShrink: 0,
        objectFit: 'contain',
        borderRadius: 2,
        ...style,
      }}
    />
  ) : (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path d={path} />
    </svg>
  )

  // Non-replaceable: return plain icon
  if (!replaceable) {
    return iconEl
  }

  // Replaceable: wrap with click handler + portal picker
  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleClick}
        title="Click to change icon"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          padding: 2,
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, background 0.2s',
          boxShadow: pickerOpen ? `0 0 0 2px ${color}40` : 'none',
        }}
        className="icon-replaceable-trigger"
        onMouseOver={(e) => {
          if (!pickerOpen) {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${color}25`
            e.currentTarget.style.background = `${color}08`
          }
        }}
        onMouseOut={(e) => {
          if (!pickerOpen) {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        {iconEl}
      </div>

      {pickerOpen && (
        <IconPicker
          currentIcon={typeof currentIcon === 'string' && !isImageUrl(currentIcon) ? currentIcon : null}
          color={color}
          onSelect={handleSelect}
          onClose={handleClose}
          anchorRect={anchorRect}
        />
      )}
    </>
  )
}
