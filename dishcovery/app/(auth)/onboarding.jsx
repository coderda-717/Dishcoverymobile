import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Discover Flavors That Bring People Together",
    description:
      "Explore authentic dishes, learn their stories, and share your love for food.",
    source: require("../../assets/images/image4.png"),
    style: {
      position: "absolute",
      right: -30,
      top: -25,
      width: 220,
      height: 220,
    },
  },
  {
    id: "2",
    title: "See What Others Think",
    description:
      "Read honest reviews, ratings, and stories from people who've tasted every dish — so you always know what's worth trying!",
    source: require("../../assets/images/image5.png"),
    style: {
      position: "absolute",
      right: 3,
      top: 3,
      width: 150,
      height: 150,
    },
  },
  {
    id: "3",
    title: "Save, Share & Savor Every Dish",
    description:
      "Save your favorite recipes, share your food moments, and keep your culinary journey alive — one plate at a time.",
    source: require("../../assets/images/image6.png"),
    style: {
      position: "absolute",
      right: 3,
      top: 3,
      width: 150,
      height: 150,
    },
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const completeOnboarding = async () => {
    try {
      // Check if user is already authenticated
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        // User is authenticated, go to main app
        console.log('User authenticated, navigating to main app');
        router.replace("/(tabs)");
      } else {
        // User not authenticated, go to sign in
        console.log('User not authenticated, navigating to signin');
        router.replace("/(auth)/signin");
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      // On error, default to sign in
      router.replace("/(auth)/signin");
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.illustration}>
              <View style={styles.starGroup}>
                <Image
                  source={require("../../assets/images/Group2.png")}
                  style={styles.starGroupImage}
                />
              </View>

              <View style={styles.circle}>
                <Image source={item.source} style={item.style} />
              </View>

              <View style={styles.starGroup}>
                <Image
                  source={require("../../assets/images/Group1.png")}
                  style={styles.starGroupImage}
                />
              </View>
            </View>

            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={slidesRef}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A6370E",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    flex: 1,
  },
  illustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 30,
    borderColor: "#FFD166",
    marginVertical: 20,
    overflow: "hidden",
  },
  starGroup: {
    flexDirection: "row",
    marginVertical: 15,
  },
  starGroupImage: {
    width: 120,
    height: 60,
  },
  textBox: {
    flex: 1,
    backgroundColor: "#9c6a58ff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: "#fff",
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  desc: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
    borderColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 40,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  skipText: {
    color: "#fff",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  dot: {
    width: 40,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 2,
    opacity: 0.5,
    marginHorizontal: 3,
  },
  activeDot: {
    opacity: 1,
    backgroundColor: "#A6370E",
  },
  nextButton: {
    backgroundColor: "#EB5017",
    paddingVertical: 12,
    paddingHorizontal: 120,
    borderRadius: 10,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
  },
});