import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();
 



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