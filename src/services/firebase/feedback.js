import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './config'
import { DEFAULT_RATING_CATEGORIES } from './ratingCategories'

const FEEDBACK_COLLECTION = 'feedback'

export const COMMENT_MAX_LENGTH = 1000

export const LEGACY_CATEGORY_KEYS = DEFAULT_RATING_CATEGORIES.map((category) => category.key)

export const RATING_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
}

const FIRESTORE_ERROR_MESSAGES = {
  'firestore/not-configured':
    'Firestore is not configured. Copy .env.example to .env and add your Firebase credentials.',
  'firestore/permission-denied': 'You do not have permission to submit or view this feedback.',
  'firestore/unavailable': 'Firestore is temporarily unavailable. Please try again.',
}

function getDbInstance() {
  if (!db) {
    const error = new Error('Firestore is not configured.')
    error.code = 'firestore/not-configured'
    throw error
  }

  return db
}

function getFeedbackCollection() {
  return collection(getDbInstance(), FEEDBACK_COLLECTION)
}

export function getFeedbackErrorMessage(error) {
  if (!error) {
    return 'Something went wrong. Please try again.'
  }

  const mappedCode =
    error.code && FIRESTORE_ERROR_MESSAGES[error.code]
      ? error.code
      : {
          'permission-denied': 'firestore/permission-denied',
          unavailable: 'firestore/unavailable',
        }[error.code]

  if (mappedCode && FIRESTORE_ERROR_MESSAGES[mappedCode]) {
    return FIRESTORE_ERROR_MESSAGES[mappedCode]
  }

  return error.message || 'Something went wrong. Please try again.'
}

export function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

export function normalizeFeedbackRatings(data) {
  if (data.ratings && typeof data.ratings === 'object') {
    return { ...data.ratings }
  }

  const ratings = {}

  LEGACY_CATEGORY_KEYS.forEach((key) => {
    if (data[key] != null) {
      ratings[key] = data[key]
    }
  })

  return ratings
}

export function mapFeedbackDoc(snapshot) {
  const data = snapshot.data()
  const ratings = normalizeFeedbackRatings(data)

  return {
    id: snapshot.id,
    userId: data.userId,
    ratings,
    comment: data.comment || '',
    createdAt: data.createdAt ?? null,
  }
}

export function getRatingValue(feedback, categoryKey) {
  return feedback.ratings?.[categoryKey] ?? null
}

export function getFeedbackRatedValues(feedback, categories) {
  return categories
    .map((category) => getRatingValue(feedback, category.key))
    .filter((value) => isValidRating(value))
}

export function formatAverageRating(average) {
  const score = Math.round(average * 10) / 10
  const labelKey = Math.min(5, Math.max(1, Math.round(average)))

  return {
    score,
    displayScore: Number.isInteger(score) ? String(score) : score.toFixed(1),
    label: RATING_LABELS[labelKey],
  }
}

export function calculateFeedbackAverage(feedback, categories) {
  const ratedValues = getFeedbackRatedValues(feedback, categories)

  if (!ratedValues.length) {
    return 0
  }

  const total = ratedValues.reduce((sum, value) => sum + value, 0)

  return total / ratedValues.length
}

export function computeUserFeedbackAnalytics(feedbackList, categories) {
  if (!feedbackList.length || !categories.length) {
    return null
  }

  const categoryAverages = categories.map((category) => {
    const ratedEntries = feedbackList.filter((feedback) =>
      isValidRating(getRatingValue(feedback, category.key)),
    )
    const total = ratedEntries.reduce(
      (sum, feedback) => sum + getRatingValue(feedback, category.key),
      0,
    )
    const average = ratedEntries.length ? total / ratedEntries.length : null

    return {
      key: category.key,
      label: category.name,
      average,
      displayAverage: average != null ? formatAverageRating(average) : null,
      responseCount: ratedEntries.length,
    }
  })

  const ratedFeedback = feedbackList.filter(
    (feedback) => getFeedbackRatedValues(feedback, categories).length > 0,
  )

  const overallAverageValue = ratedFeedback.length
    ? ratedFeedback.reduce(
        (sum, feedback) => sum + calculateFeedbackAverage(feedback, categories),
        0,
      ) / ratedFeedback.length
    : 0

  return {
    submissionCount: feedbackList.length,
    overallAverage: formatAverageRating(overallAverageValue),
    categoryAverages,
    latestFeedback: feedbackList[0],
  }
}

export function computeManagementAnalytics(feedbackList, categories) {
  if (!categories.length) {
    return {
      submissionCount: 0,
      overallAverage: formatAverageRating(0),
      categoryAverages: [],
      recentFeedback: [],
      latestFeedback: null,
    }
  }

  if (!feedbackList.length) {
    return {
      submissionCount: 0,
      overallAverage: formatAverageRating(0),
      categoryAverages: categories.map((category) => ({
        key: category.key,
        label: category.name,
        average: 0,
        displayAverage: formatAverageRating(0),
      })),
      recentFeedback: [],
      latestFeedback: null,
    }
  }

  const categoryAverages = categories.map((category) => {
    const ratedEntries = feedbackList.filter((feedback) =>
      isValidRating(getRatingValue(feedback, category.key)),
    )
    const total = ratedEntries.reduce(
      (sum, feedback) => sum + getRatingValue(feedback, category.key),
      0,
    )
    const average = ratedEntries.length ? total / ratedEntries.length : null

    return {
      key: category.key,
      label: category.name,
      average,
      displayAverage: average != null ? formatAverageRating(average) : null,
      responseCount: ratedEntries.length,
    }
  })

  const ratedFeedback = feedbackList.filter(
    (feedback) => getFeedbackRatedValues(feedback, categories).length > 0,
  )

  const overallAverageValue = ratedFeedback.length
    ? ratedFeedback.reduce(
        (sum, feedback) => sum + calculateFeedbackAverage(feedback, categories),
        0,
      ) / ratedFeedback.length
    : 0

  const sortedFeedback = [...feedbackList].sort(
    (a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt),
  )

  return {
    submissionCount: feedbackList.length,
    overallAverage: formatAverageRating(overallAverageValue),
    categoryAverages,
    recentFeedback: sortedFeedback.slice(0, 5),
    latestFeedback: sortedFeedback[0] || null,
  }
}

function toLocalDateKey(timestamp) {
  if (!timestamp) {
    return null
  }

  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatChartDayLabel(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function computeDailyFeedbackTrend(feedbackList, categories, dayCount = 14) {
  if (!categories.length || dayCount < 1) {
    return []
  }

  const totalsByDay = {}

  feedbackList.forEach((feedback) => {
    const dateKey = toLocalDateKey(feedback.createdAt)

    if (!dateKey) {
      return
    }

    if (!totalsByDay[dateKey]) {
      totalsByDay[dateKey] = {
        submissions: 0,
        ratingTotal: 0,
        ratedSubmissions: 0,
      }
    }

    totalsByDay[dateKey].submissions += 1

    if (getFeedbackRatedValues(feedback, categories).length > 0) {
      totalsByDay[dateKey].ratingTotal += calculateFeedbackAverage(feedback, categories)
      totalsByDay[dateKey].ratedSubmissions += 1
    }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = []

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`
    const dayTotals = totalsByDay[dateKey]

    days.push({
      dateKey,
      label: formatChartDayLabel(dateKey),
      submissions: dayTotals?.submissions || 0,
      averageRating:
        dayTotals?.ratedSubmissions > 0
          ? dayTotals.ratingTotal / dayTotals.ratedSubmissions
          : null,
      displayAverage:
        dayTotals?.ratedSubmissions > 0
          ? formatAverageRating(dayTotals.ratingTotal / dayTotals.ratedSubmissions)
          : null,
    })
  }

  return days
}

export async function createFeedback(userId, feedbackData, categories) {
  const ratings = {}

  categories.forEach((category) => {
    ratings[category.key] = feedbackData.ratings[category.key]
  })

  const payload = {
    userId,
    ratings,
    comment: feedbackData.comment?.trim() || '',
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(getFeedbackCollection(), payload)
  return { id: docRef.id, ...payload, createdAt: new Date() }
}

function getTimestampMillis(timestamp) {
  if (!timestamp) {
    return 0
  }

  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().getTime()
  }

  return new Date(timestamp).getTime() || 0
}

export function formatFeedbackTimestamp(timestamp) {
  if (!timestamp) {
    return '—'
  }

  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export async function getFeedbackByUserId(userId) {
  const feedbackQuery = query(getFeedbackCollection(), where('userId', '==', userId))
  const snapshot = await getDocs(feedbackQuery)

  return snapshot.docs
    .map(mapFeedbackDoc)
    .sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt))
}

export async function getAllFeedback() {
  const snapshot = await getDocs(getFeedbackCollection())

  return snapshot.docs
    .map(mapFeedbackDoc)
    .sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt))
}

export async function updateFeedback(feedbackId, feedbackData, categories) {
  const ratings = {}

  categories.forEach((category) => {
    ratings[category.key] = feedbackData.ratings[category.key]
  })

  const payload = {
    ratings,
    comment: feedbackData.comment?.trim() || '',
  }

  await updateDoc(doc(getDbInstance(), FEEDBACK_COLLECTION, feedbackId), payload)

  return { id: feedbackId, ...payload }
}

export async function deleteFeedback(feedbackId) {
  await deleteDoc(doc(getDbInstance(), FEEDBACK_COLLECTION, feedbackId))
}

export function buildInitialRatings(categories) {
  return categories.reduce((accumulator, category) => {
    accumulator[category.key] = null
    return accumulator
  }, {})
}

export function validateFeedbackRatings(ratings, categories) {
  const errors = {}

  categories.forEach((category) => {
    if (!isValidRating(ratings[category.key])) {
      errors[category.key] = `Please rate ${category.name.toLowerCase()}.`
    }
  })

  return errors
}

// Backward-compatible export for components still importing FEEDBACK_CATEGORIES
export { DEFAULT_RATING_CATEGORIES as FEEDBACK_CATEGORIES } from './ratingCategories'
