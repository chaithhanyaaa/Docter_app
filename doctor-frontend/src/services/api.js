// Mock API service - backend-ready signatures
import mockAppointments from '../data/appointments';

let doctors = [];

export async function signupDoctor(data) {
  const id = Date.now().toString();
  const doctor = {
    id,
    name: data.name,
    email: data.email,
    specialization: data.specialization,
    experience: data.experience,
    imageUrl: data.imageUrl || null,
    status: 'PENDING',
  };
  // keep password only in internal store (simulates DB)
  doctors.push({ ...doctor, password: data.password });
  return doctor;
}

export async function loginDoctor({ email, password }) {
  // Simulate credential check against stored doctors
  const found = doctors.find(d => d.email === email && d.password === password);
  if (found) {
    return {
      user: { id: found.id, name: found.name, role: 'DOCTOR', email: found.email },
      profile: { ...found },
    };
  }

  // Fake login for development: allow login without signup
  const id = Date.now().toString();
  const user = { id, name: email.split('@')[0], role: 'DOCTOR', email };
  return { user, profile: null };
}

export async function fetchAppointments() {
  // Return a cloned copy to avoid accidental external mutation
  return mockAppointments.map(a => ({ ...a }));
}

export async function acceptAppointment(appointmentId) {
  const appt = mockAppointments.find(a => a.id === appointmentId);
  if (appt) {
    appt.status = 'ACCEPTED';
    return { ...appt };
  }
  throw new Error('Appointment not found');
}
