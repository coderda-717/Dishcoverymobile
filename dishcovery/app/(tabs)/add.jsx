// app/(tabs)/add.jsx - Updated with backend integration
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { recipeAPI } from '../services/api';

export default function Add() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    title: '',
    cuisine: '',
    category: '',
    ingredients: '',
    steps: '',
    allergies: '',
    cookingTime: '',
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredTime, setHoveredTime] = useState(null);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];
  const cookingTimes = [
    '30 mins', '1 hr', '1 hr 30 mins', '2 hrs', '2 hrs 30 mins',
    '3 hrs', '3 hrs 30 mins', '4 hrs', '4 hrs 30 mins', '5 hrs',
    '5 hrs 30 mins', '6 hrs', '6 hrs 30 mins', '7 hrs', '7 hrs 30 mins',
    '8 hrs', '8 hrs 30 mins', '9 hrs', '9 hrs 30 mins', '10 hrs'
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  // Convert time string to minutes
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 30;
    
    const parts = timeStr.toLowerCase().split(' ');
    let minutes = 0;
    
    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
      const unit = parts[i + 1];
      
      if (unit.includes('hr')) {
        minutes += value * 60;
      } else if (unit.includes('min')) {
        minutes += value;
      }
    }
    
    return minutes || 30;
  };

  const handleNext = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Missing Field', 'Please enter a recipe title');
      return;
    }
    
    if (!formData.category) {
      Alert.alert('Missing Field', 'Please select a category');
      return;
    }
    
    if (!formData.ingredients.trim()) {
      Alert.alert('Missing Field', 'Please enter ingredients');
      return;
    }
    
    if (!formData.steps.trim()) {
      Alert.alert('Missing Field', 'Please enter cooking steps');
      return;
    }

    setLoading(true);

    try {
      // Prepare recipe data
      const recipeData = {
        name: formData.title.trim(),
        category: formData.category,
        description: formData.cuisine.trim() || `Delicious ${formData.title}`,
        ingredients: formData.ingredients
          .split(',')
          .map(i => i.trim())
          .filter(i => i.length > 0),
        instructions: formData.steps
          .split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        cookingTime: parseTimeToMinutes(formData.cookingTime),
        prepTime: 10,
        rating: 0,
        image: formData.photo,
      };

      console.log('Creating recipe:', recipeData.name);

      // Call API to create recipe
      const result = await recipeAPI.createRecipe(recipeData);

      if (result.success) {
        Alert.alert(
          'Success! 🎉',
          'Your recipe has been added successfully!',
          [
            {
              text: 'View Recipe',
              onPress: () => {
                // Reset form
                setFormData({
                  photo: null,
                  title: '',
                  cuisine: '',
                  category: '',
                  ingredients: '',
                  steps: '',
                  allergies: '',
                  cookingTime: '',
                });
                
                // Navigate to home to see the new recipe
                router.push('/(tabs)');
              }
            }
          ]
        );
      } else {
        // Handle specific error cases
        const errorMessage = result.error || 'Failed to add recipe';
        
        if (errorMessage.includes('authentication') || errorMessage.includes('token')) {
          Alert.alert(
            'Authentication Required',
            'Please log in again to add recipes',
            [
              {
                text: 'Log In',
                onPress: () => router.push('/(auth)/signin')
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('Recipe creation error:', error);
      
      // Use network error handler
      const handled = handleNetworkError(error);
      
      if (!handled) {
        Alert.alert(
          'Error',
          'Failed to add recipe. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add Recipe</Text>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Image 
            source={require('../../assets/icons/arrow-right.png')} 
            style={styles.backArrow}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContent}
      >
        <TouchableOpacity 
          style={styles.photoUpload} 
          onPress={pickImage}
          disabled={loading}
        >
          {formData.photo ? (
            <Image source={{ uri: formData.photo }} style={styles.uploadedImage} />
          ) : (
            <>
              <Image 
                source={require('../../assets/icons/camera-icon.png')} 
                style={styles.cameraIcon}
              />
              <Text style={styles.uploadText}>Tap to add photo</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Recipe Title*</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Smoky Jollof Rice"
          placeholderTextColor="#999"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          editable={!loading}
        />

        <Text style={styles.label}>Cuisine</Text>
        <TextInput
          style={styles.input}
          placeholder="What cuisine is this?"
          placeholderTextColor="#999"
          value={formData.cuisine}
          onChangeText={(text) => setFormData({ ...formData, cuisine: text })}
          editable={!loading}
        />

        <Text style={styles.label}>Category*</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          disabled={loading}
        >
          <Text style={[styles.dropdownText, !formData.category && styles.placeholder]}>
            {formData.category || 'Select category...'}
          </Text>
          <Image 
            source={require('../../assets/icons/chevron-down.png')} 
            style={styles.chevron}
          />
        </TouchableOpacity>
        {showCategoryDropdown && (
          <View style={styles.dropdownMenu}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.dropdownMenuItem}
                onPressIn={() => setHoveredCategory(category)}
                onPressOut={() => setHoveredCategory(null)}
                onPress={() => {
                  setFormData({ ...formData, category });
                  setShowCategoryDropdown(false);
                  setHoveredCategory(null);
                }}
              >
                <Text style={[
                  styles.dropdownMenuText,
                  hoveredCategory === category && styles.hoveredText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Ingredients*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="List each ingredient (separate with comma)..."
          placeholderTextColor="#999"
          value={formData.ingredients}
          onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <Text style={styles.label}>Steps*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="List each step taken to prepare this meal (one per line)..."
          placeholderTextColor="#999"
          value={formData.steps}
          onChangeText={(text) => setFormData({ ...formData, steps: text })}
          multiline
          numberOfLines={4}
          editable={!loading}
        />

        <Text style={styles.label}>Allergy Warnings</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Dairy, nuts, gluten (separate with comma)..."
          placeholderTextColor="#999"
          value={formData.allergies}
          onChangeText={(text) => setFormData({ ...formData, allergies: text })}
          editable={!loading}
        />

        <Text style={styles.label}>Cooking Time</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowTimeDropdown(!showTimeDropdown)}
          disabled={loading}
        >
          <Text style={[styles.dropdownText, !formData.cookingTime && styles.placeholder]}>
            {formData.cookingTime || 'Select time'}
          </Text>
          <Image 
            source={require('../../assets/icons/chevron-down.png')} 
            style={styles.chevron}
          />
        </TouchableOpacity>
        {showTimeDropdown && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.dropdownMenuScroll}>
              {cookingTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.dropdownMenuItem}
                  onPressIn={() => setHoveredTime(time)}
                  onPressOut={() => setHoveredTime(null)}
                  onPress={() => {
                    setFormData({ ...formData, cookingTime: time });
                    setShowTimeDropdown(false);
                    setHoveredTime(null);
                  }}
                >
                  <Text style={[
                    styles.dropdownMenuText,
                    hoveredTime === time && styles.hoveredText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.nextButton, loading && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={[styles.nextButtonText, { marginLeft: 8 }]}>
                Creating Recipe...
              </Text>
            </View>
          ) : (
            <Text style={styles.nextButtonText}>Create Recipe</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'GoogleSans-Bold',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'GoogleSans-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
    fontFamily: 'GoogleSans-Regular',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'GoogleSans-Regular',
  },
  dropdownMenuText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'GoogleSans-Regular',
  },
  hoveredText: {
    color: '#000',
    fontWeight: '500',
    fontFamily: 'GoogleSans-Medium',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: '#ff4458',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 100,
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: '#ff4458',
    borderRadius: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  cameraIcon: {
    width: 60,
    height: 60,
    tintColor: '#ccc',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: '#666',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownMenuScroll: {
    maxHeight: 250,
  },
  dropdownMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nextButton: {
    backgroundColor: '#ff4458',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});