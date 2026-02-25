import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AuthLayout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="auth-layout">
      <div className="auth-header">
        <div className="auth-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#0D9488"/>
            <path d="M20 10V30M10 20H30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span className="auth-brand">MediConnect</span>
        </div>
        <p className="auth-subtitle">Doctor Portal</p>
      </div>
      
      <div className="auth-container">
        {children}
      </div>

      <div className="auth-footer">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Register as Doctor</Link>
          </p>
        ) : (
          <p>
            Already registered?{' '}
            <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        )}
      </div>
    </div>
  );
}
