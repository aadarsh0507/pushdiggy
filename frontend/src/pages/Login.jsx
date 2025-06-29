import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => handleTabSwitch('client')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'client' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Client Login
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4 mr-2" />
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Don’t have an account?{' '}
              {activeTab === 'admin' ? (
                <Link to="/register/admin" className="text-blue-600 hover:text-blue-500">
                  Register as Admin
                </Link>
              ) : (
                <Link to="/register" className="text-blue-600 hover:text-blue-500">
                  Register as Client
                </Link>
              )}
            </p>
            <p className="mt-2">
              Need help?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
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
