import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('fishermate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add user language
    const language = localStorage.getItem('fishermate_language') || 'en';
    config.headers['Accept-Language'] = language;
    
    // Add timestamp
    config.headers['X-Timestamp'] = Date.now();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('fishermate_token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded, retrying after delay...');
    }
    
    if (error.code === 'ECONNABORTED') {
      // Request timeout
      error.message = 'Request timeout - please check your connection';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Chat endpoints
  chat: '/api/chat',
  chatHistory: '/api/chat/history',
  
  // Weather endpoints
  weather: '/api/weather',
  weatherForecast: '/api/weather/forecast',
  weatherAlerts: '/api/weather/alerts',
  marineConditions: '/api/weather/marine',
  
  // Legal endpoints
  legal: '/api/legal',
  legalInfo: '/api/legal/info',
  legalSearch: '/api/legal/search',
  
  // Safety endpoints
  safety: '/api/safety',
  safetyGuide: '/api/safety/guide',
  safetyChecklist: '/api/safety/checklist',
  
  // Emergency endpoints
  emergency: '/api/emergency',
  emergencyContacts: '/api/emergency/contacts',
  emergencyAlert: '/api/emergency/alert',
  
  // Voice endpoints
  voice: '/api/voice',
  voiceToText: '/api/voice/to-text',
  textToVoice: '/api/voice/to-speech',
  
  // Location endpoints
  location: '/api/location',
  locationUpdate: '/api/location/update',
  
  // User endpoints
  user: '/api/user',
  userProfile: '/api/user/profile',
  userSettings: '/api/user/settings',
  
  // Notification endpoints
  notifications: '/api/notifications',
  notificationSettings: '/api/notifications/settings',
  
  // WhatsApp endpoints
  whatsapp: '/api/whatsapp',
  whatsappWebhook: '/api/whatsapp/webhook',
  
  // SMS endpoints
  sms: '/api/sms',
  smsWebhook: '/api/sms/webhook',
};

// Chat API functions
export const chatApi = {
  sendMessage: async (message, options = {}) => {
    const response = await api.post(apiEndpoints.chat, {
      message,
      ...options,
    });
    return response.data;
  },
  
  getHistory: async (limit = 50, offset = 0) => {
    const response = await api.get(apiEndpoints.chatHistory, {
      params: { limit, offset },
    });
    return response.data;
  },
  
  clearHistory: async () => {
    const response = await api.delete(apiEndpoints.chatHistory);
    return response.data;
  },
};

// Weather API functions
export const weatherApi = {
  getCurrentWeather: async (lat, lon) => {
    const response = await api.get(apiEndpoints.weather, {
      params: { lat, lon },
    });
    return response.data;
  },
  
  getForecast: async (lat, lon, days = 5) => {
    const response = await api.get(apiEndpoints.weatherForecast, {
      params: { lat, lon, days },
    });
    return response.data;
  },
  
  getAlerts: async (lat, lon) => {
    const response = await api.get(apiEndpoints.weatherAlerts, {
      params: { lat, lon },
    });
    return response.data;
  },
  
  getMarineConditions: async (lat, lon) => {
    const response = await api.get(apiEndpoints.marineConditions, {
      params: { lat, lon },
    });
    return response.data;
  },
};

// Legal API functions
export const legalApi = {
  getLegalInfo: async (state, category) => {
    const response = await api.get(apiEndpoints.legalInfo, {
      params: { state, category },
    });
    return response.data;
  },
  
  searchLegal: async (query, state) => {
    const response = await api.get(apiEndpoints.legalSearch, {
      params: { query, state },
    });
    return response.data;
  },
  
  getAllRegulations: async () => {
    const response = await api.get(apiEndpoints.legal);
    return response.data;
  },
};

// Safety API functions
export const safetyApi = {
  getSafetyGuide: async (category) => {
    const response = await api.get(apiEndpoints.safetyGuide, {
      params: { category },
    });
    return response.data;
  },
  
  getChecklist: async (type) => {
    const response = await api.get(apiEndpoints.safetyChecklist, {
      params: { type },
    });
    return response.data;
  },
  
  getAllSafety: async () => {
    const response = await api.get(apiEndpoints.safety);
    return response.data;
  },
};

// Emergency API functions
export const emergencyApi = {
  sendAlert: async (alertData) => {
    const response = await api.post(apiEndpoints.emergencyAlert, alertData);
    return response.data;
  },
  
  getContacts: async (state) => {
    const response = await api.get(apiEndpoints.emergencyContacts, {
      params: { state },
    });
    return response.data;
  },
  
  updateLocation: async (lat, lon) => {
    const response = await api.post(apiEndpoints.locationUpdate, {
      latitude: lat,
      longitude: lon,
      timestamp: Date.now(),
    });
    return response.data;
  },
};

// Voice API functions
export const voiceApi = {
  speechToText: async (audioBlob, language = 'en') => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);
    
    const response = await api.post(apiEndpoints.voiceToText, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  textToSpeech: async (text, language = 'en', voice = 'default') => {
    const response = await api.post(apiEndpoints.textToVoice, {
      text,
      language,
      voice,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// User API functions
export const userApi = {
  getProfile: async () => {
    const response = await api.get(apiEndpoints.userProfile);
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put(apiEndpoints.userProfile, profileData);
    return response.data;
  },
  
  getSettings: async () => {
    const response = await api.get(apiEndpoints.userSettings);
    return response.data;
  },
  
  updateSettings: async (settings) => {
    const response = await api.put(apiEndpoints.userSettings, settings);
    return response.data;
  },
};

// Notification API functions
export const notificationApi = {
  getNotifications: async (limit = 20, offset = 0) => {
    const response = await api.get(apiEndpoints.notifications, {
      params: { limit, offset },
    });
    return response.data;
  },
  
  markAsRead: async (notificationId) => {
    const response = await api.put(`${apiEndpoints.notifications}/${notificationId}/read`);
    return response.data;
  },
  
  getSettings: async () => {
    const response = await api.get(apiEndpoints.notificationSettings);
    return response.data;
  },
  
  updateSettings: async (settings) => {
    const response = await api.put(apiEndpoints.notificationSettings, settings);
    return response.data;
  },
};

// WhatsApp API functions
export const whatsappApi = {
  sendMessage: async (to, message) => {
    const response = await api.post(apiEndpoints.whatsapp, {
      to,
      message,
    });
    return response.data;
  },
  
  sendTemplate: async (to, template, parameters) => {
    const response = await api.post(`${apiEndpoints.whatsapp}/template`, {
      to,
      template,
      parameters,
    });
    return response.data;
  },
};

// SMS API functions
export const smsApi = {
  sendMessage: async (to, message) => {
    const response = await api.post(apiEndpoints.sms, {
      to,
      message,
    });
    return response.data;
  },
  
  sendBulk: async (recipients, message) => {
    const response = await api.post(`${apiEndpoints.sms}/bulk`, {
      recipients,
      message,
    });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if online
  isOnline: () => navigator.onLine,
  
  // Retry function for failed requests
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  },
  
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      return {
        type: 'server_error',
        status,
        message: data?.message || 'Server error occurred',
        details: data?.details || null,
      };
    } else if (error.request) {
      // Network error
      return {
        type: 'network_error',
        message: 'Network connection failed',
        details: error.message,
      };
    } else {
      // Other error
      return {
        type: 'unknown_error',
        message: 'An unexpected error occurred',
        details: error.message,
      };
    }
  },
  
  // Cache responses
  cache: new Map(),
  
  getCachedResponse: (key) => {
    const cached = apiUtils.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.data;
    }
    return null;
  },
  
  setCachedResponse: (key, data) => {
    apiUtils.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },
  
  clearCache: () => {
    apiUtils.cache.clear();
  },
};

// Export default API instance
export default api;
