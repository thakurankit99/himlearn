// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000/api',
    timeout: 30000
  },
  production: {
    // Use environment variable if available, otherwise use the new API URL
    baseURL: process.env.REACT_APP_API_URL || 'https://api.himlearning.cfd/api',
    timeout: 30000
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the configuration for current environment
export const apiConfig = API_CONFIG[environment];

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // For absolute URLs (like those from a separate backend deployment)
  if (apiConfig.baseURL.includes('http')) {
    return `${apiConfig.baseURL}/${cleanEndpoint}`;
  }
  
  // For relative URLs (same-origin deployment)
  return `${apiConfig.baseURL}/${cleanEndpoint}`;
};

// Helper to check if we're using a separate backend
export const isUsingRemoteBackend = () => {
  return apiConfig.baseURL.includes('http');
};

// Default export for backward compatibility
export default apiConfig;
