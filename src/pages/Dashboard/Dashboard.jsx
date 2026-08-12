import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmployeeLayout from '../../components/employee/EmployeeLayout'
import { useAuth } from '../../context/useAuth'
import { useEmployee } from '../../context/useEmployee'
import { useRatingCategories } from '../../context/useRatingCategories'
import {
  calculateFeedbackAverage,
  computeUserFeedbackAnalytics,
  formatAverageRating,
  formatFeedbackTimestamp,
  getFeedbackByUserId,
  getFeedbackErrorMessage,
  getRatingValue,
  RATING_LABELS,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/employee/EmployeeLayout.css'
import '../../components/Feedback/Feedback.css'
import './Dashboard.css'

function DashboardStat({ label, value, detail }) {
  return (
    <div className="dashboard-stat">
      <span className="dashboard-stat__label">{label}</span>
      <span className="dashboard-stat__value">{value}</span>
      {detail && <span className="dashboard-stat__detail">{detail}</span>}
    </div>
  )
}

function CategoryBar({ label, average, displayAverage }) {
  const hasAverage = average != null && displayAverage
  const width = hasAverage ? `${(average / 5) * 100}%` : '0%'

  return (
    <div className="dashboard-bar">
      <div className="dashboard-bar__header">
        <span className="dashboard-bar__label">{label}</span>
        <span className="dashboard-bar__score">
          {hasAverage ? `${displayAverage.displayScore}/5 · ${displayAverage.label}` : 'Not rated yet'}
        </span>
      </div>
      <div className="dashboard-bar__track">
        <div className="dashboard-bar__fill" style={{ width }} />
      </div>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { employee } = useEmployee()
  const { activeCategories, loading: categoriesLoading } = useRatingCategories()
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const displayName = user?.displayName || user?.email || 'there'

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

  const analytics = useMemo(
    () =>
      feedbackList.length && activeCategories.length
        ? computeUserFeedbackAnalytics(feedbackList, activeCategories)
        : null,
    [feedbackList, activeCategories],
  )

  const latestAverage = analytics?.latestFeedback
    ? formatAverageRating(
        calculateFeedbackAverage(analytics.latestFeedback, activeCategories),
      )
    : null

  return (
    <EmployeeLayout>
      <div className="employee-panel employee-panel--wide dashboard-panel">
        <header className="feedback-page-header dashboard-header">
          <div className="feedback-page-header__main">
            <span className="feedback-page-header__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17l4-4 4 4 8-10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 3h4v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 3l-7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="feedback-page-header__content">
              <p className="feedback-page-header__eyebrow">Employee Dashboard</p>
              <h1 className="feedback-page-header__title">Welcome, {displayName}</h1>
              <p className="feedback-page-header__text">
                {employee?.department
                  ? `Your personal feedback overview for ${employee.department}.`
                  : 'Your personal feedback overview based on submissions you have made.'}
              </p>
            </div>
          </div>
          <Link to="/feedback" className="btn btn-primary feedback-page-header__action">
            Give Feedback
          </Link>
        </header>

        {error && (
          <div className="auth-alert employee-panel__alert" role="alert">
            {error}
          </div>
        )}

        {loading || categoriesLoading ? (
          <div className="auth-loading dashboard-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading your dashboard…</p>
          </div>
        ) : !analytics ? (
          <div className="dashboard-empty">
            <p className="dashboard-empty__title">No feedback analytics yet</p>
            <p className="dashboard-empty__text">
              Submit your first workplace feedback to see your personal ratings summary here.
            </p>
            <Link to="/feedback" className="btn btn-primary">
              Give Feedback
            </Link>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <DashboardStat
                label="Total submissions"
                value={analytics.submissionCount}
                detail="Feedback entries you have submitted"
              />
              <DashboardStat
                label="Average score"
                value={`${analytics.overallAverage.displayScore}/5`}
                detail={analytics.overallAverage.label}
              />
              <DashboardStat
                label="Latest submission"
                value={formatFeedbackTimestamp(analytics.latestFeedback.createdAt)}
                detail={
                  latestAverage
                    ? `Most recent average: ${latestAverage.displayScore}/5`
                    : undefined
                }
              />
            </div>

            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2 className="dashboard-section__title">Your rating averages</h2>
                <p className="dashboard-section__text">
                  Average scores across all {analytics.submissionCount} of your submissions.
                </p>
              </div>
              <div className="dashboard-bars">
                {analytics.categoryAverages.map((category) => (
                  <CategoryBar
                    key={category.key}
                    label={category.label}
                    average={category.average}
                    displayAverage={category.displayAverage}
                  />
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2 className="dashboard-section__title">Latest submission</h2>
                <Link to="/my-feedback" className="dashboard-section__link">
                  View all feedback
                </Link>
              </div>
              <div className="dashboard-latest">
                <div className="dashboard-latest__meta">
                  <span>{formatFeedbackTimestamp(analytics.latestFeedback.createdAt)}</span>
                  <span className="dashboard-latest__badge">
                    Average: {latestAverage?.displayScore}/5 — {latestAverage?.label}
                  </span>
                </div>
                <div className="dashboard-latest__grid">
                  {activeCategories.slice(0, 4).map((category) => {
                    const rating = getRatingValue(analytics.latestFeedback, category.key)

                    return (
                      <div key={category.key} className="dashboard-latest__item">
                        <span className="dashboard-latest__label">{category.name}</span>
                        <span className="dashboard-latest__value">
                          {rating != null ? `${rating}/5 — ${RATING_LABELS[rating]}` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {analytics.latestFeedback.comment ? (
                  <p className="dashboard-latest__comment">{analytics.latestFeedback.comment}</p>
                ) : (
                  <p className="dashboard-latest__comment dashboard-latest__comment--empty">
                    No comment on the latest submission.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </EmployeeLayout>
  )
}

export default Dashboard
