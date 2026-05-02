import React, { useRef } from 'react'
import { useImageStore } from '../../context/ImageStore'

export function ImagePlaceholder({ id, label, aspectRatio = '16/9', rounded }) {
  const { images, uploadImage } = useImageStore()
  const fileInputRef = useRef(null)
  const imageUrl = images[id]

  const aspectMap = { '16/9': '56.25%', '4/3': '75%', '1/1': '100%' }
  const paddingTop = aspectMap[aspectRatio] || '56.25%'

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      uploadImage(id, url)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  if (imageUrl) {
    return (
      <div
        className={`image-placeholder has-image`}
        style={{
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: rounded ? 14 : 0,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
        onClick={handleClick}
      >
        <img
          src={imageUrl}
          alt={label || 'Proposal image'}
          style={{
            width: '100%',
            aspectRatio: aspectRatio.replace('/', ' / '),
            objectFit: 'cover',
            display: 'block',
            borderRadius: rounded ? 14 : 0,
          }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleUpload}
        />
      </div>
    )
  }

  return (
    <div
      className="image-placeholder"
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        paddingTop,
        border: '2px dashed #CBD5E1',
        background: 'linear-gradient(135deg, #F9FAFB, #F1F5F9)',
        borderRadius: rounded ? 14 : 0,
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(148,163,184,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span style={{ fontSize: 13, color: '#94A3B8', marginTop: 10, fontWeight: 500 }}>
          {label || 'Image Placeholder'}
        </span>
        <span style={{ fontSize: 11, color: '#CBD5E1', marginTop: 3 }}>
          Click to upload
        </span>
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </div>
  )
}
