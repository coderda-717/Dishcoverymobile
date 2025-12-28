// dishcovery/app/services/api.js
// ✅ FIXED VERSION - Properly integrated with backend
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';
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
  // ✅ SIGNUP - Fixed to match backend structure
  signup: async (userData) => {
    try {
      const { name, email, password } = userData;
      
      // Split name into firstName and lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      console.log('Signing up with:', { firstName, lastName, email });

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
      console.log('Signup response:', response.ok, data);

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
      console.error('Signup error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  },

  // ✅ LOGIN - Working correctly
  login: async (email, password) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        // Save token and user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, data };
      }

      return {
        success: false,
        error: data.error || data.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      return { success: false, error: error.message };
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
};

// ============================================
// RECIPE API
// ============================================
export const recipeAPI = {
  // ✅ GET ALL RECIPES - With filters
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
      
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: await createHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get all recipes error:', error);
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

  // ✅ CREATE RECIPE - Fixed FormData implementation
  createRecipe: async (recipeData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const formData = new FormData();

      // Add image
      if (recipeData.image) {
        const uriParts = recipeData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: recipeData.image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // Add other fields
      formData.append('name', recipeData.name || recipeData.title);
      formData.append('category', recipeData.category || 'Nigerian');
      formData.append('cookingTime', String(recipeData.cookingTime || '30'));
      formData.append('prepTime', String(recipeData.prepTime || '10'));
      formData.append('rating', String(recipeData.rating || '0'));
      formData.append('description', recipeData.description || '');
      
      // Handle ingredients array
      const ingredients = Array.isArray(recipeData.ingredients) 
        ? recipeData.ingredients 
        : recipeData.ingredients.split(',').map(i => i.trim());
      formData.append('ingredients', JSON.stringify(ingredients));
      
      // Handle instructions array
      const instructions = Array.isArray(recipeData.instructions) 
        ? recipeData.instructions 
        : recipeData.instructions.split('\n').filter(i => i.trim());
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
      return { success: response.ok, data };
    } catch (error) {
      console.error('Create recipe error:', error);
      return { success: false, error: error.message };
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
        return { success: false, error: 'No authentication token found' };
      }

      const formData = new FormData();

      // Only add image if changed
      if (recipeData.image && !recipeData.image.startsWith('http')) {
        const uriParts = recipeData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('image', {
          uri: recipeData.image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // Add other fields if provided
      if (recipeData.name) formData.append('name', recipeData.name);
      if (recipeData.category) formData.append('category', recipeData.category);
      if (recipeData.cookingTime) formData.append('cookingTime', String(recipeData.cookingTime));
      if (recipeData.prepTime) formData.append('prepTime', String(recipeData.prepTime));
      if (recipeData.rating) formData.append('rating', String(recipeData.rating));
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
        return { success: false, error: 'No authentication token found' };
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
        return { success: false, error: 'No authentication token found' };
      }

      // For now, just return cached user data
      // Backend doesn't have /auth/me endpoint yet
      const userData = await authAPI.getCurrentUser();
      return { success: true, data: userData };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (profileData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      // Update local storage for now
      const currentUser = await authAPI.getCurrentUser();
      const updatedUser = { ...currentUser, ...profileData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ GET USER RECIPES
  getUserRecipes: async (userId) => {
    try {
      // Filter recipes by userId
      const allRecipes = await recipeAPI.getAllRecipes();
      const userRecipes = allRecipes.filter(recipe => recipe.userId === userId);
      return userRecipes;
    } catch (error) {
      console.error('Get user recipes error:', error);
      return [];
    }
  },

  // ✅ CHANGE PASSWORD
  changePassword: async (oldPassword, newPassword) => {
    try {
      // Not implemented in backend yet
      console.warn('Change password not implemented in backend');
      return { success: false, error: 'Not implemented yet' };
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
  // ✅ TOGGLE FAVORITE
  toggleFavorite: async (recipeId) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'No authentication token found' };
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

  // ✅ GET USER FAVORITES
  getUserFavorites: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return { success: false, error: 'No authentication token found' };
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
      console.error('Get user favorites error:', error);
      return { success: false, error: error.message, data: [] };
    }
  },
};

// Export all
export default {
  authAPI,
  recipeAPI,
  userAPI,
  favoritesAPI,
};