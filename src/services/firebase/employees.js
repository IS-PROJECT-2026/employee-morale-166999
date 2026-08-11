import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const EMPLOYEES_COLLECTION = 'employees'

const FIRESTORE_ERROR_MESSAGES = {
  'firestore/not-configured':
    'Firestore is not configured. Copy .env.example to .env and add your Firebase credentials.',
  'firestore/not-found': 'Employee record not found.',
  'firestore/permission-denied': 'You do not have permission to access this employee record.',
  'firestore/unavailable': 'Firestore is temporarily unavailable. Please try again.',
}

function getDbInstance() {
  if (!db) {
    const error = new Error('Firestore is not configured.')
    error.code = 'firestore/not-configured'
    throw error
  }

  return db
}

function getEmployeeDocRef(userId) {
  return doc(getDbInstance(), EMPLOYEES_COLLECTION, userId)
}

export function getEmployeeErrorMessage(error) {
  if (!error) {
    return 'Something went wrong. Please try again.'
  }

  const mappedCode =
    error.code && FIRESTORE_ERROR_MESSAGES[error.code]
      ? error.code
      : {
          'permission-denied': 'firestore/permission-denied',
          unavailable: 'firestore/unavailable',
          'not-found': 'firestore/not-found',
        }[error.code]

  if (mappedCode && FIRESTORE_ERROR_MESSAGES[mappedCode]) {
    return FIRESTORE_ERROR_MESSAGES[mappedCode]
  }

  return error.message || 'Something went wrong. Please try again.'
}

export function mapEmployeeDoc(snapshot) {
  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()

  return {
    id: snapshot.id,
    userId: data.userId || snapshot.id,
    fullName: data.fullName || '',
    email: data.email || '',
    employeeId: data.employeeId || '',
    department: data.department || '',
    jobTitle: data.jobTitle || '',
    dateJoined: data.dateJoined || '',
    isAdmin: Boolean(data.isAdmin),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  }
}

export function isEmployeeProfileComplete(employee) {
  if (!employee) {
    return false
  }

  return Boolean(
    employee.fullName?.trim() &&
      employee.employeeId?.trim() &&
      employee.department?.trim() &&
      employee.jobTitle?.trim() &&
      employee.dateJoined?.trim(),
  )
}

export async function getEmployeeByUserId(userId) {
  const snapshot = await getDoc(getEmployeeDocRef(userId))
  return mapEmployeeDoc(snapshot)
}

export async function createEmployeeIfNotExists(user) {
  const docRef = getEmployeeDocRef(user.uid)
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return mapEmployeeDoc(snapshot)
  }

  const employeeData = {
    userId: user.uid,
    fullName: user.displayName?.trim() || '',
    email: user.email || '',
    employeeId: '',
    department: '',
    jobTitle: '',
    dateJoined: '',
    isAdmin: false,
    createdAt: serverTimestamp(),
  }

  await setDoc(docRef, employeeData)

  const createdSnapshot = await getDoc(docRef)
  return mapEmployeeDoc(createdSnapshot)
}

export async function updateEmployeeProfile(userId, profileData) {
  const docRef = getEmployeeDocRef(userId)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    const error = new Error('Employee record not found.')
    error.code = 'firestore/not-found'
    throw error
  }

  const updates = {
    fullName: profileData.fullName.trim(),
    employeeId: profileData.employeeId.trim(),
    department: profileData.department.trim(),
    jobTitle: profileData.jobTitle.trim(),
    dateJoined: profileData.dateJoined,
    updatedAt: serverTimestamp(),
  }

  await updateDoc(docRef, updates)

  const updatedSnapshot = await getDoc(docRef)
  return mapEmployeeDoc(updatedSnapshot)
}
