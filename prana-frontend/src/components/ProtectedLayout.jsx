import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedLayout({ allowedRole }) {
  // Simulated auth check (in production, read from localStorage or React Context user state)
  const userToken = localStorage.getItem('prana_token') || 'simulated_token';
  const userRole = localStorage.getItem('prana_role') || allowedRole; // defaults to allowed for hackathon simulation

  if (!userToken) {
    // Redirect to login if unauthenticated
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and doesn't match
  if (allowedRole && userRole !== allowedRole && userRole !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 dark:bg-gray-800 border border-red-200 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Access Denied</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Your current account role does not have permission to access this secure portal.
        </p>
      </div>
    );
  }

  return <Outlet />;
}