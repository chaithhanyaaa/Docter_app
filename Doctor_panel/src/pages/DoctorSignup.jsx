import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

function DoctorSignup() {
  const { loginDoctor } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    qualification: '',
    specialization: '',
    experience: '',
    imageUrl: ''
  })

  const [imagePreview, setImagePreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create a local URL for preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create doctor object
    const newDoctor = {
      id: Date.now(),
      name: formData.fullName,
      email: formData.email,
      qualification: formData.qualification,
      specialization: formData.specialization,
      experience: formData.experience,
      imageUrl: formData.imageUrl,
      status: 'PENDING',
      role: 'DOCTOR'
    }

    // Save doctor (mock - would be API call in production)
    loginDoctor(newDoctor)

    // Redirect to dashboard with message
    navigate('/dashboard', { state: { message: 'Your profile is under review. Admin approval required.' } })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Doctor Signup</h1>
        <p className="auth-subtitle">Create your doctor profile</p>

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
              name="fullName"
              className="form-input"
              value={formData.fullName}
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
          <button type="submit" className="btn btn-primary">
            Sign Up
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
