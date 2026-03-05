import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API from "../api/axios";

function MyAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  // Helper function to get appointment ID from various possible field names
  const getAppointmentId = (appointment) => {
    return appointment.appointmentId || appointment.id || appointment.appointment_id || null;
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await API.get('/appointments/my');
      console.log('Appointments response:', response.data);
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle cancel appointment
  const handleCancel = async (appointment) => {
    const appointmentId = getAppointmentId(appointment);
    
    if (!appointmentId) {
      alert('Unable to get appointment ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      await API.put(`/appointments/${appointmentId}/cancel`);
      
      // Update local state
      setAppointments(appointments.map(apt => 
        getAppointmentId(apt) === appointmentId 
          ? { ...apt, status: 'CANCELLED' }
          : apt
      ));
      
      alert('Appointment cancelled successfully');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  // Check if appointment can be cancelled
  const canCancel = (appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointmentDate > today && appointment.status !== 'CANCELLED';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Handle time format HH:mm:ss
    const time = timeString.split(':');
    const hours = parseInt(time[0]);
    const minutes = time[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'PENDING':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={() => navigate('/')} />
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your appointments...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar user={user} onLogout={() => navigate('/')} />
        <div className="page-container">
          <div className="my-appointments-page">
            <h1>My Appointments</h1>
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchAppointments}>Retry</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div>
        <Navbar user={user} onLogout={() => navigate('/')} />
        <div className="page-container">
          <div className="my-appointments-page">
            <h1>My Appointments</h1>
            <div className="no-appointments-container">
              <div className="empty-state">
                <h3>No Appointments Yet</h3>
                <p>You haven't booked any appointments yet.</p>
                <button 
                  className="book-now-btn"
                  onClick={() => navigate('/')}
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={() => navigate('/')} />
      <div className="page-container">
        <div className="my-appointments-page">
          <h1>My Appointments</h1>
          <div className="appointments-list">
            {appointments.map((appointment, index) => {
              const aptId = getAppointmentId(appointment);
              return (
                <div key={aptId || index} className="appointment-card">
                  <div className="appointment-header">
                    <div className="doctor-info">
                      <img
                        src={appointment.doctor?.imageData 
                          ? `data:image/jpeg;base64,${appointment.doctor.imageData}` 
                          : "/Fallback-img.jpeg"
                        }
                        alt={appointment.doctor?.name || 'Doctor'}
                        onError={(e) => { e.target.src = "/Fallback-img.jpeg"; }}
                      />
                      <div className="doctor-details">
                        <h3>{appointment.doctor?.name || 'Doctor'}</h3>
                        <p>{appointment.doctor?.specialization || ''}</p>
                        <p>{appointment.doctor?.qualification || ''}</p>
                      </div>
                    </div>
                    <div className={`appointment-status ${getStatusClass(appointment.status)}`}>
                      {appointment.status || 'PENDING'}
                    </div>
                  </div>

                  <div className="appointment-body">
                    <div className="appointment-info">
                      <div className="info-item">
                        <span className="info-label">Date:</span>
                        <span className="info-value">{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Time:</span>
                        <span className="info-value">{formatTime(appointment.appointmentTime)}</span>
                      </div>
                    </div>
                  </div>

                  {canCancel(appointment) && (
                    <div className="appointment-actions">
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(appointment)}
                        disabled={cancellingId === aptId}
                      >
                        {cancellingId === aptId ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyAppointments;
