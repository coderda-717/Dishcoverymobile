

// ============ AUTH API ============
export const authAPI = {
  // Signup new user
  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      // Returns: { token, user: { id, name, email } }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout (client-side only for now)
  logout: async () => {
    // Clear local storage
    // await AsyncStorage.removeItem('userToken');
    // await AsyncStorage.removeItem('userData');
    return { success: true };
  },
};

// ============ USER API ============
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return await response.json();
      // Returns: { id, name, email }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Get user's recipes
  getUserRecipes: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/recipes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user recipes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user recipes error:', error);
      throw error;
    }
  },
};

// ============ RECIPE API ============
export const recipeAPI = {
  // Get all recipes
  getAllRecipes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      return await response.json();
      // Returns array of recipes
    } catch (error) {
      console.error('Get all recipes error:', error);
      throw error;
    }
  },

  // Get single recipe by ID
  getRecipeById: async (recipeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
      
      if (!response.ok) {
        throw new Error('Recipe not found');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get recipe error:', error);
      throw error;
    }
  },

  // Create new recipe (with image)
  createRecipe: async (recipeData) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      
      // Append recipe fields
      formData.append('name', recipeData.name);
      formData.append('category', recipeData.category || 'Nigerian');
      formData.append('cookingTime', recipeData.cookingTime);
      formData.append('prepTime', recipeData.prepTime);
      formData.append('rating', recipeData.rating || 0);
      formData.append('description', recipeData.description);
      formData.append('ingredients', JSON.stringify(recipeData.ingredients));
      formData.append('instructions', JSON.stringify(recipeData.instructions));
      
      // Append image file
      if (recipeData.imageUri) {
        formData.append('image', {
          uri: recipeData.imageUri,
          type: 'image/jpeg',
          name: 'recipe.jpg',
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create recipe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create recipe error:', error);
      throw error;
    }
  },

  // Search recipes
  searchRecipes: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search recipes error:', error);
      throw error;
    }
  },

  // Update recipe
  updateRecipe: async (recipeId, recipeData) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update recipe error:', error);
      throw error;
    }
  },

  // Delete recipe
  deleteRecipe: async (recipeId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete recipe error:', error);
      throw error;
    }
  },

  // Save/favorite recipe
  saveRecipe: async (recipeId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/recipes/save/${recipeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Save recipe error:', error);
      throw error;
    }
  },

  // Get user's saved recipes
  getSavedRecipes: async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/recipes/saved/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved recipes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get saved recipes error:', error);
      throw error;
    }
  },
};