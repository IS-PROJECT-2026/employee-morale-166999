export const EMPLOYEE_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin',
}

export function isAdminUser(employee) {
  if (!employee) {
    return false
  }

  return employee.role === EMPLOYEE_ROLES.ADMIN || Boolean(employee.isAdmin)
}

export function isManagementUser(employee) {
  if (!employee) {
    return false
  }

  return (
    isAdminUser(employee) ||
    employee.role === EMPLOYEE_ROLES.MANAGER
  )
}
