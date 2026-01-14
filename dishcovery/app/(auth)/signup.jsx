// dishcovery/app/(auth)/signup.jsx
// ✅ FIXED - Redirects to signin after successful signup (no auto-login)
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { authAPI } from '../services/api';
import AuthInput from "../components/input";
import AuthButton from "../components/button";
import DishSafeAreaView from "../components/DishSafearea";
import AuthStyles1 from '../(auth)/AuthStyle1';
import StatusModal from '../components/StatusModal';

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
  const [successMessage, setSuccessMessage] = useState('');
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
      const signupData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      };

      console.log('🚀 Signing up:', { ...signupData, password: '***' });

      const result = await authAPI.signup(signupData);

      if (result.success) {
        console.log('✅ Signup successful');

        // ✅ FIX: Do NOT auto-login - just show success and redirect to signin
        setModalType('success');
        setSuccessMessage('Account created successfully! Please log in with your credentials.');
        setModalVisible(true);

        // Clear form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // ✅ FIX: Redirect to signin after 2 seconds
        setTimeout(() => {
          setModalVisible(false);
          router.replace("/(auth)/signin");
        }, 2000);
        
      } else {
        const message = result.error || 'Signup failed. Please try again.';
        console.error('❌ Signup failed:', message);
        setErrorMessage(message);
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setErrorMessage('Network error. Please check your connection.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setModalVisible(false);
    router.replace("/(auth)/signin");
  };

  const handleRetry = () => {
    setModalVisible(false);
    handleSignUp();
  };

  const handleCloseModal = () => {
    if (modalType === 'success') {
      handleSuccessModalClose();
    } else {
      setModalVisible(false);
    }
  };

  return (
    <DishSafeAreaView>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={AuthStyles1.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require("../../assets/images/image1.png")} style={AuthStyles1.image1} />

          <View style={AuthStyles1.headerContainer}>
            <Image source={require("../../assets/images/icon.png")} style={AuthStyles1.logo} />
            <Text style={AuthStyles1.title}>Ready to Dishcover?</Text>
            <Text style={AuthStyles1.subtitle}>Fill in your details to sign up</Text>
          </View>

          <View style={AuthStyles1.formContainer}>
            <Text style={AuthStyles1.label}>First name</Text>
            <AuthInput
              placeholder="First Name"
              value={form.firstName}
              onChangeText={(v) => handleChange("firstName", v)}
              editable={!loading}
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}

            <Text style={AuthStyles1.label}>Last name</Text>
            <AuthInput 
              placeholder="Last Name" 
              value={form.lastName} 
              onChangeText={(v) => handleChange("lastName", v)}
              editable={!loading}
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}

            <Text style={AuthStyles1.label}>Email</Text>
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

            <Text style={AuthStyles1.label}>Password</Text>
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

            <Text style={AuthStyles1.label}>Confirm Password</Text>
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

          <View style={AuthStyles1.buttonContainer}>
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
            <Text style={AuthStyles1.link}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </ScrollView>

        <StatusModal
          visible={modalVisible}
          type={modalType}
          message={modalType === 'success' ? successMessage : errorMessage}
          onClose={handleCloseModal}
          onRetry={modalType === 'error' ? handleRetry : undefined}
        />
      </KeyboardAvoidingView>
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