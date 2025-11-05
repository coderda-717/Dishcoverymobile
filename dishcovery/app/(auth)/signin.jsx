import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from "expo-router"
import AuthInput from '../components/input';
import AuthButton from '../components/button';
import DishSafeAreaView from '../components/DishSafearea';
import AuthStyles from '../(auth)/AuthStyle';
import SignUpScreen from './signup';

    
    
  const SignInScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const handleChange = (name, value) => setForm({ ...form, [name]: value }) 
  const router= useRouter();
  

            

           
 

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={AuthStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1,}}>
        <Image source={require("../../assets/images/image2.png")} style={AuthStyles.image2} />
        </View>
                <View style={{ flex: 2, marginTop: 150,}}>
        <View style={AuthStyles.headerContainer}>
          <Image source={require("../../assets/images/icon.png")} style={AuthStyles.logo} />
          <Text style={AuthStyles.title}>Welcome Back!</Text>
          <Text style={AuthStyles.subtitle}>Please log in</Text>
        </View>

        <View style={AuthStyles.formContainer}>
        <ScrollView>
          <Text style={AuthStyles.label}>Email</Text>
          <AuthInput placeholder="Email" value={form.email} onChangeText={(v) => handleChange("email", v)} />
          <Text style={AuthStyles.label}>Password</Text>
         
          <AuthInput
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
          />
          
           </ScrollView>
          
        </View>
       <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
          <Text style={AuthStyles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={AuthStyles.buttonContainer}>

      
          <AuthButton title="Log In" onPress={() =>router.push("/(tabs)")} />
        
          <AuthButton title="Continue with Google" type="google" onPress={() => {}} />
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={AuthStyles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </DishSafeAreaView>
  )
     
};

    export default  SignInScreen ;

  
  
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 140,
  },

});


  
            