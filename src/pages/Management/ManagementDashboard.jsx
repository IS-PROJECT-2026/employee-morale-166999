import { useEffect, useMemo, useState } from 'react'
import ManagementLayout from '../../components/management/ManagementLayout'
import { useAuth } from '../../context/useAuth'
import { useEmployee } from '../../context/useEmployee'
import { useRatingCategories } from '../../context/useRatingCategories'
import {
  calculateFeedbackAverage,
  computeManagementAnalytics,
  formatAverageRating,
  formatFeedbackTimestamp,
  getAllFeedback,
  getFeedbackErrorMessage,
  getRatingValue,
} from '../../services/firebase/feedback'
import { isAdminUser } from '../../utils/roles'
import '../../components/auth/AuthLayout.css'
import '../../components/management/ManagementLayout.css'
import './ManagementDashboard.css'

function ManagementBar({ label, average, displayAverage, responseCount }) {
  return (
    <div className="management-bar">
      <div className="management-bar__header">
        <span className="management-bar__label">{label}</span>
        <span className="management-bar__score">
          {displayAverage.displayScore}/5 · {displayAverage.label}
          {responseCount != null ? ` · ${responseCount} responses` : ''}
        </span>
      </div>
      <div className="management-bar__track">
        <div
          className="management-bar__fill"
          style={{ width: `${(average / 5) * 100}%` }}
        />
      </div>
    </div>
  )
}

function ManagementDashboard() {
  const { user } = useAuth()
  const { employee } = useEmployee()
  const { allCategories, addCategory, refreshCategories, loading: categoriesLoading } =
    useRatingCategories()

  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadManagementData() {
      setLoading(true)
      setError('')

      try {
        const results = await getAllFeedback()
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

    loadManagementData()

    return () => {
      cancelled = true
    }
  }, [user])

  const analytics = useMemo(
    () => computeManagementAnalytics(feedbackList, allCategories),
    [feedbackList, allCategories],
  )

  const latestAverage = analytics.latestFeedback
    ? formatAverageRating(calculateFeedbackAverage(analytics.latestFeedback, allCategories))
    : null

  const handleAddCategory = async (event) => {
    event.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    if (!categoryName.trim()) {
      setCategoryError('Category name is required.')
      return
    }

    setSavingCategory(true)

    const { error: saveError } = await addCategory({
      name: categoryName,
      description: categoryDescription,
    })

    setSavingCategory(false)

    if (saveError) {
      setCategoryError(saveError)
      return
    }

    setCategorySuccess('Category added successfully.')
    setCategoryName('')
    setCategoryDescription('')
    await refreshCategories()
  }

  const pageLoading = loading || categoriesLoading

  return (
    <ManagementLayout>
      <div className="management-panel">
        <header className="management-header">
          <p className="management-header__eyebrow">Management Insights</p>
          <h1 className="management-header__title">Workplace Feedback Overview</h1>
          <p className="management-header__text">
            Organization-wide feedback summaries calculated dynamically from employee
            submissions in Firestore.
          </p>
        </header>

        {error && (
          <div className="auth-alert management-panel__alert" role="alert">
            {error}
          </div>
        )}

        {pageLoading ? (
          <div className="auth-loading management-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading management insights…</p>
          </div>
        ) : (
          <>
            <section className="management-stats" aria-label="Overview">
              <div className="management-stat">
                <span className="management-stat__label">Total submissions</span>
                <span className="management-stat__value">{analytics.submissionCount}</span>
                <span className="management-stat__detail">All employee feedback entries</span>
              </div>
              <div className="management-stat">
                <span className="management-stat__label">Overall average</span>
                <span className="management-stat__value">
                  {analytics.submissionCount
                    ? `${analytics.overallAverage.displayScore}/5`
                    : '—'}
                </span>
                <span className="management-stat__detail">
                  {analytics.submissionCount ? analytics.overallAverage.label : 'No data yet'}
                </span>
              </div>
              <div className="management-stat">
                <span className="management-stat__label">Latest submission</span>
                <span className="management-stat__value">
                  {analytics.latestFeedback
                    ? formatFeedbackTimestamp(analytics.latestFeedback.createdAt)
                    : '—'}
                </span>
                <span className="management-stat__detail">
                  {latestAverage
                    ? `Average ${latestAverage.displayScore}/5`
                    : 'Waiting for first submission'}
                </span>
              </div>
            </section>

            <section className="management-section">
              <div className="management-section__header">
                <div>
                  <h2 className="management-section__title">Rating averages</h2>
                  <p className="management-section__text">
                    Average score for each active feedback category across all submissions.
                  </p>
                </div>
              </div>

              {analytics.submissionCount === 0 ? (
                <div className="management-empty">No feedback submissions yet.</div>
              ) : (
                <div className="management-bars">
                  {analytics.categoryAverages.map((category) => (
                    <ManagementBar
                      key={category.key}
                      label={category.label}
                      average={category.average}
                      displayAverage={category.displayAverage}
                      responseCount={category.responseCount}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="management-section">
              <div className="management-section__header">
                <div>
                  <h2 className="management-section__title">Recent feedback</h2>
                  <p className="management-section__text">
                    Latest employee comments and rating summaries.
                  </p>
                </div>
              </div>

              {analytics.recentFeedback.length === 0 ? (
                <div className="management-empty">No recent feedback to display.</div>
              ) : (
                <div className="management-recent-list">
                  {analytics.recentFeedback.map((feedback) => {
                    const average = formatAverageRating(
                      calculateFeedbackAverage(feedback, allCategories),
                    )

                    return (
                      <article key={feedback.id} className="management-recent-card">
                        <div className="management-recent-card__meta">
                          <span>{formatFeedbackTimestamp(feedback.createdAt)}</span>
                          <span className="management-recent-card__average">
                            Average: {average.displayScore}/5 — {average.label}
                          </span>
                        </div>
                        <div className="management-recent-card__ratings">
                          {allCategories.slice(0, 4).map((category) => (
                            <span key={category.key}>
                              {category.name}: {getRatingValue(feedback, category.key) ?? '—'}/5
                            </span>
                          ))}
                        </div>
                        {feedback.comment ? (
                          <p className="management-recent-card__comment">{feedback.comment}</p>
                        ) : (
                          <p className="management-recent-card__comment management-recent-card__comment--empty">
                            No comment provided.
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="management-section">
              <div className="management-section__header">
                <div>
                  <h2 className="management-section__title">Rating categories</h2>
                  <p className="management-section__text">
                    Active categories available in the employee feedback form.
                  </p>
                </div>
              </div>

              <div className="management-category-list">
                {allCategories.map((category) => (
                  <div key={category.id} className="management-category-item">
                    <div>
                      <span className="management-category-item__name">{category.name}</span>
                      {category.description && (
                        <p className="management-category-item__description">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="management-category-item__badge">
                      {category.isDefault ? 'Default' : 'Custom'}
                    </span>
                  </div>
                ))}
              </div>

              {isAdminUser(employee) ? (
                <form className="management-category-form auth-form" onSubmit={handleAddCategory}>
                  <h3 className="management-category-form__title">Add category</h3>

                  {categorySuccess && (
                    <div className="employee-success" role="status">
                      {categorySuccess}
                    </div>
                  )}

                  {categoryError && (
                    <div className="auth-alert" role="alert">
                      {categoryError}
                    </div>
                  )}

                  <div className="auth-field">
                    <label htmlFor="category-name">Category name</label>
                    <input
                      id="category-name"
                      type="text"
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      disabled={savingCategory}
                      placeholder="e.g. Career Growth"
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="category-description">Description (optional)</label>
                    <textarea
                      id="category-description"
                      value={categoryDescription}
                      onChange={(event) => setCategoryDescription(event.target.value)}
                      disabled={savingCategory}
                      placeholder="Describe what employees should rate."
                      rows={3}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={savingCategory}>
                    {savingCategory ? 'Saving…' : 'Add Category'}
                  </button>
                </form>
              ) : (
                <p className="management-section__text">
                  Only admins can add new rating categories.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </ManagementLayout>
  )
}

export default ManagementDashboard
