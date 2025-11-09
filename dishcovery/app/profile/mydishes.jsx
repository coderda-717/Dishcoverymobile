import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import recipes from '../recipe/recipe';

export default function MyDishes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter to show only user's recipes
  const myRecipes = recipes.filter(r => r.chef?.name === "You");

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  const filteredRecipes = myRecipes.filter(recipe => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleShare = (recipe) => {
    Alert.alert("Share", `Sharing ${recipe.name}`);
    // Backend: Implement share functionality
  };

  const handleDelete = (recipeId) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Backend: await recipeAPI.delete(recipeId);
            Alert.alert("Success", "Recipe deleted");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dishes</Text>
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
          placeholder="Search your dishes"
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
            <View key={recipe.id} style={styles.recipeCard}>
              <Image source={recipe.image} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                
                <View style={styles.categoryTags}>
                  {recipe.categories?.map((cat, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.recipeStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={14} color="#FF6347" />
                    <Text style={styles.statText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={14} color="#FF6347" />
                    <Text style={styles.statText}>{recipe.likes || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="chatbubble" size={14} color="#FF6347" />
                    <Text style={styles.statText}>{recipe.comments || 0}</Text>
                  </View>
                  <Text style={styles.flag}>{recipe.flag}</Text>
                </View>

                <Text style={styles.recipeDesc} numberOfLines={3}>
                  {recipe.aboutrecipe}
                </Text>

                <View style={styles.recipeFooter}>
                  <View style={styles.authorInfo}>
                    <Image 
                      source={{ uri: "https://i.pravatar.cc/80?img=50" }}
                      style={styles.authorImage}
                    />
                    <View>
                      <Text style={styles.authorName}>You</Text>
                      <Text style={styles.timePosted}>{recipe.chef?.timePosted}</Text>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleShare(recipe)}>
                      <Ionicons name="share-social" size={22} color="#FF6347" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(recipe.id)}>
                      <Ionicons name="trash" size={22} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No dishes found</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a1a1a',
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#FF6347',
    borderColor: '#FF6347',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  recipesList: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  categoryTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  flag: {
    fontSize: 16,
  },
  recipeDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timePosted: {
    fontSize: 11,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});