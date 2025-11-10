import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const RecipeCard = ({ recipe, onCategoryPress }) => {
  const router = useRouter();

  // Check if this is a backend recipe (has URL string) or local recipe (has require object)
  const isBackendRecipe = recipe.image && typeof recipe.image === 'string' && recipe.image.startsWith('http');
  
  // Map backend fields to component format
  const displayRecipe = {
    id: recipe.id,
    name: recipe.name || recipe.title,
    // Backend uses single category string, local uses array - normalize to single string
    category: typeof recipe.category === 'string' ? recipe.category : (Array.isArray(recipe.category) ? recipe.category[0] : 'Nigerian'),
    time: recipe.cookingTime || recipe.time || 60,
    aboutrecipe: recipe.description || recipe.aboutrecipe || 'A delicious recipe',
    flag: recipe.flag || '🇳🇬',
    image: isBackendRecipe ? { uri: recipe.image } : recipe.image,
    chef: recipe.chef || {
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: recipe.userId ? `Chef ${recipe.userId}` : 'Chef',
      timePosted: recipe.createdAt ? getTimeAgo(recipe.createdAt) : '2 days ago'
    }
  };

  function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  }

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleCategoryPress = () => {
    if (onCategoryPress && displayRecipe.category) {
      onCategoryPress(displayRecipe.category);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* Recipe Image */}
      <Image 
        source={displayRecipe.image} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        {/* Recipe Name */}
        <Text style={styles.name} numberOfLines={1}>{displayRecipe.name}</Text>
        
        {/* Time and Flag Row */}
        <View style={styles.timeRow}>
          <View style={styles.timeContainer}>
            <View style={styles.timeIcon} />
            <Text style={styles.time}>{displayRecipe.time} mins</Text>
          </View>
          <Text style={styles.flag}>{displayRecipe.flag}</Text>
        </View>
        
        {/* Description */}
        <Text style={styles.aboutrecipe} numberOfLines={2}>
          {displayRecipe.aboutrecipe}
        </Text>

        {/* Chef Section */}
        <View style={styles.chefSection}>
          <Image 
            source={{ uri: displayRecipe.chef.image }} 
            style={styles.chefImage} 
          />
          <View style={styles.chefInfo}>
            <Text style={styles.chefName} numberOfLines={1}>{displayRecipe.chef.name}</Text>
            <Text style={styles.postTime}>{displayRecipe.chef.timePosted}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
    fontFamily: 'GoogleSans-Bold',
    letterSpacing: 0.2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff4458',
    marginRight: 6,
  },
  time: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'GoogleSans-Medium',
  },
  flag: {
    fontSize: 20,
  },
  aboutrecipe: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'GoogleSans-Regular',
  },
  chefSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    fontFamily: 'GoogleSans-Medium',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'GoogleSans-Regular',
  },
});

export default RecipeCard;