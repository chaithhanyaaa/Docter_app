import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { fetchDoctorAppointments, acceptAppointment, rejectAppointment, fetchDoctorProfile } from '../services/api'

function Appointments() {
  const { doctor } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [doctorProfile, setDoctorProfile] = useState(null)

  // Fetch doctor profile to get current status
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchDoctorProfile()
        setDoctorProfile(profile)
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
      }
    }
    loadProfile()
  }, [])

  // Use profile from API if available, otherwise fall back to doctor from auth context
  const currentDoctor = doctorProfile || doctor
  const isApproved = currentDoctor?.status === 'APPROVED'

  // Load appointments
  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchDoctorAppointments()
      setAppointments(data)
    } catch (err) {
      console.error('Error loading appointments:', err)
      setError(err.response?.data?.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appointmentId) => {
    setActionLoading(appointmentId)
    setError('')
    try {
      await acceptAppointment(appointmentId)
      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'ACCEPTED' } : apt
        )
      )
      setSuccessMessage('Appointment accepted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error accepting appointment:', err)
      setError(err.response?.data?.message || 'Failed to accept appointment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appointmentId) => {
    setActionLoading(appointmentId)
    setError('')
    try {
      await rejectAppointment(appointmentId)
      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'REJECTED' } : apt
        )
      )
      setSuccessMessage('Appointment rejected successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error rejecting appointment:', err)
      setError(err.response?.data?.message || 'Failed to reject appointment')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1 className="appointments-title">Appointments</h1>
        <p className="dashboard-subtitle">Manage your patient appointments</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message" style={{ marginBottom: '1rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem' }}>
          {error}
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          <span>✓</span> {successMessage}
        </div>
      )}

      {/* Approval warning */}
      {!isApproved && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          Your profile is under review. Approval required to manage appointments.
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="empty-state">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">No appointments found</div>
      ) : (
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patientName || apt.patient_name || apt.patient?.name}</td>
                  <td>{apt.date}</td>
                  <td>{apt.timeSlot || apt.time_slot || apt.time}</td>
                  <td>
                    <span className={`status-badge ${apt.status === 'ACCEPTED' ? 'status-approved' : apt.status === 'REJECTED' ? 'status-rejected' : 'status-pending'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    {apt.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-success"
                          onClick={() => handleAccept(apt.id)}
                          disabled={!isApproved || actionLoading === apt.id}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          {actionLoading === apt.id ? '...' : 'Accept'}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(apt.id)}
                          disabled={!isApproved || actionLoading === apt.id}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          {actionLoading === apt.id ? '...' : 'Reject'}
                        </button>
                      </div>
                    ) : apt.status === 'ACCEPTED' ? (
                      <span style={{ color: '#22c55e', fontWeight: '500' }}>Accepted</span>
                    ) : apt.status === 'REJECTED' ? (
                      <span style={{ color: '#dc2626', fontWeight: '500' }}>Rejected</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Appointments
