import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const RecipeCard = ({ recipe, onCategoryPress }) => {
  return (
    <View style={styles.card}>
      <Image source={recipe.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{recipe.name}</Text>
        
        {recipe.categories && recipe.categories.length > 0 && (
        <View style={styles.categories}>
          {recipe.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.badge}
              onPress={() => onCategoryPress(category)}
            >
              <Text style={styles.badgeText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        )}
        <View style={styles.timeRow}>
          <Text style={styles.icon}>⏱</Text>
          <Text style={styles.time}>{recipe.time}</Text>
        </View>

        <Text style={styles.flag}>{recipe.flag}</Text>
        <Text style={styles.aboutrecipe}>{recipe}</Text>

        {/* Chef Section */}
        <View style={styles.chefSection}>
          <Image source={{ uri: recipe.chef.image }} style={styles.chefImage} />
          <View>
            <Text style={styles.chefName}>{recipe.chef.name}</Text>
            <Text style={styles.postTime}>{recipe.chef.timePosted}</Text>
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
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  time: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'GoogleSans-Regular',
  },
  aboutrecipe: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'GoogleSans-Regular',
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
 
  categories: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#ff4458',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
  },
  
  flag: {
    fontSize: 16,
    marginBottom: 8,
  },
 
 chefSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  chefImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
 
 
});

export default RecipeCard;