import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API from "../api/axios";

function BookAppointment({ user }) {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch all doctors to get the selected one
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get('/doctors');
        const approvedDoctors = response.data.filter(d => d.status === 'APPROVED');
        setDoctors(approvedDoctors);
        
        // Find the selected doctor
        const doctor = approvedDoctors.find(d => d.doctorId === parseInt(doctorId));
        if (doctor) {
          setSelectedDoctor(doctor);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorId]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      setSlotsLoading(true);
      try {
        const response = await API.get(
          `/appointments/slots?doctorId=${selectedDoctor.doctorId}&date=${selectedDate}`
        );
        setAvailableSlots(response.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('Failed to load available slots');
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError("Please select a doctor, date, and time slot");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Format time as HH:mm:ss
      const timeParts = selectedSlot.split(':');
      const formattedTime = `${timeParts[0]}:${timeParts[1]}:00`;

      await API.post('/appointments', {
        doctor: {
          doctorId: selectedDoctor.doctorId
        },
        appointmentDate: selectedDate,
        appointmentTime: formattedTime
      });

      setSuccess(true);
      
      // Redirect to my appointments after short delay
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={() => navigate('/')} />
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={() => navigate('/')} />
      
      <div className="page-container">
        <div className="booking-page">
          <h1>Book Appointment</h1>

          {success && (
            <div className="success-message">
              Appointment booked successfully! Redirecting to My Appointments...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Doctor Selection */}
          <div className="booking-section">
            <h3>Select Doctor</h3>
            <select
              value={selectedDoctor?.doctorId || ""}
              onChange={(e) => {
                const doctor = doctors.find(d => d.doctorId === parseInt(e.target.value));
                setSelectedDoctor(doctor);
                setSelectedDate("");
                setSelectedSlot(null);
              }}
              className="booking-select"
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.doctorId} value={doc.doctorId}>
                  {doc.name} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="booking-section">
            <h3>Select Date</h3>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              className="booking-date-input"
            />
          </div>

          {/* Time Slots */}
          {selectedDoctor && selectedDate && (
            <div className="booking-section">
              <h3>Select Time Slot</h3>
              {slotsLoading ? (
                <div className="loading-slots">
                  <div className="loading-spinner"></div>
                  <p>Loading available slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="no-slots">
                  <p>No available slots for this date. Please select another date.</p>
                </div>
              ) : (
                <div className="slots-grid">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Doctor Info */}
          {selectedDoctor && (
            <div className="selected-doctor-info">
              <h3>Selected Doctor</h3>
              <div className="doctor-card">
                <img
                  src={selectedDoctor.imageData ? `data:image/jpeg;base64,${selectedDoctor.imageData}` : "/Fallback-img.jpeg"}
                  alt={selectedDoctor.name}
                  onError={(e) => { e.target.src = "/Fallback-img.jpeg"; }}
                />
                <div className="doctor-info">
                  <h4>{selectedDoctor.name}</h4>
                  <p>{selectedDoctor.specialization}</p>
                  <p>{selectedDoctor.qualification}</p>
                  <p>{selectedDoctor.experience} Years Experience</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="booking-actions">
            <button
              className="booking-submit-btn"
              onClick={handleSubmit}
              disabled={!selectedDoctor || !selectedDate || !selectedSlot || submitting}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              className="booking-back-btn"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookAppointment;
