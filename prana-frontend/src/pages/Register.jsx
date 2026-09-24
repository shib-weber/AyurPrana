import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRegister } from '../services/api';
import { UserPlus, CheckCircle, AlertCircle, ShieldCheck, Activity, Database, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'doctor',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiRegister({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        full_name: formData.full_name.trim()
      });

      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-emerald-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Branding Panel (Desktop Sidebar) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 to-emerald-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Join AyurPrana CTMS</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Secure regulatory platform for AIIA clinical portfolios, CDISC standards, and NPvCC pharmacovigilance tracking.
            </p>
          </div>

          <div className="relative z-10 hidden lg:space-y-3 lg:block pt-6">
            <div className="flex items-center space-x-3 text-xs text-emerald-200">
              <Activity className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Real-time AE/SAE safety reporting</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-emerald-200">
              <Database className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-centre trial synchronization</span>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-xs text-emerald-300">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold underline hover:text-emerald-200">
              Login here
            </Link>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Prana Account</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-xl text-xs sm:text-sm flex items-center space-x-2 border border-red-200 dark:border-red-900">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs sm:text-sm flex items-center space-x-2 border border-emerald-200 dark:border-emerald-900">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})} 
                  required 
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                  placeholder="First & Last Name" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  required 
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                  placeholder="userhandle" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                  placeholder="email@mail.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Role Portal</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                >
                  <option value="doctor">Doctor / Investigator</option>
                  <option value="patient">Patient</option>
                  <option value="researcher">Researcher / Data Manager</option>
                  <option value="gov_official">Government Official / Regulator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Registering...' : 'Register Securely'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 lg:hidden">
            Already have an account? <Link to="/login" className="text-emerald-600 font-medium hover:underline">Login here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}