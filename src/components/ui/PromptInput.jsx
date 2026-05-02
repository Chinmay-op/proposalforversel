import React, { useState, useRef, useEffect } from 'react'
import { useProposal } from '../../context/ProposalContext'

export function PromptInput() {
  const {
    document,
    submitPrompt,
    resetConversation,
    isLoading,
    isRefining,
    error,
    conversationHistory,
  } = useProposal()

  const [prompt, setPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const isProcessing = isLoading || isRefining
  const isFollowUpMode = conversationHistory.length > 0

  // Auto-focus follow-up input when switching modes
  useEffect(() => {
    if (isFollowUpMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFollowUpMode])

  const handleSubmit = () => {
    if (!prompt.trim() || isProcessing) return
    submitPrompt(prompt.trim())
    setPrompt('')
  }

  const handleKeyDown = (e) => {
    if (isFollowUpMode) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    } else {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSubmit()
      }
    }
  }

  // ─── Follow-up mode (premium chat bar) ─────────────────────────
  if (isFollowUpMode) {
    return (
      <div style={{ flexShrink: 0 }}>
        {/* Gradient divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), rgba(139, 92, 246, 0.15), transparent)',
          marginBottom: 14,
        }} />

        {/* Input container with glow effect */}
        <div style={{
          position: 'relative',
          borderRadius: 18,
          padding: 1,
          background: isFocused
            ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.4))'
            : 'linear-gradient(135deg, rgba(51, 65, 85, 0.4), rgba(51, 65, 85, 0.2))',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isFocused
            ? '0 0 20px rgba(14, 165, 233, 0.1), 0 0 40px rgba(139, 92, 246, 0.05)'
            : 'none',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: 17,
            padding: '4px 4px 4px 14px',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Sparkle icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              paddingBottom: 10,
              marginRight: 8,
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={isFocused ? '#06B6D4' : '#475569'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'stroke 0.3s' }}
              >
                <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707M17.657 17.657l.707.707"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>

            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={1}
              placeholder="Refine your proposal..."
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: '8px 0',
                fontSize: 13,
                lineHeight: 1.5,
                color: '#E2E8F0',
                background: 'transparent',
                border: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                outline: 'none',
                minHeight: 36,
                maxHeight: 100,
                overflow: 'auto',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
              }}
            />

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !prompt.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                border: 'none',
                background: isProcessing
                  ? 'rgba(51, 65, 85, 0.5)'
                  : !prompt.trim()
                    ? 'rgba(51, 65, 85, 0.3)'
                    : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                color: '#FFFFFF',
                cursor: isProcessing || !prompt.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isProcessing || !prompt.trim() ? 0.4 : 1,
                transform: prompt.trim() && !isProcessing ? 'scale(1)' : 'scale(0.9)',
                flexShrink: 0,
                boxShadow: prompt.trim() && !isProcessing
                  ? '0 2px 12px rgba(14, 165, 233, 0.3)'
                  : 'none',
              }}
              onMouseOver={(e) => {
                if (prompt.trim() && !isProcessing) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                if (prompt.trim() && !isProcessing) {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(14, 165, 233, 0.3)'
                }
              }}
            >
              {isRefining ? (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: hint + new proposal */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          padding: '0 6px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              fontSize: 10,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <kbd style={{
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 4,
                background: 'rgba(51, 65, 85, 0.3)',
                border: '1px solid rgba(51, 65, 85, 0.3)',
                color: '#64748B',
                fontFamily: 'inherit',
              }}>↵</kbd>
              Send
            </span>
            <span style={{
              fontSize: 10,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <kbd style={{
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 4,
                background: 'rgba(51, 65, 85, 0.3)',
                border: '1px solid rgba(51, 65, 85, 0.3)',
                color: '#64748B',
                fontFamily: 'inherit',
              }}>⇧↵</kbd>
              New line
            </span>
          </div>
          <button
            onClick={() => {
              resetConversation()
              setPrompt('')
            }}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#64748B',
              background: 'rgba(51, 65, 85, 0.15)',
              border: '1px solid rgba(51, 65, 85, 0.2)',
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 8,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#F59E0B'
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#64748B'
              e.currentTarget.style.background = 'rgba(51, 65, 85, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.2)'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Proposal
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div style={{
            marginTop: 10,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: 12, color: '#FCA5A5', margin: 0, flex: 1 }}>
              {error}
            </p>
          </div>
        )}

        {/* Scrollbar & animation styles */}
        <style>{`
          .chat-input-area textarea::-webkit-scrollbar { width: 3px; }
          .chat-input-area textarea::-webkit-scrollbar-track { background: transparent; }
          .chat-input-area textarea::-webkit-scrollbar-thumb { background: rgba(51,65,85,0.3); border-radius: 999px; }
          .chat-input-area textarea::placeholder { color: #475569; }
        `}</style>
      </div>
    )
  }

  // ─── Initial mode (full premium textarea) ──────────────────────
  return (
    <div className="prompt-input" style={{ padding: '0' }}>
      {/* Label with gradient accent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
      }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#94A3B8',
        }}>
          Proposal Prompt
        </span>
      </div>

      {/* Textarea with gradient border */}
      <div style={{
        borderRadius: 14,
        padding: 1,
        background: isFocused
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.35), rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.35))'
          : 'linear-gradient(135deg, rgba(51, 65, 85, 0.4), rgba(51, 65, 85, 0.2))',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isFocused
          ? '0 0 24px rgba(14, 165, 233, 0.08), 0 0 48px rgba(139, 92, 246, 0.04)'
          : 'none',
      }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={6}
          placeholder="Describe the proposal you want to generate...

e.g. Generate a proposal for an AI-powered underground mine safety system for Sateroid Innovations, including sections on challenges, architecture, features, scope of work, and contact."
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 13,
            lineHeight: 1.6,
            color: '#E2E8F0',
            background: 'rgba(15, 23, 42, 0.7)',
            border: 'none',
            borderRadius: 13,
            resize: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
            backdropFilter: 'blur(8px)',
          }}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        style={{
          width: '100%',
          marginTop: 12,
          padding: '13px 20px',
          borderRadius: 14,
          border: 'none',
          background: isLoading
            ? 'linear-gradient(135deg, #1E293B, #334155)'
            : !prompt.trim()
              ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(6, 182, 212, 0.15))'
              : 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
          cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: !prompt.trim() && !isLoading ? 0.5 : 1,
          boxShadow: prompt.trim() && !isLoading
            ? '0 4px 20px rgba(14, 165, 233, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)'
            : 'none',
          letterSpacing: '0.02em',
        }}
        onMouseOver={(e) => {
          if (prompt.trim() && !isLoading) {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(14, 165, 233, 0.35), 0 0 48px rgba(6, 182, 212, 0.15)'
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          if (prompt.trim() && !isLoading) {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.3), 0 0 40px rgba(6, 182, 212, 0.1)'
          }
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            Generate Proposal
          </>
        )}
      </button>

      {error && (
        <div style={{
          marginTop: 12,
          padding: '12px 14px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 13, color: '#FCA5A5' }}>Generation Failed</p>
              <p style={{ fontSize: 12, color: '#F87171' }}>{error}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            style={{
              marginTop: 10,
              width: '100%',
              padding: '8px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Retry
          </button>
        </div>
      )}

      <p style={{
        marginTop: 10,
        fontSize: 10,
        color: '#374151',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <kbd style={{
          fontSize: 9,
          padding: '1px 5px',
          borderRadius: 4,
          background: 'rgba(51, 65, 85, 0.3)',
          border: '1px solid rgba(51, 65, 85, 0.3)',
          color: '#64748B',
          fontFamily: 'inherit',
        }}>Ctrl</kbd>
        +
        <kbd style={{
          fontSize: 9,
          padding: '1px 5px',
          borderRadius: 4,
          background: 'rgba(51, 65, 85, 0.3)',
          border: '1px solid rgba(51, 65, 85, 0.3)',
          color: '#64748B',
          fontFamily: 'inherit',
        }}>↵</kbd>
        to generate
      </p>
    </div>
  )
}
