import {
  calculateFeedbackAverage,
  formatAverageRating,
  formatFeedbackTimestamp,
  getRatingValue,
  RATING_LABELS,
} from '../../services/firebase/feedback'
import './FeedbackViewCard.css'

function getScoreClass(rating) {
  if (rating == null) {
    return 'feedback-view-score--empty'
  }

  if (rating <= 2) {
    return 'feedback-view-score--low'
  }

  if (rating === 3) {
    return 'feedback-view-score--mid'
  }

  return 'feedback-view-score--high'
}

function getDateTimeValue(timestamp) {
  if (!timestamp) {
    return undefined
  }

  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function FeedbackViewCard({ feedback, categories, employeeName, submissionLabel }) {
  const average = formatAverageRating(calculateFeedbackAverage(feedback, categories))
  const isDetailView = !employeeName
  const dateTimeValue = getDateTimeValue(feedback.createdAt)

  return (
    <article
      className={`feedback-view-card${isDetailView ? ' feedback-view-card--detail' : ''}`}
    >
      <div className="feedback-view-card__header">
        {isDetailView ? (
          <div className="feedback-view-card__submission">
            {submissionLabel && (
              <span className="feedback-view-card__submission-label">{submissionLabel}</span>
            )}
            <div>
              <span className="feedback-view-card__date-eyebrow">Submitted</span>
              <time
                className="feedback-view-card__date feedback-view-card__date--prominent"
                dateTime={dateTimeValue}
              >
                {formatFeedbackTimestamp(feedback.createdAt)}
              </time>
            </div>
          </div>
        ) : (
          <div className="feedback-view-card__identity">
            {employeeName && (
              <span className="feedback-view-card__avatar" aria-hidden="true">
                {employeeName.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              {employeeName && (
                <p className="feedback-view-card__employee">{employeeName}</p>
              )}
              <time className="feedback-view-card__date" dateTime={dateTimeValue}>
                {formatFeedbackTimestamp(feedback.createdAt)}
              </time>
            </div>
          </div>
        )}
        <span className="feedback-view-card__average">
          {average.displayScore}/5 · {average.label}
        </span>
      </div>

      <div className="feedback-view-card__ratings">
        {categories.map((category) => {
          const rating = getRatingValue(feedback, category.key)
          const scoreClass = getScoreClass(rating)

          return (
            <div key={category.key} className="feedback-view-card__rating">
              <div className="feedback-view-card__rating-top">
                <span className="feedback-view-card__rating-label">{category.name}</span>
                <span className={`feedback-view-score ${scoreClass}`}>
                  {rating != null ? `${rating}/5` : '—'}
                </span>
              </div>
              {rating != null ? (
                <>
                  <div className="feedback-view-card__track">
                    <div
                      className={`feedback-view-card__fill ${scoreClass}`}
                      style={{ width: `${(rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="feedback-view-card__rating-text">{RATING_LABELS[rating]}</span>
                </>
              ) : (
                <span className="feedback-view-card__rating-text feedback-view-card__rating-text--empty">
                  Not rated
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="feedback-view-card__comment-block">
        <p className="feedback-view-card__comment-label">Comment</p>
        {feedback.comment ? (
          <blockquote className="feedback-view-card__comment">{feedback.comment}</blockquote>
        ) : (
          <p className="feedback-view-card__comment feedback-view-card__comment--empty">
            No comment provided.
          </p>
        )}
      </div>
    </article>
  )
}

export default FeedbackViewCard
