import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/useAuth'
import '../../components/auth/AuthLayout.css'

function SignUp() {
  const { register, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = 'Employee name is required.'
    }

    if (!email.trim()) {
      errors.email = 'Email is required.'
    }

    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!validate()) {
      return
    }

    setLoading(true)

    const { user, error } = await register({
      name: name.trim(),
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setFormError(error)
      return
    }

    if (user) {
      navigate('/profile', { replace: true })
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Create your account to set up your employee profile and access WorkPulse."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="auth-alert" role="alert">
            {formError}
          </div>
        )}

        {!isFirebaseConfigured && (
          <div className="auth-alert" role="alert">
            Firebase is not configured. Copy <code>.env.example</code> to <code>.env</code> and
            add your project credentials to enable registration.
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="signup-name">Employee name</label>
          <input
            id="signup-name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
            placeholder="Your full name"
          />
          {fieldErrors.name && (
            <span id="signup-name-error" className="auth-field__error" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            placeholder="you@company.com"
          />
          {fieldErrors.email && (
            <span id="signup-email-error" className="auth-field__error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
            placeholder="At least 6 characters"
          />
          {fieldErrors.password && (
            <span id="signup-password-error" className="auth-field__error" role="alert">
              {fieldErrors.password}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={
              fieldErrors.confirmPassword ? 'signup-confirm-password-error' : undefined
            }
            placeholder="Re-enter your password"
          />
          {fieldErrors.confirmPassword && (
            <span
              id="signup-confirm-password-error"
              className="auth-field__error"
              role="alert"
            >
              {fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignUp
