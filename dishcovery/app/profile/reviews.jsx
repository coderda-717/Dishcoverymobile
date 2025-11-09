import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Reviews() {
  const router = useRouter();

  // Mock reviews data - Backend: await reviewAPI.getMyReviews();
  const reviews = [
    {
      id: 1,
      recipe: {
        name: "Jollof Rice",
        categories: ["Lunch", "Dinner"],
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {reviews.map((item) => (
          <View key={item.id} style={styles.reviewCard}>
            {/* Recipe Info */}
            <View style={styles.recipeHeader}>
              <Image source={item.recipe.image} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{item.recipe.name}</Text>
                <View style={styles.categoryTags}>
                  {item.recipe.categories.map((cat, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.stats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={12} color="#FF6347" />
                    <Text style={styles.statText}>{item.recipe.time}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={12} color="#FF6347" />
                    <Text style={styles.statText}>{item.recipe.likes}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble" size={12} color="#FF6347" />
                    <Text style={styles.statText}>{item.recipe.comments}</Text>
                  </View>
                  <Text style={styles.flag}>{item.recipe.flag}</Text>
                </View>
              </View>
            </View>

            {/* Reviewers */}
            <View style={styles.reviewersSection}>
              <View style={styles.reviewerImages}>
                {item.reviewers.slice(0, 3).map((reviewer, index) => (
                  <Image
                    key={index}
                    source={{ uri: reviewer.image }}
                    style={[styles.reviewerImage, { marginLeft: index * -10 }]}
                  />
                ))}
              </View>
              <Text style={styles.reviewersText}>
                Reviewed by {item.reviewers[0].name} and others
              </Text>
              <TouchableOpacity style={styles.viewReviewsBtn}>
                <Text style={styles.viewReviewsText}>View Reviews</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF6347" />
              </TouchableOpacity>
            </View>

            {/* Individual Reviews */}
            {item.reviewers.map((reviewer, index) => (
              <View key={index} style={styles.reviewItem}>
                <Image source={{ uri: reviewer.image }} style={styles.reviewerAvatar} />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{reviewer.name}</Text>
                    <Text style={styles.reviewTime}>{reviewer.time}</Text>
                  </View>
                  <Text style={styles.reviewText}>
                    Perfectly spiced and rich in flavor! The grains stayed separate, and the aroma filled my kitchen. This is the real party food!
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.replyText}>Reply</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.likeSection}>
                  <Ionicons name="heart-outline" size={20} color="#666" />
                  <Text style={styles.likeCount}>{item.reviewCount}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  reviewCard: {
    backgroundColor: '#F5F5F5',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
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
    gap: 3,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  flag: {
    fontSize: 14,
  },
  reviewersSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginBottom: 12,
  },
  reviewerImages: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  reviewersText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  viewReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewReviewsText: {
    fontSize: 14,
    color: '#FF6347',
    fontWeight: '600',
  },
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewTime: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
  },
  likeSection: {
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});