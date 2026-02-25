// Mock appointment data
// This will be replaced with API calls in the future

export const initialAppointments = [
  {
    id: 1,
    patientName: 'John Smith',
    date: '2026-02-26',
    timeSlot: '09:00 AM',
    status: 'PENDING'
  },
  {
    id: 2,
    patientName: 'Emily Johnson',
    date: '2026-02-26',
    timeSlot: '10:30 AM',
    status: 'PENDING'
  },
  {
    id: 3,
    patientName: 'Michael Brown',
    date: '2026-02-27',
    timeSlot: '11:00 AM',
    status: 'ACCEPTED'
  },
  {
    id: 4,
    patientName: 'Sarah Davis',
    date: '2026-02-27',
    timeSlot: '02:00 PM',
    status: 'PENDING'
  },
  {
    id: 5,
    patientName: 'Robert Wilson',
    date: '2026-02-28',
    timeSlot: '09:30 AM',
    status: 'PENDING'
  },
  {
    id: 6,
    patientName: 'Jennifer Martinez',
    date: '2026-02-28',
    timeSlot: '03:30 PM',
    status: 'ACCEPTED'
  }
]

// Simulated API calls
export const fetchAppointments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...initialAppointments])
    }, 300)
  })
}

export const acceptAppointment = (appointmentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, appointmentId })
    }, 300)
  })
}
