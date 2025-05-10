import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
httpClient.interceptors.request.use(async (config) => {
  const { getIdToken } = useAuth();
  const token = await getIdToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle token refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { getIdToken } = useAuth();
        const newToken = await getIdToken(true); // Force refresh

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;