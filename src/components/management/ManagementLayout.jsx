import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import LogoIcon from '../Logo/LogoIcon'
import { useAuth } from '../../context/useAuth'
import { useEmployee } from '../../context/useEmployee'
import { isAdminUser } from '../../utils/roles'
import './ManagementLayout.css'

const navItems = [{ label: 'Management Insights', to: '/management' }]

function ManagementLayout({ children }) {
  const { user, logout } = useAuth()
  const { employee } = useEmployee()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = user?.displayName || user?.email || 'Manager'

  const handleLogout = async () => {
    setLoggingOut(true)
    const { error } = await logout()
    setLoggingOut(false)

    if (!error) {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="management-layout">
      <header className="management-layout__header">
        <div className="management-layout__inner container">
          <Link to="/management" className="management-layout__brand">
            <LogoIcon className="management-layout__logo" />
            <span>WorkPulse Management</span>
          </Link>

          <nav className="management-layout__nav" aria-label="Management navigation">
            <ul className="management-layout__links">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `management-layout__link${isActive ? ' management-layout__link--active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link to="/dashboard" className="management-layout__link">
                  Employee Area
                </Link>
              </li>
            </ul>

            <div className="management-layout__actions">
              <span className="management-layout__role">
                {isAdminUser(employee) ? 'Admin' : 'Manager'}
              </span>
              <span className="management-layout__user">{displayName}</span>
              <button
                type="button"
                className="btn btn-secondary management-layout__logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Signing out…' : 'Log Out'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="management-layout__main">{children}</main>
    </div>
  )
}

export default ManagementLayout
