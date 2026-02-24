import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DoctorLogin from './pages/DoctorLogin'
import DoctorSignup from './pages/DoctorSignup'
import DoctorDashboard from './pages/DoctorDashboard'
import Appointments from './pages/Appointments'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<DoctorLogin />} />
          <Route path="/signup" element={<DoctorSignup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole={'DOCTOR'}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute requiredRole={'DOCTOR'}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
