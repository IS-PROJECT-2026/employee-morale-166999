import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoIcon from '../../components/Logo/LogoIcon'
import { useAuth } from '../../context/useAuth'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const displayName = user?.displayName || user?.email || 'there'

  const handleLogout = async () => {
    setLogoutError('')
    setLoggingOut(true)

    const { error } = await logout()

    setLoggingOut(false)

    if (error) {
      setLogoutError(error)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header__inner container">
          <Link to="/" className="dashboard-header__brand">
            <LogoIcon className="dashboard-header__logo" />
            <span>WorkPulse</span>
          </Link>
          <div className="dashboard-header__actions">
            <span className="dashboard-header__user">{displayName}</span>
            <button
              type="button"
              className="btn btn-secondary dashboard-header__logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? 'Signing out…' : 'Log Out'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card container">
          <p className="dashboard-card__eyebrow">Employee Dashboard</p>
          <h1 className="dashboard-card__title">Welcome, {displayName}</h1>
          <p className="dashboard-card__text">
            You&apos;re signed in to WorkPulse. Your employee dashboard will appear here
            in a future update — including feedback tools and morale insights tailored
            for your team.
          </p>

          {logoutError && (
            <div className="auth-alert dashboard-card__alert" role="alert">
              {logoutError}
            </div>
          )}

          <div className="dashboard-card__placeholder">
            <span className="dashboard-card__placeholder-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p>Dashboard features coming soon</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
