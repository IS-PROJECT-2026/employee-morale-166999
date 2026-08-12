import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import LogoIcon from '../Logo/LogoIcon'
import { useAuth } from '../../context/useAuth'
import './EmployeeLayout.css'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Give Feedback', to: '/feedback' },
  { label: 'My Feedback', to: '/my-feedback' },
]

function EmployeeLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = user?.displayName || user?.email || 'Employee'

  const handleLogout = async () => {
    setLoggingOut(true)

    const { error } = await logout()

    setLoggingOut(false)

    if (!error) {
      navigate('/', { replace: true })
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="employee-layout">
      <header className="employee-layout__header">
        <div className="employee-layout__inner container">
          <Link to="/dashboard" className="employee-layout__brand" onClick={closeMenu}>
            <LogoIcon className="employee-layout__logo" />
            <span>WorkPulse</span>
          </Link>

          <nav
            className={`employee-layout__nav ${menuOpen ? 'employee-layout__nav--open' : ''}`}
            aria-label="Employee navigation"
          >
            <ul className="employee-layout__links">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `employee-layout__link${isActive ? ' employee-layout__link--active' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `employee-layout__link${isActive ? ' employee-layout__link--active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  My Profile
                </NavLink>
              </li>
            </ul>

            <div className="employee-layout__actions">
              <span className="employee-layout__user">{displayName}</span>
              <button
                type="button"
                className="btn btn-secondary employee-layout__logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Signing out…' : 'Log Out'}
              </button>
            </div>
          </nav>

          <button
            type="button"
            className={`employee-layout__toggle ${menuOpen ? 'employee-layout__toggle--open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="employee-layout__main">{children}</main>
    </div>
  )
}

export default EmployeeLayout
