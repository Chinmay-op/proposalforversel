import React from 'react'
import { useProposal } from '../../context/ProposalContext'
import { PageWrapper } from './PageWrapper'
import { SectionRouter } from './SectionRouter'

export function ProposalDocument() {
  const { document, theme } = useProposal()

  if (!document || !document.pages) return null

  // Inject CSS variables from theme for components that use var(--primary) etc.
  const cssVars = {
    '--primary': theme.primary,
    '--accent': theme.accent,
    '--dark': theme.dark,
    '--bg': theme.bg,
    '--card-bg': theme.cardBg,
    '--highlight': theme.highlight,
    '--text': theme.text,
    '--muted': theme.mutedText,
    '--divider': theme.divider,
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", ...cssVars }}>
      {document.pages.map((page, pageIndex) => {
          const headerNodes = (page.sections || [])
            .filter(section => section.componentType === 'SectionHeader' || section.componentType === 'CoverPage' || section.componentType === 'TitleCover')
            .map((section, idx) => (
              <div key={`header-${idx}`} style={{ width: '100%', boxSizing: 'border-box' }}>
                <SectionRouter section={section} />
              </div>
            ))

          const contentNodes = (page.sections || [])
            .filter(section => section.componentType !== 'SectionHeader' && section.componentType !== 'CoverPage' && section.componentType !== 'TitleCover')
            .map((section, idx, arr) => {
              const isSecondToLast = idx === arr.length - 2
              return (
                <div 
                  key={`content-${idx}`} 
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxSizing: 'border-box', 
                    flexGrow: isSecondToLast ? 1 : 0 
                  }}
                >
                  <SectionRouter section={section} />
                </div>
              )
            })

          return (
            <PageWrapper
              key={page.pageId || pageIndex}
              pageNumber={pageIndex + 1}
              totalPages={document.pages.length}
              meta={document.meta}
              theme={theme}
              headerNodes={headerNodes}
              contentNodes={contentNodes}
            />
          )
        })}
    </div>
  )
}
