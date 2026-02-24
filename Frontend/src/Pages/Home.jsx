import { useState } from "react";
import Navbar from "../Components/Navbar";
import DoctorCard from "../Components/DoctorCard";
import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import doctors from "../Data/doctors";

function Home({ user, onLoginClick, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // ✅ ONLY APPROVED DOCTORS + SEARCH
  const filteredDoctors = doctors
    .filter((d) => d.status === "APPROVED")
    .filter(
      (d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      {/* 🔝 NAVBAR */}
      <Navbar
        user={user}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctor or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🎯 HERO BANNER */}
      <Banner />

      {/* 🧑‍⚕️ DOCTOR LIST */}
      <section className="doctor-list">
        {filteredDoctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            user={user}
            onBook={() => setSelectedDoctor(doc)}
          />
        ))}
      </section>

      {/* 📅 BOOKING MODAL */}
      {selectedDoctor && (
        <div className="booking-form">
          <h3>Book Appointment</h3>

          <p>
            <strong>Doctor:</strong> {selectedDoctor.name}
          </p>

          <input type="date" />
          <input type="time" />

          <button
            onClick={() => {
              alert("Appointment submitted (backend later)");
              setSelectedDoctor(null);
            }}
          >
            Confirm
          </button>

          <button className="secondary" onClick={() => setSelectedDoctor(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;