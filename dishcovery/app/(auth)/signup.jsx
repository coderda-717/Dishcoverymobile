import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../components/input";
import AuthButton from "../components/button";
import DishSafeAreaView from "../components/DishSafearea";
import AuthStyles from '../(auth)/AuthStyle';
import { authAPI } from '../services/api';

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
  const router = useRouter();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
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

    // First name validation
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Last name validation
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
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
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Combine first and last name for backend
      const userData = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        password: form.password,
      };

      const result = await authAPI.signup(userData);

      if (result.success) {
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
                // Navigate to main app
                router.replace("/(tabs)");
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Sign Up Failed',
          result.data?.error || 'Could not create account. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to server. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
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
              Alert.alert('Coming Soon', 'Google Sign-In will be available soon!');
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

export default SignUpScreen