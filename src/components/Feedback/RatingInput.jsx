import { RATING_LABELS } from '../../services/firebase/feedback'
import './Feedback.css'

const ratingOptions = [1, 2, 3, 4, 5]

function RatingInput({ id, label, value, onChange, error, disabled }) {
  return (
    <fieldset className={`feedback-rating${error ? ' feedback-rating--error' : ''}`}>
      <legend className="feedback-rating__legend">{label}</legend>
      <div className="feedback-rating__options" role="radiogroup" aria-labelledby={`${id}-legend`}>
        {ratingOptions.map((rating) => {
          const inputId = `${id}-${rating}`

          return (
            <label key={rating} htmlFor={inputId} className="feedback-rating__option">
              <input
                id={inputId}
                type="radio"
                name={id}
                value={rating}
                checked={value === rating}
                onChange={() => onChange(rating)}
                disabled={disabled}
              />
              <span className="feedback-rating__value">{rating}</span>
              <span className="feedback-rating__label">{RATING_LABELS[rating]}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <span className="feedback-rating__error" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  )
}

export default RatingInput
