import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

function DoctorLogin() {
  const { loginDoctor, doctor } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Mock authentication (no backend yet)
    // In production, this would be an API call
    if (formData.email && formData.password) {
      // Create auth object
      const doctorAuth = {
        id: Date.now(),
        name: formData.email.split('@')[0], // Mock name from email
        email: formData.email,
        role: 'DOCTOR',
        status: doctor?.status || 'PENDING',
        qualification: doctor?.qualification || '',
        specialization: doctor?.specialization || '',
        experience: doctor?.experience || '',
        imageUrl: doctor?.imageUrl || ''
      }

      // Login doctor
      loginDoctor(doctorAuth)

      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      setError('Please enter email and password')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Doctor Login</h1>
        <p className="auth-subtitle">Access your doctor panel</p>

        {error && (
          <div className="warning-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorLogin
