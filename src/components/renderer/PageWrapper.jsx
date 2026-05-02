import React, { useRef, useState, useEffect } from 'react'
import { useProposal } from '../../context/ProposalContext'

export function PageWrapper({ children, headerNodes, contentNodes, pageNumber, totalPages, meta, theme }) {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)
  const headerRef = useRef(null)
  const [scale, setScale] = useState(1)

  const isCoverPage = pageNumber === 1
  const accentColor = theme?.primary || '#1A56DB'
  const accentLight = theme?.accent || '#06B6D4'

  const { refiningPages, refinePageAction } = useProposal()
  const [isHovered, setIsHovered] = useState(false)
  const [isRefineInputOpen, setIsRefineInputOpen] = useState(false)
  const [refinePrompt, setRefinePrompt] = useState('')

  const isCurrentlyRefining = refiningPages[pageNumber - 1]

  const handleRefineSubmit = () => {
    if (!refinePrompt.trim()) return
    refinePageAction(pageNumber - 1, refinePrompt)
    setIsRefineInputOpen(false)
    setRefinePrompt('')
  }

  useEffect(() => {
    const adjustScale = () => {
      if (!wrapperRef.current || !contentRef.current) return

      const previousTransform = contentRef.current.style.transform
      const previousWidth = contentRef.current.style.width
      
      contentRef.current.style.transform = 'scale(1)'
      contentRef.current.style.width = '100%'

      const wrapperStyle = window.getComputedStyle(wrapperRef.current)
      const pt = parseFloat(wrapperStyle.paddingTop) || 0
      const pb = parseFloat(wrapperStyle.paddingBottom) || 0
      
      const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0
      const availableHeight = wrapperRef.current.clientHeight - pt - pb - headerHeight

      const contentHeight = contentRef.current.scrollHeight

      if (contentHeight > availableHeight && availableHeight > 0) {
        // Multiply by 0.98 to add a 2% buffer, preventing sub-pixel overflows
        const calculatedScale = ((availableHeight - 2) / contentHeight) * 0.98
        setScale(Math.max(0.62, calculatedScale))
      } else {
        setScale(1)
      }

      contentRef.current.style.transform = previousTransform
      contentRef.current.style.width = previousWidth
    }

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(adjustScale)
    })

    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current)
    if (contentRef.current) {
      Array.from(contentRef.current.children).forEach(child => {
        resizeObserver.observe(child)
      })
    }

    const timer = setTimeout(adjustScale, 100)

    return () => {
      resizeObserver.disconnect()
      clearTimeout(timer)
    }
  }, [children])

  return (
    <div 
      className="page-wrapper" 
      ref={wrapperRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsRefineInputOpen(false) }}
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        padding: isCoverPage ? '14mm 16mm 18mm 16mm' : '14mm 16mm 18mm 16mm',
        backgroundColor: theme?.bg || '#FFFFFF',
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
        position: 'relative',
        margin: '0 auto 24px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* ═══ REFINE OVERLAYS (non-print interactive area) ═══ */}
      {isCurrentlyRefining && (
        <div className="refine-overlay" style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="animate-pulse" style={{ width: 40, height: 40, borderRadius: '50%', background: accentColor, marginBottom: 16 }} />
          <p style={{ fontWeight: 600, color: '#334155' }}>Refining Page Content...</p>
          <p style={{ fontSize: 13, color: '#64748B', maxWidth: 300, textAlign: 'center', marginTop: 8 }}>
            Our AI is analyzing your comment and generating a new layout specifically for this page.
          </p>
        </div>
      )}

      {!isCurrentlyRefining && isHovered && !isRefineInputOpen && (
        <button
          className="refine-page-btn"
          onClick={() => setIsRefineInputOpen(true)}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 50,
            background: 'rgba(15, 23, 42, 0.8)', color: 'white',
            border: 'none', padding: '8px 16px', borderRadius: 20,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.target.style.background = '#0F172A'}
          onMouseOut={(e) => e.target.style.background = 'rgba(15, 23, 42, 0.8)'}
        >
          ✨ Refine Page
        </button>
      )}

      {isRefineInputOpen && !isCurrentlyRefining && (
        <div className="refine-page-input" style={{
          position: 'absolute', top: 16, right: 16, zIndex: 60,
          background: '#FFFFFF', padding: 16, borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          width: 320, border: '1px solid #E2E8F0',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Refine this page</p>
          <textarea 
            autoFocus
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="e.g. Add a feature card about security, or change the tone to be more technical..."
            style={{
              width: '100%', height: 80, padding: 8, fontSize: 13,
              borderRadius: 6, border: '1px solid #CBD5E1', 
              resize: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button 
              onClick={() => setIsRefineInputOpen(false)}
              style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#F1F5F9', color: '#64748B', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleRefineSubmit}
              style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: accentColor, color: 'white', fontWeight: 600, cursor: 'pointer' }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
      {/* ═══ BRANDED PAGE HEADER ═══ */}
      {!isCoverPage && (
        <div className="page-header" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '10px 16mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}>
          {/* Left: Company name (styled identically to the right badge) */}
          <span style={{
            fontSize: 8,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: accentColor,
            background: `${accentColor}0D`,
            padding: '3px 10px',
            borderRadius: 999,
            border: `1px solid ${accentColor}20`,
          }}>
            {meta?.companyName || 'COMPANY'}
          </span>

          {/* Right: proposal type badge */}
          <span style={{
            fontSize: 8,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: accentColor,
            background: `${accentColor}0D`,
            padding: '3px 10px',
            borderRadius: 999,
            border: `1px solid ${accentColor}20`,
          }}>
            {meta?.proposalType || 'PROPOSAL'}
          </span>
        </div>
      )}

      {/* ═══ FIXED HEADER AREA (UNSCALED) ═══ */}
      {headerNodes && headerNodes.length > 0 && (
        <div 
          ref={headerRef} 
          style={{ width: '100%', marginTop: isCoverPage ? 0 : 24, zIndex: 15, position: 'relative' }}
        >
          {headerNodes}
        </div>
      )}

      {/* ═══ CONTENT AREA ═══ */}
      <div 
        ref={contentRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginTop: (!headerNodes || headerNodes.length === 0) ? (isCoverPage ? 0 : 24) : 16,
          paddingBottom: 36,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: scale !== 1 ? `${(100 / scale)}%` : '100%',
          overflow: 'hidden',
        }}
      >
        {contentNodes || children}
      </div>

      {/* ═══ PREMIUM PAGE FOOTER ═══ */}
      <div className="page-footer" style={{
        position: 'absolute',
        bottom: '8mm',
        left: '16mm',
        right: '16mm',
        zIndex: 10,
      }}>
        {/* Top accent gradient line */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, ${accentColor}35, ${accentLight}20, transparent)`,
          marginBottom: 8,
        }} />
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Left: company name */}
          <span style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 1.8,
            color: theme?.mutedText || '#94A3B8',
            fontWeight: 600,
            fontVariant: 'small-caps',
            maxWidth: '50%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {meta?.companyName ? `${meta.companyName.toUpperCase()}` : 'COMPANY'}
          </span>

          {/* Center: decorative dots */}
          <div style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: `${accentColor}${i === 1 ? '40' : '20'}`,
              }} />
            ))}
          </div>

          {/* Right: page counter */}
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: theme?.mutedText || '#94A3B8',
          }}>
            <span style={{ color: accentColor }}>
              {String(pageNumber).padStart(2, '0')}
            </span>
            <span style={{ margin: '0 3px', opacity: 0.4 }}>/</span>
            <span>{String(totalPages).padStart(2, '0')}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
