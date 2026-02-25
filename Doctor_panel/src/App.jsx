import { useState, createContext, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DoctorNavbar from './components/DoctorNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import DoctorSignup from './pages/DoctorSignup'
import DoctorLogin from './pages/DoctorLogin'
import DoctorDashboard from './pages/DoctorDashboard'
import Appointments from './pages/Appointments'

// Create auth context
const AuthContext = createContext(null)

// Auth provider component
export function AuthProvider({ children }) 
{
  const [doctor, setDoctor] = useState(null)

  const loginDoctor = (doctorData) => {
    setDoctor(doctorData)
  }

  const logoutDoctor = () => {
    setDoctor(null)
  }

  const updateDoctorStatus = (status) => {
    if (doctor) {
      setDoctor({ ...doctor, status })
    }
  }

  return (
    <AuthContext.Provider value={{ doctor, loginDoctor, logoutDoctor, updateDoctorStatus }}>
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
