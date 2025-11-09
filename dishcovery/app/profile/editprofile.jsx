import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userData } from '../data/userdata';

export default function EditProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(userData);

  const handleSaveChanges = () => {
    Alert.alert("Success", "Profile updated successfully!");
    // Backend: await userAPI.updateProfile(profileData);
    router.back();
  };

  const handleImagePicker = () => {
    Alert.alert("Coming Soon", "Image picker will be implemented");
    // Backend: Use expo-image-picker
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: profileData.profileImage }} 
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>First Name</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{profileData.firstName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{profileData.lastName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{profileData.email}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Username</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{profileData.username}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Password</Text>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>{profileData.password}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        </View>

        {/* User's Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User's Preferences</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dietary Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>Favorite Cuisines</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  card: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#FF6347',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});