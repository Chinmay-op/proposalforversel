import React, { useRef, useEffect, useState } from 'react'
import { useProposal } from '../../context/ProposalContext'

export function ChatThread() {
  const {
    conversationHistory,
    documentVersions,
    activeVersionIndex,
    switchToVersion,
    isRefining,
    isLoading,
  } = useProposal()

  const scrollRef = useRef(null)
  const [hoveredVersion, setHoveredVersion] = useState(null)
  const [animatedMessages, setAnimatedMessages] = useState(new Set())

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationHistory, isRefining])

  // Track newly added messages for entrance animation
  useEffect(() => {
    if (conversationHistory.length > 0) {
      const lastIdx = conversationHistory.length - 1
      setAnimatedMessages(prev => new Set([...prev, lastIdx]))
    }
  }, [conversationHistory.length])

  if (conversationHistory.length === 0) return null

  const formatTime = (timestamp) => {
    const d = new Date(timestamp)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      ref={scrollRef}
      className="chat-thread"
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingBottom: 8,
        scrollBehavior: 'smooth',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%)',
      }}
    >
      {/* Conversation header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 6px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}>
        {/* Animated gradient icon */}
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6, #06B6D4)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 4s ease infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 12px rgba(14, 165, 233, 0.25)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#CBD5E1',
          }}>
            Proposal Chat
          </span>
          <div style={{
            fontSize: 10,
            color: '#475569',
            marginTop: 1,
          }}>
            {documentVersions.length} version{documentVersions.length !== 1 ? 's' : ''} · {conversationHistory.filter(m => m.role === 'user').length} message{conversationHistory.filter(m => m.role === 'user').length !== 1 ? 's' : ''}
          </div>
        </div>
        {/* Version dots indicator */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {documentVersions.map((_, idx) => (
            <div
              key={idx}
              onClick={() => switchToVersion(idx)}
              style={{
                width: idx === activeVersionIndex ? 16 : 6,
                height: 6,
                borderRadius: 999,
                background: idx === activeVersionIndex
                  ? 'linear-gradient(90deg, #0EA5E9, #06B6D4)'
                  : 'rgba(51, 65, 85, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: idx === activeVersionIndex ? '0 0 8px rgba(6, 182, 212, 0.4)' : 'none',
              }}
              title={`Version ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      {conversationHistory.map((msg, i) => {
        const isUser = msg.role === 'user'
        const isAssistant = msg.role === 'assistant'
        const versionIdx = msg.versionIndex
        const isActiveVersion = versionIdx === activeVersionIndex
        const isViewingOldVersion = isAssistant && versionIdx !== undefined && versionIdx !== activeVersionIndex
        const isNew = animatedMessages.has(i)

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isUser ? 'flex-end' : 'flex-start',
              padding: '6px 0',
              animation: isNew ? 'messageSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              opacity: isNew ? 0 : 1,
            }}
          >
            {/* Avatar + role label row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
              flexDirection: isUser ? 'row-reverse' : 'row',
              padding: '0 4px',
            }}>
              {/* Avatar */}
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: isUser
                  ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                  : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isUser
                  ? '0 1px 6px rgba(99, 102, 241, 0.3)'
                  : '0 1px 6px rgba(6, 182, 212, 0.3)',
              }}>
                {isUser ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isUser ? '#A5B4FC' : '#67E8F9',
              }}>
                {isUser ? 'You' : 'AI Engine'}
              </span>
              <span style={{ fontSize: 9, color: '#374151' }}>
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {/* Message bubble */}
            <div
              style={{
                maxWidth: '94%',
                padding: isAssistant && versionIdx !== undefined ? '12px 14px 8px' : '11px 14px',
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isUser
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.06))'
                  : isActiveVersion
                    ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(6, 182, 212, 0.04))'
                    : 'rgba(30, 41, 59, 0.4)',
                border: isUser
                  ? '1px solid rgba(99, 102, 241, 0.15)'
                  : isActiveVersion
                    ? '1px solid rgba(6, 182, 212, 0.2)'
                    : '1px solid rgba(51, 65, 85, 0.3)',
                cursor: isAssistant && versionIdx !== undefined ? 'pointer' : 'default',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredVersion === i ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: hoveredVersion === i
                  ? '0 4px 20px rgba(6, 182, 212, 0.12)'
                  : isActiveVersion
                    ? '0 0 0 1px rgba(6, 182, 212, 0.05)'
                    : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => {
                if (isAssistant && versionIdx !== undefined) {
                  switchToVersion(versionIdx)
                }
              }}
              onMouseEnter={() => isAssistant && versionIdx !== undefined && setHoveredVersion(i)}
              onMouseLeave={() => setHoveredVersion(null)}
            >
              {/* Subtle shimmer on active version */}
              {isActiveVersion && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.03), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}

              <p style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: isUser ? '#C7D2FE' : '#D1D5DB',
                margin: 0,
                wordBreak: 'break-word',
                fontWeight: 400,
                position: 'relative',
              }}>
                {msg.content}
              </p>

              {/* Version footer for assistant messages */}
              {isAssistant && versionIdx !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: '1px solid rgba(51, 65, 85, 0.2)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    {/* Version pill */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: isActiveVersion
                        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(14, 165, 233, 0.08))'
                        : 'rgba(51, 65, 85, 0.25)',
                      border: `1px solid ${isActiveVersion ? 'rgba(6, 182, 212, 0.25)' : 'rgba(51, 65, 85, 0.2)'}`,
                    }}>
                      <div style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: isActiveVersion
                          ? '#10B981'
                          : '#475569',
                        boxShadow: isActiveVersion ? '0 0 6px rgba(16, 185, 129, 0.5)' : 'none',
                      }} />
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isActiveVersion ? '#06B6D4' : '#64748B',
                        letterSpacing: '0.04em',
                      }}>
                        v{versionIdx + 1}
                      </span>
                    </div>

                    {/* Status text */}
                    {isActiveVersion ? (
                      <span style={{
                        fontSize: 10,
                        color: '#34D399',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Active
                      </span>
                    ) : hoveredVersion === i ? (
                      <span style={{
                        fontSize: 10,
                        color: '#FBBF24',
                        fontWeight: 500,
                        animation: 'fadeIn 0.2s ease',
                      }}>
                        ↩ Click to restore
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Refining typing indicator */}
      {(isRefining || isLoading) && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '6px 0',
          animation: 'messageSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}>
          {/* Avatar + label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
            padding: '0 4px',
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#67E8F9' }}>
              AI Engine
            </span>
          </div>

          {/* Typing bubble */}
          <div style={{
            padding: '14px 20px',
            borderRadius: '16px 16px 16px 4px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(6, 182, 212, 0.04))',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            {/* Animated dots */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                  animation: `typingBounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                  boxShadow: '0 0 6px rgba(6, 182, 212, 0.3)',
                }} />
              ))}
            </div>
            <span style={{
              fontSize: 12,
              color: '#94A3B8',
              fontWeight: 500,
              fontStyle: 'italic',
            }}>
              Refining your proposal...
            </span>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes messageSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .chat-thread::-webkit-scrollbar {
          width: 4px;
        }
        .chat-thread::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-thread::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 999px;
        }
        .chat-thread::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 0.5);
        }
      `}</style>
    </div>
  )
}
