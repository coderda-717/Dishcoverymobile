import React, { useEffect } from 'react';
import { View, Image, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Show splash for 2 seconds for branding
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ALWAYS go to onboarding (for all users, every launch)
      router.replace("/(auth)/onboarding");
      
    } catch (error) {
      console.error('Splash screen error:', error);
      // On error, still show onboarding
      router.replace("/(auth)/onboarding");
    }
  };
  
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
            fontFamily: 'GoogleSans-Bold',
          }}
        >
          Dishcovery
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#666",
            marginBottom: 24,
            textAlign: "center",
            fontFamily: 'GoogleSans-Regular',
          }}
        >
          Discover flavors that bring people together
        </Text>

        <ActivityIndicator size="small" color="#FF4C4C" style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}