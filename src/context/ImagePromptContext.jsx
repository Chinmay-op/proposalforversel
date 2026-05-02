import React, { createContext, useContext, useState, useCallback } from 'react'

const ImagePromptContext = createContext(null)

/**
 * Deep-walks the ENTIRE document JSON tree to find every ImagePlaceholder
 * and CoverPage imageId — regardless of nesting depth.
 */
function generateImagePrompts(doc) {
  if (!doc?.pages) return []

  const prompts = []
  const seenIds = new Set()

  doc.pages.forEach((page, pageIndex) => {
    const sections = page.sections || []

    // ── Get page-level context for prompt generation ──
    const sectionHeader = sections.find(s => s.componentType === 'SectionHeader')
    const sectionHeading = sectionHeader?.props?.heading || ''
    const sectionSubheading = sectionHeader?.props?.subheading || ''

    // Collect ALL text on this page for contextual prompts
    const pageTextParts = []
    const collectText = (obj) => {
      if (!obj || typeof obj !== 'object') return
      if (Array.isArray(obj)) {
        obj.forEach(collectText)
        return
      }
      // Extract text from known prop keys
      if (typeof obj.title === 'string') pageTextParts.push(obj.title)
      if (typeof obj.heading === 'string') pageTextParts.push(obj.heading)
      if (typeof obj.subheading === 'string') pageTextParts.push(obj.subheading)
      if (typeof obj.tagline === 'string') pageTextParts.push(obj.tagline)
      if (typeof obj.body === 'string') pageTextParts.push(obj.body.slice(0, 120))
      if (typeof obj.quote === 'string') pageTextParts.push(obj.quote)
      if (typeof obj.executiveSummary === 'string') pageTextParts.push(obj.executiveSummary.slice(0, 120))
      if (typeof obj.label === 'string' && obj.label.length > 3) pageTextParts.push(obj.label)
      if (typeof obj.metric === 'string') pageTextParts.push(obj.metric)
      // Recurse into nested structures
      if (obj.props && typeof obj.props === 'object') collectText(obj.props)
      if (Array.isArray(obj.children)) obj.children.forEach(collectText)
      if (Array.isArray(obj.sections)) obj.sections.forEach(collectText)
      if (Array.isArray(obj.steps)) obj.steps.forEach(collectText)
      if (Array.isArray(obj.competitors)) obj.competitors.forEach(collectText)
      if (Array.isArray(obj.bullets)) obj.bullets.forEach(b => { if (typeof b === 'string') pageTextParts.push(b) })
      if (Array.isArray(obj.items)) obj.items.forEach(item => { if (typeof item === 'string') pageTextParts.push(item) })
    }
    collectText(sections)
    const pageContext = pageTextParts.filter(Boolean).join('. ').slice(0, 400).trim()

    // ── Deep-walk to find ALL image components ──
    let imgIndexOnPage = 0

    const walkTree = (node) => {
      if (!node || typeof node !== 'object') return
      if (Array.isArray(node)) {
        node.forEach(walkTree)
        return
      }

      const ct = node.componentType

      // Found a CoverPage with imageId
      if (ct === 'CoverPage' && node.props?.imageId) {
        const id = node.props.imageId
        if (!seenIds.has(id)) {
          seenIds.add(id)
          const title = doc.meta?.title || node.props?.title || 'Business'
          const domain = doc.meta?.proposalType || 'Technology'
          const cleanTitle = typeof title === 'string' ? title.replace(/\\n/g, ' ') : title

          // Prefer LLM-generated coverImagePrompt, fallback to generic
          const llmPrompt = node.props.coverImagePrompt
          const generatedPrompt = llmPrompt
            ? `${llmPrompt} Professional quality, 16:9 composition, no text overlay.`
            : `Professional high-quality corporate photograph for a ${domain} proposal titled "${cleanTitle}". Context: ${pageContext.slice(0, 120)}. Modern, sleek, cinematic corporate photography style with subtle tech elements. Widescreen 16:9 composition, vibrant yet professional color palette, sharp focus, premium stock photo quality. No text overlay.`

          prompts.push({
            id,
            label: '🎨 Cover Image',
            pageNumber: pageIndex + 1,
            isCover: true,
            prompt: generatedPrompt,
            originalPrompt: '',
            comment: '',
            isEditing: false,
          })
          prompts[prompts.length - 1].originalPrompt = prompts[prompts.length - 1].prompt
        }
      }

      // Found a standalone ImagePlaceholder
      if (ct === 'ImagePlaceholder' && node.props?.id) {
        const id = node.props.id
        if (!seenIds.has(id)) {
          seenIds.add(id)
          imgIndexOnPage++
          const domain = doc.meta?.proposalType || 'business'

          let label = `📸 ${node.props?.label || 'Image'}`
          if (sectionHeading) {
            label = `📸 ${sectionHeading}`
            if (imgIndexOnPage > 1) label += ` (#${imgIndexOnPage})`
          }

          // Prefer LLM-generated imagePrompt, fallback to generic
          const llmPrompt = node.props.imagePrompt
          const generatedPrompt = llmPrompt
            ? `${llmPrompt} Professional quality, 16:9 aspect ratio, no text overlay.`
            : `Professional photograph or premium 3D illustration related to: ${pageContext}. Clean, modern visual style suitable for a ${domain} strategy document. High resolution, professional lighting, 16:9 aspect ratio. No text overlay, no messy charts or illegible graphs.`

          prompts.push({
            id,
            label,
            pageNumber: pageIndex + 1,
            isCover: false,
            prompt: generatedPrompt,
            originalPrompt: '',
            comment: '',
            isEditing: false,
          })
          prompts[prompts.length - 1].originalPrompt = prompts[prompts.length - 1].prompt
        }
      }

      // Recurse into everything — props, children, sections, etc.
      if (node.props && typeof node.props === 'object') {
        Object.values(node.props).forEach(val => {
          if (Array.isArray(val)) val.forEach(walkTree)
          else if (val && typeof val === 'object') walkTree(val)
        })
      }
    }

    // Walk every section on this page
    sections.forEach(walkTree)
  })

  console.log(`[ImagePrompts] Deep-walk found ${prompts.length} image prompts:`, prompts.map(p => `${p.label} (page ${p.pageNumber}, id: ${p.id})`))
  return prompts
}

export function ImagePromptProvider({ children }) {
  const [imagePrompts, setImagePrompts] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  const generatePrompts = useCallback((document) => {
    const prompts = generateImagePrompts(document)
    setImagePrompts(prompts)
    if (prompts.length > 0) setIsVisible(true)
  }, [])

  const updatePromptComment = useCallback((id, comment) => {
    setImagePrompts(prev => prev.map(p => {
      if (p.id !== id) return p

      // Regenerate prompt with the comment as refinement
      let newPrompt = p.originalPrompt
      if (comment.trim()) {
        newPrompt = `${p.originalPrompt} Additional direction: ${comment.trim()}`
      }

      return { ...p, comment, prompt: newPrompt }
    }))
  }, [])

  const setEditing = useCallback((id, isEditing) => {
    setImagePrompts(prev => prev.map(p =>
      p.id === id ? { ...p, isEditing } : p
    ))
  }, [])

  const updatePromptDirectly = useCallback((id, newPrompt) => {
    setImagePrompts(prev => prev.map(p =>
      p.id === id ? { ...p, prompt: newPrompt } : p
    ))
  }, [])

  const copyPrompt = useCallback((id) => {
    const prompt = imagePrompts.find(p => p.id === id)
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt)
    }
  }, [imagePrompts])

  return (
    <ImagePromptContext.Provider value={{
      imagePrompts,
      isVisible,
      setIsVisible,
      generatePrompts,
      updatePromptComment,
      setEditing,
      updatePromptDirectly,
      copyPrompt,
    }}>
      {children}
    </ImagePromptContext.Provider>
  )
}

export function useImagePrompts() {
  const ctx = useContext(ImagePromptContext)
  if (!ctx) {
    throw new Error('useImagePrompts must be used within an ImagePromptProvider')
  }
  return ctx
}
