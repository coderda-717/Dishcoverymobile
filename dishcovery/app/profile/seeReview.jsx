import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://dishcovery-backend-1.onrender.com/api';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to create headers
const createHeaders = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export default function SeeReview() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get recipe ID from URL params
  
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (id) {
      loadRecipeReviews();
    }
  }, [id]);

  const loadRecipeReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch recipe details and its reviews
      const response = await fetch(`${API_BASE_URL}/reviews/recipe/${id}`, {
        method: 'GET',
        headers: await createHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setReviews(data.reviews);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reviews');
      console.error('Load reviews error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      // Toggle like on review
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: await createHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      
      // Update local state
      setReviews(reviews.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            isLiked: !review.isLiked,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1
          };
        }
        return review;
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to like review');
      console.error('Like review error:', error);
    }
  };

  const handleReply = (reviewId) => {
    setReplyingTo(reviewId);
  };

  const submitReply = async (reviewId) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      // Submit reply to review
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: await createHeaders(),
        body: JSON.stringify({ text: replyText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const data = await response.json();
      
      Alert.alert('Success', 'Reply posted successfully');
      setReplyText('');
      setReplyingTo(null);
      
      // Reload reviews to show new reply
      loadRecipeReviews();
    } catch (error) {
      Alert.alert('Error', 'Failed to post reply');
      console.error('Reply error:', error);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4458" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reviews</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recipe Card */}
        <View style={styles.recipeCard}>
          <Image source={recipe.image} style={styles.recipeImage} />
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <View style={styles.categoryTags}>
              {recipe.categories?.map((cat, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{cat}</Text>
                </View>
              ))}
            </View>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={13} color="#ff4458" />
                <Text style={styles.statText}>{recipe.time}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="thumbs-up" size={13} color="#ff4458" />
                <Text style={styles.statText}>{recipe.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={13} color="#ff4458" />
                <Text style={styles.statText}>{recipe.comments || reviews.length}</Text>
              </View>
              <Text style={styles.flag}>{recipe.flag}</Text>
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsContainer}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <Image 
                  source={{ uri: review.user.image }} 
                  style={styles.reviewerAvatar} 
                />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.user.name}</Text>
                    <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                  <TouchableOpacity onPress={() => handleReply(review.id)}>
                    <Text style={styles.replyText}>Reply</Text>
                  </TouchableOpacity>

                  {/* Reply Input */}
                  {replyingTo === review.id && (
                    <View style={styles.replyInputContainer}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder="Write your reply..."
                        placeholderTextColor="#999"
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                        autoFocus
                      />
                      <View style={styles.replyActions}>
                        <TouchableOpacity 
                          style={styles.cancelReplyBtn}
                          onPress={cancelReply}
                        >
                          <Text style={styles.cancelReplyText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.submitReplyBtn}
                          onPress={() => submitReply(review.id)}
                        >
                          <Text style={styles.submitReplyText}>Reply</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                
                {/* Like Section */}
                <View style={styles.likeSection}>
                  <TouchableOpacity onPress={() => handleLikeReview(review.id)}>
                    <Ionicons 
                      name={review.isLiked ? "heart" : "heart-outline"} 
                      size={22} 
                      color={review.isLiked ? "#ff4458" : "#666"} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.likeCount}>{review.likes}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyReviews}>
              <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
              <Text style={styles.emptyReviewsText}>No reviews yet</Text>
              <Text style={styles.emptyReviewsSubtext}>Be the first to review this recipe!</Text>
            </View>
          )}
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
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
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
  recipeCard: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  recipeInfo: {
    paddingHorizontal: 4,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: '#ff4458',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  flag: {
    fontSize: 16,
    marginLeft: 4,
  },
  reviewsContainer: {
    paddingHorizontal: 20,
  },
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reviewTime: {
    fontSize: 13,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  replyInputContainer: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
  },
  replyInput: {
    fontSize: 14,
    color: '#1a1a1a',
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelReplyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  cancelReplyText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  submitReplyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ff4458',
    borderRadius: 8,
  },
  submitReplyText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  likeSection: {
    alignItems: 'center',
    marginLeft: 8,
  },
  likeCount: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 6,
  },
});