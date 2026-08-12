import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from './config'

const FEEDBACK_COLLECTION = 'feedback'

export const COMMENT_MAX_LENGTH = 1000

export const FEEDBACK_CATEGORIES = [
  { key: 'workEnvironment', label: 'Work Environment' },
  { key: 'managementSupport', label: 'Management Support' },
  { key: 'teamCollaboration', label: 'Team Collaboration' },
  { key: 'communication', label: 'Communication' },
  { key: 'workLifeBalance', label: 'Work-Life Balance' },
  { key: 'overallSatisfaction', label: 'Overall Satisfaction' },
]

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

export function calculateFeedbackAverage(feedback) {
  const total = FEEDBACK_CATEGORIES.reduce((sum, { key }) => sum + (feedback[key] || 0), 0)
  return total / FEEDBACK_CATEGORIES.length
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

export function mapFeedbackDoc(snapshot) {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: data.userId,
    workEnvironment: data.workEnvironment,
    managementSupport: data.managementSupport,
    teamCollaboration: data.teamCollaboration,
    communication: data.communication,
    workLifeBalance: data.workLifeBalance,
    overallSatisfaction: data.overallSatisfaction,
    comment: data.comment || '',
    createdAt: data.createdAt ?? null,
  }
}

export async function createFeedback(userId, feedbackData) {
  const payload = {
    userId,
    workEnvironment: feedbackData.workEnvironment,
    managementSupport: feedbackData.managementSupport,
    teamCollaboration: feedbackData.teamCollaboration,
    communication: feedbackData.communication,
    workLifeBalance: feedbackData.workLifeBalance,
    overallSatisfaction: feedbackData.overallSatisfaction,
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

export async function getFeedbackByUserId(userId) {
  const feedbackQuery = query(getFeedbackCollection(), where('userId', '==', userId))

  const snapshot = await getDocs(feedbackQuery)

  return snapshot.docs
    .map(mapFeedbackDoc)
    .sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt))
}

export function computeUserFeedbackAnalytics(feedbackList) {
  if (!feedbackList.length) {
    return null
  }

  const categoryAverages = FEEDBACK_CATEGORIES.map(({ key, label }) => {
    const total = feedbackList.reduce((sum, feedback) => sum + (feedback[key] || 0), 0)
    const average = total / feedbackList.length

    return {
      key,
      label,
      average,
      displayAverage: formatAverageRating(average),
    }
  })

  const overallAverageValue =
    feedbackList.reduce((sum, feedback) => sum + calculateFeedbackAverage(feedback), 0) /
    feedbackList.length

  return {
    submissionCount: feedbackList.length,
    overallAverage: formatAverageRating(overallAverageValue),
    categoryAverages,
    latestFeedback: feedbackList[0],
  }
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
  })
}
