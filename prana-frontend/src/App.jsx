import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorPortal from './pages/portals/DoctorPortal';
import PatientPortal from './pages/portals/PatientPortal';
import ResearcherPortal from './pages/portals/ResearcherPortal';
import GovPortal from './pages/portals/GovPortal';
import InvestigatorReviewPortal from './pages/portals/InvestigatorReviewPortal'; // <-- Newly added Investigator Review Portal
import TrialDetailPage from './pages/TrialDetailPage';
import PatientProfilePage from './pages/PatientProfilePage';
import DoctorProfilePage from './pages/DoctorProfilePage'; 

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('prana_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-ayurGreen-50/30 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Dynamic Trial Detail Route */}
              <Route path="/trials/:trialId" element={
                <ProtectedRoute>
                  <TrialDetailPage />
                </ProtectedRoute>
              } />

              {/* Protected Role-Based Portals */}
              <Route path="/doctor-portal" element={
                <ProtectedRoute>
                  <DoctorPortal />
                </ProtectedRoute>
              } />
              <Route path="/patient-portal" element={
                <ProtectedRoute>
                  <PatientPortal />
                </ProtectedRoute>
              } />
              <Route path="/researcher-portal" element={
                <ProtectedRoute>
                  <ResearcherPortal />
                </ProtectedRoute>
              } />
              <Route path="/gov-portal" element={
                <ProtectedRoute>
                  <GovPortal />
                </ProtectedRoute>
              } />
              
              {/* Newly Added IEC / Investigator Protocol Review Portal */}
              <Route path="/investigator-review" element={
                <ProtectedRoute>
                  <InvestigatorReviewPortal />
                </ProtectedRoute>
              } />

              {/* Protected Individual Patient & Doctor Profile Routes */}
              <Route path="/patient/:patientId" element={
                <ProtectedRoute>
                  <PatientProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/doctor/:doctorId" element={
                <ProtectedRoute>
                  <DoctorProfilePage />
                </ProtectedRoute>
              } />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}