import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for unwrapping standard data envelope
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'Terjadi kesalahan sistem.';
    return Promise.reject(new Error(message));
  }
);
