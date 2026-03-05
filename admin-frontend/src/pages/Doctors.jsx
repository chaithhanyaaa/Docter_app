import React, { useState, useEffect } from 'react';
import { doctorsAPI } from '../services/api';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      const doctorsData = Array.isArray(response.data) ? response.data : (response.data.data || response.data.doctors || []);
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Doctors fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load doctors. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setBusy(id);
    try {
      await doctorsAPI.approve(id);
      setDoctors(prev => prev.map(d => d.doctorId === id ? { ...d, status: 'APPROVED' } : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve doctor');
    } finally {
      setBusy(null);
    }
  };

  const handleDisapprove = async (id) => {
    setBusy(id);
    try {
      await doctorsAPI.disapprove(id);
      setDoctors(prev => prev.map(d => d.doctorId === id ? { ...d, status: 'PENDING' } : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to disapprove doctor');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    setBusy(id);
    try {
      await doctorsAPI.delete(id);
      setDoctors(prev => prev.filter(d => d.doctorId !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="page doctors-page">
        <h1>Manage Doctors</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page doctors-page">
        <h1>Manage Doctors</h1>
        <div className="error" style={{ padding: '20px', background: '#fee', borderRadius: '8px' }}>
          <strong>Error:</strong> {error}
          <br /><br />
          <small>Make sure the backend server is running at http://localhost:8080</small>
        </div>
      </div>
    );
  }

  return (
    <div className="page doctors-page">
      <h1>Manage Doctors</h1>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.doctorId}>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.specialization}</td>
                <td>
                  <span className={`status status-${d.status?.toLowerCase()}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  {d.status === 'PENDING' && (
                    <button
                      className="btn"
                      onClick={() => handleApprove(d.doctorId)}
                      disabled={busy === d.doctorId}
                    >
                      Approve
                    </button>
                  )}
                  {d.status === 'APPROVED' && (
                    <button
                      className="btn btn-warning"
                      onClick={() => handleDisapprove(d.doctorId)}
                      disabled={busy === d.doctorId}
                    >
                      Disapprove
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(d.doctorId)}
                    disabled={busy === d.doctorId}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {doctors.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            No doctors found
          </div>
        )}
      </div>
    </div>
  );
}