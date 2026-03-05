import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import { fetchDoctorProfile } from '../services/api'

function DoctorDashboard() {
  const { doctor } = useAuth()
  const location = useLocation()
  const [message, setMessage] = useState('')
  const [doctorProfile, setDoctorProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch doctor profile from API
    const loadProfile = async () => {
      try {
        const profile = await fetchDoctorProfile()
        setDoctorProfile(profile)
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      // Clear the message after displaying
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }, [location.state])

  // Use profile from API if available, otherwise fall back to doctor from auth context
  const currentDoctor = doctorProfile || doctor
  const isPending = currentDoctor?.status === 'PENDING'
  const isApproved = currentDoctor?.status === 'APPROVED'

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {currentDoctor?.name}</p>
      </div>

      {/* Message from signup */}
      {message && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          {message}
        </div>
      )}

      {/* PENDING Status Message */}
      {isPending && (
        <div className="warning-message">
          <span className="warning-icon">⏳</span>
          Your account is pending admin approval. You will be able to manage appointments once approved.
        </div>
      )}

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          {currentDoctor?.imageData ? (
            <img
              src={`data:image/jpeg;base64,${currentDoctor.imageData}`}
              alt={currentDoctor.name}
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              {currentDoctor?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
          )}
          <div>
            <h2 className="profile-name">{currentDoctor?.name}</h2>
            <p className="profile-info">
              {currentDoctor?.qualification} - {currentDoctor?.specialization}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{currentDoctor?.email}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Qualification</span>
            <span className="profile-detail-value">{currentDoctor?.qualification || 'N/A'}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Specialization</span>
            <span className="profile-detail-value">{currentDoctor?.specialization || 'N/A'}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Years of Experience</span>
            <span className="profile-detail-value">{currentDoctor?.experience || 'N/A'} years</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Status</span>
            <span className="profile-detail-value">
              <span className={`status-badge ${isApproved ? 'status-approved' : 'status-pending'}`}>
                {currentDoctor?.status || 'PENDING'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Appointments Section - Only show for APPROVED status */}
      {isApproved && (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/appointments" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            View Appointments
          </Link>
        </div>
      )}

      {/* Message for non-approved users */}
      {isPending && (
        <div style={{ marginTop: '1.5rem', color: '#64748b' }}>
          Once your profile is approved by the admin, you will be able to manage appointments.
        </div>
      )}
    </div>
  )
}

export default DoctorDashboard
