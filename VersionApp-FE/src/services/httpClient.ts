import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  try {
    const { getIdToken } = useAuth();
    let token = await getIdToken();

    if (!token) {
      token = localStorage.getItem('token');
      console.log('Using token from localStorage instead of auth hook');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token (first 10 chars):', token.substring(0, 10) + '...');
    } else {
      console.warn('No authentication token available for request');
    }
  } catch (error) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Using fallback token from localStorage after error');
    } else {
      console.error('Failed to set authorization header:', error);
    }
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Got 401, trying to refresh token...');

      try {
        const { getIdToken } = useAuth();
        const newToken = await getIdToken(true);

        if (newToken) {
          console.log('Token refreshed successfully');
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        } else {
          console.warn('Token refresh returned empty token');
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;