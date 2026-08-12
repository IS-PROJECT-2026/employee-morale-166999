import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ManagementLayout from '../../components/management/ManagementLayout'
import DailyFeedbackChart from '../../components/management/DailyFeedbackChart'
import RecentFeedbackList from '../../components/management/RecentFeedbackList'
import { useAuth } from '../../context/useAuth'
import { useRatingCategories } from '../../context/useRatingCategories'
import { getAllEmployees, getEmployeeErrorMessage } from '../../services/firebase/employees'
import {
  computeDailyFeedbackTrend,
  computeManagementAnalytics,
  getAllFeedback,
  getFeedbackErrorMessage,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/management/ManagementLayout.css'
import '../../components/management/EmployeeFeedbackDetail.css'
import '../../components/management/DailyFeedbackChart.css'
import './ManagementDashboard.css'

function MetricRow({ label, average, displayAverage }) {
  return (
    <div className="insights-metric">
      <div className="insights-metric__top">
        <span className="insights-metric__label">{label}</span>
        <span className="insights-metric__value">{displayAverage.displayScore}</span>
      </div>
      <div className="insights-metric__track">
        <div
          className="insights-metric__fill"
          style={{ width: `${(average / 5) * 100}%` }}
        />
      </div>
    </div>
  )
}

function ManagementDashboard() {
  const { user } = useAuth()
  const { allCategories, loading: categoriesLoading } = useRatingCategories()

  const [employees, setEmployees] = useState([])
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadManagementData() {
      setLoading(true)
      setError('')

      try {
        const [results, employeeResults] = await Promise.all([getAllFeedback(), getAllEmployees()])

        if (!cancelled) {
          setFeedbackList(results)
          setEmployees(employeeResults)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getFeedbackErrorMessage(err) || getEmployeeErrorMessage(err))
          setFeedbackList([])
          setEmployees([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadManagementData()

    return () => {
      cancelled = true
    }
  }, [user])

  const analytics = useMemo(
    () => computeManagementAnalytics(feedbackList, allCategories),
    [feedbackList, allCategories],
  )

  const dailyTrend = useMemo(
    () => computeDailyFeedbackTrend(feedbackList, allCategories),
    [feedbackList, allCategories],
  )

  const hasDailyActivity = dailyTrend.some(
    (day) => day.submissions > 0 || day.averageRating != null,
  )

  const topCategory = useMemo(() => {
    if (!analytics.categoryAverages.length) {
      return null
    }

    return [...analytics.categoryAverages].sort((a, b) => b.average - a.average)[0]
  }, [analytics.categoryAverages])

  const employeeLookup = useMemo(() => {
    return employees.reduce((accumulator, item) => {
      accumulator[item.userId] = item
      return accumulator
    }, {})
  }, [employees])

  const pageLoading = loading || categoriesLoading
  const overallScore = analytics.submissionCount ? analytics.overallAverage.displayScore : '—'

  return (
    <ManagementLayout>
      <div className="insights-page">
        {error && (
          <div className="auth-alert insights-page__alert" role="alert">
            {error}
          </div>
        )}

        {pageLoading ? (
          <div className="auth-loading insights-page__loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading management insights…</p>
          </div>
        ) : (
          <>
            <div className="insights-shell">
              <div className="insights-shell__card">
                <header className="insights-shell__header">
                  <div className="insights-shell__intro">
                    <span className="insights-shell__avatar" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 0112 0"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <div>
                      <h1 className="insights-shell__title">Category rating averages</h1>
                      <p className="insights-shell__subtitle">
                        Average scores from all employee feedback submissions
                      </p>
                    </div>
                  </div>
                  <div className="insights-shell__avg">
                    <span className="insights-shell__avg-label">Overall average rating</span>
                    <span className="insights-shell__avg-value">{overallScore}</span>
                  </div>
                </header>

                {analytics.submissionCount === 0 ? (
                  <div className="insights-empty">No feedback submissions yet.</div>
                ) : (
                  <>
                    <div className="insights-shell__metrics">
                      {analytics.categoryAverages.map((category) => (
                        <MetricRow
                          key={category.key}
                          label={category.label}
                          average={category.average}
                          displayAverage={category.displayAverage}
                        />
                      ))}
                    </div>

                    {hasDailyActivity && (
                      <DailyFeedbackChart dailyData={dailyTrend} />
                    )}

                    <div className="insights-shell__footer">
                      <div className="insights-mini-stat">
                        <span className="insights-mini-stat__icon insights-mini-stat__icon--purple" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 3l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 15.9l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 3z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <div>
                          <span className="insights-mini-stat__label">
                            {topCategory ? topCategory.label : 'Top category'}
                          </span>
                          <strong className="insights-mini-stat__value">
                            {topCategory ? topCategory.displayAverage.displayScore : '—'}
                          </strong>
                        </div>
                      </div>
                      <Link
                        to="/management/employees"
                        className="insights-mini-stat insights-mini-stat--link"
                      >
                        <span className="insights-mini-stat__icon insights-mini-stat__icon--pink" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path
                              d="M7 9h10M7 13h6M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <div>
                          <span className="insights-mini-stat__label">Total feedback</span>
                          <strong className="insights-mini-stat__value">
                            {analytics.submissionCount}
                          </strong>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            <section className="insights-recent">
              <div className="insights-recent__header">
                <h2>Recent feedback</h2>
                <p>Latest submissions — click to view full details.</p>
              </div>

              {feedbackList.length === 0 ? (
                <div className="insights-empty insights-empty--compact">
                  No recent feedback to display.
                </div>
              ) : (
                <RecentFeedbackList
                  feedbackList={feedbackList}
                  employeeLookup={employeeLookup}
                  categories={allCategories}
                />
              )}
            </section>
          </>
        )}
      </div>
    </ManagementLayout>
  )
}

export default ManagementDashboard
