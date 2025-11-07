import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: 'Adegoke',
    lastName: 'Uchechukwu',
    email: 'Adechukwu25@gmail.com',
    username: '@uchecooks',
    password: '**********',
  });

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Photo picker coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image with Camera Button */}
        <View style={styles.imageSection}>
          <Image
            source={require('../../assets/images/chef.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>First Name</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profileData.firstName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profileData.lastName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profileData.email}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profileData.username}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.infoRow, styles.lastRow]}>
            <Text style={styles.infoLabel}>Password</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profileData.password}</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        </View>

        {/* User's Preferences Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User's Preferences</Text>

          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dietary Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.infoRow, styles.lastRow]}>
            <Text style={styles.infoLabel}>Favorite Cuisines</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 24,
    right: '36%',
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
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  infoValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  saveButton: {
    backgroundColor: '#ff4458',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});