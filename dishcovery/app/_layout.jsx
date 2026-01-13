// dishcovery/app/_layout.jsx
// ✅ FIXED - Properly handles authentication and onboarding flow

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
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

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
    const inSplash = segments[0] === 'splash';

    console.log('🧭 Navigation check:', { 
      segments, 
      isAuthenticated, 
      hasCompletedOnboarding,
      inAuthGroup,
      inTabsGroup,
      inSplash
    });

    // ✅ CRITICAL FIX: Proper navigation priority
    if (isAuthenticated && hasCompletedOnboarding) {
      // User is fully authenticated and onboarded
      if (!inTabsGroup) {
        console.log('➡️ Authenticated user -> Redirecting to tabs');
        router.replace('/(tabs)');
      }
    } else if (!hasCompletedOnboarding && !inSplash) {
      // User hasn't completed onboarding
      console.log('➡️ No onboarding -> Redirecting to splash');
      router.replace('/splash');
    } else if (hasCompletedOnboarding && !isAuthenticated && !inAuthGroup) {
      // User completed onboarding but not authenticated
      console.log('➡️ Not authenticated -> Redirecting to signin');
      router.replace('/(auth)/signin');
    }
  }, [isReady, isAuthenticated, hasCompletedOnboarding, segments, fontsLoaded]);

  const checkAuthStatus = async () => {
    try {
      // ✅ FIX: Check for both userToken AND authToken (in case your API uses different key)
      const [userToken, authToken, onboardingStatus] = await AsyncStorage.multiGet([
        'userToken',
        'authToken',
        'hasCompletedOnboarding'
      ]);
      
      const token = userToken[1] || authToken[1];
      const hasOnboarded = onboardingStatus[1] === 'true';
      
      console.log('🔍 Initial auth check:', { 
        hasToken: !!token, 
        hasOnboarded,
        userToken: !!userToken[1],
        authToken: !!authToken[1]
      });
      
      setIsAuthenticated(!!token);
      setHasCompletedOnboarding(hasOnboarded);
      setIsReady(true);
      
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
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