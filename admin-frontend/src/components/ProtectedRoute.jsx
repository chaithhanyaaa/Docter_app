import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ admin, children }) {
  if (!admin || admin.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return children;
}
