import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import DoctorCard from "../Components/DoctorCard";
import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import API from "../api/axios";

function Home({ user, onLogout }) {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await API.get('/doctors');
        // Filter only approved doctors
        const approvedDoctors = response.data.filter(d => d.status === 'APPROVED');
        setDoctors(approvedDoctors);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = ["All", ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors
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

  const handleBookClick = (doctor) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/book/${doctor.doctorId}`);
  };

  return (
    <div>
      {/* 🔝 NAVBAR */}
      <Navbar
        user={user}
        onLogout={onLogout}
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

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <div className="doctor-list">
              {displayedDoctors.map((doc) => (
                <DoctorCard
                  key={doc.doctorId}
                  doctor={doc}
                  user={user}
                  onBook={() => handleBookClick(doc)}
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
          </>
        )}
      </section>

      {/* 🔻 FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;
