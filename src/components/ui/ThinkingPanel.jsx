import React, { useState, useEffect, useRef } from 'react'
import { useProposal } from '../../context/ProposalContext'

export function ThinkingPanel() {
  const { thoughts, isLoading } = useProposal()
  const [collapsed, setCollapsed] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [thoughts])

  if (thoughts.length === 0 && !isLoading) return null

  return (
    <div className="thinking-panel" style={{ marginTop: 16 }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
        style={{
          padding: '10px 14px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: collapsed ? 10 : '10px 10px 0 0',
          border: '1px solid rgba(51, 65, 85, 0.5)',
          borderBottom: collapsed ? undefined : 'none',
          cursor: 'pointer',
          color: '#94A3B8',
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider">AI Reasoning</span>
          <span className="text-xs text-slate-500">({thoughts.length})</span>
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Thoughts list */}
      {!collapsed && (
        <div
          ref={scrollRef}
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            padding: '12px 14px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0 0 10px 10px',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderTop: 'none',
          }}
        >
          {thoughts.map((t, i) => {
            const isPhase1 = t.phase === 1
            const dotColor = isPhase1 ? '#3B82F6' : '#10B981'
            const isHeader = t.text.startsWith('Starting') || t.text.startsWith('✓')

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 8,
                paddingBottom: 8,
                borderBottom: '1px solid rgba(51, 65, 85, 0.2)',
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  minWidth: 6,
                  borderRadius: '50%',
                  background: isHeader ? dotColor : '#475569',
                  marginTop: 5,
                }} />
                <div>
                  {isHeader && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      color: dotColor,
                      marginRight: 6,
                    }}>
                      {isPhase1 ? 'Phase 1 — Planning' : 'Phase 2 — Writing'}
                    </span>
                  )}
                  <p style={{
                    fontSize: 13,
                    color: isHeader ? '#CBD5E1' : '#64748B',
                    lineHeight: 1.5,
                    fontWeight: isHeader ? 600 : 400,
                  }}>
                    {t.text}
                  </p>
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
              <div className="animate-pulse" style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#06B6D4',
              }} />
              <span style={{ fontSize: 12, color: '#475569' }}>Thinking...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
