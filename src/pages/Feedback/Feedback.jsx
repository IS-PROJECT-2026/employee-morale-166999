import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmployeeLayout from '../../components/employee/EmployeeLayout'
import RatingInput from '../../components/Feedback/RatingInput'
import { useAuth } from '../../context/useAuth'
import { useRatingCategories } from '../../context/useRatingCategories'
import {
  buildInitialRatings,
  COMMENT_MAX_LENGTH,
  createFeedback,
  getFeedbackErrorMessage,
  validateFeedbackRatings,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/employee/EmployeeLayout.css'
import '../../components/Feedback/Feedback.css'

function FeedbackForm({ activeCategories, user }) {
  const [ratings, setRatings] = useState(() => buildInitialRatings(activeCategories))
  const [comment, setComment] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const statusRef = useRef(null)

  useEffect(() => {
    if ((successMessage || formError) && statusRef.current) {
      statusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [successMessage, formError])

  const handleRatingChange = (key) => (value) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const resetForm = () => {
    setRatings(buildInitialRatings(activeCategories))
    setComment('')
    setFieldErrors({})
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')

    if (!user) {
      setFormError('You must be signed in to submit feedback.')
      return
    }

    const ratingErrors = validateFeedbackRatings(ratings, activeCategories)
    const errors = { ...ratingErrors }

    if (comment.length > COMMENT_MAX_LENGTH) {
      errors.comment = `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.`
    }

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)

    try {
      await createFeedback(
        user.uid,
        {
          ratings,
          comment,
        },
        activeCategories,
      )

      setSuccessMessage('Thank you! Your feedback has been submitted successfully.')
      resetForm()
    } catch (error) {
      setFormError(getFeedbackErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <div className="feedback-form__scale">
        Rate each category from <strong>1 (Very Poor)</strong> to{' '}
        <strong>5 (Excellent)</strong>. All ratings are required.
      </div>

      {activeCategories.map((category) => (
        <RatingInput
          key={category.key}
          id={`feedback-${category.key}`}
          label={category.name}
          value={ratings[category.key]}
          onChange={handleRatingChange(category.key)}
          error={fieldErrors[category.key]}
          disabled={submitting}
        />
      ))}

      <div className="auth-field feedback-form__comment">
        <label htmlFor="feedback-comment">Additional comments (optional)</label>
        <textarea
          id="feedback-comment"
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={submitting}
          maxLength={COMMENT_MAX_LENGTH}
          placeholder="Share any additional thoughts about your workplace experience…"
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby="feedback-comment-counter"
        />
        <div
          id="feedback-comment-counter"
          className={`feedback-form__counter${
            comment.length >= COMMENT_MAX_LENGTH ? ' feedback-form__counter--limit' : ''
          }`}
        >
          {comment.length}/{COMMENT_MAX_LENGTH}
        </div>
        {fieldErrors.comment && (
          <span className="auth-field__error" role="alert">
            {fieldErrors.comment}
          </span>
        )}
      </div>

      <div ref={statusRef} className="feedback-form__status">
        {successMessage && (
          <div className="feedback-form__success" role="status">
            <span className="feedback-form__success-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <p className="feedback-form__success-title">{successMessage}</p>
              <Link to="/my-feedback" className="feedback-form__success-link">
                View your feedback history
              </Link>
            </div>
          </div>
        )}

        {formError && (
          <div className="auth-alert" role="alert">
            {formError}
          </div>
        )}
      </div>

      <div className="employee-profile-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  )
}

function Feedback() {
  const { user } = useAuth()
  const { activeCategories, loading: categoriesLoading } = useRatingCategories()
  const formKey = activeCategories.map((category) => category.key).join('|')

  return (
    <EmployeeLayout>
      <div className="employee-panel employee-panel--wide">
        <header className="feedback-page-header">
          <div className="feedback-page-header__main">
            <span className="feedback-page-header__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 9h8M8 13h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="feedback-page-header__content">
              <p className="feedback-page-header__eyebrow">Give Feedback</p>
              <h1 className="feedback-page-header__title">Share Your Workplace Experience</h1>
              <p className="feedback-page-header__text">
                Rate key aspects of your workplace and optionally add comments to help your
                organization understand how things are going.
              </p>
            </div>
          </div>
          <Link to="/my-feedback" className="btn btn-secondary feedback-page-header__action">
            My Feedback
          </Link>
        </header>

        {categoriesLoading ? (
          <div className="auth-loading profile-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading feedback categories…</p>
          </div>
        ) : (
          <FeedbackForm key={formKey} activeCategories={activeCategories} user={user} />
        )}
      </div>
    </EmployeeLayout>
  )
}

export default Feedback
