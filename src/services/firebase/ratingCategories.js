import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from './config'

const RATING_CATEGORIES_COLLECTION = 'ratingCategories'

export const DEFAULT_RATING_CATEGORIES = [
  {
    key: 'workEnvironment',
    name: 'Work Environment',
    description: 'Physical workspace, tools, and daily working conditions.',
    isDefault: true,
  },
  {
    key: 'managementSupport',
    name: 'Management Support',
    description: 'Guidance, support, and leadership from management.',
    isDefault: true,
  },
  {
    key: 'teamCollaboration',
    name: 'Team Collaboration',
    description: 'Teamwork, cooperation, and working relationships.',
    isDefault: true,
  },
  {
    key: 'communication',
    name: 'Communication',
    description: 'Clarity and effectiveness of workplace communication.',
    isDefault: true,
  },
  {
    key: 'workLifeBalance',
    name: 'Work-Life Balance',
    description: 'Balance between work responsibilities and personal life.',
    isDefault: true,
  },
  {
    key: 'overallSatisfaction',
    name: 'Overall Satisfaction',
    description: 'Overall satisfaction with the workplace experience.',
    isDefault: true,
  },
]

const CATEGORY_ERROR_MESSAGES = {
  'categories/not-configured': 'Firestore is not configured.',
  'categories/duplicate': 'A category with this name already exists.',
  'categories/invalid-name': 'Category name is required.',
  'categories/permission-denied': 'You do not have permission to manage rating categories.',
}

function getDbInstance() {
  if (!db) {
    const error = new Error('Firestore is not configured.')
    error.code = 'categories/not-configured'
    throw error
  }

  return db
}

function getCategoriesCollection() {
  return collection(getDbInstance(), RATING_CATEGORIES_COLLECTION)
}

export function slugifyCategoryName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function getCategoryErrorMessage(error) {
  if (!error) {
    return 'Something went wrong. Please try again.'
  }

  if (error.code && CATEGORY_ERROR_MESSAGES[error.code]) {
    return CATEGORY_ERROR_MESSAGES[error.code]
  }

  const mappedCode =
    error.code === 'permission-denied' ? 'categories/permission-denied' : error.code

  if (mappedCode && CATEGORY_ERROR_MESSAGES[mappedCode]) {
    return CATEGORY_ERROR_MESSAGES[mappedCode]
  }

  return error.message || 'Something went wrong. Please try again.'
}

export function mapCategoryDoc(snapshot) {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    key: data.key,
    name: data.name,
    description: data.description || '',
    active: data.active !== false,
    isDefault: Boolean(data.isDefault),
    createdBy: data.createdBy || '',
    createdAt: data.createdAt ?? null,
  }
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1
    }

    return a.name.localeCompare(b.name)
  })
}

export async function getAllRatingCategories() {
  const snapshot = await getDocs(getCategoriesCollection())
  return sortCategories(snapshot.docs.map(mapCategoryDoc))
}

export async function getActiveRatingCategories() {
  const categoriesQuery = query(getCategoriesCollection(), where('active', '==', true))
  const snapshot = await getDocs(categoriesQuery)
  return sortCategories(snapshot.docs.map(mapCategoryDoc))
}

export async function seedDefaultRatingCategories(createdBy) {
  const existing = await getAllRatingCategories()

  if (existing.length > 0) {
    return existing
  }

  const seeded = []

  for (const category of DEFAULT_RATING_CATEGORIES) {
    const docRef = await addDoc(getCategoriesCollection(), {
      key: category.key,
      name: category.name,
      description: category.description,
      active: true,
      isDefault: true,
      createdBy: createdBy || 'system',
      createdAt: serverTimestamp(),
    })

    seeded.push({
      id: docRef.id,
      ...category,
      active: true,
      createdBy: createdBy || 'system',
      createdAt: new Date(),
    })
  }

  return sortCategories(seeded)
}

export async function createRatingCategory({ name, description, createdBy }) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    const error = new Error('Category name is required.')
    error.code = 'categories/invalid-name'
    throw error
  }

  const key = slugifyCategoryName(trimmedName)

  if (!key) {
    const error = new Error('Category name is required.')
    error.code = 'categories/invalid-name'
    throw error
  }

  const existing = await getAllRatingCategories()
  const duplicate = existing.find(
    (category) =>
      category.key === key || category.name.trim().toLowerCase() === trimmedName.toLowerCase(),
  )

  if (duplicate) {
    const error = new Error('A category with this name already exists.')
    error.code = 'categories/duplicate'
    throw error
  }

  const docRef = await addDoc(getCategoriesCollection(), {
    key,
    name: trimmedName,
    description: description?.trim() || '',
    active: true,
    isDefault: false,
    createdBy,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    key,
    name: trimmedName,
    description: description?.trim() || '',
    active: true,
    isDefault: false,
    createdBy,
    createdAt: new Date(),
  }
}
