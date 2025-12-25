import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ headerShown: false }}
        initialRouteName="splash"
      >
        <Stack.Screen 
          name="splash" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/edit-profile" />
        <Stack.Screen name="profile/my-dishes" />
        <Stack.Screen name="profile/favorites" />
        <Stack.Screen name="profile/reviews" />
        <Stack.Screen name="profile/privacy-policy" />
        <Stack.Screen name="profile/terms-conditions" />
        <Stack.Screen name="profile/faq-help" />
      </Stack>
    </AuthProvider>
  );
}