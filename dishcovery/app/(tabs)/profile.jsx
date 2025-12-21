import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_IMAGE = 'https://res.cloudinary.com/dguseowoa/image/upload/v1762823979/amala_and_gbegiri_lkovb8.jpg';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

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
        // NO AUTO GUEST MODE - User must sign in
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              
              setIsAuthenticated(false);
              setUserData(null);
              
              router.replace('/(auth)/signin');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleProtectedAction = (path) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to access this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign In', 
            onPress: () => router.push('/(auth)/signin')
          }
        ]
      );
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

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.emptyStateContainer}>
          <View style={styles.emptyState}>
            <Image 
              source={require('../../assets/images/icon.png')}
              style={styles.emptyStateLogo}
            />
            <Text style={styles.emptyStateTitle}>Welcome to Dishcovery!</Text>
            <Text style={styles.emptyStateText}>
              Sign in to save your favorite recipes, write reviews, and share your culinary creations.
            </Text>
            
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={styles.createAccountText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
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
            onPress={() => handleProtectedAction('/profile/editprofile')}
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
            onPress={() => handleProtectedAction('/profile/mydishes')}
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
            onPress={() => router.push('/profile/privacypolicy')}
          >
            <Text style={styles.menuText}>Privacy & Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/termsandconditions')}
          >
            <Text style={styles.menuText}>Terms and Condition</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/faqhelp')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyState: {
    alignItems: 'center',
    width: '100%',
  },
  emptyStateLogo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'GoogleSans-Bold',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'GoogleSans-Regular',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4458',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    width: '100%',
    marginBottom: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  createAccountButton: {
    paddingVertical: 16,
  },
  createAccountText: {
    fontSize: 16,
    color: '#ff4458',
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
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
});