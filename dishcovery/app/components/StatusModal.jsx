import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatusModal = ({ visible, type, onClose, onRetry }) => {
  const getModalConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'close-circle',
          iconColor: '#FF6B6B',
          backgroundColor: '#FFF5F5',
          title: 'Whoops!',
          message: 'something went wrong, please check your connection',
          buttonText: 'Try again',
          buttonColor: '#FF4458',
          showButton: true,
          onPress: onRetry,
        };
      case 'success':
        return {
          icon: 'checkmark-circle',
          iconColor: '#4CAF50',
          backgroundColor: '#F1F8F4',
          title: 'Congratulations!',
          message: 'You have successfully created your account',
          buttonText: 'Continue',
          buttonColor: '#4CAF50',
          showButton: true,
          onPress: onClose,
        };
      case 'message-read':
        return {
          icon: 'checkmark-circle',
          iconColor: '#4CAF50',
          backgroundColor: '#FFFFFF',
          title: 'Well Done!',
          message: 'You successfully read this important message.',
          buttonText: null,
          showButton: false,
          closeIcon: true,
        };
      default:
        return null;
    }
  };

  const config = getModalConfig();

  if (!config) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: config.backgroundColor }]}>
          {config.closeIcon && (
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}

          <View style={[styles.iconContainer, { backgroundColor: config.iconColor }]}>
            <Ionicons name={config.icon} size={40} color="#FFFFFF" />
          </View>

          <Text style={[
            styles.title,
            type === 'error' ? styles.errorTitle : styles.successTitle
          ]}>
            {config.title}
          </Text>

          <Text style={styles.message}>{config.message}</Text>

          {config.showButton && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: config.buttonColor }]}
              onPress={config.onPress}
            >
              <Text style={styles.buttonText}>{config.buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 32,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'GoogleSans-Bold',
  },
  errorTitle: {
    color: '#FF4458',
  },
  successTitle: {
    color: '#1F2937',
  },
  message: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: 'GoogleSans-Regular',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
});

export default StatusModal;