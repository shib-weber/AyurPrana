import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin, apiGetProfile } from '../services/api';
import { Lock, AlertCircle, ShieldCheck, Activity, ArrowRight, UserCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin(username, password);
      localStorage.setItem('prana_token', data.access_token);

      // Fetch user profile to get role
      const profile = await apiGetProfile(data.access_token);
      localStorage.setItem('prana_role', profile.role);
      localStorage.setItem('prana_username', profile.username);

      // Route based on real backend role
      if (profile.role === 'doctor') navigate('/doctor-portal');
      else if (profile.role === 'patient') navigate('/patient-portal');
      else if (profile.role === 'researcher') navigate('/researcher-portal');
      else if (profile.role === 'gov_official') navigate('/gov-portal');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
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
            <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back to Prana</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Log in to access your secure AIIA portal, monitor clinical trial metrics, and review NPvCC safety updates.
            </p>
          </div>

          <div className="relative z-10 hidden lg:space-y-3 lg:block pt-6">
            <div className="flex items-center space-x-3 text-xs text-emerald-200">
              <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Role-based clinical access</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-emerald-200">
              <Activity className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Encrypted audit-ready sessions</span>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-xs text-emerald-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold underline hover:text-emerald-200">
              Register here
            </Link>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Secure Login</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-xl text-xs sm:text-sm flex items-center space-x-2 border border-red-200 dark:border-red-900">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                className="w-full px-3.5 py-2.5 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                placeholder="e.g. userhandle" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-3.5 py-2.5 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-5 lg:hidden">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-medium hover:underline">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
}