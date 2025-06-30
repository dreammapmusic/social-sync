// API Configuration - Using same production backend for all environments
const config = {
  development: {
    apiUrl: 'https://social-sync-api.norbert-gobor3.workers.dev',
    description: 'Production backend (same as live)'
  },
  production: {
    apiUrl: 'https://social-sync-api.norbert-gobor3.workers.dev',
    description: 'Production Cloudflare Workers backend'
  }
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const environment = isDevelopment ? 'development' : 'production';

// Export the current configuration
export const currentConfig = config[environment];

// Export all configs for reference
export const allConfigs = config;

// Helper function to get API URL
export const getApiUrl = () => {
  // Allow override via environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return currentConfig.apiUrl;
};

console.log(`🌍 SocialSync running in ${environment} mode`);
console.log(`🔗 API URL: ${getApiUrl()}`);
console.log(`📝 ${currentConfig.description}`);
console.log(`✅ Using same backend for local testing and live deployment`); 