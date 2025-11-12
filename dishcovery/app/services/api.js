import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to create headers
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

// Auth API
export const authAPI = {
  signup: async (userData) => {
    try {
      console.log('Signing up with:', { ...userData, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify(userData),
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
        error: data.error || data.message || 'Signup failed' 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Save token and user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }
      return { success: response.ok, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

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

// Recipe API
export const recipeAPI = {
  getAllRecipes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'GET',
        headers: await createHeaders(),
      });
      const data = await response.json();
      return response.ok ? data : [];
    } catch (error) {
      console.error('Get all recipes error:', error);
      return [];
    }
  },

  getRecipeById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
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
      formData.append('name', recipeData.name);
      formData.append('category', recipeData.category);
      formData.append('cookingTime', recipeData.cookingTime);
      formData.append('prepTime', recipeData.prepTime || '10');
      formData.append('rating', recipeData.rating || '0');
      formData.append('description', recipeData.description || '');
      formData.append('ingredients', JSON.stringify(recipeData.ingredients));
      formData.append('instructions', JSON.stringify(recipeData.instructions));

      const response = await fetch(`${API_BASE_URL}/recipes`, {
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

  searchRecipes: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: await createHeaders(),
      });
      const data = await response.json();
      return response.ok ? data : [];
    } catch (error) {
      console.error('Search recipes error:', error);
      return [];
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { // ✅ Changed here
      method: 'GET',
      headers: await createHeaders(true),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('⚠️ Unexpected response (not JSON):', text.slice(0, 200));
      return {
        success: false,
        error: 'Server did not return valid JSON. Possibly wrong endpoint.',
      };
    }

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error: error.message };
  }
},

 

  getUserRecipes: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/recipes`, {
        method: 'GET',
        headers: await createHeaders(),
      });
      const data = await response.json();
      return response.ok ? data : [];
    } catch (error) {
      console.error('Get user recipes error:', error);
      return [];
    }
  },

  changePassword: async (oldPassword, newPassword) => {
  try {
   const response = await userAPI.changePassword(current, newPass);
if (!response.success) throw new Error(response.data?.error || 'Failed');



    const data = await response.json();
    return { success: response.ok, data };

  } 
  catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: error.message };
  }
},

};

export default {
  authAPI,
  recipeAPI,
  userAPI,
};