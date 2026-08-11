import { Link } from 'react-router-dom'
import LogoIcon from '../Logo/LogoIcon'
import './AuthLayout.css'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <header className="auth-page__header">
        <Link to="/" className="auth-page__brand">
          <LogoIcon className="auth-page__logo" />
          <span>WorkPulse</span>
        </Link>
      </header>

      <main className="auth-page__main">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">{title}</h1>
            {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="auth-card__footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
