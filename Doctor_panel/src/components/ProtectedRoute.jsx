import { Navigate } from 'react-router-dom'
import { useAuth } from '../App'

function ProtectedRoute({ children }) {
  const { doctor } = useAuth()

  // Check if doctor is logged in
  if (!doctor) {
    return <Navigate to="/login" replace />
  }

  // Check if role is DOCTOR
  if (doctor.role !== 'DOCTOR') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
