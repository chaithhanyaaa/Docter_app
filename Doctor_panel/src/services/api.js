import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doctorToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('doctorToken')
      localStorage.removeItem('doctorData')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH APIs ====================

// Doctor Signup
export const signupDoctor = async (doctorData) => {
  const response = await api.post('/doctors/signup', doctorData)
  return response.data
}

// Doctor Login
export const loginDoctor = async (credentials) => {
  const response = await api.post('/doctor-auth/login', {
    email: credentials.email,
    password: credentials.password
  })
  return response.data // plain JWT string
}

// ==================== APPOINTMENT APIs ====================

// Get all appointments for logged in doctor
export const fetchDoctorAppointments = async () => {
  const response = await api.get('/appointments/doctor')
  return response.data
}

// Accept an appointment
export const acceptAppointment = async (appointmentId) => {
  const response = await api.put(`/appointments/${appointmentId}/accept`)
  return response.data
}

// Reject an appointment
export const rejectAppointment = async (appointmentId) => {
  const response = await api.put(`/appointments/${appointmentId}/reject`)
  return response.data
}

// Get stored token
export const getToken = () => localStorage.getItem('doctorToken')

// Store token and doctor data
export const storeAuthData = (token, doctorData) => {
  localStorage.setItem('doctorToken', token)
  localStorage.setItem('doctorData', JSON.stringify(doctorData))
}

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('doctorToken')
  localStorage.removeItem('doctorData')
}

// Get stored doctor data
export const getStoredDoctor = () => {
  const data = localStorage.getItem('doctorData')
  return data ? JSON.parse(data) : null
}

// Fetch doctor profile
export const fetchDoctorProfile = async () => {
  const response = await api.get('/doctors/me')
  return response.data
}

export default api