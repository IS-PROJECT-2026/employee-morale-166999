import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ManagementLayout from '../../components/management/ManagementLayout'
import FeedbackViewCard from '../../components/management/FeedbackViewCard'
import { useAuth } from '../../context/useAuth'
import { useRatingCategories } from '../../context/useRatingCategories'
import { getEmployeeByUserId, getEmployeeErrorMessage } from '../../services/firebase/employees'
import {
  calculateFeedbackAverage,
  formatAverageRating,
  getFeedbackByUserId,
  getFeedbackErrorMessage,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/management/ManagementLayout.css'
import '../../components/management/EmployeeFeedbackDetail.css'
import '../../components/management/FeedbackViewCard.css'
import './EmployeeFeedbackPage.css'

function EmployeeFeedbackPage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const { allCategories, loading: categoriesLoading } = useRatingCategories()
  const [employee, setEmployee] = useState(null)
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !userId) {
      return undefined
    }

    let cancelled = false

    async function loadEmployeeFeedback() {
      setLoading(true)
      setError('')

      try {
        const [employeeRecord, feedbackResults] = await Promise.all([
          getEmployeeByUserId(userId),
          getFeedbackByUserId(userId),
        ])

        if (!cancelled) {
          if (!employeeRecord) {
            setError('Employee not found.')
            setEmployee(null)
            setFeedbackList([])
          } else {
            setEmployee(employeeRecord)
            setFeedbackList(feedbackResults)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(getFeedbackErrorMessage(err) || getEmployeeErrorMessage(err))
          setEmployee(null)
          setFeedbackList([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEmployeeFeedback()

    return () => {
      cancelled = true
    }
  }, [user, userId])

  const employeeAverage = useMemo(() => {
    if (!feedbackList.length || !allCategories.length) {
      return null
    }

    const total = feedbackList.reduce(
      (sum, feedback) => sum + calculateFeedbackAverage(feedback, allCategories),
      0,
    )

    return formatAverageRating(total / feedbackList.length)
  }, [feedbackList, allCategories])

  const displayName = employee?.fullName?.trim() || employee?.email || 'Employee'
  const pageLoading = loading || categoriesLoading

  return (
    <ManagementLayout>
      <div className="management-panel employee-feedback-page">
        <Link to="/management/employees" className="employee-feedback-page__back">
          ← Back to employee feedback
        </Link>

        {error && (
          <div className="auth-alert management-panel__alert" role="alert">
            {error}
          </div>
        )}

        {pageLoading ? (
          <div className="auth-loading management-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading employee feedback…</p>
          </div>
        ) : employee ? (
          <>
            <header className="management-header employee-feedback-page__header">
              <p className="management-header__eyebrow">Employee Feedback</p>
              <h1 className="management-header__title">{displayName}</h1>
              <p className="management-header__text">
                Complete ratings and comments submitted by this employee.
              </p>
            </header>

            <div className="management-employee-summary">
              <div className="management-employee-summary__profile">
                <span className="management-employee-summary__avatar" aria-hidden="true">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="management-employee-summary__label">Employee</span>
                  <span className="management-employee-summary__value">{displayName}</span>
                  {employee.department && (
                    <span className="management-employee-summary__department">
                      {employee.department}
                    </span>
                  )}
                </div>
              </div>
              <div className="management-employee-summary__stat">
                <span className="management-employee-summary__label">Submissions</span>
                <span className="management-employee-summary__value management-employee-summary__value--stat">
                  {feedbackList.length}
                </span>
              </div>
              <div className="management-employee-summary__stat">
                <span className="management-employee-summary__label">Average rating</span>
                <span className="management-employee-summary__value management-employee-summary__value--stat">
                  {employeeAverage ? `${employeeAverage.displayScore}/5` : '—'}
                </span>
                {employeeAverage && (
                  <span className="management-employee-summary__detail">
                    {employeeAverage.label}
                  </span>
                )}
              </div>
            </div>

            {feedbackList.length === 0 ? (
              <div className="management-empty">This employee has no feedback submissions.</div>
            ) : (
              <div className="management-feedback-list">
                {feedbackList.map((feedback, index) => (
                  <FeedbackViewCard
                    key={feedback.id}
                    feedback={feedback}
                    categories={allCategories}
                    submissionLabel={`Submission ${feedbackList.length - index} of ${feedbackList.length}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </ManagementLayout>
  )
}

export default EmployeeFeedbackPage
