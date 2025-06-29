import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();
const USER_KEY = 'PushDiggy_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      let endpoint = '/client/login';
      if (expectedRole === 'admin') endpoint = '/admin/login';
      const res = await api.post(endpoint, { email, password });

      if (!res.data.user) {
        return { success: false, error: res.data.message || 'Login failed' };
      }

      if (expectedRole && res.data.user.role !== expectedRole) {
        return { success: false, error: `This account is not registered as ${expectedRole}.` };
      }

      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (email, password, role, details) => {
    try {
      const payload = { email, password, ...details };
      let endpoint = '/client/register';
      if (role === 'admin') endpoint = '/admin/register';
      await api.post(endpoint, payload);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isClient: user?.role === 'client',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
