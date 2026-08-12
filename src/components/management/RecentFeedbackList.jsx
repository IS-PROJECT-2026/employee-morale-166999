import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  calculateFeedbackAverage,
  formatAverageRating,
  formatFeedbackTimestamp,
} from '../../services/firebase/feedback'
import './EmployeeFeedbackDetail.css'

const PAGE_SIZE = 5

function truncateComment(comment, maxLength = 72) {
  if (!comment?.trim()) {
    return null
  }

  const trimmed = comment.trim()

  if (trimmed.length <= maxLength) {
    return trimmed
  }

  return `${trimmed.slice(0, maxLength).trim()}…`
}

function RecentFeedbackList({ feedbackList, employeeLookup, categories }) {
  const [requestedPage, setRequestedPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(feedbackList.length / PAGE_SIZE))
  const page = Math.min(requestedPage, totalPages - 1)

  const visibleFeedback = useMemo(() => {
    const start = page * PAGE_SIZE
    return feedbackList.slice(start, start + PAGE_SIZE)
  }, [feedbackList, page])

  const showPagination = feedbackList.length > PAGE_SIZE

  return (
    <div className="management-recent-panel">
      <ul className="management-employee-links">
        {visibleFeedback.map((feedback) => {
          const employeeRecord = employeeLookup[feedback.userId]
          const displayName =
            employeeRecord?.fullName?.trim() || employeeRecord?.email || 'Employee'
          const average = formatAverageRating(calculateFeedbackAverage(feedback, categories))
          const commentPreview = truncateComment(feedback.comment)

          return (
            <li key={feedback.id}>
              <Link
                to={`/management/employees/${feedback.userId}`}
                className="management-employee-link management-employee-link--recent"
              >
                <span className="management-employee-link__avatar" aria-hidden="true">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="management-employee-link__content">
                  <span className="management-employee-link__name">{displayName}</span>
                  <span className="management-employee-link__department">
                    {formatFeedbackTimestamp(feedback.createdAt)}
                  </span>
                  {commentPreview && (
                    <span className="management-employee-link__preview">{commentPreview}</span>
                  )}
                </span>
                <span className="management-employee-link__meta">
                  <span className="management-employee-link__average">
                    {average.displayScore}/5 · {average.label}
                  </span>
                </span>
                <span className="management-employee-link__action" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      {showPagination && (
        <div className="management-pagination">
          <p className="management-pagination__info">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, feedbackList.length)}{' '}
            of {feedbackList.length}
          </p>
          <div className="management-pagination__actions">
            <button
              type="button"
              className="btn btn-secondary management-pagination__btn"
              onClick={() => setRequestedPage((current) => current - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <span className="management-pagination__page">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary management-pagination__btn"
              onClick={() => setRequestedPage((current) => current + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentFeedbackList
