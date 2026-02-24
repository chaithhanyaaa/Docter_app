import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { signupDoctor } from '../services/api';

export default function DoctorSignup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
      
      const doctorData = {
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        experience: form.experience,
        imageUrl
      };

      await signupDoctor(doctorData);

      navigate('/login', { 
        state: { message: 'Your profile is under review and will be visible after admin approval.' }
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-container">
        <h1 className="auth-title">Create Doctor Account</h1>
        <p className="auth-description">Register to access the doctor portal</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dr. John Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="doctor@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <select
              id="specialization"
              name="specialization"
              value={form.specialization}
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
              <option value="Gynecology">Gynecology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="ENT">ENT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
              placeholder="e.g., 5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Profile Image (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
