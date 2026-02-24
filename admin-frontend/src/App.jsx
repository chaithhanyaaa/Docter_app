import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Banners from './pages/Banners';
import initialDoctors from './data/doctors';
import initialBanners from './data/banners';
import './App.css';

export default function App(){
  const [admin, setAdmin] = useState(null);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [banners, setBanners] = useState(initialBanners);

  const login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) return reject(new Error('Invalid credentials'));
        const fake = { id: String(Date.now()), name: 'Admin User', role: 'ADMIN', email };
        setAdmin(fake);
        resolve(fake);
      }, 400);
    });
  };

  const logout = () => setAdmin(null);

  const approveDoctor = id => new Promise(resolve => {
    setTimeout(() => {
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'APPROVED' } : d));
      resolve();
    }, 300);
  });

  const deleteDoctor = id => new Promise(resolve => {
    setTimeout(() => {
      setDoctors(prev => prev.filter(d => d.id !== id));
      resolve();
    }, 300);
  });

  const toggleBanner = id => new Promise(resolve => {
    setTimeout(() => {
      setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
      resolve();
    }, 300);
  });

  const deleteBanner = id => new Promise(resolve => {
    setTimeout(() => {
      setBanners(prev => prev.filter(b => b.id !== id));
      resolve();
    }, 300);
  });

  return (
    <div className="app-root">
      {admin && <AdminNavbar admin={admin} onLogout={logout} />}
      <main className="container">
        <Routes>
          <Route path="/login" element={<AdminLogin onLogin={login} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute admin={admin}>
              <Dashboard doctors={doctors} />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute admin={admin}>
              <Doctors doctors={doctors} approveDoctor={approveDoctor} deleteDoctor={deleteDoctor} />
            </ProtectedRoute>
          } />
          <Route path="/banners" element={
            <ProtectedRoute admin={admin}>
              <Banners banners={banners} toggleBanner={toggleBanner} deleteBanner={deleteBanner} />
            </ProtectedRoute>
          } />
          <Route path="/" element={admin ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
