import React from 'react';
import DoctorNavbar from '../components/DoctorNavbar';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboard() {
  const { user, profile } = useAuth();

  return (
    <div className="app-root">
      <DoctorNavbar />
      <main className="container">
        <div className="card">
          <div className="profile-grid">
            <div className="profile-image">
              {profile && profile.imageUrl ? (
                <img src={profile.imageUrl} alt="doctor" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
            </div>
            <div className="profile-info">
              <h2>{user ? user.name : 'Doctor'}</h2>
              <p><strong>Email:</strong> {user ? user.email : '-'}</p>
              <p><strong>Specialization:</strong> {profile ? profile.specialization : '-'}</p>
              <p><strong>Experience:</strong> {profile ? `${profile.experience} years` : '-'}</p>
              <p><strong>Status:</strong> <span className={profile && profile.status === 'PENDING' ? 'status-pending' : 'status-approved'}>{profile ? profile.status : 'UNKNOWN'}</span></p>
              {profile && profile.status === 'PENDING' && (
                <div className="notice">Your profile is under review. Some actions are disabled until approval.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
