import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../components/input";
import AuthButton from "../components/button";
import DishSafeAreaView from "../components/DishSafearea";

const SignUpScreen = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  return (
    <DishSafeAreaView>
      <ScrollView >
        <Image
          source={require("../../assets/images/image1.png")}
          style={styles.image1}
        />
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Ready to Dishcover?</Text>
        <Text style={styles.subtitle}>Fill in your details to sign up</Text>

        <AuthInput
          placeholder="First Name"
          value={form.firstName}
          onChangeText={(v) => handleChange("firstName", v)}
        />
        <AuthInput
          placeholder="Last Name"
          value={form.lastName}
          onChangeText={(v) => handleChange("lastName", v)}
        />
        <AuthInput
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => handleChange("email", v)}
        />
        <AuthInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />
        <AuthInput
          placeholder="Confirm Password"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(v) => handleChange("confirmPassword", v)}
        />

        <AuthButton title="Sign Up" onPress={() => {}} />
        <AuthButton
          title="Continue with Google"
          type="google"
          onPress={() => {}}
        />

        <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </DishSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    color: "#666",
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    color: "#FF4C4C",
    fontWeight: "600",
  },
  image1: {
    position: "absolute",
    width: 130,
    height: 130,
    marginBottom: 10,
    resizeMode: "contain",
    left: -20,
    top: 0,
  },
});

export default SignUpScreen;
