import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { proposalEngine } from '../engine/proposalEngine'
import { THEMES, recolorDocument, buildThemeFromColors } from '../themes/themes'
import { firestoreStorage } from '../utils/firestoreStorage'
import { useAuth } from './AuthContext'

const ProposalContext = createContext(null)

export function ProposalProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid

  const [document, setDocument] = useState(null)
  const [plan, setPlan] = useState(null)
  const [theme, setTheme] = useState(THEMES.TechBlue)
  const [activeThemeName, setActiveThemeName] = useState('TechBlue')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [thoughts, setThoughts] = useState([])
  const [refiningPages, setRefiningPages] = useState({})

  // ─── Conversation & Version History ─────────────────────────────
  const [conversationHistory, setConversationHistory] = useState([])
  const [documentVersions, setDocumentVersions] = useState([])
  const [activeVersionIndex, setActiveVersionIndex] = useState(-1)
  const [isRefining, setIsRefining] = useState(false)

  // ─── Session Management ───────────────────────────────────────
  const [sessionsList, setSessionsList] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Callback for external systems to react when document is ready
  const [onDocumentReady, setOnDocumentReady] = useState(null)

  const registerDocumentReadyCallback = useCallback((cb) => {
    setOnDocumentReady(() => cb)
  }, [])

  // ─── Load Sessions List ─────────────────────────────────────────
  const loadSessionsList = useCallback(async () => {
    if (!uid) return
    try {
      const allSessions = await firestoreStorage.getAllSessions(uid)
      // Metadata docs already have pageCount as a top-level field
      const summary = allSessions.map(s => ({
        id: s.id,
        title: s.title,
        updatedAt: s.updatedAt,
        pageCount: s.pageCount || 0,
        themeName: s.activeThemeName
      }))
      setSessionsList(summary)
    } catch (err) {
      console.error('Failed to load sessions list', err)
    }
  }, [uid])

  useEffect(() => {
    loadSessionsList()
  }, [loadSessionsList])

  // ─── Load Session ─────────────────────────────────────────────
  const loadSession = useCallback(async (sessionId) => {
    if (!uid) return
    try {
      const sessionData = await firestoreStorage.getSession(uid, sessionId)
      if (sessionData) {
        setDocument(sessionData.document)
        setPlan(sessionData.plan)
        setTheme(sessionData.theme)
        setActiveThemeName(sessionData.activeThemeName || 'Custom')
        setConversationHistory(sessionData.conversationHistory || [])
        setDocumentVersions(sessionData.documentVersions || [])
        setActiveVersionIndex(sessionData.activeVersionIndex || 0)
        setCurrentSessionId(sessionId)
        if (onDocumentReady) {
          onDocumentReady(sessionData.document)
        }
      }
    } catch (err) {
      console.error('Failed to load session', err)
    }
  }, [onDocumentReady, uid])

  const deleteSession = useCallback(async (sessionId) => {
    if (!uid) return
    await firestoreStorage.deleteSession(uid, sessionId)
    if (currentSessionId === sessionId) {
      setDocument(null)
      setPlan(null)
      setThoughts([])
      setError(null)
      setConversationHistory([])
      setDocumentVersions([])
      setActiveVersionIndex(-1)
      setCurrentSessionId(null)
    }
    loadSessionsList()
  }, [currentSessionId, loadSessionsList, uid])

  // ─── Helper: resolve theme from plan ────────────────────────────
  const resolveThemeFromPlan = useCallback((resultPlan) => {
    let resolvedTheme
    let resolvedThemeName

    // Support new explicit overrides if AI added them
    const overrides = resultPlan.meta?.themeUpdates || {}

    if (resultPlan.brandColors?.primary || overrides.primary) {
      const primary = overrides.primary || resultPlan.brandColors?.primary || '#1A56DB'
      const accent = overrides.accent || resultPlan.brandColors?.accent
      const dark = overrides.dark || resultPlan.brandColors?.dark
      resolvedTheme = buildThemeFromColors(primary, accent, dark, overrides)
      resolvedThemeName = resultPlan.theme || 'Custom Override'
      THEMES[resolvedThemeName] = resolvedTheme
    } else {
      resolvedThemeName = resultPlan.theme || 'TechBlue'
      resolvedTheme = THEMES[resolvedThemeName] || THEMES.TechBlue
    }

    return { resolvedTheme, resolvedThemeName }
  }, [])

  // ─── Generate Proposal (internal pipeline) ────────────────────
  const executeGeneration = useCallback(async (promptContext) => {
    setIsLoading(true)
    setError(null)
    setThoughts([])
    setDocument(null)
    setPlan(null)
    setDocumentVersions([])
    setActiveVersionIndex(-1)
    
    // Create new session id
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2,8)}`
    setCurrentSessionId(newSessionId)

    try {
      const onThought = (t) => setThoughts(prev => [...prev, t])
      // Give it the combined context
      const result = await proposalEngine.generateProposal(promptContext, onThought)
      setPlan(result.plan)
      setDocument(result.document)

      const { resolvedTheme, resolvedThemeName } = resolveThemeFromPlan(result.plan)
      setTheme(resolvedTheme)
      setActiveThemeName(resolvedThemeName)

      const pageCount = result.document.pages?.length || 0
      const companyName = result.document.meta?.companyName || result.plan.companyName || 'the client'
      const assistantSummary = `Generated a ${pageCount}-page proposal for ${companyName} using ${result.plan.pageMode || 'standard'} mode with the "${resolvedThemeName}" theme.`

      const now = Date.now()
      
      // We keep existing pre-gen chat in history, but add the generation success node
      const newHistory = [
        ...conversationHistory,
        { role: 'assistant', content: assistantSummary, timestamp: now + 1, versionIndex: 0 },
      ]
      setConversationHistory(newHistory)

      // Save version snapshot
      const version = {
        id: 'v1',
        document: JSON.parse(JSON.stringify(result.document)),
        plan: JSON.parse(JSON.stringify(result.plan)),
        theme: resolvedTheme,
        themeName: resolvedThemeName,
        timestamp: now + 1,
        prompt: promptContext,
        summary: assistantSummary,
      }
      setDocumentVersions([version])
      setActiveVersionIndex(0)

      // Auto-save session
      const sessionData = {
        id: newSessionId,
        title: companyName,
        updatedAt: now + 2,
        document: result.document,
        plan: result.plan,
        theme: resolvedTheme,
        activeThemeName: resolvedThemeName,
        conversationHistory: newHistory,
        documentVersions: [version],
        activeVersionIndex: 0
      }
      if (uid) await firestoreStorage.saveSession(uid, sessionData)
      loadSessionsList()

      // Notify external systems (like ImagePromptContext)
      if (onDocumentReady) {
        onDocumentReady(result.document)
      }
    } catch (err) {
      console.error('Proposal generation failed:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [onDocumentReady, resolveThemeFromPlan, loadSessionsList, conversationHistory, uid])

  // ─── Trigger Pre-Chat or Refinement ────────────────────────────
  const submitPrompt = useCallback(async (textPrompt) => {
    if (!textPrompt.trim()) return

    // Add user message to history immediately
    const userMsg = { role: 'user', content: textPrompt, timestamp: Date.now() }
    setConversationHistory(prev => [...prev, userMsg])
    setError(null)
    
    // If the document is already generated, we are in refinement mode
    if (document && plan) {
      setIsRefining(true)
      try {
        const onThought = (t) => setThoughts(prev => [...prev, t])
        const recentHistory = [...conversationHistory.slice(-5), userMsg] // use latest
        const result = await proposalEngine.refineDocument(
          document, plan, recentHistory, textPrompt, onThought
        )

        let resultTheme = theme
        let resultThemeName = activeThemeName

        const themeUpdates = result.document?.meta?.themeUpdates
        if (themeUpdates) {
          onThought({ phase: 2, text: 'Applying overridden customized visual theme...' })
          const combinedPlan = { ...result.plan, meta: { ...result.plan?.meta, themeUpdates } }
          const resolved = resolveThemeFromPlan(combinedPlan)
          resultTheme = resolved.resolvedTheme
          resultThemeName = resolved.resolvedThemeName
          
          setTheme(resultTheme)
          setActiveThemeName(resultThemeName)
          result.document = recolorDocument(result.document, resultTheme.primary)
        }

        setDocument(result.document)
        if (result.plan) setPlan(result.plan)

        const pageCount = result.document.pages?.length || 0
        const newVersionIndex = documentVersions.length
        const assistantSummary = `Updated the proposal (now ${pageCount} pages). Applied: "${textPrompt.length > 80 ? textPrompt.slice(0, 80) + '...' : textPrompt}"`

        const assistantMsg = {
          role: 'assistant',
          content: assistantSummary,
          timestamp: Date.now(),
          versionIndex: newVersionIndex,
        }
        setConversationHistory(prev => [...prev, assistantMsg])

        const snapshotPlan = JSON.parse(JSON.stringify(result.plan || plan))

        const version = {
          id: `v${newVersionIndex + 1}`,
          document: JSON.parse(JSON.stringify(result.document)),
          plan: snapshotPlan,
          theme: resultTheme,
          themeName: resultThemeName,
          timestamp: Date.now(),
          prompt: textPrompt,
          summary: assistantSummary,
        }
        
        const newDocVersions = [...documentVersions, version]
        setDocumentVersions(newDocVersions)
        setActiveVersionIndex(newVersionIndex)

        if (currentSessionId) {
          const sessionData = {
            id: currentSessionId,
            title: result.document.meta?.companyName || document.meta?.companyName || 'Proposal',
            updatedAt: Date.now(),
            document: result.document,
            plan: snapshotPlan,
            theme: resultTheme,
            activeThemeName: resultThemeName,
            conversationHistory: [...conversationHistory, userMsg, assistantMsg],
            documentVersions: newDocVersions,
            activeVersionIndex: newVersionIndex
          }
          if (uid) await firestoreStorage.saveSession(uid, sessionData)
          loadSessionsList()
        }

        if (onDocumentReady) onDocumentReady(result.document)
      } catch (err) {
        console.error('Document refinement failed:', err)
        setError(err.message || 'An unexpected error occurred during refinement')
        setConversationHistory(prev => prev.slice(0, -1))
      } finally {
        setIsRefining(false)
      }

    } else {
      // PRE-GENERATION CHAT MODE
      setIsLoading(true)
      try {
        const historyContext = [...conversationHistory, userMsg]
        // Explicit skip command shortcut
        if (textPrompt.toLowerCase().includes('just generate') || textPrompt.toLowerCase().includes('generate it')) {
           const combinedContext = historyContext.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\\n')
           await executeGeneration(combinedContext)
           return
        }

        const reply = await proposalEngine.analyzeRequirementsChat(historyContext)
        
        if (reply.includes('[READY_TO_GENERATE]')) {
           // Provide all gathered context to the generator
           const combinedContext = historyContext.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\\n')
           await executeGeneration("Context gathered from user chat, extract requirements fully:\n" + combinedContext)
        } else {
           // Normal AI question logic
           setConversationHistory(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }])
           setIsLoading(false)
        }
      } catch (err) {
        console.error('Pre-chat failed:', err)
        setError(err.message || 'Chat generation failed.')
        setConversationHistory(prev => prev.slice(0, -1))
        setIsLoading(false)
      }
    }
  }, [document, plan, conversationHistory, documentVersions, theme, activeThemeName, onDocumentReady, resolveThemeFromPlan, currentSessionId, loadSessionsList, executeGeneration])



  // ─── Switch to a previous version ──────────────────────────────
  const switchToVersion = useCallback((versionIndex) => {
    const version = documentVersions[versionIndex]
    if (!version) return

    setDocument(JSON.parse(JSON.stringify(version.document)))
    setPlan(JSON.parse(JSON.stringify(version.plan)))
    setActiveVersionIndex(versionIndex)

    if (version.theme) setTheme(version.theme)
    if (version.themeName) setActiveThemeName(version.themeName)

    if (onDocumentReady) onDocumentReady(version.document)
  }, [documentVersions, onDocumentReady])

  // ─── Reset everything for a new proposal ───────────────────────
  const resetConversation = useCallback(() => {
    setDocument(null)
    setPlan(null)
    setThoughts([])
    setError(null)
    setConversationHistory([])
    setDocumentVersions([])
    setActiveVersionIndex(-1)
    setIsRefining(false)
    setRefiningPages({})
    setCurrentSessionId(null)
  }, [])

  // ─── Per-page refinement (existing) ────────────────────────────
  const refinePageAction = useCallback(async (pageIndex, comment) => {
    if (!document) return;
    
    setRefiningPages(prev => ({ ...prev, [pageIndex]: true }))
    setError(null)
    
    try {
      const onThought = (t) => setThoughts(prev => [...prev, t])
      const newDocument = await proposalEngine.refinePageContent(document, pageIndex, comment, plan, onThought)
      
      setDocument(newDocument)
      
      // Auto-save to Firestore after page refinement
      if (currentSessionId && uid) {
        const sessionData = {
          id: currentSessionId,
          title: newDocument.meta?.companyName || document.meta?.companyName || 'Proposal',
          updatedAt: Date.now(),
          document: newDocument,
          plan,
          theme,
          activeThemeName,
          conversationHistory,
          documentVersions,
          activeVersionIndex,
        }
        firestoreStorage.saveSession(uid, sessionData).then(() => {
          console.log('[refinePageAction] Session auto-saved after page refinement')
        })
      }

      if (onDocumentReady) {
        onDocumentReady(newDocument)
      }
    } catch (err) {
      console.error('Page refinement failed:', err)
      setError(err.message || 'An unexpected error occurred during page refinement')
    } finally {
      setRefiningPages(prev => ({ ...prev, [pageIndex]: false }))
    }
  }, [document, plan, theme, activeThemeName, conversationHistory, documentVersions, activeVersionIndex, currentSessionId, uid, onDocumentReady])

  const switchTheme = useCallback(async (themeName) => {
    const newTheme = THEMES[themeName]
    if (!newTheme || !document) return

    const recolored = recolorDocument(document, newTheme.primary)
    setDocument(recolored)
    setTheme(newTheme)
    setActiveThemeName(themeName)

    if (currentSessionId && uid) {
      // Background save updated theme
      firestoreStorage.getSession(uid, currentSessionId).then(sess => {
        if (sess) {
          sess.document = recolored
          sess.theme = newTheme
          sess.activeThemeName = themeName
          sess.updatedAt = Date.now()
          firestoreStorage.saveSession(uid, sess)
        }
      })
    }

    if (onDocumentReady) {
      onDocumentReady(recolored)
    }
  }, [document, onDocumentReady, currentSessionId, uid])

  return (
    <ProposalContext.Provider value={{
      document,
      plan,
      theme,
      activeThemeName,
      isLoading,
      isRefining,
      error,
      thoughts,
      refiningPages,
      conversationHistory,
      documentVersions,
      activeVersionIndex,
      sessionsList,
      currentSessionId,
      loadSession,
      deleteSession,
      submitPrompt,
      refinePageAction,
      switchTheme,
      switchToVersion,
      resetConversation,
      registerDocumentReadyCallback,
    }}>
      {children}
    </ProposalContext.Provider>
  )
}

export function useProposal() {
  const ctx = useContext(ProposalContext)
  if (!ctx) {
    throw new Error('useProposal must be used within a ProposalProvider')
  }
  return ctx
}
