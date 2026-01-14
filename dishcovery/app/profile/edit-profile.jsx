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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, userAPI } from '../services/api'; // ✅ Adjust this path if needed
import DEFAULT_PROFILE_IMAGE from '../(tabs)/profile.jsx';

export default function editprofile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState({ key: '', label: '', value: '' });
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
  current: '',
  newPass: '',
  confirm: '',
});


  useEffect(() => {
    loadProfile();
  }, []);

  // ✅ Load profile using API helpers
  const loadProfile = async () => {
    try {
      setLoading(true);

      const localUser = await authAPI.getCurrentUser();
      if (!localUser) {
        Alert.alert('Error', 'Please login to view your profile');
        router.replace('/login');
        return;
      }

      // Optionally refresh from backend
      const response = await userAPI.getProfile();
      const userData = response.success ? response.data : localUser;

      setProfileData({
        id: userData._id || userData.id,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email,
        username:
          userData.username ||
          `@${userData.firstName?.toLowerCase() || 'user'}`,
        profileImage:
         userData.profileImage || DEFAULT_PROFILE_IMAGE,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      });
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle editing a profile field
  const handleFieldUpdate = async () => {
    if (!editField.value.trim()) {
      Alert.alert('Error', `${editField.label} cannot be empty`);
      return;
    }

    setEditModalVisible(false);
    setUpdating(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please log in again');
        router.replace('/login');
        return;
      }

      const response = await fetch(
        'https://dishcovery-backend-1.onrender.com/api/users/me',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [editField.key]: editField.value }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local user data in AsyncStorage
      const currentUser = await authAPI.getCurrentUser();
      const updatedUser = {
        ...currentUser,
        [editField.key]: editField.value,
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      // Reflect updated info on screen
      setProfileData({
        ...profileData,
        [editField.key]: editField.value,
        name:
          editField.key === 'firstName' || editField.key === 'lastName'
            ? `${updatedUser.firstName} ${updatedUser.lastName}`.trim()
            : profileData.name,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Upload profile image
  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const imageUri = result.assets[0].uri;
        const token = await AsyncStorage.getItem('userToken');

        const formData = new FormData();
        formData.append('profileImage', {
          uri: imageUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

        const response = await fetch(
          'https://dishcovery-backend-1.onrender.com/api/users/me/avatar',
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!response.ok) throw new Error('Image upload failed');
        setProfileData({ ...profileData, profileImage: imageUri });
        Alert.alert('Success', 'Profile image updated!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to update image');
    }
  };

  // ✅ Logout through API
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authAPI.logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handlePasswordChange = () => {
   setPasswordData({ current: '', newPass: '', confirm: '' });
  setPasswordModalVisible(true);
  };

  const handlePasswordUpdate = async () => {
  const { current, newPass, confirm } = passwordData;

  if (!current.trim() || !newPass.trim() || !confirm.trim()) {
    Alert.alert('Error', 'All password fields are required.');
    return;
  }

  if (newPass !== confirm) {
    Alert.alert('Error', 'New passwords do not match.');
    return;
  }

  setUpdating(true);
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'Please log in again.');
      router.replace('/login');
      return;
    }

    const response = await fetch(
      'https://dishcovery-backend-1.onrender.com/api/users/me/password',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: current,
          newPassword: newPass,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to change password');
    }

    Alert.alert('Success', 'Password changed successfully!');
    setPasswordModalVisible(false);
  } catch (error) {
    console.error('Password update error:', error);
    Alert.alert('Error', error.message || 'Could not change password');
  } finally {
    setUpdating(false);
  }
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
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ff4458" />
          </TouchableOpacity>
        </View>

        {/* Loading Overlay */}
        {updating && (
          <View style={styles.updatingOverlay}>
            <ActivityIndicator size="large" color="#ff4458" />
            <Text style={styles.updatingText}>Updating...</Text>
          </View>
        )}

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: profileData?.profileImage }} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImagePicker}
            disabled={updating}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
          <View style={styles.card}>
            {[
              { key: 'firstName', label: 'First Name', value: profileData?.firstName },
              { key: 'lastName', label: 'Last Name', value: profileData?.lastName },
              { key: 'email', label: 'Email', value: profileData?.email },
              { key: 'username', label: 'Username', value: profileData?.username },
            ].map((item, i) => (
              <View key={item.key}>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() =>
                    setEditField(item) || setEditModalVisible(true)
                  }
                  disabled={updating}
                >
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{item.value || 'Not set'}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
                  </View>
                </TouchableOpacity>
                {i < 3 && <View style={styles.divider} />}
              </View>
            ))}

            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.infoItem}
              onPress={handlePasswordChange}
            >
              <Text style={styles.infoLabel}>Password</Text>
              <View style={styles.infoRight}>
                <Text style={styles.infoValue}>••••••••</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a1a1a" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoNoteText}>
            Changes are saved automatically when you update each field
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField.label}</Text>
            <TextInput
              style={styles.modalInput}
              value={editField.value}
              onChangeText={(text) =>
                setEditField({ ...editField, value: text })
              }
              placeholder={`Enter ${editField.label.toLowerCase()}`}
              autoFocus
              keyboardType={
                editField.key === 'email' ? 'email-address' : 'default'
              }
              autoCapitalize={
                editField.key === 'email' ? 'none' : 'words'
              }
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
  <Modal
  visible={passwordModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setPasswordModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Change Password</Text>

      <TextInput
        style={styles.modalInput}
        placeholder="Current Password"
        secureTextEntry
        value={passwordData.current}
        onChangeText={(text) =>
          setPasswordData({ ...passwordData, current: text })
        }
      />

      <TextInput
        style={styles.modalInput}
        placeholder="New Password"
        secureTextEntry
        value={passwordData.newPass}
        onChangeText={(text) =>
          setPasswordData({ ...passwordData, newPass: text })
        }
      />

      <TextInput
        style={styles.modalInput}
        placeholder="Confirm New Password"
        secureTextEntry
        value={passwordData.confirm}
        onChangeText={(text) =>
          setPasswordData({ ...passwordData, confirm: text })
        }
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setPasswordModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveModalButton]}
          onPress={handlePasswordUpdate}
        >
          <Text style={styles.saveModalButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

// ✅ Styles unchanged from your original version
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  updatingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  updatingText: { marginTop: 12, fontSize: 14, color: '#666', fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  imageContainer: { alignItems: 'center', marginVertical: 32 },
  profileImage: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#f5f5f5' },
  cameraButton: {
    position: 'absolute', bottom: 0, right: '34%',
    backgroundColor: '#1a1a1a', width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff',
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, color: '#999', marginLeft: 20, marginBottom: 12, fontWeight: '600', letterSpacing: 0.5 },
  card: { backgroundColor: '#F5F5F5', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 20 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  infoLabel: { fontSize: 16, color: '#1a1a1a', fontWeight: '400' },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: '60%' },
  infoValue: { fontSize: 16, color: '#1a1a1a', fontWeight: '500', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#E0E0E0' },
  infoNote: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 16, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 12, gap: 12 },
  infoNoteText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 20, backgroundColor: '#F9F9F9' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F5F5F5' },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
  saveModalButton: { backgroundColor: '#ff4458' },
  saveModalButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
