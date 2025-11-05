import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../recipe/recipe';

export default function index() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];

  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter(recipe => recipe.categories?.includes(selectedCategory));

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
        {filteredRecipes?.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe}
            onCategoryPress={setSelectedCategory}
          />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: 'GoogleSans-Bold', // Add this
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'GoogleSans-Regular', // Add this
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium', // Add this
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
    backgroundColor: '#ff4458',
    borderColor: '#ff4458',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 12,
  },
  recipeSection: {
    flex: 1,
  },
  recipeContent: {
    paddingBottom: 20,
  },
});