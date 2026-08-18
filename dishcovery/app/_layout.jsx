// dishcovery/app/_layout.jsx
import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './context/AuthContext';

function RootLayoutNav() {
  const segments = useSegments();
  const pathname = usePathname();
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
   
  }, [isReady, isAuthenticated, segments, fontsLoaded]);

  // Single, app-wide hardware back-button handler.
  // This is the ONLY place back navigation is intercepted — do not add
  // BackHandler/useFocusEffect back handling in individual screens, or you'll
  // get two competing listeners and unpredictable behavior.
  //
  // Chain: signin / signup / forgot-password -> onboarding -> index ("/")
  useEffect(() => {
    const onBackPress = () => {
      if (
        pathname.includes('/signin') ||
        pathname.includes('/signup') ||
        pathname.includes('/forgot-password')
      ) {
        router.replace('/(auth)/onboarding');
        return true;
      }

      if (pathname.includes('/onboarding')) {
        router.replace('/');
        return true;
      }

      // Any other screen: let the default back behavior happen
      // (native stack pop, or app exit if there's nothing left).
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [pathname, router]);

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
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