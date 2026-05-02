import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)

        // Check if user doc exists in Firestore, create if not
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userDocRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          setIsAdmin(userData.isAdmin === true)

          // Block disabled users
          if (userData.disabled === true) {
            await signOut(auth)
            setUser(null)
            setIsAdmin(false)
            setAuthError('Your account has been disabled. Contact an administrator.')
            setLoading(false)
            return
          }
        } else {
          // First login — create user doc
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            isAdmin: false,
            disabled: false,
            createdAt: serverTimestamp(),
          })
          setIsAdmin(false)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      const msg = mapFirebaseError(err.code)
      setAuthError(msg)
      throw err
    }
  }, [])

  const signup = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // Create Firestore user doc
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        displayName: '',
        isAdmin: false,
        disabled: false,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      const msg = mapFirebaseError(err.code)
      setAuthError(msg)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    setAuthError(null)
    await signOut(auth)
  }, [])

  const clearError = useCallback(() => setAuthError(null), [])

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      authError,
      login,
      signup,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

function mapFirebaseError(code) {
  console.warn('[Auth] Firebase error code:', code)
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email address.'
    case 'auth/user-disabled': return 'This account has been disabled.'
    case 'auth/user-not-found': return 'No account found with this email.'
    case 'auth/wrong-password': return 'Incorrect password.'
    case 'auth/invalid-credential': return 'Invalid email or password.'
    case 'auth/email-already-in-use': return 'An account already exists with this email. Try signing in instead.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/too-many-requests': return 'Too many attempts. Please try again later.'
    case 'auth/network-request-failed': return 'Network error. Check your internet connection.'
    case 'auth/operation-not-allowed': return 'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.'
    case 'auth/missing-password': return 'Please enter a password.'
    default: return `Authentication error (${code || 'unknown'}). Please try again.`
  }
}
