import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import recipes from '../recipe/recipe';

export default function Dishcover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Jollof Rice', 'Egusi Soup', 'Pounded Yam']);
  const router = useRouter();

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => setShowDropdown(false), 200);
  };

  // Search using both 'name' and 'title', and 'aboutrecipe' and 'description'
  const searchResults = searchQuery.length > 0 
    ? safeRecipes.filter(recipe => {
        const query = searchQuery.toLowerCase();
        // Handle both 'name' and 'title' properties
        const recipeName = recipe?.name || recipe?.title || '';
        const recipeDesc = recipe?.aboutrecipe || recipe?.description || '';
        const nameMatch = recipeName.toLowerCase().includes(query);
        const descMatch = recipeDesc.toLowerCase().includes(query);
        return nameMatch || descMatch;
      })
    : [];

  const handleRecipePress = (recipeId, recipeName) => {
    // Add to recent searches
    if (!recentSearches.includes(recipeName)) {
      setRecentSearches([recipeName, ...recentSearches].slice(0, 5));
    }
    setShowDropdown(false);
    setSearchQuery('');
    router.push(`/recipe/${recipeId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dishcovery</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image 
            source={require('../../assets/icons/search-icon.png')} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search any meal, ingredient or cousine"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>

        {showDropdown && (
          <>
            <View style={styles.overlay} />
            <View style={styles.searchDropdown}>
              {searchQuery.length === 0 ? (
                <View>
                  <Text style={styles.dropdownHeader}>Recent</Text>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchDropdownItem}
                      onPress={() => setSearchQuery(search)}
                    >
                      <Text style={styles.searchDropdownText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {searchResults.length > 0 ? (
                    searchResults.map((recipe) => (
                      <TouchableOpacity
                        key={recipe.id}
                        style={styles.searchDropdownItem}
                        onPress={() => handleRecipePress(recipe.id, recipe.name || recipe.title)}
                      >
                        <Text style={styles.searchDropdownText}>
                          {recipe.name || recipe.title}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.searchDropdownItem}>
                      <Text style={styles.noResultsText}>No results found</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </View>

      <ScrollView 
        style={[styles.gridContainer, showDropdown && styles.blurred]}
        scrollEnabled={!showDropdown}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {safeRecipes.length > 0 ? (
            <>
              {/* First 4 grey boxes */}
              {[1, 2, 3, 4].map((num) => (
                <View key={`grey-${num}`} style={styles.gridItem}>
                  <View style={styles.greyBox} />
                </View>
              ))}

              {/* 5th item - Large rectangular (spans 2 columns) */}
              {safeRecipes[0] && (
                <TouchableOpacity
                  key={`large-${safeRecipes[0].id}`}
                  style={styles.largeGridItem}
                  onPress={() => !showDropdown && handleRecipePress(safeRecipes[0].id, safeRecipes[0].name || safeRecipes[0].title)}
                  disabled={showDropdown}
                >
                  <Image source={safeRecipes[0].image} style={styles.gridImage} />
                </TouchableOpacity>
              )}

              {/* 6th item - Large rectangular (spans 2 columns) */}
              {safeRecipes[1] && (
                <TouchableOpacity
                  key={`large-${safeRecipes[1].id}`}
                  style={styles.largeGridItem}
                  onPress={() => !showDropdown && handleRecipePress(safeRecipes[1].id, safeRecipes[1].name || safeRecipes[1].title)}
                  disabled={showDropdown}
                >
                  <Image source={safeRecipes[1].image} style={styles.gridImage} />
                </TouchableOpacity>
              )}

              {/* Next 8 square items (items 2-9) */}
              {safeRecipes.slice(2, 10).map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.gridItem}
                  onPress={() => !showDropdown && handleRecipePress(recipe.id, recipe.name || recipe.title)}
                  disabled={showDropdown}
                >
                  <Image source={recipe.image} style={styles.gridImage} />
                </TouchableOpacity>
              ))}

              {/* Last 2 large rectangular items (items 10-11) */}
              {safeRecipes.slice(10, 12).map((recipe) => (
                <TouchableOpacity
                  key={`large-end-${recipe.id}`}
                  style={styles.largeGridItem}
                  onPress={() => !showDropdown && handleRecipePress(recipe.id, recipe.name || recipe.title)}
                  disabled={showDropdown}
                >
                  <Image source={recipe.image} style={styles.gridImage} />
                </TouchableOpacity>
              ))}

              {/* Remaining items as squares */}
              {safeRecipes.slice(12).map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.gridItem}
                  onPress={() => !showDropdown && handleRecipePress(recipe.id, recipe.name || recipe.title)}
                  disabled={showDropdown}
                >
                  <Image source={recipe.image} style={styles.gridImage} />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.noRecipes}>
              <Text style={styles.noRecipesText}>No recipes available</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: 'GoogleSans-Bold',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontFamily: 'GoogleSans-Regular',
  },
  dropdownHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    fontFamily: 'GoogleSans-Medium',
  },
  searchDropdownText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'GoogleSans-Regular',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ff4458',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
    marginRight: 8,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: -1000,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  searchDropdown: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 400,
    zIndex: 1001,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  searchDropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noResultsText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'GoogleSans-Regular',
  },
  blurred: {
    opacity: 0.3,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: 70,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
  },
  largeGridItem: {
    width: '66.66%',
    aspectRatio: 2,
    padding: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  greyBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  noRecipes: {
    flex: 1,
    width: '100%',
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