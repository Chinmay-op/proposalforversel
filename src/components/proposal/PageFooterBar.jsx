import React from 'react'

export function PageFooterBar({ proposalName, pageNumber, totalPages, accentColor }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{
      position: 'absolute',
      bottom: '8mm',
      left: '16mm',
      right: '16mm',
    }}>
      {/* Gradient top line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, ${accent}30, ${accent}10, transparent)`,
        marginBottom: 8,
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: '#94A3B8',
          fontWeight: 600,
          fontVariant: 'small-caps',
        }}>
          {proposalName || 'PROPOSAL'}
        </span>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: '#94A3B8',
        }}>
          <span style={{ color: accent }}>
            {String(pageNumber).padStart(2, '0')}
          </span>
          {totalPages && (
            <>
              <span style={{ margin: '0 3px', opacity: 0.4 }}>/</span>
              <span>{String(totalPages).padStart(2, '0')}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
