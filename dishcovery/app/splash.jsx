import { View, Image, Text, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SplashScreen() {

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
  )
}