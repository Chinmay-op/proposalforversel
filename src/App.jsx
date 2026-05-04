import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProposalProvider, useProposal } from './context/ProposalContext'
import { ImageStoreProvider } from './context/ImageStore'
import { ImagePromptProvider, useImagePrompts } from './context/ImagePromptContext'
import { ProposalDocument } from './components/renderer/ProposalDocument'
import { PromptInput } from './components/ui/PromptInput'
import { ChatThread } from './components/ui/ChatThread'
import { ThinkingPanel } from './components/ui/ThinkingPanel'
import { ImagePromptPanel } from './components/ui/ImagePromptPanel'
import { ThemePanel } from './components/ui/ThemePanel'
import { ExportButton } from './components/ui/ExportButton'
import { HistorySidebar } from './components/ui/HistorySidebar'
import { AuthPage } from './components/ui/AuthPage'
import { GemPromptPanel } from './components/ui/GemPromptPanel'
import { AdminPanel } from './components/admin/AdminPanel'

function AppContent() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [mobileTab, setMobileTab] = useState('chat') // 'chat' | 'preview'
  const { user, isAdmin, logout } = useAuth()
  const {
    document,
    isLoading,
    isRefining,
    activeVersionIndex,
    documentVersions,
    registerDocumentReadyCallback,
    conversationHistory,
    hasPassedGemPanel,
  } = useProposal()
  const { generatePrompts } = useImagePrompts()

  useEffect(() => {
    registerDocumentReadyCallback((doc) => {
      generatePrompts(doc)
    })
  }, [registerDocumentReadyCallback, generatePrompts])

  const hasDocument = !!document
  const isProcessing = isLoading || isRefining
  const currentVersion = documentVersions[activeVersionIndex]
  const versionLabel = currentVersion ? `v${activeVersionIndex + 1}` : null

  if (showAdmin && isAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />
  }

  // Show the Gemini Refinement Panel before the main UI for new proposals
  if (!hasPassedGemPanel && !document && conversationHistory.length === 0) {
    return <GemPromptPanel />
  }

  return (
    <div className={`app-container ${hasDocument ? `mobile-show-${mobileTab}` : 'mobile-show-chat'}`} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#060A14',
    }}>
      {/* ═══ TOP BAR ═══ */}
      <header className="app-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        background: 'rgba(10, 15, 28, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.25)',
        zIndex: 50,
        flexShrink: 0,
      }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 16px rgba(14, 165, 233, 0.25), 0 0 32px rgba(139, 92, 246, 0.1)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 10px',
              color: '#F1F5F9',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginLeft: 4,
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
          <div className="header-title-block" style={{ marginLeft: 8 }}>
            <h1 style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              AI Proposal Generator
            </h1>
            <p style={{
              fontSize: 10,
              color: '#475569',
              marginTop: 1,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              Powered by Azure GPT-5 · Two-Phase CoT+ReAct Engine
            </p>
          </div>
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Version badge */}
          {versionLabel && (
            <div className="header-version-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(14, 165, 233, 0.15)',
              boxShadow: isProcessing ? '0 0 12px rgba(245, 158, 11, 0.1)' : '0 0 12px rgba(6, 182, 212, 0.05)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isProcessing
                  ? 'linear-gradient(135deg, #F59E0B, #EF4444)'
                  : 'linear-gradient(135deg, #10B981, #06B6D4)',
                boxShadow: isProcessing
                  ? '0 0 8px rgba(245, 158, 11, 0.5)'
                  : '0 0 8px rgba(16, 185, 129, 0.5)',
                animation: isProcessing ? 'pulse 1.5s ease infinite' : 'none',
              }} />
              <span className="version-label" style={{
                fontSize: 11,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                {versionLabel}
              </span>
              {isRefining && (
                <span style={{
                  fontSize: 10,
                  color: '#F59E0B',
                  fontWeight: 500,
                  animation: 'fadeIn 0.3s ease',
                }}>
                  Updating...
                </span>
              )}
              {!isProcessing && documentVersions.length > 1 && (
                <span className="header-version-of" style={{
                  fontSize: 10,
                  color: '#475569',
                  fontWeight: 500,
                }}>
                  of {documentVersions.length}
                </span>
              )}
            </div>
          )}
          {document && <ExportButton />}

          {/* Admin button */}
          {isAdmin && (
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8,
                padding: '6px 12px',
                color: '#FCA5A5',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                letterSpacing: '0.03em',
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </button>
          )}

          {/* User & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="header-user-email" style={{ fontSize: 11, color: '#64748B', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </span>
            <button
              onClick={logout}
              title="Sign out"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '6px 8px',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      
      <div className={`app-main-layout ${hasDocument ? `mobile-show-${mobileTab}` : 'mobile-show-chat'}`} style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Left panel */}
        <div className="left-panel" style={{
          width: 390,
          minWidth: 390,
          borderRight: '1px solid rgba(51, 65, 85, 0.2)',
          background: 'linear-gradient(180deg, rgba(10, 15, 28, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%)',
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient background glow */}
          <div style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {hasDocument ? (
            <>
              <ChatThread />
              <PromptInput />

              {/* Collapsible panels — separated by gradient divider */}
              <div style={{
                marginTop: 14,
                overflowY: 'auto',
                flexShrink: 0,
                maxHeight: 240,
              }}>
                <div style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(51, 65, 85, 0.3), transparent)',
                  marginBottom: 10,
                }} />
                <ThinkingPanel />
                <ImagePromptPanel />
              </div>
            </>
          ) : (
            <>
              {conversationHistory.length > 0 && <ChatThread />}
              <PromptInput />
              <ThinkingPanel />
              <ImagePromptPanel />
            </>
          )}
        </div>

        {/* Right panel */}
        <div className="right-panel" style={{
          flex: 1,
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          padding: document ? '32px 24px' : 0,
          position: 'relative',
        }}>
          {/* Subtle grid pattern overlay */}
          {!document && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(51, 65, 85, 0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              pointerEvents: 'none',
            }} />
          )}
          {document ? (
            <ProposalDocument />
          ) : (
            <EmptyState isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* ═══ MOBILE BOTTOM TAB BAR ═══ */}
      {hasDocument && (
        <div className="mobile-tab-bar">
          <button
            className={`mobile-tab-btn ${mobileTab === 'chat' ? 'active' : ''}`}
            onClick={() => setMobileTab('chat')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Chat
          </button>
          <button
            className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileTab('preview')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Preview
          </button>
        </div>
      )}

      {/* ThemePanel — rendered OUTSIDE the right-panel so it never leaks into print */}
      {document && <ThemePanel />}

      {/* Global animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .left-panel::-webkit-scrollbar { width: 4px; }
        .left-panel::-webkit-scrollbar-track { background: transparent; }
        .left-panel::-webkit-scrollbar-thumb { background: rgba(51,65,85,0.3); border-radius: 999px; }
        .right-panel::-webkit-scrollbar { width: 6px; }
        .right-panel::-webkit-scrollbar-track { background: transparent; }
        .right-panel::-webkit-scrollbar-thumb { background: rgba(51,65,85,0.3); border-radius: 999px; }
        .right-panel::-webkit-scrollbar-thumb:hover { background: rgba(51,65,85,0.5); }
      `}
      </style>
    </div>
  )
}

function EmptyState({ isLoading }) {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 24,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Orbiting particles */}
        <div style={{
          position: 'relative',
          width: 80,
          height: 80,
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(139,92,246,0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2.5s ease infinite',
          }}>
            <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="url(#loadGrad)" strokeWidth="2">
              <defs>
                <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
              <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
            </svg>
          </div>
          {/* Orbiting dot */}
          <div style={{
            position: 'absolute',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#06B6D4',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)',
            top: -3,
            left: '50%',
            marginLeft: -3,
            animation: 'orbit 3s linear infinite',
            transformOrigin: '3px 43px',
          }} />
        </div>
        <div style={{ textAlign: 'center', animation: 'floatUp 0.6s ease' }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #CBD5E1, #94A3B8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em',
          }}>
            Generating your proposal...
          </h2>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 8, lineHeight: 1.6 }}>
            AI is reasoning through the best structure, theme, and content
          </p>
        </div>
        <style>{`
          @keyframes orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 28,
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Icon */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(139,92,246,0.04))',
        border: '1px solid rgba(51, 65, 85, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'floatUp 0.5s ease',
      }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="url(#emptyGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155"/>
              <stop offset="100%" stopColor="#1E293B"/>
            </linearGradient>
          </defs>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      <div style={{
        textAlign: 'center',
        maxWidth: 360,
        animation: 'floatUp 0.6s ease',
      }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#3B4A63',
          letterSpacing: '-0.02em',
        }}>
          No Proposal Yet
        </h2>
        <p style={{
          fontSize: 14,
          color: '#2D3B4F',
          marginTop: 10,
          lineHeight: 1.7,
        }}>
          Enter a prompt in the chat panel to generate a professional, multi-page proposal document powered by AI.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 420,
        animation: 'floatUp 0.7s ease',
      }}>
        {['IoT Platform', 'Healthcare SaaS', 'Smart City', 'Mining Safety', 'EdTech Startup'].map((tag, i) => (
          <span key={tag} style={{
            fontSize: 11,
            padding: '5px 14px',
            borderRadius: 999,
            background: 'rgba(51, 65, 85, 0.15)',
            border: '1px solid rgba(51, 65, 85, 0.1)',
            color: '#3B4A63',
            fontWeight: 600,
            letterSpacing: '0.02em',
            transition: 'all 0.2s ease',
            cursor: 'default',
            animationDelay: `${i * 0.05}s`,
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Auth Gate Wrapper ────────────────────────────────────────── */
function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#060A14',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.06))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 2s ease infinite',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4" strokeLinecap="round" />
          </svg>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.95)} }`}</style>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <ImageStoreProvider>
      <ProposalProvider>
        <ImagePromptProvider>
          <AppContent />
        </ImagePromptProvider>
      </ProposalProvider>
    </ImageStoreProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}
