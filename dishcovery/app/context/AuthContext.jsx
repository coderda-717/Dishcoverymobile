import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('userToken');
      const savedUser = await AsyncStorage.getItem('userData');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.success) {
        const { token: userToken, user: userData } = result.data;
        
        // Save token and user data
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, error: result.data?.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const result = await authAPI.signup({ name, email, password });
      
      if (result.success && result.data) {
        // Handle both possible response structures
        const userToken = result.data.token;
        const userData = result.data.user;
        
        // Validate that we have required data
        if (!userToken || !userData) {
          console.error('Invalid signup response:', result.data);
          return { 
            success: false, 
            error: 'Invalid response from server. Please try again.' 
          };
        }
        
        // Save token and user data
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: result.data?.error || result.error || 'Signup failed' 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshUserProfile = async () => {
    try {
      const result = await userAPI.getProfile();
      
      if (result.success) {
        await AsyncStorage.setItem('userData', JSON.stringify(result.data));
        setUser(result.data);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  // Get user data with fallback
  const getUserData = () => {
    if (user) {
      return {
        id: user.id,
        firstName: user.name?.split(' ')[0] || 'User',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        username: `@${user.name?.replace(/\s+/g, '').toLowerCase() || 'user'}`,
        email: user.email,
        profileImage: "https://i.pravatar.cc/300?img=50",
        stats: {
          recipiesTried: 0,
          favourites: 0,
          reviews: 0
        },
        preferences: {
          dietary: [],
          favoriteCuisines: []
        }
      };
    }
    
    // Return guest data if not authenticated
    return {
      id: null,
      firstName: "Guest",
      lastName: "User",
      username: "@guest",
      email: "guest@dishcovery.com",
      profileImage: "https://i.pravatar.cc/300?img=50",
      stats: {
        recipiesTried: 0,
        favourites: 0,
        reviews: 0
      },
      preferences: {
        dietary: [],
        favoriteCuisines: []
      }
    };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated,
      login, 
      signup,
      logout,
      refreshUserProfile,
      getUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;