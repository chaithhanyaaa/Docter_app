import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import { fetchAppointments, acceptAppointment } from '../data/appointments'

function Appointments() {
  const { doctor } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  const isApproved = doctor?.status === 'APPROVED'

  // Load appointments
  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const data = await fetchAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (appointmentId) => {
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
    } catch (error) {
      console.error('Error accepting appointment:', error)
    }
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h1 className="appointments-title">Appointments</h1>
        <p className="dashboard-subtitle">Manage your patient appointments</p>
      </div>

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
                  <td>{apt.patientName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.timeSlot}</td>
                  <td>
                    <span className={`status-badge ${apt.status === 'ACCEPTED' ? 'status-approved' : 'status-pending'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    {apt.status === 'PENDING' ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleAccept(apt.id)}
                        disabled={!isApproved}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Accept
                      </button>
                    ) : (
                      <span style={{ color: '#22c55e', fontWeight: '500' }}>Accepted</span>
                    )}
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
