import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsConditions() {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Section 1 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>User Accounts</Text>
          </View>
          <Text style={styles.text}>
            To access certain features, you'll need to create an account.
          </Text>
          <Text style={styles.text}>
            You agree to provide accurate information when signing up and to keep your login details secure. You're responsible for any activity that occurs under your account.
          </Text>
          <Text style={styles.text}>
            If you believe your account has been compromised, please contact us immediately at{' '}
            <Text style={styles.email} onPress={handleEmailPress}>
              support@dishcovery.app
            </Text>
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Using Dishcovery</Text>
          </View>
          <Text style={styles.text}>
            Dishcovery is designed to help you explore, share, and review delicious dishes.
          </Text>
          <Text style={styles.text}>
            Please use the app respectfully and responsibly. Do not post or share content that is offensive, misleading, or infringes on the rights of others.
          </Text>
          <Text style={styles.text}>
            We reserve the right to remove content or suspend accounts that violate these guidelines.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>User-Generated Content</Text>
          </View>
          <Text style={styles.text}>
            When you share a review, comment, or recipe photo, you keep ownership of your content — yours or that you have permission to use it.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Privacy</Text>
          </View>
          <Text style={styles.text}>
            Your privacy matters to us.
          </Text>
          <Text style={styles.text}>
            All information collected through your use of Dishcovery is handled according to our Privacy & Policy, which you can read separately on the Privacy page.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="refresh" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>App Updates and Changes</Text>
          </View>
          <Text style={styles.text}>
            We're always improving Dishcovery!
          </Text>
          <Text style={styles.text}>
            This means features or layouts may change from time to time. We may also update these Terms occasionally, and we'll notify you in the app when major updates occur.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          </View>
          <Text style={styles.text}>
            Dishcovery aims to provide accurate information, but we cannot guarantee that all recipe data or content will always be error-free.
          </Text>
          <Text style={styles.text}>
            We are not responsible for any loss, injury, or damage resulting from the use of information or content within the app.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="close-circle" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Termination</Text>
          </View>
          <Text style={styles.text}>
            We may suspend or terminate access to your account if you violate these Terms or misuse the app.
          </Text>
          <Text style={styles.text}>
            You can delete your account at any time in your profile settings.
          </Text>
        </View>

        {/* Section 8 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color="#FF6347" />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <Text style={styles.text}>
            If you have questions about these Terms, please contact us at:
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
