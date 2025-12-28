// dishcovery/app/(auth)/signup.jsx
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

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('error');
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      return { valid: false, message: 'Please fill in all fields' };
    }

    if (name.trim().length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }

    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }

    return { valid: true };
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();

    const validation = validateForm();
    if (!validation.valid) {
      setModalMessage(validation.message);
      setModalType('error');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting signup with:', { name, email });

      // Call real API
      const result = await authAPI.signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      console.log('Signup result:', result);

      if (result.success) {
        // Show success modal
        setModalMessage('Account created successfully!');
        setModalType('success');
        setModalVisible(true);

        // Navigate to main app after a delay
        setTimeout(() => {
          setModalVisible(false);
          router.replace('/(tabs)');
        }, 2000);
      } else {
        // Show error
        setModalMessage(result.error || 'Signup failed. Please try again.');
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setModalMessage('An unexpected error occurred. Please try again.');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google Sign-Up
    setModalMessage('Google Sign-Up coming soon!');
    setModalType('error');
    setModalVisible(true);
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const retrySignUp = () => {
    setModalVisible(false);
    handleSignUp();
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Dishcovery today</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <AuthInput
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

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
                  placeholder="Create a password"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <AuthInput
                  placeholder="Re-enter your password"
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.linkText}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <AuthButton
                  title={isLoading ? 'Creating Account...' : 'Sign Up'}
                  onPress={handleSignUp}
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
                onPress={handleGoogleSignUp}
                type="google"
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn} disabled={isLoading}>
                <Text style={styles.signInText}>Sign In</Text>
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
        onRetry={modalType === 'error' ? retrySignUp : undefined}
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
  termsContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'GoogleSans-Regular',
  },
  linkText: {
    color: '#FF4458',
    fontWeight: '600',
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
  signInText: {
    color: '#FF4458',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
});

export default Signup;