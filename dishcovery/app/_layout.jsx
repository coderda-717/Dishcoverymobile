// app/_layout.jsx
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/GoogleSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  
  return (
    <Stack initialRouteName="splash">
      {/* Splash screen */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />

      {/* Auth screens (login, register, etc.) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* Main app tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Recipe detail page */}
      <Stack.Screen name="recipedetail" options={{ headerShown: false }} />

      {/* Profile screens */}
      <Stack.Screen name="profile/edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="profile/my-dishes" options={{ headerShown: false }} />
      <Stack.Screen name="profile/favorites" options={{ headerShown: false }} />
      <Stack.Screen name="profile/reviews" options={{ headerShown: false }} />
      <Stack.Screen name="profile/privacy-policy" options={{ headerShown: false }} />
      <Stack.Screen name="profile/terms-conditions" options={{ headerShown: false }} />
      <Stack.Screen name="profile/faq-help" options={{ headerShown: false }} />
    </Stack>
  );
}