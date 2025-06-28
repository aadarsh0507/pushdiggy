import axios from 'axios';

// Static base URL (you can change it manually as needed)
const BASE_URL = 'http://localhost:5000/api';  // Change to your backend IP/port when deployed

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Optional: only if using cookies/session
});

export const useAuth = () => {
  // ...existing code...

  const login = async (email, password, role) => {
    try {
      let endpoint = '/client/login';
      if (role === 'admin') {
        endpoint = '/admin/login';
      }
      const res = await api.post(endpoint, { email, password });
      if (res.data.success) {
        // Save user/session as needed
        return { success: true, user: res.data.user };
      } else {
        return { success: false, error: res.data.error };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  // ...existing code...
};

export default api;
