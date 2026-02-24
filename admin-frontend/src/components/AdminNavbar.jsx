import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminNavbar({ admin, onLogout }) {
	return (
		<header className="admin-nav">
			<div className="nav-left">
				<div className="brand">Admin Console</div>
				<nav className="links">
					<NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
					<NavLink to="/doctors" className={({isActive}) => isActive ? 'active' : ''}>Doctors</NavLink>
					<NavLink to="/banners" className={({isActive}) => isActive ? 'active' : ''}>Banners</NavLink>
				</nav>
			</div>
			<div className="nav-right">
				<div className="admin-info">{admin?.name} ({admin?.role})</div>
				<button className="btn btn-logout" onClick={onLogout}>Logout</button>
			</div>
		</header>
	);
}
