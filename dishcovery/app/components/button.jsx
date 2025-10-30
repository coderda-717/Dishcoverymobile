import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const AuthButton = ({ title, onPress, type = 'primary' }) => {
  const isGoogle = type === 'google';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isGoogle ? styles.google : styles.primary]}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {isGoogle && (
          <Image
            source={require('../../assets/images/goggle.png')} // ✅ correct path and spelling
            style={styles.logo}
          />
        )}
        <Text style={[styles.text, isGoogle ? styles.googleText : styles.primaryText]}>
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
});

export default AuthButton;
