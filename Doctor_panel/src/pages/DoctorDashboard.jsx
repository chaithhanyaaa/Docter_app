import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

function DoctorDashboard() {
  const { doctor } = useAuth()
  const location = useLocation()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      // Clear the message after displaying
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }, [location.state])

  const isApproved = doctor?.status === 'APPROVED'

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, Dr. {doctor?.name}</p>
      </div>

      {/* Message from signup */}
      {message && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          {doctor?.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              {doctor?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
          )}
          <div>
            <h2 className="profile-name">Dr. {doctor?.name}</h2>
            <p className="profile-info">
              {doctor?.qualification} - {doctor?.specialization}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{doctor?.email}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Qualification</span>
            <span className="profile-detail-value">{doctor?.qualification || 'N/A'}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Specialization</span>
            <span className="profile-detail-value">{doctor?.specialization || 'N/A'}</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Years of Experience</span>
            <span className="profile-detail-value">{doctor?.experience || 'N/A'} years</span>
          </div>
          <div className="profile-detail">
            <span className="profile-detail-label">Status</span>
            <span className="profile-detail-value">
              <span className={`status-badge ${isApproved ? 'status-approved' : 'status-pending'}`}>
                {doctor?.status || 'PENDING'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Approval Status Message */}
      {!isApproved && (
        <div className="warning-message">
          <span className="warning-icon">⏳</span>
          Your profile is under review. You cannot manage appointments yet. Please wait for admin approval.
        </div>
      )}

      {/* Action Buttons */}
      {isApproved ? (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/appointments" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            View Appointments
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem', color: '#64748b' }}>
          Once your profile is approved by the admin, you will be able to manage appointments.
        </div>
      )}
    </div>
  )
}

export default DoctorDashboard
