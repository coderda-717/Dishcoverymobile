import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@dishcovery.app');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Section 1 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Privacy & Policy</Text>
          </View>
          <Text style={styles.text}>
            At Dishcovery, your privacy matters to us as much as your love for good food. This policy explains how we collect, use, and protect your personal information to ensure that your experience on Dishcovery is safe, personal, and enjoyable.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Information We Collect</Text>
          </View>
          <Text style={styles.text}>
            When you create an account, we collect basic details such as your name, email address, and profile photo to personalize your experience.
          </Text>
          <Text style={styles.text}>
            As you use Dishcovery, we also gather data about your activity — the recipes you save, the reviews you write, and your favorite dishes.
          </Text>
          <Text style={styles.text}>
            If you enable location services, we may use it to show local dishes or cultural recipes that match where you are.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          </View>
          <Text style={styles.text}>
            We use the information we collect to make Dishcovery better for you.
          </Text>
          <Text style={styles.text}>
            Your activity helps us recommend recipes you might love, display your reviews to others, and understand what features to improve next.
          </Text>
          <Text style={styles.text}>
            We never use your data for purposes unrelated to your Dishcovery experience.
          </Text>
          <Text style={styles.text}>
            Dishcovery does not sell your personal data to anyone.
          </Text>
          <Text style={styles.text}>
            The only information that other users can see is your username, profile photo, and the reviews you choose to share publicly.
          </Text>
          <Text style={styles.text}>
            You are always in control — you can edit or delete your reviews and account information whenever you wish.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Your Privacy and Security</Text>
          </View>
          <Text style={styles.text}>
            We take the protection of your data seriously.
          </Text>
          <Text style={styles.text}>
            Dishcovery uses secure servers and encryption to keep your information safe.
          </Text>
          <Text style={styles.text}>
            We regularly review and update our systems to maintain a high standard of security.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hand-left" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Your Choices and Control</Text>
          </View>
          <Text style={styles.text}>
            You can update your personal information or manage privacy settings directly from your profile page.
          </Text>
          <Text style={styles.text}>
            If you decide to stop using Dishcovery, you can request to delete your account and all related data.
          </Text>
          <Text style={styles.text}>
            You can also disable location services at any time in your device settings
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <Text style={styles.text}>
            If you have any questions or concerns about this policy or how your data is handled, please reach out to us at:
          </Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.email}>support@dishcovery.app</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  text: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
