import React from 'react';

export default function Dashboard({ doctors }) {
  const total = doctors.length;
  const pending = doctors.filter(d => d.status === 'PENDING').length;
  const approved = doctors.filter(d => d.status === 'APPROVED').length;

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Doctors</div>
        </div>
        <div className="stat">
          <div className="stat-value">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat">
          <div className="stat-value">{approved}</div>
          <div className="stat-label">Approved</div>
        </div>
      </div>
    </div>
  );
}
