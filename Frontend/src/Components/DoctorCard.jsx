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
      <img
        src={doctor.imageUrl}
        alt={doctor.name}
        onError={(e) => {
          e.target.src = "/fallback-doctor.png";
        }}
      />

      <h3>{doctor.name}</h3>
      <p>{doctor.specialization}</p>
      <p>{doctor.experience} years experience</p>

      <button onClick={handleBookClick}>
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;