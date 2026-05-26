import axios from 'axios';
import API_BASE from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes strict timeout for heavy analysis
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  }
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject auth tokens if we have them later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API_TIMEOUT] The request took longer than 120s.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
