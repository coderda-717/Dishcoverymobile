// app/(auth)/_layout.jsx
import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../../assets/fonts/GoogleSans-Bold.ttf'),
  });

  // Centralized hardware back-button handling for the whole auth stack:
  // signin / signup / forgot-password -> onboarding -> index ("/")
  useEffect(() => {
    const onBackPress = () => {
      if (pathname.includes('/onboarding')) {
        router.replace('/');
        return true;
      }

      if (
        pathname.includes('/signin') ||
        pathname.includes('/signup') ||
        pathname.includes('/forgot-password')
      ) {
        router.replace('/(auth)/onboarding');
        return true;
      }

      // Any other route in this stack: fall back to default back behavior.
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [pathname, router]);

  // Show loading while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
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
      <Stack.Screen 
        name="forgot-password" 
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