import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userData } from '../data/userdata';

export default function Profile() {
  const router = useRouter();

  // Backend integration - Replace userData with actual user from context
  // const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: () => {
            // Backend: Call logout API
            // await authAPI.logout();
            router.replace('/signin');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image 
            source={{ uri: userData.profileImage }} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text style={styles.username}>{userData.username}</Text>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit-profile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Receipes Tried</Text>
            <Text style={styles.statValue}>{userData.stats.recipiesTried}</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statLabel}>Favourites</Text>
            <Text style={styles.statValue}>{userData.stats.favourites}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Reviews</Text>
            <Text style={styles.statValue}>{userData.stats.reviews}</Text>
          </View>
        </View>

        {/* User's Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User's Content</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/my-dishes')}
          >
            <Text style={styles.menuText}>My Dishes</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/favorites')}
          >
            <Text style={styles.menuText}>Favorites</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/reviews')}
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
          <Ionicons name="arrow-forward" size={20} color="#FF6347" />
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
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
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
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
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
    color: '#FF6347',
  },
});
