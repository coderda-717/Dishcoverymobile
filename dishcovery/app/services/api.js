// dishcovery/app/services/api.js
// ✅ CORRECTED VERSION - Matches backend URL and structure
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ CORRECT Backend URL
const API_BASE_URL = 'https://dishcovery-backend-ln31.onrender.com/api';
const API_TIMEOUT = 30000; // 30 seconds

// Helper: Get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper: Create headers with optional auth
const createHeaders = async (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper: Fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  // ✅ SIGNUP - Correct field names for backend
  signup: async (userData) => {
    try {
      const { firstName, lastName, email, password } = userData;

      console.log('🚀 Signing up:', { firstName, lastName, email });

      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('📥 Signup response:', response.status, data);

      if (response.ok && data.token && data.user) {
        // Save token and user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, data };
      }

      return {
        success: false,
        data,
        error: data.error || data.message || 'Signup failed',
      };
    } catch (error) {
      console.error('❌ Signup error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // ✅ LOGIN
  login: async (email, password) => {
    try {
      console.log('🚀 Logging in:', email);

      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password 
        }),
      });

      const data = await response.json();
      console.log('📥 Login response:', response.status, data);

      if (response.ok && data.token && data.user) {
        // Save token and user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, data };
      }

      return {
        success: false,
        error: data.error || data.message || 'Invalid credentials',
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      return { success: false, error: error.message || 'Network error' };
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ GET CURRENT USER
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // ✅ FORGOT PASSWORD
  forgotPassword: async (email) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ RESET PASSWORD
  resetPassword: async (email, password) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// RECIPE API
// ============================================
export const recipeAPI = {
  // ✅ GET ALL RECIPES
  getAllRecipes: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.q) queryParams.append('q', filters.q);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.maxCookingTime) queryParams.append('maxCookingTime', filters.maxCookingTime);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const url = `${API_BASE_URL}/recipes${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      console.log('📥 Fetching recipes from:', url);

      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: await createHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Recipes fetched:', data.length);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Get recipes error:', error);
      return [];
    }
  },

  // ✅ GET RECIPE BY ID
  getRecipeById: async (id) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/recipes/${id}`, {
        method: 'GET',
        headers: await createHeaders(),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Get recipe by ID error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ CREATE RECIPE - Fixed for Cloudinary backend
  createRecipe: async (recipeData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required. Please login.' };
      }

      console.log('🚀 Creating recipe:', recipeData.name);

      const formData = new FormData();

      // ✅ Add image if exists
      if (recipeData.image && !recipeData.image.startsWith('http')) {
        const uriParts = recipeData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: recipeData.image,
          name: `recipe.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // ✅ Add recipe fields
      formData.append('name', recipeData.name || recipeData.title);
      formData.append('category', recipeData.category || 'Nigerian');
      formData.append('cookingTime', String(recipeData.cookingTime || 30));
      formData.append('prepTime', String(recipeData.prepTime || 10));
      formData.append('rating', String(recipeData.rating || 0));
      formData.append('description', recipeData.description || `Delicious ${recipeData.name}`);
      
      // ✅ Handle ingredients
      const ingredients = Array.isArray(recipeData.ingredients) 
        ? recipeData.ingredients 
        : recipeData.ingredients.split(',').map(i => i.trim()).filter(i => i);
      formData.append('ingredients', JSON.stringify(ingredients));
      
      // ✅ Handle instructions
      const instructions = Array.isArray(recipeData.instructions) 
        ? recipeData.instructions 
        : recipeData.instructions.split('\n').map(s => s.trim()).filter(s => s);
      formData.append('instructions', JSON.stringify(instructions));

      const response = await fetchWithTimeout(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('📥 Create recipe response:', response.status, data);

      return { success: response.ok, data };
    } catch (error) {
      console.error('❌ Create recipe error:', error);
      return { success: false, error: error.message || 'Failed to create recipe' };
    }
  },

  // ✅ SEARCH RECIPES
  searchRecipes: async (query) => {
    try {
      return await recipeAPI.getAllRecipes({ q: query });
    } catch (error) {
      console.error('Search recipes error:', error);
      return [];
    }
  },

  // ✅ UPDATE RECIPE
  updateRecipe: async (id, recipeData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const formData = new FormData();

      // Only add image if changed
      if (recipeData.image && !recipeData.image.startsWith('http')) {
        const uriParts = recipeData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: recipeData.image,
          name: `recipe.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // Add fields if provided
      if (recipeData.name) formData.append('name', recipeData.name);
      if (recipeData.category) formData.append('category', recipeData.category);
      if (recipeData.cookingTime) formData.append('cookingTime', String(recipeData.cookingTime));
      if (recipeData.prepTime) formData.append('prepTime', String(recipeData.prepTime));
      if (recipeData.rating !== undefined) formData.append('rating', String(recipeData.rating));
      if (recipeData.description !== undefined) formData.append('description', recipeData.description);
      
      if (recipeData.ingredients) {
        const ingredients = Array.isArray(recipeData.ingredients) 
          ? recipeData.ingredients 
          : recipeData.ingredients.split(',').map(i => i.trim());
        formData.append('ingredients', JSON.stringify(ingredients));
      }
      
      if (recipeData.instructions) {
        const instructions = Array.isArray(recipeData.instructions) 
          ? recipeData.instructions 
          : recipeData.instructions.split('\n').filter(i => i.trim());
        formData.append('instructions', JSON.stringify(instructions));
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Update recipe error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ DELETE RECIPE
  deleteRecipe: async (id) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Delete recipe error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  // ✅ GET PROFILE
  getProfile: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update cached user data
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        return { success: true, data };
      }

      return { success: false, error: data.error || 'Failed to fetch profile' };
    } catch (error) {
      console.error('Get profile error:', error);
      // Return cached data on error
      const cachedUser = await authAPI.getCurrentUser();
      return cachedUser 
        ? { success: true, data: cachedUser }
        : { success: false, error: error.message };
    }
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (profileData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update cached user data
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        return { success: true, data };
      }

      return { success: false, error: data.error || 'Update failed' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ CHANGE PASSWORD
  changePassword: async (oldPassword, newPassword) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// FAVORITES API
// ============================================
export const favoritesAPI = {
  // ✅ GET USER FAVORITES
  getUserFavorites: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required', data: [] };
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return { success: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Get favorites error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // ✅ TOGGLE FAVORITE
  toggleFavorite: async (recipeId) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/favorites/${recipeId}/toggle`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ✅ Export all
export default {
  authAPI,
  recipeAPI,
  userAPI,
  favoritesAPI,
};