import { authService } from './authService.js';

// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8092/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Common headers for API requests
export const getDefaultHeaders = () => {
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  // Add JWT token if available
  const authHeader = authService.getAuthHeader();
  return { ...baseHeaders, ...authHeader };
};

// Error handling utility
export const handleApiError = (error, context = 'API request') => {
  console.error(`Error in ${context}:`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new Error('Network error: Unable to connect to server');
  }
  
  if (error.status === 401) {
    // Unauthorized - clear auth data and redirect to login
    authService.logout();
    window.location.href = '/login';
    return new Error('Session expired. Please login again.');
  }
  
  if (error.status === 404) {
    return new Error('Resource not found');
  }
  
  if (error.status === 500) {
    return new Error('Server error: Please try again later');
  }
  
  return error.message ? new Error(error.message) : new Error('An unexpected error occurred');
};

// Request wrapper with timeout and retry logic
export const apiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getDefaultHeaders(),
        ...options.headers
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw handleApiError(error, `Request to ${url}`);
  }
};
