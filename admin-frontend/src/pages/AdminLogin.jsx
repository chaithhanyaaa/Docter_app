import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      // Token could be returned as plain text (direct) or in JSON format
      let token = response.data;
      
      // If token is not a string (e.g., it's a JSON object), try to extract it
      if (typeof token !== 'string') {
        const data = response.data;
        token = data.token || data.data?.token || data.accessToken || data.jwt;
      }
      
      if (!token || typeof token !== 'string') {
        throw new Error('No token received from server');
      }
      
      // Save token to localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify({ email }));
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin({ email });
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <form className="card login-card" onSubmit={submit}>
        <h2>Admin Login</h2>
        <label>Email</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          type="email" 
          placeholder="admin@example.com"
          required 
        />
        <label>Password</label>
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          type="password" 
          placeholder="Enter your password"
          required 
        />
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}