function DoctorCard({ doctor, user, onBook }) {
  const handleBookClick = () => {
    if (!user) {
      alert("Please login to book an appointment");
      return;
    }
    onBook();
  };

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          onError={(e) => {
            e.target.src = "/Fallback-img.jpeg";
          }}
        />
        <span className="card-badge">Available</span>
      </div>

      <div className="card-content">
        <h3>{doctor.name}</h3>
        <p className="specialization">{doctor.specialization}</p>
        <p className="experience">💼 {doctor.experience} Years Experience</p>

        <button className="card-btn" onClick={handleBookClick}>
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
