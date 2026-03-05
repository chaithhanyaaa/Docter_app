import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Navbar({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  
  // Listen for changes to localStorage (for when user logs in from another component)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && !user) {
        // User was set but prop not updated
        window.location.reload();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
    setShowProfile(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="DocBook" className="logo" />
        </Link>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2>DocBook</h2>
        </Link>
      </div>

      <div>
        {user ? (
          <div className="profile-container">
            <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
              <span className="profile-icon">👤</span>
              <span className="profile-name">{user.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">👤</div>
                  <div className="profile-info">
                    <h4>{user.name || 'User'}</h4>
                    <p>{user.email || ''}</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <Link 
                  to="/my-appointments" 
                  className="dropdown-item"
                  onClick={() => setShowProfile(false)}
                >
                  📅 My Appointments
                </Link>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/signup" className="nav-btn signup-btn">
              Sign Up
            </Link>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
