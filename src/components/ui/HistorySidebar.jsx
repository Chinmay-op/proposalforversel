import React from 'react'
import { useProposal } from '../../context/ProposalContext'

export function HistorySidebar({ isOpen, onClose }) {
  const { sessionsList, currentSessionId, loadSession, deleteSession } = useProposal()

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Drawer */}
      <div className="history-drawer" style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 280,
        background: '#0F172A',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 100,
        boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ color: '#F1F5F9', fontSize: 16, fontWeight: 700, margin: 0 }}>Session History</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {sessionsList.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: 13, textAlign: 'center', marginTop: 32 }}>No history found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessionsList.map(session => {
                const isActive = session.id === currentSessionId
                const date = new Date(session.updatedAt)
                const isToday = new Date().toDateString() === date.toDateString()
                
                return (
                  <div key={session.id} style={{
                    padding: 12,
                    borderRadius: 8,
                    background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(14, 165, 233, 0.3)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onClick={() => {
                     loadSession(session.id)
                     onClose()
                  }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 600, color: isActive ? '#38BDF8' : '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 24 }}>
                      {session.title || 'Untitled'}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
                      <span>{session.pageCount} pages</span>
                      <span>{isToday ? date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                      style={{
                        position: 'absolute', top: 10, right: 8, background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4
                      }}
                      title="Delete Session"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
