import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import BookAppointment from "./Pages/BookAppointment";
import MyAppointments from "./Pages/MyAppointments";
import { isTokenExpired, clearAuthData, getAuthUser } from "./utils/auth";
import "./App.css";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for existing token and user on load
  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Check if token exists and if it's expired
    if (token && isTokenExpired(token)) {
      // Token is expired, clear auth data and redirect to login
      console.log('Token expired, logging out...');
      clearAuthData();
      navigate('/login');
      return;
    }
    
    // Token is valid or doesn't exist, try to get user data
    const userData = getAuthUser();
    if (userData) {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      {/* Home Page - Public */}
      <Route 
        path="/" 
        element={
          <Home 
            user={user} 
            onLogout={handleLogout}
          />
        } 
      />

      {/* Login Page */}
      <Route 
        path="/login" 
        element={
          <Login 
            onLogin={handleLogin}
          />
        } 
      />

      {/* Signup Page */}
      <Route 
        path="/signup" 
        element={
          <Signup 
            onSignup={() => navigate('/login')}
          />
        } 
      />

      {/* Book Appointment Page - Protected */}
      <Route 
        path="/book/:doctorId" 
        element={
          <ProtectedRoute>
            <BookAppointment user={user} />
          </ProtectedRoute>
        } 
      />

      {/* My Appointments Page - Protected */}
      <Route 
        path="/my-appointments" 
        element={
          <ProtectedRoute>
            <MyAppointments user={user} onCancel={() => {}} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
