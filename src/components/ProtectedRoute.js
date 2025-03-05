// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirige a la página de login si no hay token
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
