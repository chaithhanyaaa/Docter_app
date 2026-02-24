import React, { useEffect, useState } from 'react';
import DoctorNavbar from '../components/DoctorNavbar';
import { fetchAppointments, acceptAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile, setProfile } = useAuth();

  useEffect(() => {
    let mounted = true;
    fetchAppointments().then(data => {
      if (mounted) setAppointments(data);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  async function handleAccept(id) {
    await acceptAppointment(id);
    const updated = await fetchAppointments();
    setAppointments(updated);
  }

  const disabled = !profile || profile.status === 'PENDING';

  return (
    <div className="app-root">
      <DoctorNavbar />
      <main className="container">
        <div className="card">
          <h3>Appointments</h3>
          {profile && profile.status === 'PENDING' && (
            <div className="notice">Your account is pending approval. Accept actions are disabled.</div>
          )}

          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>{a.status}</td>
                    <td>
                      <button className="btn" onClick={() => handleAccept(a.id)} disabled={disabled || a.status === 'ACCEPTED'}>
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
