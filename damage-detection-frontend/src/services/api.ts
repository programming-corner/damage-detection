import axios, {AxiosInstance, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-api-domain.com/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      // You might want to navigate to login screen here
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: async (credentials: {email: string; password: string}) => {
    const response: AxiosResponse = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  validateToken: async (token: string) => {
    const response: AxiosResponse = await apiClient.get('/auth/validate', {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data.user;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};

// Damage Report API
export const damageReportAPI = {
  createReport: async (reportData: {
    itemSku: string;
    notes: string;
    location: {latitude: number; longitude: number};
  }) => {
    const response: AxiosResponse = await apiClient.post('/items/report-damage', reportData);
    return response.data;
  },

  uploadImage: async (imageUri: string, reportId: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `damage_${Date.now()}.jpg`,
    } as any);
    formData.append('reportId', reportId);

    const response: AxiosResponse = await apiClient.post('/items/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReports: async (status?: string) => {
    const params = status ? {status} : {};
    const response: AxiosResponse = await apiClient.get('/items', {params});
    return response.data;
  },

  getReportById: async (id: string) => {
    const response: AxiosResponse = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  reviewReport: async (id: string, decision: 'CONFIRMED' | 'REJECTED', notes?: string) => {
    const response: AxiosResponse = await apiClient.post(`/items/${id}/review`, {
      decision,
      notes,
    });
    return response.data;
  },
};

// Upload helper for signed URLs
export const uploadAPI = {
  getSignedUrl: async (fileName: string, fileType: string) => {
    const response: AxiosResponse = await apiClient.post('/upload/signed-url', {
      fileName,
      fileType,
    });
    return response.data;
  },

  uploadToSignedUrl: async (signedUrl: string, file: any) => {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    return response;
  },
};

export default apiClient;