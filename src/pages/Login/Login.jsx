import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout'
import { useAuth } from '../../context/useAuth'
import '../../components/auth/AuthLayout.css'

function Login() {
  const { login, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errors = {}

    if (!email.trim()) {
      errors.email = 'Email is required.'
    }

    if (!password) {
      errors.password = 'Password is required.'
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

    const { user, error } = await login({ email: email.trim(), password })

    setLoading(false)

    if (error) {
      setFormError(error)
      return
    }

    if (user) {
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your WorkPulse dashboard."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup">Create one</Link>
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
            add your project credentials to enable sign-in.
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            placeholder="you@company.com"
          />
          {fieldErrors.email && (
            <span id="login-email-error" className="auth-field__error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            placeholder="Enter your password"
          />
          {fieldErrors.password && (
            <span id="login-password-error" className="auth-field__error" role="alert">
              {fieldErrors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Log In'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
