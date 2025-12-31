// dishcovery/app/(auth)/signin.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import DishSafeAreaView from '../components/DishSafearea';
import AuthStyles from '../(auth)/AuthStyle';
import StatusModal from '../components/StatusModal';

const SignInScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Attempting login for:', form.email);
      
      const result = await authAPI.login(form.email, form.password);

      if (result.success) {
        console.log('✅ Login successful');

        // Ensure onboarding is marked as completed
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        
        // Clear form
        setForm({ email: "", password: "" });
        
        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        // Handle error response
        const message = result.error || 'Invalid email or password';
        console.error('❌ Login failed:', message);
        setErrorMessage(message);
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setModalVisible(false);
    handleLogin();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <DishSafeAreaView>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={AuthStyles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>
            <Image source={require("../../assets/images/image2.png")} style={AuthStyles.image2} />
          </View>
          
          <View style={{ flex: 2, marginTop: 150 }}>
            <View style={AuthStyles.headerContainer}>
              <Image source={require("../../assets/images/icon.png")} style={AuthStyles.logo} />
              <Text style={AuthStyles.title}>Welcome Back!</Text>
              <Text style={AuthStyles.subtitle}>Please log in</Text>
            </View>

            <View style={AuthStyles.formContainer}>
              <Text style={AuthStyles.label}>Email</Text>
              <AuthInput 
                placeholder="Email" 
                value={form.email} 
                onChangeText={(v) => handleChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}

              <Text style={AuthStyles.label}>Password</Text>
              <AuthInput
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                editable={!loading}
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <TouchableOpacity 
              onPress={() => router.push("/(auth)/forgot-password")}
              disabled={loading}
            >
              <Text style={AuthStyles.forgotLink}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={AuthStyles.buttonContainer}>
              <AuthButton 
                title={loading ? "Logging in..." : "Log In"} 
                onPress={handleLogin}
                disabled={loading}
              />
              {loading && (
                <ActivityIndicator 
                  size="small" 
                  color="#FF6B35" 
                  style={styles.loader}
                />
              )}
              
              <AuthButton 
                title="Continue with Google" 
                type="google" 
                onPress={() => {
                  // Google sign-in coming soon
                }}
                disabled={loading}
              />
            </View>

            <TouchableOpacity 
              onPress={() => router.push("/(auth)/signup")}
              disabled={loading}
            >
              <Text style={AuthStyles.link}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <StatusModal
          visible={modalVisible}
          type={modalType}
          message={errorMessage}
          onClose={handleCloseModal}
          onRetry={handleRetry}
        />
      </KeyboardAvoidingView>
    </DishSafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 140,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
  loader: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
});