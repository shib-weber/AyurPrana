import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('prana_token');
  const role = localStorage.getItem('prana_role');
  const username = localStorage.getItem('prana_username');

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getPortalRoute = () => {
    if (role === 'doctor') return '/doctor-portal';
    if (role === 'patient') return '/patient-portal';
    if (role === 'researcher') return '/researcher-portal';
    if (role === 'gov_official') return '/gov-portal';
    if (role === 'gov_investigator') return '/investigator-review';
    return '/';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title (Using public/logo.png) */}
        <Link to="/" className="flex items-center space-x-2.5" onClick={() => setMobileMenuOpen(false)}>
          <img 
            src="/logo.png" 
            alt="AyurPrana Logo" 
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-lg shrink-0" 
          />
          <span className="font-bold text-lg sm:text-xl text-emerald-800 dark:text-white tracking-wide">AyurPrana</span>
          <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-medium hidden xs:inline-block">
            AIIA CTMS
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 font-medium text-sm transition">
            Home
          </Link>
          
          {token ? (
            <>
              <Link 
                to={getPortalRoute()} 
                className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center space-x-1.5 bg-emerald-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg max-w-[200px] truncate"
                title={`${username ? username.toUpperCase() : 'Portal'} (${role})`}
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{username ? username.toUpperCase() : 'Portal'} ({role})</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1.5 rounded-lg bg-red-50 dark:bg-gray-700 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 font-medium text-sm transition">
                Login
              </Link>
              <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition">
                Register
              </Link>
            </>
          )}
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Action Controls (Theme Toggle + Menu Toggle) */}
        <div className="flex items-center space-x-2 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link 
                to={getPortalRoute()} 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-gray-700"
              >
                <User className="h-5 w-5" />
                <span className="truncate">{username ? username.toUpperCase() : 'Portal'} ({role})</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-red-600 bg-red-50 dark:bg-gray-700 transition text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}