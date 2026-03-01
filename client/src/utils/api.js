import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api/';
console.log('DEBUG: Injected API_URL is:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

export const API_BASE_URL = API_URL.endsWith('/api/')
  ? API_URL.replace('/api/', '')
  : API_URL.split('/api')[0];

console.log('DEBUG: Calculated API_BASE_URL for images is:', API_BASE_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
