import { View, TextInput, StyleSheet } from "react-native"

const OTPInput = ({ value, onChangeText }) => {
  const digits = value.split("").slice(0, 6)

  const handleDigitChange = (index, digit) => {
    if (!/^\d*$/.test(digit)) return
    const newDigits = [...digits]
    newDigits[index] = digit
    onChangeText(newDigits.join(""))
  }

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <TextInput
          key={index}
          style={styles.digitInput}
          maxLength={1}
          keyboardType="numeric"
          value={digits[index] || ""}
          onChangeText={(digit) => handleDigitChange(index, digit)}
          placeholder="-"
          placeholderTextColor="#ccc"
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  digitInput: {
    width: "15%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
})

export default OTPInput
