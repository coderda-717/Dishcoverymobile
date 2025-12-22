import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInput from "../components/input";
import AuthButton from "../components/button";
import DishSafeAreaView from "../components/DishSafearea";
import AuthStyles from '../(auth)/AuthStyle';
import StatusModal from '../components/StatusModal';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';

// Helper to extract error message from response
const getErrorMessage = (data) => {
  return data?.error || data?.message || 'An error occurred. Please try again.';
};

const SignUpScreen = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

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

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup process with:', form.email.trim());
      
      // Backend expects firstName and lastName separately
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log('Signup response:', response.status, data);

      if (response.ok && data.token) {
        // Save user data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        console.log('Signup successful');
        
        // Show success modal
        setModalType('success');
        setModalVisible(true);
      } else {
        // Handle error response
        const message = getErrorMessage(data);
        console.error('Signup failed:', message);
        setErrorMessage(message);
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setModalVisible(false);
    // Clear form
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    // Navigate to main app
    router.replace("/(auth)/signin");
  };

  const handleRetry = () => {
    setModalVisible(false);
    handleSignUp();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={AuthStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/images/image1.png")} style={AuthStyles.image1} />

        <View style={AuthStyles.headerContainer}>
          <Image source={require("../../assets/images/icon.png")} style={AuthStyles.logo} />
          <Text style={AuthStyles.title}>Ready to Dishcover?</Text>
          <Text style={AuthStyles.subtitle}>Fill in your details to sign up</Text>
        </View>

        <View style={AuthStyles.formContainer}>
          <Text style={AuthStyles.label}>First name</Text>
          <AuthInput
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
            editable={!loading}
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}

          <Text style={AuthStyles.label}>Last name</Text>
          <AuthInput 
            placeholder="Last Name" 
            value={form.lastName} 
            onChangeText={(v) => handleChange("lastName", v)}
            editable={!loading}
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}

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

          <Text style={AuthStyles.label}>Confirm Password</Text>
          <AuthInput
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => handleChange("confirmPassword", v)}
            editable={!loading}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        <View style={AuthStyles.buttonContainer}>
          <AuthButton 
            title={loading ? "Creating Account..." : "Sign Up"} 
            onPress={handleSignUp}
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
          onPress={() => router.push("/(auth)/signin")}
          disabled={loading}
        >
          <Text style={AuthStyles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>

      <StatusModal
        visible={modalVisible}
        type={modalType}
        message={errorMessage}
        onClose={modalType === 'success' ? handleSuccessModalClose : handleCloseModal}
        onRetry={handleRetry}
      />
    </DishSafeAreaView>
  );
};

const styles = {
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
    fontFamily: 'GoogleSans-Regular',
  },
  loader: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
};

export default SignUpScreen;