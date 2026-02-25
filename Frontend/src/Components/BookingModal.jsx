import { useState } from "react";

// Mock time slots for UI demonstration
const TIME_SLOTS = [
  "10:00 – 10:30",
  "10:30 – 11:00",
  "11:00 – 11:30",
  "11:30 – 12:00",
  "14:00 – 14:30",
  "14:30 – 15:00",
  "15:00 – 15:30",
  "15:30 – 16:00",
  "16:00 – 16:30",
  "16:30 – 17:00",
];

function BookingModal({ doctor, user, onConfirm, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!selectedTimeSlot) {
      alert("Please select a time slot");
      return;
    }

    setIsSubmitting(true);

    // Create booking object (frontend-ready for future API call)
    const bookingData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log the booking object (as per requirements)
    console.log("Booking submitted:", bookingData);

    // Show success message
    setSuccessMessage("Booking request submitted. Confirmation pending.");

    // Pass data to parent
    onConfirm(bookingData);

    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setSuccessMessage("");
    onClose();
  };

  return (
    <div className="booking-modal-backdrop" onClick={handleClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="booking-modal-header">
          <h2>Book Appointment</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="booking-success-message">
            <span className="success-icon">✓</span>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Doctor Info (Read-only) */}
        <div className="booking-doctor-info">
          <div className="doctor-avatar">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              onError={(e) => {
                e.target.src = "/Fallback-img.jpeg";
              }}
            />
          </div>
          <div className="doctor-details">
            <h3>{doctor.name}</h3>
            <p className="specialization">{doctor.specialization}</p>
            <p className="experience">{doctor.experience} Years Experience</p>
          </div>
        </div>

        {/* Date Picker */}
        <div className="booking-form-group">
          <label htmlFor="appointment-date">Select Date</label>
          <input
            type="date"
            id="appointment-date"
            value={selectedDate}
            min={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="booking-date-input"
          />
        </div>

        {/* Time Slots */}
        <div className="booking-form-group">
          <label>Select Time Slot</label>
          <div className="time-slots-grid">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                className={`time-slot-btn ${
                  selectedTimeSlot === slot ? "selected" : ""
                }`}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="booking-modal-actions">
          <button
            className="booking-confirm-btn"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </button>
          <button className="booking-cancel-btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
