// app/(auth)/_layout.jsx
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../../assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../../assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../../assets/fonts/GoogleSans-Bold.ttf'),
  });

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
        name="welcome" 
        options={{
          gestureEnabled: false,
        }} 
      />
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