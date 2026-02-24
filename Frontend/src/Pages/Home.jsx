import { useState } from "react";
import Navbar from "../Components/Navbar";
import DoctorCard from "../Components/DoctorCard";
import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import doctors from "../Data/doctors";

function Home({ user, appointments, onLoginClick, onSignupClick, onLogout, onAddAppointment, onCancelAppointment }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [visibleCount, setVisibleCount] = useState(4);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  // Get unique specialties for filtering
  const specialties = ["All", ...new Set(doctors.map(d => d.specialization))];

  // ✅ FILTERED DOCTORS
  const filteredDoctors = doctors
    .filter((d) => d.status === "APPROVED")
    .filter((d) => 
      selectedSpecialty === "All" || d.specialization === selectedSpecialty
    )
    .filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Show limited doctors based on visible count
  const displayedDoctors = filteredDoctors.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDoctors.length;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleBookClick = () => {
    if (!user) {
      alert("Please login to book an appointment");
      return;
    }
    setSelectedDoctor({ ...selectedDoctor });
  };

  const confirmBooking = () => {
    if (!bookingDate || !bookingTime) {
      alert("Please select date and time");
      return;
    }
    
    onAddAppointment(selectedDoctor, bookingDate, bookingTime);
    alert(`Appointment booked with ${selectedDoctor.name} on ${bookingDate} at ${bookingTime}`);
    setSelectedDoctor(null);
    setBookingDate("");
    setBookingTime("");
  };

  return (
    <div>
      {/* 🔝 NAVBAR */}
      <Navbar
        user={user}
        appointments={appointments}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onLogout={onLogout}
        onCancelAppointment={onCancelAppointment}
      />

      {/* 🔍 SEARCH SECTION */}
      <div className="search-section">
        <div className="search-bar">
          <h1>Find Your Perfect Doctor</h1>
          <p>Book appointments with top-rated healthcare professionals</p>
          
          <div className="search-container">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      {/* 🎯 HERO BANNER */}
      <Banner />

      {/* 🩺 SPECIALTY FILTERS */}
      <section className="specialty-section">
        <div className="specialty-header">
          <h2>Browse by Specialty</h2>
          <p>Find doctors specialized in specific areas</p>
        </div>
        
        <div className="specialty-tabs">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              className={`specialty-tab ${selectedSpecialty === specialty ? 'active' : ''}`}
              onClick={() => {
                setSelectedSpecialty(specialty);
                setVisibleCount(4);
              }}
            >
              {specialty}
            </button>
          ))}
        </div>
      </section>

      {/* 🧑‍⚕️ DOCTOR LIST */}
      <section className="doctor-section">
        <div className="section-header">
          <h2>
            {selectedSpecialty === "All" ? "Our Expert Doctors" : `${selectedSpecialty} Specialists`}
          </h2>
          <p>Choose from our network of highly qualified medical professionals</p>
        </div>
        
        <div className="doctor-list">
          {displayedDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              user={user}
              onBook={() => setSelectedDoctor(doc)}
            />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="show-more-container">
            <button className="show-more-btn" onClick={handleShowMore}>
              Show More Doctors ({filteredDoctors.length - visibleCount} more)
            </button>
          </div>
        )}
      </section>

      {/* 📅 BOOKING MODAL */}
      {selectedDoctor && (
        <div className="modal-backdrop" onClick={() => setSelectedDoctor(null)}>
          <div className="booking-form" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment</h3>

            <div className="doctor-info">
              <p>{selectedDoctor.name}</p>
              <p>{selectedDoctor.specialization}</p>
            </div>

            <label>Select Date</label>
            <input 
              type="date" 
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />

            <div className="form-row">
              <div>
                <label>Select Time</label>
                <input 
                  type="time" 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
            </div>

            <button className="primary" onClick={confirmBooking}>
              Confirm Booking
            </button>

            <button className="secondary" onClick={() => {
              setSelectedDoctor(null);
              setBookingDate("");
              setBookingTime("");
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;
