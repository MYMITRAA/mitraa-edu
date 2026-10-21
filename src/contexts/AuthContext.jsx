import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { ROLE_DASHBOARD_PATH } from '../data/mockData'

const AuthContext = createContext(undefined)
const registeredUsersKey = (role) => `mitraa_users_${role}`
const LOCAL_ROLES = Object.keys(ROLE_DASHBOARD_PATH)
const PASSWORD_ITERATIONS = 210000

const encodeBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const decodeBase64 = (value) => Uint8Array.from(atob(value), character => character.charCodeAt(0))

const hashPassword = async (password, salt) => {
  const webCrypto = globalThis.crypto
  if (!webCrypto?.subtle) {
    throw new Error('Secure password storage is unavailable in this browser. Use a modern browser on HTTPS or localhost.')
  }
  const passwordSalt = salt || webCrypto.getRandomValues(new Uint8Array(16))
  const key = await webCrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await webCrypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: passwordSalt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  )
  return { passwordSalt: encodeBase64(passwordSalt), passwordHash: encodeBase64(new Uint8Array(hash)) }
}

const verifyPassword = async (password, salt, expectedHash) => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password verification is unavailable in this browser. Use a modern browser on HTTPS or localhost.')
  }
  try {
    const storedSalt = decodeBase64(salt)
    const actualHash = decodeBase64((await hashPassword(password, storedSalt)).passwordHash)
    const expected = decodeBase64(expectedHash)
    return actualHash.length === expected.length
      && actualHash.reduce((difference, byte, index) => difference | (byte ^ expected[index]), 0) === 0
  } catch {
    return false
  }
}

const readRegisteredUsers = async (role) => {
  const saved = localStorage.getItem(registeredUsersKey(role))
  if (!saved) return []

  let users
  try {
    users = JSON.parse(saved)
  } catch {
    throw new Error("Saved account data is invalid. Clear this role's saved accounts and register again.")
  }
  if (!Array.isArray(users)) {
    throw new Error("Saved account data is invalid. Clear this role's saved accounts and register again.")
  }
  let migrated = false
  const normalizedUsers = await Promise.all(users.map(async (user) => {
    if (!user || typeof user !== 'object' || typeof user.email !== 'string') {
      throw new Error("Saved account data is invalid. Clear this role's saved accounts and register again.")
    }
    if (typeof user.password === 'string') {
      const { password: _password, ...safeUser } = user
      migrated = true
      return { ...safeUser, ...await hashPassword(user.password) }
    }
    if (typeof user.passwordSalt !== 'string' || typeof user.passwordHash !== 'string') {
      throw new Error("Saved account data is invalid. Clear this role's saved accounts and register again.")
    }
    return user
  }))
  if (migrated) saveRegisteredUsers(role, normalizedUsers)
  return normalizedUsers
}

const saveRegisteredUsers = (role, users) => {
  localStorage.setItem(registeredUsersKey(role), JSON.stringify(users))
}

const withoutCredentials = ({ password: _password, passwordSalt: _salt, passwordHash: _hash, ...user }) => user

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingRole, setPendingRole] = useState(null)
  const migrationPromise = useRef(Promise.resolve())
  const migrationErrors = useRef({})

  useEffect(() => {
    let active = true
    migrationPromise.current = Promise.all(LOCAL_ROLES.map(async (role) => {
      try {
        await readRegisteredUsers(role)
      } catch (error) {
        if (active) migrationErrors.current[role] = error.message
      }
    }))
    return () => { active = false }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('mitraa_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {}
    }
  }, [])

  const login = async (email, password, role) => {
    await new Promise(r => setTimeout(r, 600))
    try {
      await migrationPromise.current
      const registeredUsers = await readRegisteredUsers(role)
      const identifier = email.trim().toLowerCase()
      const registeredAccount = registeredUsers.find(
        u => u.email?.toLowerCase() === identifier || u.id?.toLowerCase() === identifier
      )
      if (!registeredAccount || !(await verifyPassword(password, registeredAccount.passwordSalt, registeredAccount.passwordHash))) {
        return { success: false, message: 'Invalid email or password for the selected role.' }
      }
      const safeUser = withoutCredentials(registeredAccount)
      if (['principal', 'management', 'examcontroller'].includes(role)) {
        setPendingUser(safeUser)
        return { success: true, requiresOTP: true }
      }
      setUser(safeUser)
      localStorage.setItem('mitraa_user', JSON.stringify(safeUser))
      return { success: true }
    } catch (error) {
      return { success: false, message: migrationErrors.current[role] || error.message }
    }
  }

  const register = async ({ name, email, password, role }) => {
    await new Promise(r => setTimeout(r, 300))
    const normalizedEmail = email.trim().toLowerCase()
    try {
      await migrationPromise.current
      if (!LOCAL_ROLES.includes(role)) {
        return { success: false, message: 'Select a valid account role.' }
      }
      const users = await readRegisteredUsers(role)
      if (users.some(u => u.email?.toLowerCase() === normalizedEmail)) {
        return { success: false, message: 'An account with this email already exists for this role.' }
      }

      const credentials = await hashPassword(password)
      const user = {
        id: `${role.slice(0, 3).toUpperCase()}-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        role,
        ...credentials,
      }
      saveRegisteredUsers(role, [...users, user])
      setPendingRole(role)
      return { success: true }
    } catch (error) {
      return { success: false, message: migrationErrors.current[role] || error.message || 'Could not save the account in local storage.' }
    }
  }

  const resetPassword = async ({ email, password, role }) => {
    await new Promise(r => setTimeout(r, 300))
    const normalizedEmail = email.trim().toLowerCase()
    try {
      await migrationPromise.current
      const users = await readRegisteredUsers(role)
      const index = users.findIndex(u => u.email?.toLowerCase() === normalizedEmail)
      if (index >= 0) {
        users[index] = { ...users[index], ...await hashPassword(password) }
        saveRegisteredUsers(role, users)
        return { success: true }
      }

      return { success: false, message: 'No account with this email was found for the selected role.' }
    } catch (error) {
      return { success: false, message: error.message || 'Could not update the password in local storage.' }
    }
  }

  const verifyOTP = async (otp) => {
    await new Promise(r => setTimeout(r, 400))
    if (otp === '123456' && pendingUser) {
      setUser(pendingUser)
      localStorage.setItem('mitraa_user', JSON.stringify(pendingUser))
      setPendingUser(null)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setPendingUser(null)
    localStorage.removeItem('mitraa_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      resetPassword,
      verifyOTP,
      logout,
      pendingRole,
      setPendingRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ROLE_DASHBOARD_PATH }
