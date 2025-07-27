import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const location = useLocation();
  const errorLocation = location.state?.error;
  const tabFromLocation = location.state?.tab;

  const [activeTab, setActiveTab] = useState(tabFromLocation || 'client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Set tab from location only once (on first mount)
  useEffect(() => {
    if (tabFromLocation) {
      setActiveTab(tabFromLocation);
    }
  }, []); // Empty dependency to run only on first render

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password, activeTab);
      console.log('LOGIN RESULT:', result);

      if (result.success) {
        const { user } = result;
        console.log("USER INFO:", user);
        console.log("User Status:", user.status);

        // Prevent login if user role doesn't match active tab
        if (user.role !== activeTab) {
          setError(`You are trying to log in as ${activeTab}, but your account is a ${user.role}.`);
          setIsLoading(false);
          return;
        }

        // Check deactivation only for clients
        if (user.status && user.status !== 'active' && user.role === 'client') {
          setError('Your account is deactivated. Please contact support.');
          setIsLoading(false);
          return;
        }

        // Navigate to respective dashboard
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/client-dashboard');
        }

        setIsLoading(false);
      } else {
        setError(result.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      activeTab === 'client' 
        ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' 
        : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
    }`}>
      <div className="max-w-md w-full">
        <div className={`rounded-2xl shadow-2xl p-8 backdrop-blur-sm ${
          activeTab === 'client' 
            ? 'bg-white/90 border border-blue-200' 
            : 'bg-white/90 border border-emerald-200'
        }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              activeTab === 'client' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
            }`}>
              {activeTab === 'client' ? (
                <User className="h-8 w-8 text-white" />
              ) : (
                <Shield className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${
              activeTab === 'client' ? 'text-blue-900' : 'text-emerald-900'
            }`}>
              Welcome Back
            </h2>
            <p className={`text-lg ${
              activeTab === 'client' ? 'text-blue-600' : 'text-emerald-600'
            }`}>
              Sign in as {activeTab === 'client' ? 'Client' : 'Admin'}
            </p>
          </div>

          <div className={`flex rounded-xl p-1 mb-8 ${
            activeTab === 'client' 
              ? 'bg-blue-100' 
              : 'bg-emerald-100'
          }`}>
            <button
              type="button"
              onClick={() => handleTabSwitch('client')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'client' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Client Login
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105' 
                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              Admin Login
            </button>
          </div>

          {(error || errorLocation) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error || errorLocation}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${
                activeTab === 'client' ? 'text-blue-700' : 'text-emerald-700'
              }`}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:border-transparent ${
                  activeTab === 'client' 
                    ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${
                activeTab === 'client' ? 'text-blue-700' : 'text-emerald-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 pr-12 focus:ring-2 focus:border-transparent ${
                    activeTab === 'client' 
                      ? 'border-blue-200 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    activeTab === 'client' ? 'text-blue-400 hover:text-blue-600' : 'text-emerald-400 hover:text-emerald-600'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 focus:ring-2 border-gray-300 rounded ${
                    activeTab === 'client' ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'
                  }`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                  activeTab === 'client' ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className={`hover:underline ${
                  activeTab === 'client' ? 'text-blue-600 hover:text-blue-500' : 'text-emerald-600 hover:text-emerald-500'
                }`}>
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : activeTab === 'client'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg'
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${activeTab === 'admin' ? 'Admin' : 'Client'}`
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p>
              Don’t have an account?{' '}
              {activeTab === 'admin' ? (
                <Link to="/register/admin" className={`font-semibold hover:underline ${
                  activeTab === 'client' ? 'text-blue-700 hover:text-blue-800' : 'text-emerald-700 hover:text-emerald-800'
                }`}>
                  Register as Admin
                </Link>
              ) : (
                <Link to="/register" className={`font-semibold hover:underline ${
                  activeTab === 'client' ? 'text-blue-700 hover:text-blue-800' : 'text-emerald-700 hover:text-emerald-800'
                }`}>
                  Register as Client
                </Link>
              )}
            </p>
            <p className={`mt-2 ${
              activeTab === 'client' ? 'text-blue-600' : 'text-emerald-600'
            }`}>
              Need help?{' '}
              <a href="#" className={`font-semibold hover:underline ${
                activeTab === 'client' ? 'text-blue-700 hover:text-blue-800' : 'text-emerald-700 hover:text-emerald-800'
              }`}>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
