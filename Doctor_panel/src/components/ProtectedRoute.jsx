import { Navigate } from 'react-router-dom'
import { useAuth } from '../App'

function ProtectedRoute({ children }) {
  const { doctor, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Check if doctor is logged in
  if (!doctor) {
    return <Navigate to="/login" replace />
  }

  // Allow access to doctor panel for any authenticated doctor
  // (Some doctors may not have role set, so we check for existence)

  return children
}

export default ProtectedRoute
