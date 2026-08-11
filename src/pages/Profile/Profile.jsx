import { useMemo, useState } from 'react'
import EmployeeLayout from '../../components/employee/EmployeeLayout'
import { useAuth } from '../../context/useAuth'
import { useEmployee } from '../../context/useEmployee'
import '../../components/auth/AuthLayout.css'
import '../../components/employee/EmployeeLayout.css'
import './Profile.css'

function formatDateJoined(dateString) {
  if (!dateString) {
    return '—'
  }

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ProfileField({ label, value, fullWidth = false }) {
  return (
    <div className={`employee-profile-item${fullWidth ? ' employee-profile-item--full' : ''}`}>
      <span className="employee-profile-item__label">{label}</span>
      <span className="employee-profile-item__value">{value || '—'}</span>
    </div>
  )
}

function Profile() {
  const { user } = useAuth()
  const { employee, loading, error, isProfileComplete, saveProfile } = useEmployee()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const formDefaults = useMemo(
    () => ({
      fullName: employee?.fullName || user?.displayName || '',
      employeeId: employee?.employeeId || '',
      department: employee?.department || '',
      jobTitle: employee?.jobTitle || '',
      dateJoined: employee?.dateJoined || '',
    }),
    [employee, user?.displayName],
  )

  const inSetupMode = Boolean(employee && !isProfileComplete)
  const showForm = inSetupMode || isEditing
  const activeFormData = formData ?? formDefaults

  const validate = (data) => {
    const errors = {}

    if (!data.fullName.trim()) {
      errors.fullName = 'Full name is required.'
    }

    if (!data.employeeId.trim()) {
      errors.employeeId = 'Employee ID is required.'
    }

    if (!data.department.trim()) {
      errors.department = 'Department is required.'
    }

    if (!data.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required.'
    }

    if (!data.dateJoined) {
      errors.dateJoined = 'Date joined is required.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...(prev ?? formDefaults), [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')

    if (!validate(activeFormData)) {
      return
    }

    setSaving(true)

    const { employee: updatedEmployee, error: saveError } = await saveProfile(activeFormData)

    setSaving(false)

    if (saveError) {
      setFormError(saveError)
      return
    }

    if (updatedEmployee) {
      setSuccessMessage('Profile saved successfully.')
      setFormData(null)
      setIsEditing(false)
    }
  }

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="auth-loading profile-loading" role="status" aria-live="polite">
          <div className="auth-loading__spinner" aria-hidden="true" />
          <p>Loading your profile…</p>
        </div>
      </EmployeeLayout>
    )
  }

  return (
    <EmployeeLayout>
      <div className="employee-panel employee-panel--wide">
        <p className="employee-panel__eyebrow">My Profile</p>
        <h1 className="employee-panel__title">
          {isProfileComplete ? 'Employee Profile' : 'Complete Your Profile'}
        </h1>
        <p className="employee-panel__text">
          {isProfileComplete
            ? 'Your employee information is stored securely and linked to your account.'
            : 'Add your employee details to finish setting up your WorkPulse account.'}
        </p>

        {error && (
          <div className="auth-alert employee-panel__alert" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="employee-success employee-panel__alert" role="status">
            {successMessage}
          </div>
        )}

        {showForm ? (
          <form className="employee-form auth-form" onSubmit={handleSubmit} noValidate>
            {formError && (
              <div className="auth-alert" role="alert">
                {formError}
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="profile-full-name">Full name</label>
              <input
                id="profile-full-name"
                type="text"
                name="fullName"
                autoComplete="name"
                value={activeFormData.fullName}
                onChange={handleChange('fullName')}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.fullName)}
                placeholder="Your full name"
              />
              {fieldErrors.fullName && (
                <span className="auth-field__error" role="alert">
                  {fieldErrors.fullName}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="profile-email">Email</label>
              <div id="profile-email" className="employee-form__readonly">
                {user?.email || '—'}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="profile-employee-id">Employee ID</label>
              <input
                id="profile-employee-id"
                type="text"
                name="employeeId"
                value={activeFormData.employeeId}
                onChange={handleChange('employeeId')}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.employeeId)}
                placeholder="e.g. EMP-1024"
              />
              {fieldErrors.employeeId && (
                <span className="auth-field__error" role="alert">
                  {fieldErrors.employeeId}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="profile-department">Department</label>
              <input
                id="profile-department"
                type="text"
                name="department"
                value={activeFormData.department}
                onChange={handleChange('department')}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.department)}
                placeholder="e.g. Engineering"
              />
              {fieldErrors.department && (
                <span className="auth-field__error" role="alert">
                  {fieldErrors.department}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="profile-job-title">Job title</label>
              <input
                id="profile-job-title"
                type="text"
                name="jobTitle"
                value={activeFormData.jobTitle}
                onChange={handleChange('jobTitle')}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.jobTitle)}
                placeholder="e.g. Software Engineer"
              />
              {fieldErrors.jobTitle && (
                <span className="auth-field__error" role="alert">
                  {fieldErrors.jobTitle}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="profile-date-joined">Date joined</label>
              <input
                id="profile-date-joined"
                type="date"
                name="dateJoined"
                value={activeFormData.dateJoined}
                onChange={handleChange('dateJoined')}
                disabled={saving}
                aria-invalid={Boolean(fieldErrors.dateJoined)}
              />
              {fieldErrors.dateJoined && (
                <span className="auth-field__error" role="alert">
                  {fieldErrors.dateJoined}
                </span>
              )}
            </div>

            {employee?.isAdmin && (
              <div className="auth-field">
                <label htmlFor="profile-is-admin">Admin</label>
                <div id="profile-is-admin" className="employee-form__readonly">
                  Yes
                </div>
              </div>
            )}

            <div className="employee-profile-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isProfileComplete ? 'Save Changes' : 'Save Profile'}
              </button>
              {isProfileComplete && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData(null)
                    setIsEditing(false)
                    setFormError('')
                    setFieldErrors({})
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <>
            <div className="employee-profile-grid">
              <ProfileField label="Full name" value={employee?.fullName} />
              <ProfileField label="Email" value={employee?.email || user?.email} />
              <ProfileField label="Employee ID" value={employee?.employeeId} />
              <ProfileField label="Department" value={employee?.department} />
              <ProfileField label="Job title" value={employee?.jobTitle} />
              <ProfileField
                label="Date joined"
                value={formatDateJoined(employee?.dateJoined)}
              />
              {employee?.isAdmin && (
                <ProfileField label="Admin" value="Yes" />
              )}
            </div>

            <div className="employee-profile-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setFormData(formDefaults)
                  setIsEditing(true)
                  setSuccessMessage('')
                  setFormError('')
                  setFieldErrors({})
                }}
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  )
}

export default Profile
