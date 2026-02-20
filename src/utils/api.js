import axios from 'axios';

// Change this line - either update .env OR change the fallback
export const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://server-at3h.onrender.com';

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // This becomes https://server-at3h.onrender.com/api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;