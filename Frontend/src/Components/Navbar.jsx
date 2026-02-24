import { useState } from "react";
import logo from "../assets/logo.jpg";

function Navbar({ user, appointments, onLoginClick, onSignupClick, onLogout, onCancelAppointment }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="DocBook" className="logo" />
        <h2>DocBook</h2>
      </div>

      <div>
        {user ? (
          <div className="profile-container">
            <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
              <span className="profile-icon">👤</span>
              <span className="profile-name">{user.name}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">👤</div>
                  <div className="profile-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-section">
                  <h5>📅 My Appointments ({appointments.length})</h5>
                  {appointments.length === 0 ? (
                    <p className="no-appointments">No appointments yet</p>
                  ) : (
                    <div className="appointment-list">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="appointment-item">
                          <div className="apt-info">
                            <strong>{apt.doctor.name}</strong>
                            <span>{apt.date} at {apt.time}</span>
                            <span className="apt-status">{apt.status}</span>
                          </div>
                          <button 
                            className="cancel-btn"
                            onClick={() => onCancelAppointment(apt.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout-btn" onClick={() => {
                  onLogout();
                  setShowProfile(false);
                }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="nav-btn signup-btn" onClick={onSignupClick}>
              Sign Up
            </button>
            <button className="nav-btn" onClick={onLoginClick}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
