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

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Auto-logout on 401 (Unauthorized)
      if (status === 401) {
        localStorage.removeItem('ems_token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Show alert for demo restrictions
      if (status === 403 && data.isDemo) {
        alert(data.message || 'Action restricted in Demo Mode.');
      }

      // Redirect to billing on 403 (Forbidden - Inactive Subscription)
      if (status === 403 && data.billingUrl) {
        window.location.href = data.billingUrl;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
