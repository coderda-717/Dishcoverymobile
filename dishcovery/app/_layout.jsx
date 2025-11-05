import { SplashScreen, Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect, useCallback } from 'react';

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
     {/* Splash screen*/}
     <Stack.Screen name="splash" options={{ headerShown: false }} />

      {/* Auth screens (login, register, etc.) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* Main app tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Recipe detail page */}
      <Stack.Screen name="recipedetail" options={{ headerShown: false }} />
    </Stack>
  );
}