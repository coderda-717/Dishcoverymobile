// dishcovery/app/config/config.js
// ✅ Centralized configuration for the app

export const CONFIG = {
  // ✅ CORRECT Backend URL
  API_BASE_URL: 'https://dishcovery-backend-ln31.onrender.com/api',
  
  // API settings
  API_TIMEOUT: 30000, // 30 seconds
  
  // App settings
  APP_NAME: 'Dishcovery',
  APP_VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // Image settings
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  // Default values
  DEFAULT_CATEGORY: 'Nigerian',
  DEFAULT_COOKING_TIME: 30,
  DEFAULT_PREP_TIME: 10,
  DEFAULT_RATING: 0,
  
  // Categories
  CATEGORIES: ['Nigerian', 'Continental', 'Chinese', 'Italian', 'Mexican'],
  
  // Validation
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
  
  // Storage keys
  STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData',
    HAS_ONBOARDED: 'hasCompletedOnboarding',
  },
};

export default CONFIG;