import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { recipeAPI } from '../services/api';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeAPI.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      Alert.alert('Error', 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dishcovery</Text>

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
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <ScrollView 
        style={styles.recipeSection}
        contentContainerStyle={styles.recipeContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe}
              onCategoryPress={setSelectedCategory}
            />
          ))
        ) : (
          <View style={styles.noRecipes}>
            <Text style={styles.noRecipesText}>No recipes found</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: 'GoogleSans-Bold',
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  categoryBtnActive: {
    backgroundColor: '#FF6347',
    borderColor: '#FF6347',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'GoogleSans-Regular',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 12,
  },
  recipeSection: {
    flex: 1,
    marginBottom: 70,
  },
  recipeContent: {
    paddingBottom: 20,
  },
  noRecipes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noRecipesText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'GoogleSans-Regular',
  },
});