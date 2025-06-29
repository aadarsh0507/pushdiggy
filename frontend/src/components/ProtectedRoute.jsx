import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Add this line

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // You can return a loading spinner here

  if (!user) {
    return <Navigate to="/login" state={{ tab: requiredRole }} replace />;
  }

  if (user.status !== 'active') {
    return (
      <Navigate
        to="/login"
        state={{ error: 'Your account is deactivated. Please contact support.' }}
        replace
      />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" state={{ tab: user.role }} replace />;
  }

  return children;
};

export default ProtectedRoute;
