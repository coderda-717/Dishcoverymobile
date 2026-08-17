import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const AuthButton = ({ title, onPress, type = 'primary', disabled = false }) => {
  const isGoogle = type === 'google';
  const isGuest = type === 'guest';

  const buttonStyle = isGoogle
    ? styles.google
    : isGuest
    ? styles.guest
    : styles.primary;

  const textStyle = isGoogle
    ? styles.googleText
    : isGuest
    ? styles.guestText
    : styles.primaryText;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle, disabled && styles.disabled]}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.content}>
        {isGoogle && (
          <Image
            source={require('../../assets/images/goggle.png')} // ✅ correct path and spelling
            style={styles.logo}
          />
        )}
        <Text style={[styles.text, textStyle]}>
          {title}
        </Text>
      </View>
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
  guest: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF4C4C',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
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
  guestText: {
    color: '#FF4C4C',
  },
});

export default AuthButton;