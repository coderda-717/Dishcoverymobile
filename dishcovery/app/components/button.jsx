import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AuthButton = ({ title, onPress, type = 'primary' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, type === 'google' ? styles.google : styles.primary]}
    >
      <Text style={[styles.text, type === 'google' ? styles.googleText : styles.primaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#FF4C4C',
  },
  google: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  googleText: {
    color: '#333',
  },
});

export default AuthButton;
