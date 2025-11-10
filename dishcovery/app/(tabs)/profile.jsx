import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userData as fallbackUserData } from '../data/userdata';

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, logout, getUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, [user, isAuthenticated]);

  const loadProfileData = async () => {
    try {
      if (isAuthenticated && user) {
        // Use authenticated user data
        const data = getUserData();
        setProfileData(data);
      } else {
        // Use fallback data for guests
        setProfileData(fallbackUserData);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setProfileData(fallbackUserData);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Not Logged In',
        'You are browsing as a guest. Sign in to access all features.',
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
              const result = await logout();
              if (result.success) {
                router.replace('/(auth)/signin');
              } else {
                Alert.alert('Error', 'Failed to log out. Please try again.');
              }
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

  const displayData = profileData || fallbackUserData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          {!isAuthenticated && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>Guest Mode</Text>
            </View>
          )}
          
          <Image 
            source={{ uri: displayData.profileImage }} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>
            {displayData.firstName} {displayData.lastName}
          </Text>
          <Text style={styles.username}>{displayData.username}</Text>

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
            <Text style={styles.statValue}>{displayData.stats.recipiesTried}</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>Favourites</Text>
            <Text style={styles.statValue}>{displayData.stats.favourites}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Reviews</Text>
            <Text style={styles.statValue}>{displayData.stats.reviews}</Text>
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

        {/* Action Button */}
        {!isAuthenticated ? (
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.signInText}>Sign In</Text>
            <Ionicons name="log-in-outline" size={20} color="#ff4458" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
            <Ionicons name="log-out-outline" size={20} color="#ff4458" />
          </TouchableOpacity>
        )}
      </ScrollView>
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
    position: 'relative',
  },
  guestBadge: {
    position: 'absolute',
    top: 10,
    right: 16,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadgeText: {
    fontSize: 12,
    color: '#ff4458',
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
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
  alignItems: 'center', // Add this - aligns all stat items to center
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
  lineHeight: 24, // Add this - prevents font rendering shifts
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
  signInButton: {
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
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4458',
    fontFamily: 'GoogleSans-Medium',
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