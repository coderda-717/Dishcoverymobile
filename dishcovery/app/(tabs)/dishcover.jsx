// dishcovery/app/(tabs)/dishcover.jsx
// ✅ CORRECTED - Uses proper API endpoint
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { recipeAPI } from '../services/api';

export default function Dishcover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Jollof Rice', 'Egusi Soup', 'Pounded Yam']);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Fetching recipes...');
      const data = await recipeAPI.getAllRecipes();
      console.log('✅ Recipes loaded:', data.length);
      
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Failed to fetch recipes:', error);
      setError(error.message);
      
      Alert.alert(
        'Connection Error',
        'Unable to load recipes. Please check your internet connection and try again.',
        [
          { text: 'OK' },
          { text: 'Retry', onPress: loadRecipes }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const searchResults = searchQuery.length > 0 
    ? recipes.filter(recipe => {
        const query = searchQuery.toLowerCase();
        const recipeName = recipe?.name || '';
        const recipeCategory = recipe?.category || '';
        const recipeDesc = recipe?.description || '';
        
        return (
          recipeName.toLowerCase().includes(query) ||
          recipeCategory.toLowerCase().includes(query) ||
          recipeDesc.toLowerCase().includes(query) ||
          (recipe?.ingredients && JSON.stringify(recipe.ingredients).toLowerCase().includes(query))
        );
      })
    : [];

  const handleRecipePress = (recipeId, recipeName) => {
    // Add to recent searches
    if (!recentSearches.includes(recipeName)) {
      const updatedSearches = [recipeName, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
    }
    
    setShowDropdown(false);
    setSearchQuery('');
    
    // Navigate to recipe detail
    router.push(`/recipe/${recipeId}`);
  };

  const handleRecentSearchPress = (searchTerm) => {
    setSearchQuery(searchTerm);
    setShowDropdown(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Dishcovery</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff4458" />
          <Text style={styles.loadingText}>Loading delicious recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Dishcovery</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🍽️</Text>
          <Text style={styles.errorTitle}>Unable to Load Recipes</Text>
          <Text style={styles.errorText}>
            Please check your internet connection
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            placeholder="Search any meal, ingredient or cuisine"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDropdown && (
          <>
            <TouchableOpacity 
              style={styles.overlay} 
              activeOpacity={1}
              onPress={closeDropdown}
            />
            <View style={styles.searchDropdown}>
              {searchQuery.length === 0 ? (
                <View>
                  <Text style={styles.dropdownHeader}>Recent Searches</Text>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchDropdownItem}
                      onPress={() => handleRecentSearchPress(search)}
                    >
                      <Image 
                        source={require('../../assets/icons/search-icon.png')} 
                        style={styles.recentIcon}
                      />
                      <Text style={styles.searchDropdownText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {searchResults.length > 0 ? (
                    <>
                      <Text style={styles.dropdownHeader}>
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                      </Text>
                      {searchResults.map((recipe) => (
                        <TouchableOpacity
                          key={recipe.id}
                          style={styles.searchResultItem}
                          onPress={() => handleRecipePress(recipe.id, recipe.name)}
                        >
                          <Image 
                            source={recipe.image ? { uri: recipe.image } : require('../../assets/images/recipeimages/placeholder.png')} 
                            style={styles.searchResultImage}
                          />
                          <View style={styles.searchResultInfo}>
                            <Text style={styles.searchResultName} numberOfLines={1}>
                              {recipe.name}
                            </Text>
                            <Text style={styles.searchResultCategory}>
                              {recipe.category || 'Nigerian'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <View style={styles.noResultsContainer}>
                      <Text style={styles.noResultsIcon}>🔍</Text>
                      <Text style={styles.noResultsText}>No recipes found</Text>
                      <Text style={styles.noResultsSubtext}>Try searching for something else</Text>
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
        contentContainerStyle={styles.gridContentContainer}
        scrollEnabled={!showDropdown}
        showsVerticalScrollIndicator={false}
      >
        {recipes.length > 0 ? (
          <View style={styles.grid}>
            {recipes.map((recipe, index) => {
              const positionInPattern = index % 23;
              const isVerticalRectangle = [3, 8, 11, 16, 19].includes(positionInPattern);
              const isGreyBox = positionInPattern === 4;
              
              if (isGreyBox) {
                return (
                  <View key={`grey-${index}`} style={styles.gridItem}>
                    <View style={styles.greyBox}>
                      <Text style={styles.greyBoxText}>🍽️</Text>
                    </View>
                  </View>
                );
              }
              
              if (isVerticalRectangle) {
                return (
                  <TouchableOpacity
                    key={recipe.id}
                    style={styles.verticalRectangleItem}
                    onPress={() => !showDropdown && handleRecipePress(recipe.id, recipe.name)}
                    disabled={showDropdown}
                    activeOpacity={0.8}
                  >
                    <Image 
                      source={recipe.image ? { uri: recipe.image } : require('../../assets/images/recipeimages/placeholder.png')} 
                      style={styles.gridImage}
                      resizeMode="cover"
                    />
                    <View style={styles.recipeOverlay}>
                      <Text style={styles.recipeName} numberOfLines={2}>
                        {recipe.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
              
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.gridItem}
                  onPress={() => !showDropdown && handleRecipePress(recipe.id, recipe.name)}
                  disabled={showDropdown}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={recipe.image ? { uri: recipe.image } : require('../../assets/images/recipeimages/placeholder.png')} 
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.noRecipesContainer}>
            <Text style={styles.noRecipesIcon}>🍽️</Text>
            <Text style={styles.noRecipesText}>No recipes available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadRecipes}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
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
    position: 'relative',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: 'GoogleSans-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'GoogleSans-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'GoogleSans-Bold',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'GoogleSans-Regular',
  },
  retryButton: {
    backgroundColor: '#ff4458',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    paddingBottom: 8,
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontFamily: 'GoogleSans-Regular',
  },
  clearButton: {
    fontSize: 20,
    color: '#999',
    paddingHorizontal: 8,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: -16,
    right: -16,
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
  dropdownHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    fontFamily: 'GoogleSans-Medium',
  },
  searchDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentIcon: {
    width: 16,
    height: 16,
    tintColor: '#999',
    marginRight: 12,
  },
  searchDropdownText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'GoogleSans-Regular',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'GoogleSans-Medium',
  },
  searchResultCategory: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'GoogleSans-Regular',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'GoogleSans-Medium',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'GoogleSans-Regular',
  },
  blurred: {
    opacity: 0.3,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 4,
    marginBottom: -20,
    paddingBottom: 100,
    marginTop: 0,
    paddingTop: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  gridContentContainer: {
    paddingTop: 0,
    flexGrow: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
    marginTop: 0,
    backgroundColor: '#fff',
    zIndex: 1,
    minHeight: '100%',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
  },
  verticalRectangleItem: {
    width: '33.33%',
    height: 200,
    padding: 2,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: 8,
  },
  recipeName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  greyBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyBoxText: {
    fontSize: 32,
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noRecipesIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noRecipesText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
    fontFamily: 'GoogleSans-Medium',
  },
});