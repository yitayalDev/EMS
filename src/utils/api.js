import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
