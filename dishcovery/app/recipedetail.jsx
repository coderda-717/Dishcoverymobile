import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeCard = ({ recipe, onCategoryPress }) => {
  // Map backend fields to display format
  const displayRecipe = {
    id: recipe.id,
    title: recipe.name,
    categories: [recipe.category],
    time: `${recipe.cookingTime} mins`,
    description: recipe.description,
    image: recipe.image ? { uri: recipe.image } : require('../assets/images/placeholder.png'),
    rating: recipe.rating,
    chef: {
      name: recipe.userId ? `User ${recipe.userId}` : 'Chef',
      timePosted: `${recipe.prepTime} ago`,
    }
  };

  return (
    <View style={styles.card}>
      <Image source={displayRecipe.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{displayRecipe.title}</Text>
        
        <View style={styles.categories}>
          {displayRecipe.categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.badge}
              onPress={() => onCategoryPress && onCategoryPress(cat)}
            >
              <Text style={styles.badgeText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color="#FF6347" />
          <Text style={styles.time}>{displayRecipe.time}</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {displayRecipe.description}
        </Text>

        <View style={styles.chefSection}>
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>{displayRecipe.chef.name}</Text>
            <Text style={styles.postTime}>{displayRecipe.chef.timePosted}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'GoogleSans-Bold',
  },
  categories: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  time: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GoogleSans-Regular',
  },
  description: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'GoogleSans-Regular',
  },
  chefSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'GoogleSans-Medium',
  },
  postTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
    fontFamily: 'GoogleSans-Regular',
  },
});

export default RecipeCard;