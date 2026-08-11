import EmployeeLayout from '../../components/employee/EmployeeLayout'
import { useAuth } from '../../context/useAuth'
import '../../components/employee/EmployeeLayout.css'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()

  const displayName = user?.displayName || user?.email || 'there'

  return (
    <EmployeeLayout>
      <div className="employee-panel dashboard-panel">
        <p className="employee-panel__eyebrow">Employee Dashboard</p>
        <h1 className="employee-panel__title">Welcome, {displayName}</h1>
        <p className="employee-panel__text">
          You&apos;re signed in to WorkPulse. Your employee dashboard will appear here
          in a future update — including feedback tools and morale insights tailored
          for your team.
        </p>

        <div className="dashboard-panel__placeholder">
          <span className="dashboard-panel__placeholder-icon" aria-hidden="true">
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
    </EmployeeLayout>
  )
}

export default Dashboard
