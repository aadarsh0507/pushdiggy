import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL/port
  withCredentials: true,            // Optional: if you use cookies/auth
});

export default api;