import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import API from "../api/axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Get token from response - handle both string and object formats
      let token;
      if (typeof response.data === 'string') {
        // Token is returned directly as a string
        token = response.data;
      } else if (response.data.token) {
        // Token is in response.data.token
        token = response.data.token;
      } else {
        throw new Error("Invalid response format");
      }
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Decode JWT to get user info
      let userName = 'User';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Try to get name from various possible fields
        userName = payload.name || payload.fullName || payload.userName || payload.firstName || email.split('@')[0];
      } catch (e) {
        console.log('Could not decode JWT, using email as name');
        userName = email.split('@')[0];
      }
      
      const userData = {
        id: 1,
        name: userName,
        email: email,
        token: token
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Call onLogin and navigate
      onLogin(userData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar user={null} onLogout={() => {}} />
      
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to book your appointments</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: 'var(--medical-green)', fontWeight: '600' }}>
              Sign Up
            </Link>
          </p>

          <div className="back-home">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
