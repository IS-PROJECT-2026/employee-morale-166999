import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../services/firebase/config'
import {
  getAuthErrorMessage,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/firebase/auth'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(auth))

  useEffect(() => {
    if (!auth) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isFirebaseConfigured,
      register: async ({ name, email, password }) => {
        try {
          const registeredUser = await registerUser({ name, email, password })
          return { user: registeredUser, error: null }
        } catch (error) {
          return { user: null, error: getAuthErrorMessage(error) }
        }
      },
      login: async ({ email, password }) => {
        try {
          const loggedInUser = await loginUser({ email, password })
          return { user: loggedInUser, error: null }
        } catch (error) {
          return { user: null, error: getAuthErrorMessage(error) }
        }
      },
      logout: async () => {
        try {
          await logoutUser()
          return { error: null }
        } catch (error) {
          return { error: getAuthErrorMessage(error) }
        }
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
