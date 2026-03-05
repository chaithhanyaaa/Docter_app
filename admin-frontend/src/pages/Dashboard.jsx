import React, { useState, useEffect } from 'react';
import { doctorsAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      // Handle different response structures
      const doctors = Array.isArray(response.data) ? response.data : (response.data.data || response.data.doctors || []);
      
      setStats({
        total: doctors.length,
        pending: doctors.filter(d => d.status === 'PENDING').length,
        approved: doctors.filter(d => d.status === 'APPROVED').length,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page dashboard-page">
        <h1>Dashboard</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page dashboard-page">
        <h1>Dashboard</h1>
        <div className="error" style={{ padding: '20px', background: '#fee', borderRadius: '8px' }}>
          <strong>Error:</strong> {error}
          <br /><br />
          <small>Make sure the backend server is running at http://localhost:8080</small>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Doctors</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
      </div>
    </div>
  );
}
