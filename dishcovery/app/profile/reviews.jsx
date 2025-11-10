import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Reviews() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock reviews data - Backend: await reviewAPI.getMyReviews();
  const reviews = [
    {
      id: 1,
      recipe: {
        id: 'jollof-rice-001',
        name: "Jollof Rice",
        category: "Nigerian",
        time: "90 mins",
        likes: 13,
        comments: 5,
        flag: "🇳🇬",
        image: require("../../assets/images/recipeimages/jollof.png"),
      },
      reviewers: [
        { name: "Chef_dammy", image: "https://i.pravatar.cc/50?img=1", time: "1w" },
        { name: "ToluChef", image: "https://i.pravatar.cc/50?img=2", time: "3d" },
        { name: "FoodieJane", image: "https://i.pravatar.cc/50?img=3", time: "2d" },
      ],
      reviewCount: 11,
    },
    {
      id: 2,
      recipe: {
        id: 'seafood-okra-002',
        name: "Seafood Okra Soup",
        category: "Nigerian",
        time: "30 mins",
        likes: 26,
        comments: 2,
        flag: "🇳🇬",
        image: require("../../assets/images/recipeimages/okra.png"),
      },
      reviewers: [
        { name: "Chef_dammy", image: "https://i.pravatar.cc/50?img=1", time: "2d" },
        { name: "OkraLover", image: "https://i.pravatar.cc/50?img=4", time: "1d" },
      ],
      reviewCount: 8,
    },
  ];

  const filteredReviews = reviews.filter(review =>
    review.recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewReviews = (recipeId) => {
    // Navigate to SeeReview page with recipe ID
    router.push(`/seereview?id=${recipeId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredReviews.length > 0 ? (
          filteredReviews.map((item) => (
            <View key={item.id} style={styles.reviewCard}>
              {/* Recipe Info */}
              <View style={styles.recipeHeader}>
                <Image source={item.recipe.image} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName} numberOfLines={1}>
                    {item.recipe.name}
                  </Text>
                  <View style={styles.categoryTags}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{item.recipe.category}</Text>
                    </View>
                  </View>
                  <View style={styles.stats}>
                    <View style={styles.statItem}>
                      <Ionicons name="time" size={13} color="#ff4458" />
                      <Text style={styles.statText}>{item.recipe.time}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="thumbs-up" size={13} color="#ff4458" />
                      <Text style={styles.statText}>{item.recipe.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="chatbubble" size={13} color="#ff4458" />
                      <Text style={styles.statText}>{item.recipe.comments}</Text>
                    </View>
                    <Text style={styles.flag}>{item.recipe.flag}</Text>
                  </View>
                </View>
              </View>

              {/* Reviewers Section */}
              <View style={styles.reviewersSection}>
                <View style={styles.reviewersRow}>
                  <View style={styles.reviewerImages}>
                    {item.reviewers.slice(0, 3).map((reviewer, index) => (
                      <Image
                        key={index}
                        source={{ uri: reviewer.image }}
                        style={[styles.reviewerImage, { marginLeft: index === 0 ? 0 : -12 }]}
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewersText}>
                    Reviewed by <Text style={styles.reviewerNameHighlight}>{item.reviewers[0].name}</Text> and others
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewReviewsBtn}
                  onPress={() => handleViewReviews(item.recipe.id)}
                >
                  <Text style={styles.viewReviewsText}>View Reviews</Text>
                  <Ionicons name="arrow-forward" size={16} color="#ff4458" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No reviews found</Text>
            <Text style={styles.emptySubtext}>Your recipe reviews will appear here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#ff4458',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  flag: {
    fontSize: 16,
  },
  reviewersSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewersRow: {
    flex: 1,
    marginRight: 12,
  },
  reviewerImages: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reviewerImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reviewersText: {
    fontSize: 12,
    color: '#666',
  },
  reviewerNameHighlight: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  viewReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ff4458',
    borderRadius: 8,
  },
  viewReviewsText: {
    fontSize: 13,
    color: '#ff4458',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});