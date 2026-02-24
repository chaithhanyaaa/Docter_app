import React, { useState } from 'react';

export default function Doctors({ doctors, approveDoctor, deleteDoctor }) {
  const [busy, setBusy] = useState(null);

  const handleApprove = async (id) => {
    setBusy(id);
    try {
      await approveDoctor(id);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    setBusy(id);
    try {
      await deleteDoctor(id);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page doctors-page">
      <h1>Manage Doctors</h1>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.specialization}</td>
                <td>{d.experience} yrs</td>
                <td>{d.status}</td>
                <td>
                  {d.status === 'PENDING' && (
                    <button className="btn" onClick={() => handleApprove(d.id)} disabled={busy===d.id}>Approve</button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(d.id)} disabled={busy===d.id}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
