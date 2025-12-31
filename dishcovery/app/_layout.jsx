// dishcovery/app/_layout.jsx
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './context/AuthContext';

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isReady || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not in auth flow, redirect to splash
      router.replace('/splash');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still in auth screens, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [isReady, isAuthenticated, segments, fontsLoaded]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      setIsAuthenticated(!!token);
      
      // If not authenticated or hasn't completed onboarding, start from splash
      if (!token || !hasCompletedOnboarding) {
        setIsReady(true);
        return;
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setIsReady(true);
    }
  };

  if (!isReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#ff4458" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile/edit-profile" />
      <Stack.Screen name="profile/my-dishes" />
      <Stack.Screen name="profile/favorites" />
      <Stack.Screen name="profile/reviews" />
      <Stack.Screen name="profile/privacy-policy" />
      <Stack.Screen name="profile/terms-conditions" />
      <Stack.Screen name="profile/faq-help" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}