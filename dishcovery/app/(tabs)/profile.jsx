import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Profile page coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});