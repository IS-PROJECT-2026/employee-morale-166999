import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import { RatingCategoriesContext } from './ratingCategoriesContext'
import {
  createRatingCategory,
  deleteRatingCategory,
  getActiveRatingCategories,
  getAllRatingCategories,
  getCategoryErrorMessage,
  seedDefaultRatingCategories,
  updateRatingCategory,
} from '../services/firebase/ratingCategories'

export function RatingCategoriesProvider({ children }) {
  const { user } = useAuth()
  const [activeCategories, setActiveCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCategories = useCallback(async (userId) => {
    setLoading(true)
    setError(null)

    try {
      await seedDefaultRatingCategories(userId || 'system')
      const [active, all] = await Promise.all([
        getActiveRatingCategories(),
        getAllRatingCategories(),
      ])
      setActiveCategories(active)
      setAllCategories(all)
      return { active, all, error: null }
    } catch (err) {
      const message = getCategoryErrorMessage(err)
      setError(message)
      return { active: [], all: [], error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function fetchCategories() {
      setLoading(true)
      setError(null)

      try {
        await seedDefaultRatingCategories(user.uid)
        const [active, all] = await Promise.all([
          getActiveRatingCategories(),
          getAllRatingCategories(),
        ])

        if (!cancelled) {
          setActiveCategories(active)
          setAllCategories(all)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getCategoryErrorMessage(err))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      cancelled = true
    }
  }, [user])

  const value = useMemo(
    () => ({
      activeCategories: user ? activeCategories : [],
      allCategories: user ? allCategories : [],
      loading: user ? loading : false,
      error: user ? error : null,
      refreshCategories: async () => {
        if (!user) {
          return { active: [], all: [], error: null }
        }

        return loadCategories(user.uid)
      },
      addCategory: async ({ name, description }) => {
        if (!user) {
          return { category: null, error: 'You must be signed in to add a category.' }
        }

        setError(null)

        try {
          const category = await createRatingCategory({
            name,
            description,
            createdBy: user.uid,
          })
          const refreshed = await loadCategories(user.uid)
          return { category, ...refreshed, error: null }
        } catch (err) {
          const message = getCategoryErrorMessage(err)
          setError(message)
          return { category: null, error: message }
        }
      },
      updateCategory: async (categoryId, { name, description }) => {
        if (!user) {
          return { category: null, error: 'You must be signed in to update a category.' }
        }

        setError(null)

        try {
          const category = await updateRatingCategory(categoryId, { name, description })
          const refreshed = await loadCategories(user.uid)
          return { category, ...refreshed, error: null }
        } catch (err) {
          const message = getCategoryErrorMessage(err)
          setError(message)
          return { category: null, error: message }
        }
      },
      deleteCategory: async (categoryId) => {
        if (!user) {
          return { error: 'You must be signed in to delete a category.' }
        }

        setError(null)

        try {
          await deleteRatingCategory(categoryId)
          const refreshed = await loadCategories(user.uid)
          return { ...refreshed, error: null }
        } catch (err) {
          const message = getCategoryErrorMessage(err)
          setError(message)
          return { error: message }
        }
      },
    }),
    [activeCategories, allCategories, loading, error, user, loadCategories],
  )

  return (
    <RatingCategoriesContext.Provider value={value}>{children}</RatingCategoriesContext.Provider>
  )
}
