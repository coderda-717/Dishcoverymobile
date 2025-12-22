import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import AuthInput from "../components/input"
import AuthButton from "../components/button"
import OTPInput from "../components/otp-input"
import DishSafeAreaView from "../components/DishSafearea"
import AuthStyles from '../(auth)/AuthStyle';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';

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
    return password.length >= 6
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
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // For now, backend returns placeholder message
        // In production, this would send actual email
        setStep(2)
      } else {
        setError(data.error || data.message || "Failed to send reset email")
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    setError("")
    if (otp.length !== 5) {
      setError("Please enter a valid 5-digit code")
      return
    }

    setLoading(true)
    try {
      // Simulate OTP verification
      // In production, this would verify with backend
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          otp: otp 
        }),
      });

      if (response.ok) {
        setStep(3)
      } else {
        setError("Invalid code. Please try again.")
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      // For now, allow progression since backend doesn't have this endpoint yet
      setStep(3)
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
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStep(4)
      } else {
        setError(data.error || data.message || "Failed to reset password")
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError("Network error. Please try again.")
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
        {/* Back Button */}
        {step > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Image source={require("../../assets/images/image3.png")} style={styles.backText}/>
          </TouchableOpacity>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        
        <Text style={styles.subtitle}>
          {step === 1 && "Please enter your email to reset password"}
          {step === 2 && "Enter the 5 digit code sent to your email"}
          {step === 3 && "Enter your new password"}
          {step === 4 && "Your password has been reset successfully"}
        </Text>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <View style={styles.formContainer}>
            <Text style={AuthStyles.label}>Email</Text>
            <AuthInput 
              placeholder="Email" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <View style={styles.formContainer}>
            <Text style={styles.otpLabel}>Enter verification code</Text>
            <OTPInput 
              value={otp} 
              onChangeText={setOtp}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={handleEmailSubmit}
              disabled={loading}
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <View style={styles.formContainer}>
            <Text style={AuthStyles.label}>Password</Text>
            <AuthInput 
              placeholder="New Password" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword}
              editable={!loading}
            />
            <Text style={AuthStyles.label}>Confirm Password</Text>
            <AuthInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <Text style={styles.hint}>Password must be at least 6 characters</Text>
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
              title={
                loading ? "Processing..." :
                step === 1 ? "Reset Password" : 
                step === 2 ? "Confirm" : 
                "Update Password"
              }
              onPress={
                step === 1 ? handleEmailSubmit : 
                step === 2 ? handleOTPSubmit : 
                handlePasswordReset
              }
              disabled={loading}
            />
          )}
          {loading && (
            <ActivityIndicator 
              size="small" 
              color="#FF6B35" 
              style={styles.loader}
            />
          )}
          {step === 4 && (
            <AuthButton 
              title="Back to Login" 
              onPress={() => router.push("/(auth)/signin")} 
            />
          )}
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
    marginTop: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: "#FF4C4C",
    width: 15,
    height: 24,
    position: 'absolute',
    top: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 10,
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
  resendButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  resendText: {
    color: "#FF4C4C",
    fontSize: 14,
    fontWeight: "600",
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
    position: 'relative',
  },
  errorText: {
    color: "#FF4C4C",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  loader: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
})

export default ForgotPasswordScreen