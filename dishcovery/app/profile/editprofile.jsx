import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  TextInput,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { userAPI } from '../services/api';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState({ key: '', label: '', value: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await userAPI.getProfile();
      setProfileData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        username: userData.username || '@uchecooks',
        profileImage: userData.profileImage || 'https://i.pravatar.cc/150?img=47',
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUpdating(true);
        try {
          setProfileData({ ...profileData, profileImage: result.assets[0].uri });
          Alert.alert('Success', 'Profile image updated');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile image');
          console.error('Image upload error:', error);
        } finally {
          setUpdating(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const openEditModal = (key, label, value) => {
    setEditField({ key, label, value });
    setEditModalVisible(true);
  };

  const handleFieldUpdate = async () => {
    if (!editField.value.trim()) {
      Alert.alert('Error', `${editField.label} cannot be empty`);
      return;
    }

    setEditModalVisible(false);
    setUpdating(true);

    try {
      let updateData = {};

      if (editField.key === 'firstName' || editField.key === 'lastName') {
        const firstName = editField.key === 'firstName' ? editField.value : profileData.firstName;
        const lastName = editField.key === 'lastName' ? editField.value : profileData.lastName;
        updateData.name = `${firstName} ${lastName}`.trim();
      } else {
        updateData[editField.key] = editField.value;
      }

      await userAPI.updateProfile(updateData);

      setProfileData({
        ...profileData,
        ...updateData,
        firstName: editField.key === 'firstName' ? editField.value : profileData.firstName,
        lastName: editField.key === 'lastName' ? editField.value : profileData.lastName,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to change your password',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/changepassword') }
      ]
    );
  };

  const handleSaveChanges = () => {
    Alert.alert('Success', 'All changes have been saved!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4458" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Loading Overlay */}
        {updating && (
          <View style={styles.updatingOverlay}>
            <ActivityIndicator size="large" color="#ff4458" />
          </View>
        )}

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: profileData?.profileImage }} 
            style={styles.profileImage}
          />
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={handleImagePicker}
            disabled={updating}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => openEditModal('firstName', 'First Name', profileData?.firstName)}
              disabled={updating}
            >
              <Text style={styles.infoLabel}>First Name</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue}>{profileData?.firstName || 'Not set'}</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => openEditModal('lastName', 'Last Name', profileData?.lastName)}
              disabled={updating}
            >
              <Text style={styles.infoLabel}>Last Name</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue}>{profileData?.lastName || 'Not set'}</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => openEditModal('email', 'Email', profileData?.email)}
              disabled={updating}
            >
              <Text style={styles.infoLabel}>Email</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue} numberOfLines={1}>{profileData?.email}</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => openEditModal('username', 'Username', profileData?.username)}
              disabled={updating}
            >
              <Text style={styles.infoLabel}>Username</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue}>{profileData?.username}</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={handlePasswordChange}
              disabled={updating}
            >
              <Text style={styles.infoLabel}>Password</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue}>••••••••••</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* User's Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User's Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => Alert.alert('Coming Soon', 'Dietary preferences coming soon')}
            >
              <Text style={styles.infoLabel}>Dietary Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => Alert.alert('Coming Soon', 'Favorite cuisines coming soon')}
            >
              <Text style={styles.infoLabel}>Favorite Cuisines</Text>
              <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={updating}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={editField.value}
              onChangeText={(text) => setEditField({ ...editField, value: text })}
              placeholder={`Enter ${editField.label.toLowerCase()}`}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleFieldUpdate}
              >
                <Text style={styles.saveModalButtonText}>Save</Text>
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
  scrollContent: {
    paddingBottom: 120, // Extra padding for bottom navigation
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  updatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#f5f5f5',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '34%',
    backgroundColor: '#1a1a1a',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginLeft: 20,
    marginBottom: 12,
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '60%',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#ff4458',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff4458',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveModalButton: {
    backgroundColor: '#ff4458',
  },
  saveModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});