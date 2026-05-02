import React from 'react'

export function ExportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="export-button"
      style={{
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export PDF
    </button>
  )
}
