import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from "expo-router"
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import DishSafeAreaView from '../components/DishSafearea';

const SignInScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const handleChange = (name, value) => setForm({ ...form, [name]: value })
  const router = useRouter()

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/images/image1.png")} style={styles.image1} />

        <View style={styles.headerContainer}>
          <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Please log in</Text>
        </View>

        <View style={styles.formContainer}>
          <AuthInput placeholder="Email" value={form.email} onChangeText={(v) => handleChange("email", v)} />
          <AuthInput
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AuthButton title="Log In" onPress={() => {}} />
          <AuthButton title="Continue with Google" type="google" onPress={() => {}} />
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </DishSafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    // paddingTop: 16,
    justifyContent: "center",
    // backgroundColor: '',
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  link: {
    textAlign: "center",
    color: "#FF4C4C",
    fontWeight: "600",
    fontSize: 14,
  },
  image1: {
    position: "absolute",
    width: 130,
    height: 130,
    resizeMode: "contain",
    left: -20,
    top: 0,
  },
});

export default SignInScreen;