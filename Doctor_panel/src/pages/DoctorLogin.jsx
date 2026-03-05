import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { loginDoctor as loginDoctorAPI, storeAuthData } from '../services/api'

function DoctorLogin() {
  const { loginDoctor } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginDoctorAPI({
        email: formData.email,
        password: formData.password
      })

      // Backend returns plain JWT string directly
      const token = typeof response === 'string' ? response : response.token

      if (!token) {
        throw new Error('Invalid server response - no token received')
      }

      // Store token
      storeAuthData(token, { email: formData.email })

      // Update auth context
      loginDoctor({ email: formData.email })

      // Redirect to dashboard
      navigate('/dashboard')

    } catch (err) {
      console.error('Login error:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Invalid email or password'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Doctor Login</h1>
        <p className="auth-subtitle">Access your doctor panel</p>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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