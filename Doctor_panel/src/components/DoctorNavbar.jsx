import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

function DoctorNavbar() {
  const { doctor, logoutDoctor } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutDoctor()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        Doctor Panel
      </NavLink>
      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/appointments"
          className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
        >
          Appointments
        </NavLink>
        <span style={{ color: 'white', margin: '0 0.5rem' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          Dr. {doctor?.name}
        </span>
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default DoctorNavbar
