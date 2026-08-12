import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmployeeLayout from '../../components/employee/EmployeeLayout'
import { useAuth } from '../../context/useAuth'
import {
  calculateFeedbackAverage,
  FEEDBACK_CATEGORIES,
  formatAverageRating,
  getFeedbackByUserId,
  getFeedbackErrorMessage,
  RATING_LABELS,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/employee/EmployeeLayout.css'
import '../../components/Feedback/Feedback.css'

function formatSubmissionDate(timestamp) {
  if (!timestamp) {
    return '—'
  }

  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function FeedbackHistoryCard({ feedback }) {
  const average = formatAverageRating(calculateFeedbackAverage(feedback))

  return (
    <article className="feedback-history-card">
      <div className="feedback-history-card__header">
        <time className="feedback-history-card__date" dateTime={feedback.createdAt?.toDate?.()?.toISOString()}>
          {formatSubmissionDate(feedback.createdAt)}
        </time>
        <span className="feedback-history-card__overall">
          Average: {average.displayScore}/5 — {average.label}
        </span>
      </div>

      <div className="feedback-history-card__ratings">
        {FEEDBACK_CATEGORIES.map(({ key, label }) => (
          <div key={key} className="feedback-history-card__rating">
            <span className="feedback-history-card__rating-label">{label}</span>
            <span className="feedback-history-card__rating-value">
              {feedback[key]}/5 — {RATING_LABELS[feedback[key]]}
            </span>
          </div>
        ))}
      </div>

      <div>
        <p className="feedback-history-card__comment-label">Comment</p>
        {feedback.comment ? (
          <p className="feedback-history-card__comment">{feedback.comment}</p>
        ) : (
          <p className="feedback-history-card__comment feedback-history-card__comment--empty">
            No comment provided.
          </p>
        )}
      </div>
    </article>
  )
}

function MyFeedback() {
  const { user } = useAuth()
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadFeedback() {
      setLoading(true)
      setError('')

      try {
        const results = await getFeedbackByUserId(user.uid)
        if (!cancelled) {
          setFeedbackList(results)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getFeedbackErrorMessage(err))
          setFeedbackList([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadFeedback()

    return () => {
      cancelled = true
    }
  }, [user])

  const activeFeedbackList = user ? feedbackList : []
  const activeLoading = user ? loading : false
  const activeError = user ? error : ''

  return (
    <EmployeeLayout>
      <div className="employee-panel employee-panel--wide">
        <p className="employee-panel__eyebrow">My Feedback</p>
        <h1 className="employee-panel__title">Your Feedback History</h1>
        <p className="employee-panel__text">
          Review your previous workplace feedback submissions. Only you can see your entries.
        </p>

        {activeError && (
          <div className="auth-alert employee-panel__alert" role="alert">
            {activeError}
          </div>
        )}

        {activeLoading ? (
          <div className="auth-loading profile-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading your feedback…</p>
          </div>
        ) : activeFeedbackList.length === 0 ? (
          <div className="feedback-empty">
            <p>You haven&apos;t submitted any feedback yet.</p>
            <Link to="/feedback" className="btn btn-primary">
              Give Feedback
            </Link>
          </div>
        ) : (
          <div className="feedback-history-list">
            {activeFeedbackList.map((feedback) => (
              <FeedbackHistoryCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  )
}

export default MyFeedback
