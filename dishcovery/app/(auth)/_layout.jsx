import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated
      const userToken = await AsyncStorage.getItem('userToken');
      
      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      if (userToken) {
        // User is logged in - go to main app
        router.replace('/(tabs)');
      } else if (hasSeenOnboarding === 'true') {
        // User has seen onboarding but not logged in - go to signin
        router.replace('/(auth)/signin');
      } else {
        // First time user - show onboarding
        router.replace('/(auth)/onboarding');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, show onboarding for safety
      router.replace('/(auth)/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C85A3F" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen 
        name="onboarding" 
        options={{
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="signin" 
        options={{}} 
      />
      <Stack.Screen 
        name="signup" 
        options={{}} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C85A3F',
  },
});