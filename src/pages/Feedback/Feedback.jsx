import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import EmployeeLayout from '../../components/employee/EmployeeLayout'
import RatingInput from '../../components/Feedback/RatingInput'
import { useAuth } from '../../context/useAuth'
import {
  COMMENT_MAX_LENGTH,
  createFeedback,
  FEEDBACK_CATEGORIES,
  getFeedbackErrorMessage,
  isValidRating,
} from '../../services/firebase/feedback'
import '../../components/auth/AuthLayout.css'
import '../../components/employee/EmployeeLayout.css'
import '../../components/Feedback/Feedback.css'

const initialRatings = {
  workEnvironment: null,
  managementSupport: null,
  teamCollaboration: null,
  communication: null,
  workLifeBalance: null,
  overallSatisfaction: null,
}

function Feedback() {
  const { user } = useAuth()
  const [ratings, setRatings] = useState(initialRatings)
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

  const validate = () => {
    const errors = {}

    FEEDBACK_CATEGORIES.forEach(({ key, label }) => {
      if (!isValidRating(ratings[key])) {
        errors[key] = `Please rate ${label.toLowerCase()}.`
      }
    })

    if (comment.length > COMMENT_MAX_LENGTH) {
      errors.comment = `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.`
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setRatings(initialRatings)
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

    if (!validate()) {
      return
    }

    setSubmitting(true)

    try {
      await createFeedback(user.uid, {
        ...ratings,
        comment,
      })

      setSuccessMessage('Thank you! Your feedback has been submitted successfully.')
      resetForm()
    } catch (error) {
      setFormError(getFeedbackErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <EmployeeLayout>
      <div className="employee-panel employee-panel--wide">
        <p className="employee-panel__eyebrow">Give Feedback</p>
        <h1 className="employee-panel__title">Share Your Workplace Experience</h1>
        <p className="employee-panel__text">
          Rate key aspects of your workplace and optionally add comments to help your
          organization understand how things are going.
        </p>

        <form className="feedback-form" onSubmit={handleSubmit} noValidate>
          <div className="feedback-form__scale">
            Rate each category from <strong>1 (Very Poor)</strong> to <strong>5 (Excellent)</strong>.
            All ratings are required.
          </div>

          {FEEDBACK_CATEGORIES.map(({ key, label }) => (
            <RatingInput
              key={key}
              id={`feedback-${key}`}
              label={label}
              value={ratings[key]}
              onChange={handleRatingChange(key)}
              error={fieldErrors[key]}
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
                <span className="feedback-form__success-icon" aria-hidden="true">✓</span>
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
      </div>
    </EmployeeLayout>
  )
}

export default Feedback
