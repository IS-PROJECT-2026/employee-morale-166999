import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

export const isFirebaseConfigured = requiredKeys.every((key) => Boolean(import.meta.env[key]))

let auth = null
let db = null

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error)
  }
} else {
  console.warn(
    `[Firebase] Missing environment variables: ${requiredKeys.filter((key) => !import.meta.env[key]).join(', ')}. ` +
      'Copy .env.example to .env and add your Firebase project credentials. ' +
      'The app will load, but authentication is disabled until configured.',
  )
}

export { auth, db }
