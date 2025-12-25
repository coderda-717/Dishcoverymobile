import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FAQHelp() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "Tap 'Sign Up' on the login screen, enter your details, and you're ready to start exploring recipes!"
    },
    {
      id: 2,
      question: "How do I add a recipe?",
      answer: "Tap the '+' icon in the navigation bar, fill in the recipe details, add a photo, and publish!"
    },
    {
      id: 3,
      question: "Can I save recipes to view later?",
      answer: "Yes! Tap the heart icon on any recipe to save it to your Favorites for easy access."
    },
    {
      id: 4,
      question: "How do I search for recipes?",
      answer: "Use the Dishcover tab and type keywords like ingredients, dish names, or cuisine types in the search bar."
    },
    {
      id: 5,
      question: "Can I edit or delete my recipes?",
      answer: "Yes! Go to My Dishes in your profile, select the recipe, and choose 'Edit' or 'Delete'."
    },
    {
      id: 6,
      question: "How do I change my profile picture?",
      answer: "Go to Edit Profile, tap the camera icon on your profile picture, and select a new photo."
    },
    {
      id: 7,
      question: "Is my data secure?",
      answer: "Absolutely! We use encryption and secure servers to protect your information. Read our Privacy Policy for more details."
    },
    {
      id: 8,
      question: "How do I report inappropriate content?",
      answer: "Tap the three dots on any recipe or review and select 'Report'. We'll review it promptly."
    },
    {
      id: 9,
      question: "Can I follow other chefs?",
      answer: "This feature is coming soon! Stay tuned for updates."
    },
    {
      id: 10,
      question: "How do I contact support?",
      answer: "Tap 'Contact Support' below or email us at support@dishcovery.app"
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@dishcovery.app');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ & Help</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Help Icon */}
        <View style={styles.helpSection}>
          <Ionicons name="help-circle" size={80} color="#FF6347" />
          <Text style={styles.helpTitle}>How can we help you?</Text>
        </View>

        {/* FAQ Items */}
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() => toggleExpand(faq.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </View>
            {expandedId === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Still Need Help */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
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
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 12,
  },
  contactSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 10,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
