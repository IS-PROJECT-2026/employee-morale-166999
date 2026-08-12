import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ManagementLayout from '../../components/management/ManagementLayout'
import { useAuth } from '../../context/useAuth'
import { useRatingCategories } from '../../context/useRatingCategories'
import { getAllEmployees, getEmployeeErrorMessage } from '../../services/firebase/employees'
import {
  calculateFeedbackAverage,
  formatAverageRating,
  getAllFeedback,
  getFeedbackErrorMessage,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/management/ManagementLayout.css'
import '../../components/management/EmployeeFeedbackDetail.css'
import './ManagementEmployeesPage.css'

function ManagementEmployeesPage() {
  const { user } = useAuth()
  const { allCategories, loading: categoriesLoading } = useRatingCategories()
  const [employees, setEmployees] = useState([])
  const [feedbackList, setFeedbackList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    if (!user) {
      return undefined
    }

    let cancelled = false

    async function loadData() {
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

    loadData()

    return () => {
      cancelled = true
    }
  }, [user])

  const employeesWithFeedback = useMemo(() => {
    const feedbackByUser = feedbackList.reduce((accumulator, feedback) => {
      if (!accumulator[feedback.userId]) {
        accumulator[feedback.userId] = []
      }

      accumulator[feedback.userId].push(feedback)
      return accumulator
    }, {})

    return employees
      .filter((employee) => feedbackByUser[employee.userId]?.length)
      .map((employee) => {
        const submissions = feedbackByUser[employee.userId]
        const average =
          submissions.length && allCategories.length
            ? formatAverageRating(
                submissions.reduce(
                  (sum, feedback) => sum + calculateFeedbackAverage(feedback, allCategories),
                  0,
                ) / submissions.length,
              )
            : null

        return {
          ...employee,
          submissionCount: submissions.length,
          average,
        }
      })
      .sort((a, b) => (a.fullName || a.email).localeCompare(b.fullName || b.email))
  }, [employees, feedbackList, allCategories])

  const filteredEmployees = useMemo(() => {
    const query = nameFilter.trim().toLowerCase()

    if (!query) {
      return employeesWithFeedback
    }

    return employeesWithFeedback.filter((employee) => {
      const name = employee.fullName?.trim().toLowerCase() || ''
      const email = employee.email?.toLowerCase() || ''
      const department = employee.department?.toLowerCase() || ''

      return name.includes(query) || email.includes(query) || department.includes(query)
    })
  }, [employeesWithFeedback, nameFilter])

  const pageLoading = loading || categoriesLoading

  return (
    <ManagementLayout>
      <div className="management-panel">
        <header className="management-header">
          <p className="management-header__eyebrow">Employee Feedback</p>
          <h1 className="management-header__title">Browse by Employee</h1>
          <p className="management-header__text">
            View complete ratings and comments for each employee.
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
            <p>Loading employees…</p>
          </div>
        ) : (
          <section className="management-section">
            <div className="management-employees-toolbar">
              <div className="management-employees-search">
                <label htmlFor="employee-name-filter">Filter by name</label>
                <input
                  id="employee-name-filter"
                  type="search"
                  value={nameFilter}
                  onChange={(event) => setNameFilter(event.target.value)}
                  placeholder="Search by name, email, or department…"
                  autoComplete="off"
                />
              </div>
              <p className="management-employees-count">
                {filteredEmployees.length} of {employeesWithFeedback.length} employees
              </p>
            </div>

            {employeesWithFeedback.length === 0 ? (
              <div className="management-empty">No employees with feedback submissions yet.</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="management-empty">No employees match your search.</div>
            ) : (
              <ul className="management-employee-links">
                {filteredEmployees.map((employee) => {
                  const displayName = employee.fullName?.trim() || employee.email

                  return (
                    <li key={employee.userId}>
                      <Link
                        to={`/management/employees/${employee.userId}`}
                        className="management-employee-link"
                      >
                        <span className="management-employee-link__avatar" aria-hidden="true">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                        <span className="management-employee-link__content">
                          <span className="management-employee-link__name">{displayName}</span>
                          {employee.department && (
                            <span className="management-employee-link__department">
                              {employee.department}
                            </span>
                          )}
                        </span>
                        <span className="management-employee-link__meta">
                          <span className="management-employee-link__stat">
                            {employee.submissionCount}{' '}
                            {employee.submissionCount === 1 ? 'submission' : 'submissions'}
                          </span>
                          {employee.average && (
                            <span className="management-employee-link__average">
                              {employee.average.displayScore}/5 · {employee.average.label}
                            </span>
                          )}
                        </span>
                        <span className="management-employee-link__action" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </ManagementLayout>
  )
}

export default ManagementEmployeesPage
