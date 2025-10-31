import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../components/input";
import AuthButton from "../components/button";
import DishSafeAreaView from "../components/DishSafearea";
import AuthStyles from '../(auth)/AuthStyle';


const SignUpScreen = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleChange = (name, value) => setForm({ ...form, [name]: value })

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={AuthStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/images/image1.png")} style={AuthStyles.image1} />

        <View style={AuthStyles.headerContainer}>
          <Image source={require("../../assets/images/icon.png")} style={AuthStyles.logo} />
          <Text style={AuthStyles.title}>Ready to Dishcover?</Text>
          <Text style={AuthStyles.subtitle}>Fill in your details to sign up</Text>
        </View>

        <View style={AuthStyles.formContainer}>
          <Text style={AuthStyles.label}>Firstname</Text>
          <AuthInput
            placeholder="First Name"
            value={form.firstName}
            onChangeText={(v) => handleChange("firstName", v)}
          />
          <Text style={AuthStyles.label}>Lastname</Text>
          <AuthInput placeholder="Last Name" value={form.lastName} onChangeText={(v) => handleChange("lastName", v)} />
          <Text style={AuthStyles.label}>Email</Text>
          <AuthInput placeholder="Email" value={form.email} onChangeText={(v) => handleChange("email", v)} />
          <Text style={AuthStyles.label}>Password</Text>
          <AuthInput
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
          <Text style={AuthStyles.label}>Confirm Password</Text>
          <AuthInput
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => handleChange("confirmPassword", v)}
          />
        </View>

        <View style={AuthStyles.buttonContainer}>
          <AuthButton title="Sign Up" onPress={() => {}} />
          <AuthButton title="Continue with Google" type="google" onPress={() => {}} />
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
          <Text style={AuthStyles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </DishSafeAreaView>
  )
};

export default SignUpScreen;