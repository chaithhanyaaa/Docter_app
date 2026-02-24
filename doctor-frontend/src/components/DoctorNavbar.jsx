import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DoctorNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="brand">MediPanel</div>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/appointments" className="nav-link">Appointments</NavLink>
      </div>
      <div className="nav-right">
        {user && <span className="nav-user">{user.name}</span>}
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
