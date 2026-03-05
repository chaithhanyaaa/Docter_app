import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupDoctor } from '../services/api'

function DoctorSignup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    qualification: '',
    specialization: '',
    experience: '',
    image: ''
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Create a local URL for preview
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)

        // Convert to base64
        const base64 = await convertToBase64(file)
        setFormData(prev => ({
          ...prev,
          image: base64
        }))
      } catch (error) {
        console.error('Error converting image:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Prepare signup data
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: formData.experience,
        image: formData.image
      }

      // Call signup API
      await signupDoctor(signupData)

      // Show success message
      alert('Your account is pending admin approval')

      // Redirect to login
      navigate('/login')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.response?.data?.message || err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Doctor Signup</h1>
        <p className="auth-subtitle">Create your doctor profile</p>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="form-group">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-file"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

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

          {/* Qualification */}
          <div className="form-group">
            <label className="form-label">Qualification</label>
            <select
              name="qualification"
              className="form-select"
              value={formData.qualification}
              onChange={handleChange}
              required
            >
              <option value="">Select qualification</option>
              <option value="MBBS">MBBS</option>
              <option value="MD">MD</option>
              <option value="MS">MS</option>
              <option value="DM">DM</option>
              <option value="MCh">MCh</option>
              <option value="DNB">DNB</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select
              name="specialization"
              className="form-select"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">Select specialization</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Surgery">Surgery</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="ENT">ENT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Years of Experience */}
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="experience"
              className="form-input"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
              placeholder="Enter years of experience"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-links">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorSignup
