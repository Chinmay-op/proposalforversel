import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Firestore-backed session storage.
 * All sessions are scoped under users/{uid}/sessions/{sessionId}.
 *
 * NOTE: Firestore has a 1 MB per-document limit. Proposal documents with
 * multiple versions can exceed this. We store the heavy payload
 * (document, plan, documentVersions) as a JSON string to keep the
 * Firestore document flat, and we keep a lightweight metadata doc for
 * the sessions list.
 */

// Helper: safely serialize large objects to JSON string
function pack(obj) {
  try {
    return JSON.stringify(obj)
  } catch {
    return null
  }
}

// Helper: safely deserialize
function unpack(str) {
  if (!str) return null
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

export const firestoreStorage = {
  /**
   * Save or update a session document.
   * Splits into a metadata doc and a data doc to stay within limits.
   */
  async saveSession(uid, sessionData) {
    try {
      const sessionId = sessionData.id
      const now = Date.now()

      // Metadata doc (lightweight, used for listing)
      const metaRef = doc(db, 'users', uid, 'sessions', sessionId)
      await setDoc(metaRef, {
        id: sessionId,
        title: sessionData.title || 'Untitled',
        updatedAt: now,
        pageCount: sessionData.document?.pages?.length || 0,
        activeThemeName: sessionData.activeThemeName || 'TechBlue',
      })

      // Data doc (heavy payload)
      const dataRef = doc(db, 'users', uid, 'sessionData', sessionId)
      await setDoc(dataRef, {
        id: sessionId,
        updatedAt: now,
        title: sessionData.title || 'Untitled',
        documentJson: pack(sessionData.document),
        planJson: pack(sessionData.plan),
        themeJson: pack(sessionData.theme),
        activeThemeName: sessionData.activeThemeName || 'TechBlue',
        conversationHistoryJson: pack(sessionData.conversationHistory),
        documentVersionsJson: pack(sessionData.documentVersions),
        activeVersionIndex: sessionData.activeVersionIndex ?? 0,
      })

      console.log('[firestoreStorage] Session saved:', sessionId)
      return true
    } catch (err) {
      console.error('[firestoreStorage] saveSession error:', err)
      return false
    }
  },

  /**
   * Get all session metadata for a user (lightweight list).
   */
  async getAllSessions(uid) {
    try {
      const sessionsRef = collection(db, 'users', uid, 'sessions')
      const snapshot = await getDocs(sessionsRef)
      const sessions = snapshot.docs.map(d => d.data())
      // Sort client-side to avoid needing a Firestore index
      sessions.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      return sessions
    } catch (err) {
      console.error('[firestoreStorage] getAllSessions error:', err)
      return []
    }
  },

  /**
   * Get a full session (metadata + heavy data) by ID.
   */
  async getSession(uid, sessionId) {
    try {
      const dataRef = doc(db, 'users', uid, 'sessionData', sessionId)
      const snap = await getDoc(dataRef)
      if (!snap.exists()) return null

      const raw = snap.data()
      return {
        id: raw.id,
        title: raw.title,
        updatedAt: raw.updatedAt,
        document: unpack(raw.documentJson),
        plan: unpack(raw.planJson),
        theme: unpack(raw.themeJson),
        activeThemeName: raw.activeThemeName,
        conversationHistory: unpack(raw.conversationHistoryJson) || [],
        documentVersions: unpack(raw.documentVersionsJson) || [],
        activeVersionIndex: raw.activeVersionIndex ?? 0,
      }
    } catch (err) {
      console.error('[firestoreStorage] getSession error:', err)
      return null
    }
  },

  /**
   * Delete a session (both metadata and data docs).
   */
  async deleteSession(uid, sessionId) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'sessions', sessionId))
      await deleteDoc(doc(db, 'users', uid, 'sessionData', sessionId))
      return true
    } catch (err) {
      console.error('[firestoreStorage] deleteSession error:', err)
      return false
    }
  },
}
