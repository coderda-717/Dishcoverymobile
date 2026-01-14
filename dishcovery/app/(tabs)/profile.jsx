import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_IMAGE = require('../../assets/images/profile.jpg');

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userDataStr = await AsyncStorage.getItem('userData');
      
      if (token && userDataStr) {
        const user = JSON.parse(userDataStr);
        setIsAuthenticated(true);
        setUserData({
          firstName: user.firstName || 'User',
          lastName: user.lastName || '',
          email: user.email || '',
          username: `@${(user.firstName || 'user').toLowerCase()}`,
          profileImage: DEFAULT_PROFILE_IMAGE,
          stats: {
            recipiesTried: 0,
            favourites: 0,
            reviews: 0
          }
        });
      } else {
        // NO AUTHENTICATION - Redirect to sign in
        setIsAuthenticated(false);
        setUserData(null);
        // Redirect to splash -> onboarding -> signin flow
        router.replace('/splash');
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setIsAuthenticated(false);
      setUserData(null);
      // Redirect to splash on error
      router.replace('/splash');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Show logout modal instead of Alert
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Clear all auth data from AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'authToken',
        'isAuthenticated',
        'userEmail',
        'userData',
      ]);
      
      console.log('✅ Logout successful');
      
      setIsAuthenticated(false);
      setUserData(null);
      
      // Close modal
      setShowLogoutModal(false);
      
      // Navigate to signin
      router.replace('/(auth)/signin');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleProtectedAction = (path) => {
    if (!isAuthenticated) {
      // This should never happen as unauthenticated users are redirected
      router.replace('/splash');
      return;
    }
    router.push(path);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff4458" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  // If not authenticated, they should have been redirected already
  // But as a safety measure, show nothing
  if (!isAuthenticated || !userData) {
    return null;
  }

  // Show profile when authenticated
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: userData?.profileImage || DEFAULT_PROFILE_IMAGE }} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>
            {userData?.firstName || 'User'} {userData?.lastName || ''}
          </Text>
          <Text style={styles.username}>{userData?.username || '@user'}</Text>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleProtectedAction('/profile/edit-profile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Recipes Tried</Text>
            <Text style={styles.statValue}>{userData?.stats?.recipiesTried || 0}</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>Favourites</Text>
            <Text style={styles.statValue}>{userData?.stats?.favourites || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Reviews</Text>
            <Text style={styles.statValue}>{userData?.stats?.reviews || 0}</Text>
          </View>
        </View>

        {/* User's Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User's Content</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleProtectedAction('/profile/my-dishes')}
          >
            <Text style={styles.menuText}>My Dishes</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleProtectedAction('/profile/favorites')}
          >
            <Text style={styles.menuText}>Favorites</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleProtectedAction('/profile/reviews')}
          >
            <Text style={styles.menuText}>Reviews</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/privacy-policy')}
          >
            <Text style={styles.menuText}>Privacy & Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/terms-conditions')}
          >
            <Text style={styles.menuText}>Terms and Condition</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/faq-help')}
          >
            <Text style={styles.menuText}>FAQ & Help</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
          <Ionicons name="log-out-outline" size={20} color="#ff4458" />
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ Logout Confirmation Modal - Same as index.jsx */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="log-out-outline" size={48} color="#ff4458" style={styles.modalIcon} />
            
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Do you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleCancelLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    fontFamily: 'GoogleSans-Bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'GoogleSans-Regular',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4458',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'GoogleSans-Regular',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4458',
    fontFamily: 'GoogleSans-Bold',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 12,
    fontFamily: 'GoogleSans-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'GoogleSans-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4458',
    fontFamily: 'GoogleSans-Medium',
  },
  // ✅ Logout Modal Styles - Same as index.jsx
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ff4458',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});