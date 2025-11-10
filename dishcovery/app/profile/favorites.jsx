import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import recipes from '../recipe/recipe';

export default function Favorites() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock favorite recipes - Backend: await favoriteAPI.getMyFavorites();
  const favoriteRecipes = recipes.slice(0, 5); // Mock data

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  const filteredRecipes = favoriteRecipes.filter(recipe => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleUnfavorite = (recipeId) => {
    Alert.alert(
      "Remove from Favorites",
      "Remove this recipe from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            // Backend: await favoriteAPI.remove(recipeId);
            Alert.alert("Success", "Removed from favorites");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Image 
          source={{ uri: "https://i.pravatar.cc/80?img=50" }} 
          style={styles.headerImage}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search favorites"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryBtn,
              selectedCategory === category && styles.categoryBtnActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipes List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.recipesList}
      >
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              activeOpacity={0.7}
            >
              {/* Recipe Image */}
              <Image source={recipe.image} style={styles.recipeImage} />
              
              {/* Recipe Content */}
              <View style={styles.recipeContent}>
                <Text style={styles.recipeName} numberOfLines={1}>
                  {recipe.name}
                </Text>
                
                {/* Category Tags */}
                <View style={styles.categoryTags}>
                  {recipe.categories?.slice(0, 2).map((cat, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>

                {/* Stats Row */}
                <View style={styles.recipeStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={13} color="#ff4458" />
                    <Text style={styles.statText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="thumbs-up" size={13} color="#ff4458" />
                    <Text style={styles.statText}>{recipe.likes || 13}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble" size={13} color="#ff4458" />
                    <Text style={styles.statText}>{recipe.comments || 5}</Text>
                  </View>
                  <Text style={styles.flag}>{recipe.flag}</Text>
                </View>

                {/* Description */}
                <Text style={styles.recipeDesc} numberOfLines={3}>
                  {recipe.aboutrecipe}
                </Text>

                {/* Footer with Author and Favorite Button */}
                <View style={styles.recipeFooter}>
                  <View style={styles.authorInfo}>
                    <Image 
                      source={{ uri: recipe.chef?.image || "https://i.pravatar.cc/80?img=50" }}
                      style={styles.authorImage}
                    />
                    <View>
                      <Text style={styles.authorName}>{recipe.chef?.name || "Chef"}</Text>
                      <Text style={styles.timePosted}>{recipe.chef?.timePosted || "Recently"}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleUnfavorite(recipe.id)}>
                    <Ionicons name="heart" size={26} color="#ff4458" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>Start adding recipes to your favorites!</Text>
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
  headerImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  categoryBtnActive: {
    backgroundColor: '#ff4458',
    borderColor: '#ff4458',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  recipesList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100, // Extra padding to prevent overlap with navigation
  },
  recipeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
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
  recipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
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
  recipeDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    marginBottom: 14,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timePosted: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});