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
  try {
    // Try to get token from useAuth hook first
    const { getIdToken } = useAuth();
    let token = await getIdToken();

    // If no token from hook, try localStorage as fallback
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
    // If there's an error getting the token, try localStorage as fallback
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

// Response interceptor to handle token refresh
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Got 401, trying to refresh token...');

      try {
        const { getIdToken } = useAuth();
        const newToken = await getIdToken(true); // Force refresh

        if (newToken) {
          console.log('Token refreshed successfully');
          localStorage.setItem('token', newToken); // Save refreshed token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        } else {
          console.warn('Token refresh returned empty token');
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    // Log details about the error
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