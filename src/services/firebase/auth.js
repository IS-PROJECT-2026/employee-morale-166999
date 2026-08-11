import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'

const AUTH_ERROR_MESSAGES = {
  'auth/not-configured':
    'Authentication is not configured. Copy .env.example to .env and add your Firebase credentials.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this project.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
}

function getAuthInstance() {
  if (!auth) {
    const error = new Error('Firebase authentication is not configured.')
    error.code = 'auth/not-configured'
    throw error
  }

  return auth
}

export function getAuthErrorMessage(error) {
  if (!error) {
    return 'Something went wrong. Please try again.'
  }

  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code]
  }

  return error.message || 'Something went wrong. Please try again.'
}

export async function registerUser({ name, email, password }) {
  const authInstance = getAuthInstance()
  const credential = await createUserWithEmailAndPassword(authInstance, email, password)

  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() })
  }

  return credential.user
}

export async function loginUser({ email, password }) {
  const authInstance = getAuthInstance()
  const credential = await signInWithEmailAndPassword(authInstance, email, password)
  return credential.user
}

export async function logoutUser() {
  const authInstance = getAuthInstance()
  await signOut(authInstance)
}
