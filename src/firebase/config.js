import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import { API_KEYS } from '../config/apiKeys'

const firebaseConfig = {
  apiKey: API_KEYS.FIREBASE.apiKey,
  authDomain: API_KEYS.FIREBASE.authDomain,
  projectId: API_KEYS.FIREBASE.projectId,
  storageBucket: API_KEYS.FIREBASE.storageBucket,
  messagingSenderId: API_KEYS.FIREBASE.messagingSenderId,
  appId: API_KEYS.FIREBASE.appId,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export { app }
