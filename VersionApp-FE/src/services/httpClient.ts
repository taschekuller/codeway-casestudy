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
      console.log('[httpClient] Using token from localStorage instead of auth hook');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[httpClient] Request to:', config.url);
      console.log('[httpClient] Request with token (first 10 chars):', token.substring(0, 10) + '...');
    } else {
      console.warn('[httpClient] No authentication token available for request to:', config.url);
    }
  } catch (error) {
    console.error('[httpClient] Auth error:', error);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[httpClient] Using fallback token from localStorage after error');
    } else {
      console.error('[httpClient] Failed to set authorization header:', error);
    }
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    console.log(`[httpClient] Request to ${response.config.url} succeeded with status ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || 'unknown URL';

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(`[httpClient] Got 401 from ${url}, trying to refresh token...`);

      try {
        const { getIdToken } = useAuth();
        const newToken = await getIdToken(true);

        if (newToken) {
          console.log('[httpClient] Token refreshed successfully');
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        } else {
          console.warn('[httpClient] Token refresh returned empty token');
        }
      } catch (refreshError) {
        console.error('[httpClient] Error refreshing token:', refreshError);
      }
    }

    if (error.response) {
      console.error(`[httpClient] Error response from ${url}:`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error(`[httpClient] No response received from ${url}:`, error.request);
    } else {
      console.error(`[httpClient] Error with request to ${url}:`, error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;