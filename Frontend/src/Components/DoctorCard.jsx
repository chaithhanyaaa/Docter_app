function DoctorCard({ doctor, user, onBook }) {
  const handleBookClick = () => {
    if (!user) {
      alert("Please login to book an appointment");
      return;
    }
    onBook();
  };

  // Handle image - use base64 imageData if available, otherwise fallback
  const getImageSrc = () => {
    if (doctor.imageData) {
      return `data:image/jpeg;base64,${doctor.imageData}`;
    }
    return "/Fallback-img.jpeg";
  };

  // Get experience level text
  const getExperienceLevel = (years) => {
    if (years >= 15) return "Expert";
    if (years >= 10) return "Senior";
    if (years >= 5) return "Experienced";
    return "Professional";
  };

  return (
    <div className="doctor-card">
      <div className="doctor-card-image">
        <img
          src={getImageSrc()}
          alt={doctor.name}
          onError={(e) => {
            e.target.src = "/Fallback-img.jpeg";
          }}
        />
        <div className="doctor-card-badge">
          <span className="available-dot"></span>
          Available
        </div>
        <div className="experience-badge">
          {doctor.experience}+ Years
        </div>
      </div>

      <div className="doctor-card-content">
        <div className="doctor-card-header">
          <h3>{doctor.name}</h3>
          <span className="experience-level">{getExperienceLevel(doctor.experience)}</span>
        </div>
        
        <p className="doctor-specialization">{doctor.specialization}</p>
        <p className="doctor-qualification">{doctor.qualification}</p>
        
        <div className="doctor-details">
          <div className="detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>{doctor.experience} Years Experience</span>
          </div>
          {doctor.hospital && (
            <div className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v13.5a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>{doctor.hospital}</span>
            </div>
          )}
          {doctor.fees && (
            <div className="detail-item fees">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>₹{doctor.fees}</span>
            </div>
          )}
        </div>

        <button className="doctor-card-btn" onClick={handleBookClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
