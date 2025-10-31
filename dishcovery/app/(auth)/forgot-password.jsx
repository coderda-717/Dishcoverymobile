import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import AuthInput from "../components/input"
import AuthButton from "../components/button"
import OTPInput from "../components/otp-input"
import DishSafeAreaView from "../components/DishSafearea"
import AuthStyles from '../(auth)/AuthStyle';


const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const handleEmailSubmit = async () => {
    setError("")
    if (!email.trim()) {
      setError("Please enter your email")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    try {
      // Simulate API call to send reset email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(2)
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    setError("")
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)
    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(3)
    } catch (err) {
      setError("Invalid code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError("")
    if (!password.trim()) {
      setError("Please enter a new password")
      return
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(4)
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setError("")
    } else {
      router.back()
    }
  }

  return (
    <DishSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center',}}>
        <View>

        {/* Back Button */}
        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={require("../../assets/images/image3.png")} style={styles.backText}/>
          </TouchableOpacity>
        )}
        </View>

        <View style={styles.headerContainer}>
        
          <Text style={styles.title}>Forgot Password</Text>
         
        </View>
        </View>
         <Text style={styles.subtitle}>
            {step === 1 && "Please enter your email to reset password"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Enter your new password"}
            {step === 4 && "Your password has been reset successfully"}
          </Text>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <View style={styles.formContainer}>
          <Text style={AuthStyles.label}>Email</Text>
            <AuthInput placeholder="Email" value={email} onChangeText={setEmail} />
          </View>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.otpLabel}>Enter verification code</Text>
            <OTPInput value={otp} onChangeText={setOtp} />
          </View>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <View style={styles.formContainer}>
          <Text style={AuthStyles.label}>Password</Text>
            <AuthInput placeholder="New Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Text style={AuthStyles.label}>Confirm Password</Text>
            <AuthInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Text style={styles.hint}>Password must be at least 8 characters</Text>
          </View>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Password Reset Successful!</Text>
            <Text style={styles.successSubtext}>You can now log in with your new password</Text>
          </View>
        )}

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {step < 4 && (
            <AuthButton
              title={step === 1 ? "Reset Password" : step === 2 ? "Confirm" : "Update Password"}
              onPress={
                step === 1 ? handleEmailSubmit : step === 2 ? handleOTPSubmit : step === 3 ? handlePasswordReset : null
              }
            />
          )}
          {step === 4 && <AuthButton title="Back to Login" onPress={() => router.push("/(auth)/signin")} />}
        </View>
      </ScrollView>
    </DishSafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 16,
    justifyContent: "center",
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: "#FF4C4C",
    width: 24,
    height: 24,
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
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 64,
    color: "#FF4C4C",
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
 })

export default ForgotPasswordScreen
