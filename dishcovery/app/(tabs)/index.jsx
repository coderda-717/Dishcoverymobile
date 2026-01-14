// app/(tabs)/index.js
// Updated design with logout on back button press and local recipe fallback

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  BackHandler,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { recipeAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localRecipes from '../recipe/recipe'; // ✅ Import local recipes


export default function Home() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [usingLocalData, setUsingLocalData] = useState(false);

  // Categories match backend categories
  const categories = ['All', 'Nigerian', 'Continental', 'Chinese', 'Italian', 'Mexican'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, recipes]);

  // ✅ Only handle back button when THIS screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      
      return () => backHandler.remove();
    }, [])
  );

  const handleBackPress = () => {
    // Show logout confirmation modal
    setShowLogoutModal(true);
    return true; // Prevent default back behavior
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // Clear all auth data from AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'authToken',
        'isAuthenticated',
        'userEmail',
        'userData',
      ]);
      
      console.log('✅ Logout successful');
      
      // Close modal
      setShowLogoutModal(false);
      
      // Navigate to signin
      router.replace('/(auth)/signin');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const fetchRecipes = async () => {
    try {
      console.log('📥 Fetching recipes from API...');
      const data = await recipeAPI.getAllRecipes();
      
      if (data && data.length > 0) {
        console.log('✅ API recipes loaded:', data.length);
        // ✅ Convert image paths for API recipes
        const recipesWithImages = data.map(recipe => ({
          ...recipe,
          // If image is a local path, keep it; otherwise use the URL
          image: recipe.image || 'https://via.placeholder.com/400x300?text=Recipe'
        }));
        setRecipes(recipesWithImages);
        setFilteredRecipes(recipesWithImages);
        setUsingLocalData(false);
      } else {
        // ✅ Use local recipes as fallback
        console.log('⚠️ No API recipes, using local data');
        setRecipes(localRecipes);
        setFilteredRecipes(localRecipes);
        setUsingLocalData(true);
      }
    } catch (error) {
      console.error('❌ API error, using local recipes:', error);
      // ✅ Use local recipes as fallback on error
      setRecipes(localRecipes);
      setFilteredRecipes(localRecipes);
      setUsingLocalData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Filter by category (single string, not array)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (recipe) => recipe.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.description?.toLowerCase().includes(query) ||
          recipe.category?.toLowerCase().includes(query)
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      try {
        const results = await recipeAPI.searchRecipes(query);
        setFilteredRecipes(results);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local filtering if search API fails
        filterRecipes();
      }
    } else {
      filterRecipes();
    }
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push({
        pathname: '/recipedetail',
        params: { recipeId: item.id }
      })}
    >
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.recipeImage}
        defaultSource={require('../../assets/images/recipeimages/placeholder.png')}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {item.name}
        </Text>
        
        {/* Single category display */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category || 'Nigerian'}</Text>
          </View>
        </View>

        <View style={styles.recipeDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#ff4458" />
            <Text style={styles.detailText}>
              {(item.prepTime || 0) + (item.cookingTime || 0)} min
            </Text>
          </View>
          {item.rating > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="star" size={14} color="#ff4458" />
              <Text style={styles.detailText}>{item.rating}</Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.categoryButtonTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ff4458" />
          <Text style={styles.loadingText}>Loading delicious recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Simple header with just title */}
      <View style={styles.header}>
        <Text style={styles.title}>Dishcovery</Text>
        {usingLocalData && (
          <Text style={styles.offlineBadge}>Offline Mode</Text>
        )}
      </View>

      {/* Category buttons */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {filteredRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No recipes found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? 'Try a different search term'
              : 'No recipes available in this category'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ff4458']}
              tintColor="#ff4458"
            />
          }
        />
      )}

      {/* ✅ Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="log-out-outline" size={48} color="#ff4458" style={styles.modalIcon} />
            
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Do you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleCancelLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'GoogleSans-Bold',
  },
  offlineBadge: {
    fontSize: 11,
    color: '#ff4458',
    marginTop: 4,
    fontFamily: 'GoogleSans-Regular',
  },
  categoriesContainer: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#ff4458',
    borderColor: '#ff4458',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  recipeList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recipeCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#ff4458',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  recipeDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // ✅ Logout Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#ff4458',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});