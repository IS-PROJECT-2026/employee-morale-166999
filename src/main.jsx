import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { EmployeeProvider } from './context/EmployeeContext.jsx'
import { RatingCategoriesProvider } from './context/RatingCategoriesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/employee-morale-166999">
      <AuthProvider>
        <EmployeeProvider>
          <RatingCategoriesProvider>
            <App />
          </RatingCategoriesProvider>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)