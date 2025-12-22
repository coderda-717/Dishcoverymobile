import { View, TextInput, StyleSheet } from 'react-native';

const AuthInput = ({ secureTextEntry, value, onChangeText }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    // marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default AuthInput;
