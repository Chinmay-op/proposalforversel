const DB_NAME = 'ProposalGeneratorDB'
const DB_VERSION = 1
const STORE_NAME = 'sessions'

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (e) => reject(`IndexedDB Error: ${e.target.errorCode}`)
    
    request.onsuccess = (e) => resolve(e.target.result)
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export const idbStorage = {
  async saveSession(sessionData) {
    try {
      const db = await getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(sessionData)

        request.onsuccess = () => resolve(true)
        request.onerror = (e) => reject(`Save Error: ${e.target.errorCode}`)
      })
    } catch (err) {
      console.error('[idbStorage] saveSession error:', err)
      return false
    }
  },

  async getAllSessions() {
    try {
      const db = await getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = (e) => resolve(e.target.result)
        request.onerror = (e) => reject(`GetAll Error: ${e.target.errorCode}`)
      })
    } catch (err) {
      console.error('[idbStorage] getAllSessions error:', err)
      return []
    }
  },

  async getSession(id) {
    try {
      const db = await getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(id)

        request.onsuccess = (e) => resolve(e.target.result)
        request.onerror = (e) => reject(`Get Error: ${e.target.errorCode}`)
      })
    } catch (err) {
      console.error('[idbStorage] getSession error:', err)
      return null
    }
  },

  async deleteSession(id) {
    try {
      const db = await getDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => resolve(true)
        request.onerror = (e) => reject(`Delete Error: ${e.target.errorCode}`)
      })
    } catch (err) {
      console.error('[idbStorage] deleteSession error:', err)
      return false
    }
  }
}
