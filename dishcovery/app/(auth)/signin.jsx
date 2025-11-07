import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import DishSafeAreaView from '../components/DishSafearea';
import AuthStyles from '../(auth)/AuthStyle';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';

const SignInScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

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

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data to AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        // Show success message
        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setForm({ email: "", password: "" });
                // Navigate to main app
                router.replace("/(tabs)");
              }
            }
          ]
        );
      } else {
        // Handle error response
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <ScrollView>
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
            </ScrollView>
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
                Alert.alert('Coming Soon', 'Google Sign-In will be available soon!');
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