import { createContext, useContext, useEffect, useState } from 'react'
import { ROLE_DASHBOARD_PATH } from '../data/mockData'

const AuthContext = createContext(undefined)
const SESSION_KEY = 'mitraa_demo_session'

// This UI-only session makes the prototype navigable. It is not authentication.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')) } catch { setUser(null) }
  }, [])

  const login = async (email, _password, role) => {
    const labels = { admin: 'School Administrator', teacher: 'Teacher', staff: 'Staff', finance: 'Finance Officer', preschool: 'Preschool Educator', parent: 'Parent / Guardian' }
    if (!ROLE_DASHBOARD_PATH[role]) return { success: false, message: 'Choose an available V1 role.' }
    const session = { role, name: email?.trim() || labels[role], email: email?.trim() || 'demo@mitraa.edu', institution: 'Mitraa Learning Centre', institutionId: 'demo-school', demo: true }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null) }
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, pendingRole: null, setPendingRole: () => {}, verifyOTP: async () => false, resetPassword: async () => ({ success: false, message: 'Password recovery will be available when the institution identity service is connected.' }) }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ROLE_DASHBOARD_PATH }
