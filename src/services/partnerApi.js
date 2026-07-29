import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthToken = async () => {
  const auth = getAuth();
  if (!auth.currentUser) throw new Error('User not authenticated');
  return await auth.currentUser.getIdToken();
};

const partnerApiClient = axios.create({
  baseURL: `${API_BASE_URL}/partners`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Firebase token securely to every request
partnerApiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const partnerApi = {
  applyForPartnership: async (applicationData) => {
    const response = await partnerApiClient.post('/apply', applicationData);
    return response.data;
  },

  getDashboardAnalytics: async (partnerId) => {
    const response = await partnerApiClient.get(`/analytics/${partnerId}`);
    return response.data;
  },

  requestWithdrawal: async (amount, upiId) => {
    const response = await partnerApiClient.post('/withdraw', { amount, upiId });
    return response.data;
  },

  getSalesHistory: async (partnerId) => {
    const response = await partnerApiClient.get(`/sales/${partnerId}`);
    return response.data;
  }
};