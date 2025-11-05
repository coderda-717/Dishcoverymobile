import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';

const NavIcon = ({ activeIcon, defaultIcon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {isActive && <View style={styles.activeBar} />}
      <Image 
        source={isActive ? activeIcon : defaultIcon} 
        style={styles.icon}
      />
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  activeBar: {
    position: 'absolute',
    top: -1,
    width: 60,
    height: 3,
    backgroundColor: '#ff4458',
    borderRadius: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#999',
  },
  labelActive: {
    color: '#ff4458',
    fontWeight: '600',
  },
});

export default NavIcon;