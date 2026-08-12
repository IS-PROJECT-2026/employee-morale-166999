import { useContext } from 'react'
import { RatingCategoriesContext } from './ratingCategoriesContext'

export function useRatingCategories() {
  const context = useContext(RatingCategoriesContext)

  if (!context) {
    throw new Error('useRatingCategories must be used within a RatingCategoriesProvider')
  }

  return context
}
