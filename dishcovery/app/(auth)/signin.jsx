import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from "expo-router"
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import DishSafeAreaView from '../components/DishSafearea';

const SignInScreen = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = (name, value) => setForm({ ...form, [name]: value });
   const router = useRouter()

  return (
    <DishSafeAreaView style={styles.container}>
      <Image source={require('../../assets/images/image1.png')} style={styles.image1} />

      <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please log in</Text>

      <AuthInput placeholder="Email" value={form.email} onChangeText={v => handleChange('email', v)} />
      <AuthInput placeholder="Password" secureTextEntry value={form.password} onChangeText={v => handleChange('password', v)} />

      <AuthButton title="Log In" onPress={() => {}} />
      <AuthButton title="Continue with Google" type="google" onPress={() => {}} />

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </DishSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image1: {
    position: 'absolute',
     width: 130,
    height: 130,
    marginBottom: 10,
    resizeMode: 'contain',
    left: -20,
    top: 0,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    color: '#FF4C4C',
    fontWeight: '600',
  },
});

export default SignInScreen;
