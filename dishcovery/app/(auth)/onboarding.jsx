import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
      if (hasLoggedIn === 'true') {
        // User has logged in before, skip onboarding
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
    }
  };

  const handleNext = () => {
    if (currentScreen < onboardingData.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      router.replace('/auth/Signin');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  const onboardingData = [
    {
      id: 0,
      type: 'logo',
      title: 'Welcome to Dishcovery',
      description: 'Discover and share amazing recipes',
    },
    {
      id: 1,
      image: require('../../../assets/images/onboarding1.png'),
      title: 'Discover Recipes',
      description: 'Explore thousands of delicious recipes from around the world',
    },
    {
      id: 2,
      image: require('../../../assets/images/onboarding2.png'),
      title: 'Share Your Creations',
      description: 'Share your own recipes and cooking experiences with the community',
    },
    {
      id: 3,
      image: require('../../../assets/images/onboarding3.png'),
      title: 'Cook Together',
      description: 'Connect with other food lovers and learn new cooking techniques',
    },
  ];

  const currentData = onboardingData[currentScreen];

  if (currentData.type === 'logo') {
    return (
      <View style={styles.logoContainer}>
        <View style={styles.logoContent}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.appLogo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Dishcovery</Text>
          <Text style={styles.tagline}>Your Culinary Adventure Starts Here</Text>
        </View>
        
        <TouchableOpacity
          style={styles.letsGoButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.letsGoButtonText}>Let's go</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentScreen < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.contentContainer}>
        <Image
          source={currentData.image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.slice(1).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentScreen === index + 1 && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Next/Get Started Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentScreen === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Logo Screen Styles
  logoContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  logoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    fontFamily: 'GoogleSans-Bold',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'GoogleSans-Regular',
  },
  letsGoButton: {
    backgroundColor: '#FF4458',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  letsGoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },

  // Regular Onboarding Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 40,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'GoogleSans-Medium',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'GoogleSans-Bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: 'GoogleSans-Regular',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF4458',
    width: 24,
  },
  button: {
    backgroundColor: '#FF4458',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
});

export default OnboardingScreen;