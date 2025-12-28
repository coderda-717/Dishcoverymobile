// dishcovery/app/(auth)/signin.jsx
// ✅ FIXED VERSION - Properly integrated with backend
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import StatusModal from '../components/StatusModal';
import { authAPI } from '../services/api';

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('error');
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    Keyboard.dismiss();

    // Validation
    if (!email || !password) {
      setModalMessage('Please fill in all fields');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    if (!email.includes('@')) {
      setModalMessage('Please enter a valid email address');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Call real API
      const result = await authAPI.login(email, password);

      console.log('Login result:', result);

      if (result.success) {
        // Success! Navigate to main app
        console.log('Login successful, navigating to tabs');
        router.replace('/(tabs)');
      } else {
        // Show error
        setModalMessage(result.error || 'Login failed. Please check your credentials.');
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    setModalMessage('Google Sign-In coming soon!');
    setModalType('error');
    setModalVisible(true);
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const retryLogin = () => {
    setModalVisible(false);
    handleSignIn();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <AuthInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <AuthInput
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <AuthButton
                  title={isLoading ? 'Signing in...' : 'Sign In'}
                  onPress={handleSignIn}
                  type="primary"
                />
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={styles.loadingIndicator}
                  />
                )}
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <AuthButton
                title="Continue with Google"
                onPress={handleGoogleSignIn}
                type="google"
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <StatusModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={closeModal}
        onRetry={retryLogin}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'GoogleSans-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'GoogleSans-Regular',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'GoogleSans-Medium',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FF4458',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  buttonContainer: {
    position: 'relative',
  },
  loadingIndicator: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'GoogleSans-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GoogleSans-Regular',
  },
  signUpText: {
    color: '#FF4458',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
});

export default Signin;