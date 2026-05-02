import React, { useState } from 'react'
import { useImagePrompts } from '../../context/ImagePromptContext'

export function ImagePromptPanel() {
  const { imagePrompts, isVisible, setIsVisible, updatePromptComment, setEditing, copyPrompt } = useImagePrompts()

  if (imagePrompts.length === 0) return null

  return (
    <div style={{
      marginTop: 16,
      borderRadius: 14,
      border: '1px solid rgba(6,182,212,0.15)',
      background: 'rgba(6,182,212,0.04)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: isVisible ? '60vh' : 'auto',
    }}>
      {/* Header — always visible, acts as toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(6,182,212,0.08)',
          borderBottom: isVisible ? '1px solid rgba(6,182,212,0.12)' : 'none',
          cursor: 'pointer',
          flexShrink: 0,
          borderRadius: isVisible ? '14px 14px 0 0' : 14,
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.15))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#E2E8F0',
              letterSpacing: '-0.01em',
            }}>
              Image Prompts
            </span>
            <span style={{
              fontSize: 11,
              color: '#64748B',
              marginLeft: 8,
            }}>
              {imagePrompts.length} placeholder{imagePrompts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform 0.25s ease', transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Scrollable prompt cards container */}
      {isVisible && (
        <div style={{
          padding: '8px 12px 12px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}>
          {imagePrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              onComment={updatePromptComment}
              onToggleEdit={setEditing}
              onCopy={copyPrompt}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PromptCard({ prompt, index, onComment, onToggleEdit, onCopy }) {
  const [commentText, setCommentText] = useState(prompt.comment || '')
  const [showComment, setShowComment] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = () => {
    onCopy(prompt.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCommentSubmit = () => {
    onComment(prompt.id, commentText)
    setShowComment(false)
  }

  return (
    <div style={{
      marginTop: index === 0 ? 0 : 8,
      borderRadius: 10,
      border: '1px solid rgba(51,65,85,0.3)',
      background: 'rgba(15,23,42,0.6)',
    }}>
      {/* Card header — clickable to expand/collapse prompt text */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: isExpanded ? '1px solid rgba(51,65,85,0.3)' : 'none',
          background: 'rgba(15,23,42,0.4)',
          cursor: 'pointer',
          borderRadius: isExpanded ? '10px 10px 0 0' : 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          {/* Page indicator */}
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            color: '#06B6D4',
            background: 'rgba(6,182,212,0.12)',
            padding: '2px 8px',
            borderRadius: 999,
            letterSpacing: 0.5,
            flexShrink: 0,
          }}>
            P{prompt.pageNumber}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#CBD5E1',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {prompt.label}
          </span>
        </div>

        {/* Expand chevron + action buttons */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0, marginLeft: 8 }}>
          {/* Copy button — always visible */}
          <button
            onClick={(e) => { e.stopPropagation(); handleCopy() }}
            style={{
              background: copied ? 'rgba(16,185,129,0.15)' : 'transparent',
              border: '1px solid rgba(51,65,85,0.4)',
              borderRadius: 6,
              padding: '3px 7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              color: copied ? '#10B981' : '#64748B',
              fontSize: 9,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            title="Copy prompt to clipboard"
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                ✓
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </>
            )}
          </button>

          {/* Expand chevron */}
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Expanded content: prompt text + refine */}
      {isExpanded && (
        <>
          {/* Prompt text */}
          <div style={{
            padding: '10px 12px',
            fontSize: 11,
            color: '#94A3B8',
            lineHeight: 1.65,
            fontFamily: "'Inter', sans-serif",
            wordBreak: 'break-word',
            background: 'rgba(15,23,42,0.3)',
          }}>
            {prompt.prompt}
          </div>

          {/* Action bar */}
          <div style={{
            display: 'flex',
            gap: 4,
            padding: '6px 12px',
            borderTop: '1px solid rgba(51,65,85,0.2)',
          }}>
            {/* Refine button */}
            <button
              onClick={() => setShowComment(!showComment)}
              style={{
                background: showComment ? 'rgba(6,182,212,0.15)' : 'transparent',
                border: '1px solid rgba(51,65,85,0.4)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: showComment ? '#06B6D4' : '#64748B',
                fontSize: 10,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              title="Add feedback to refine this prompt"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Refine
            </button>

            {/* Full copy button */}
            <button
              onClick={handleCopy}
              style={{
                background: copied ? 'rgba(16,185,129,0.15)' : 'transparent',
                border: '1px solid rgba(51,65,85,0.4)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: copied ? '#10B981' : '#64748B',
                fontSize: 10,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              title="Copy prompt to clipboard"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Full Prompt
                </>
              )}
            </button>
          </div>

          {/* Comment/refinement panel */}
          {showComment && (
            <div style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(51,65,85,0.3)',
              background: 'rgba(6,182,212,0.03)',
            }}>
              <label style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#06B6D4',
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'block',
                marginBottom: 6,
              }}>
                Refine with a comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="e.g., 'Make it more futuristic with a blue color scheme' or 'Use an aerial view of a city'"
                style={{
                  width: '100%',
                  minHeight: 50,
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(51,65,85,0.4)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: 11,
                  color: '#CBD5E1',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  fontFamily: "'Inter', sans-serif",
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => setShowComment(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(51,65,85,0.4)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 10,
                    color: '#64748B',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  style={{
                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 12px',
                    fontSize: 10,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(6,182,212,0.3)',
                  }}
                >
                  Apply
                </button>
              </div>
              {prompt.comment && (
                <div style={{
                  marginTop: 8,
                  padding: '5px 8px',
                  background: 'rgba(6,182,212,0.08)',
                  borderRadius: 6,
                  fontSize: 10,
                  color: '#06B6D4',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 5,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Applied: "{prompt.comment}"</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
