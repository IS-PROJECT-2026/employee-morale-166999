import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import Feedback from './pages/Feedback/Feedback'
import MyFeedback from './pages/MyFeedback/MyFeedback'
import ManagementDashboard from './pages/Management/ManagementDashboard'
import ManagementEmployeesPage from './pages/Management/ManagementEmployeesPage'
import ManagementCategoriesPage from './pages/Management/ManagementCategoriesPage'
import EmployeeFeedbackPage from './pages/Management/EmployeeFeedbackPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicAuthRoute from './components/auth/PublicAuthRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <SignUp />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-feedback"
        element={
          <ProtectedRoute>
            <MyFeedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/management"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ManagementDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/categories"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ManagementCategoriesPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/employees"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ManagementEmployeesPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/employees/:userId"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <EmployeeFeedbackPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
