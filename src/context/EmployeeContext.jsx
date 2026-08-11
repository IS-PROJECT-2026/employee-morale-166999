import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { EmployeeContext } from './employeeContext'
import {
  createEmployeeIfNotExists,
  getEmployeeErrorMessage,
  isEmployeeProfileComplete,
  updateEmployeeProfile,
} from '../services/firebase/employees'

export function EmployeeProvider({ children }) {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadEmployee = useCallback(async (authUser) => {
    setLoading(true)
    setError(null)

    try {
      const record = await createEmployeeIfNotExists(authUser)
      setEmployee(record)
      return { employee: record, error: null }
    } catch (err) {
      const message = getEmployeeErrorMessage(err)
      setError(message)
      return { employee: null, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function fetchEmployee() {
      setLoading(true)
      setError(null)

      try {
        const record = await createEmployeeIfNotExists(user)
        if (!cancelled) {
          setEmployee(record)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getEmployeeErrorMessage(err))
          setEmployee(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchEmployee()

    return () => {
      cancelled = true
    }
  }, [user])

  const activeEmployee = user ? employee : null
  const activeLoading = user ? loading : false
  const activeError = user ? error : null

  const value = useMemo(
    () => ({
      employee: activeEmployee,
      loading: activeLoading,
      error: activeError,
      isProfileComplete: isEmployeeProfileComplete(activeEmployee),
      refreshEmployee: async () => {
        if (!user) {
          return { employee: null, error: null }
        }

        return loadEmployee(user)
      },
      saveProfile: async (profileData) => {
        if (!user) {
          return { employee: null, error: 'You must be signed in to update your profile.' }
        }

        setError(null)

        try {
          const updatedEmployee = await updateEmployeeProfile(user.uid, profileData)
          setEmployee(updatedEmployee)
          return { employee: updatedEmployee, error: null }
        } catch (err) {
          const message = getEmployeeErrorMessage(err)
          setError(message)
          return { employee: null, error: message }
        }
      },
    }),
    [activeEmployee, activeLoading, activeError, user, loadEmployee],
  )

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>
}
