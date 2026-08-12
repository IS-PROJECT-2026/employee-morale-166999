import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useEmployee } from '../../context/useEmployee'
import { isManagementUser } from '../../utils/roles'

function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth()
  const { employee, loading: employeeLoading } = useEmployee()

  if (authLoading || employeeLoading) {
    return (
      <div className="auth-loading" role="status" aria-live="polite">
        <div className="auth-loading__spinner" aria-hidden="true" />
        <p>Checking access…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isManagementUser(employee)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
