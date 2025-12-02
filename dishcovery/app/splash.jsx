import React, { useEffect } from 'react';
import { View, Image, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from './context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          // User is logged in, go to main app
          router.replace("/(tabs)");
        } else {
          // User is not logged in, show onboarding
          router.replace("/(auth)/onboarding");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);
  
  return (
    <SafeAreaView style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image
          style={{
            height: 120,
            width: 120,
            marginBottom: 24,
            resizeMode: "contain",
          }}
          source={require("../assets/images/icon.png")}
        />

        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#1a1a1a",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Dishcovery
        </Text>

        <ActivityIndicator size="small" color="#FF4C4C" style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}