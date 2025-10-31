import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import AuthButton from "../components/button"
import DishSafeAreaView from "../components/DishSafearea"

const OnboardScreen = () => {
  const router = useRouter()

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/images/image1.png")} style={styles.imageTop} />

        {/* Center content */}
        <View style={styles.centerContainer}>
          <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.title}>Dishcovery</Text>
        </View>

        <Image source={require("../../assets/images/image1.png")} style={styles.imageBottom} />

        {/* Button container */}
        <View style={styles.buttonContainer}>
          <AuthButton title="Sign Up" onPress={() => router.push("/(auth)/sign-up")} />
          <TouchableOpacity style={styles.guestButton} onPress={() => router.push("/(home)")}>
            <Text style={styles.guestButtonText}>Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DishSafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  imageTop: {
    position: "absolute",
    width: 150,
    height: 150,
    resizeMode: "contain",
    left: -40,
    top: 20,
  },
  imageBottom: {
    position: "absolute",
    width: 150,
    height: 150,
    resizeMode: "contain",
    right: -40,
    bottom: 80,
  },
  centerContainer: {
    alignItems: "center",
    marginVertical: 60,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 40,
  },
  guestButton: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF4C4C",
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4C4C",
  },
})

export default OnboardScreen
