import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL/port
  // "https://5000-firebase-pushdiggygit-1751345989139.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev/api", // Change this to your backend URL/port
  withCredentials: true, // Optional: if you use cookies/auth
});

export default api;