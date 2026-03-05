import { useState, createContext, useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DoctorNavbar from './components/DoctorNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import DoctorSignup from './pages/DoctorSignup'
import DoctorLogin from './pages/DoctorLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import Appointments from './pages/Appointments'
import { getStoredDoctor, getToken, clearAuthData } from './services/api'

// Create auth context
const AuthContext = createContext(null)

// Auth provider component
export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing auth on mount
  useEffect(() => {
    const token = getToken()
    const storedDoctor = getStoredDoctor()
    
    if (token && storedDoctor) {
      setDoctor(storedDoctor)
    } else if (token) {
      // Token exists but no doctor data - clear invalid state
      clearAuthData()
    }
    setLoading(false)
  }, [])

  const loginDoctor = (doctorData) => {
    setDoctor(doctorData)
  }

  const logoutDoctor = () => {
    clearAuthData()
    setDoctor(null)
  }

  const updateDoctorStatus = (status) => {
    if (doctor) {
      const updatedDoctor = { ...doctor, status }
      setDoctor(updatedDoctor)
      // Update localStorage
      localStorage.setItem('doctorData', JSON.stringify(updatedDoctor))
    }
  }

  return (
    <AuthContext.Provider value={{ doctor, loginDoctor, logoutDoctor, updateDoctorStatus, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<DoctorLogin />} />
          <Route path="/signup" element={<DoctorSignup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DoctorNavbar />
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <DoctorNavbar />
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
