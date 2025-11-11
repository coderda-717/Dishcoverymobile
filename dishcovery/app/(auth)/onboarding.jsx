import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
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
      position: 'absolute',
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
      position: 'absolute',
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
      position: 'absolute',
      right: 3,
      top: 3,
      width: 150,
      height: 150,
    },
  }
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  // Function to mark onboarding as completed and navigate to signin
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace("/(auth)/signin");
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Last slide - complete onboarding
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    // Skip onboarding and go directly to signin
    completeOnboarding();
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      {/* SLIDE 1 - Specific decorations */}
      {item.id === "1" && (
        <>
          {/* Top Left Food Image for Slide 1 */}
          <Image
            source={require("../../assets/images/topLeftFood1.png")}
            style={styles.topLeftFood}
          />
          {/* Bottom Right Food Image for Slide 1 */}
          <Image
            source={require("../../assets/images/bottomRightFood1.png")}
            style={styles.bottomRightFood}
          />
        </>
      )}
      
      {/* SLIDE 2 - Chat bubbles, message icon, and sunburst */}
      {item.id === "2" && (
        <>
          {/* Top Left Food Image for Slide 2 */}
          <Image
            source={require("../../assets/images/topLeftFood2.png")}
            style={styles.topLeftFood}
          />
          {/* Bottom Right Food Image for Slide 2 */}
          <Image
            source={require("../../assets/images/bottomRightFood2.png")}
            style={styles.bottomRightFood}
          />
          {/* Chat bubble cloud 1 */}
          <Image
            source={require("../../assets/images/chatBubble1.png")}
            style={styles.chatBubble1}
          />
          {/* Chat bubble cloud 2 */}
          <Image
            source={require("../../assets/images/chatBubble2.png")}
            style={styles.chatBubble2}
          />
          {/* Chat bubble cloud 3 */}
          <Image
            source={require("../../assets/images/chatBubble3.png")}
            style={styles.chatBubble3}
          />
          {/* Message/Comment icon */}
          <Image
            source={require("../../assets/images/messageIcon.png")}
            style={styles.messageIcon}
          />
          {/* Sunburst/Star burst */}
          <Image
            source={require("../../assets/images/sunburst.png")}
            style={styles.sunburst}
          />
        </>
      )}
      
      {/* SLIDE 3 - Hearts */}
      {item.id === "3" && (
        <>
          {/* Top Left Food Image for Slide 3 */}
          <Image
            source={require("../../assets/images/topLeftFood3.png")}
            style={styles.topLeftFood}
          />
          {/* Bottom Right Food Image for Slide 3 */}
          <Image
            source={require("../../assets/images/bottomRightFood3.png")}
            style={styles.bottomRightFood}
          />
          {/* Heart 1 - top right */}
          <Image
            source={require("../../assets/images/heart1.png")}
            style={styles.heart1}
          />
          {/* Heart 2 - middle right */}
          <Image
            source={require("../../assets/images/heart2.png")}
            style={styles.heart2}
          />
          {/* Heart 3 - left side */}
          <Image
            source={require("../../assets/images/heart3.png")}
            style={styles.heart3}
          />
        </>
      )}
      
      <View style={styles.illustration}>
        {/* Top Star Group - ALL SLIDES */}
        <View style={styles.starGroup}>
          <Image
            source={require("../../assets/images/Group2.png")}
            style={styles.starGroupImage}
          />
        </View>
        
        {/* Center Circle with Food - SLIDE SPECIFIC */}
        <View style={styles.circle}>
          <Image
            source={item.source}
            style={item.style}
          />
        </View>
        
        {/* Bottom Star Group - ALL SLIDES */}
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
  );

  // Show loading screen while checking status
  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        {/* Button */}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#A6370E",
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    position: 'relative',
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
    borderColor: '#fff',
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
    fontFamily: 'GoogleSans-Bold',
  },
  desc: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'GoogleSans-Medium',
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
    borderColor: '#fff',
    borderWidth: 0.5,
    marginTop: 30,
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
    gap: 0, 
  },
  dot: {
    width: 40,
    height: 6,
    backgroundColor: "#ffffffff",
    borderRadius: 2,
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
  // Food decoration images
  topLeftFood: {
    position: 'absolute',
    left: -10,
    top: 20,
    width: 100,
    height: 140,
    zIndex: 1,
  },
  bottomRightFood: {
    position: 'absolute',
    right: -10,
    bottom: 280,
    width: 120,
    height: 180,
    zIndex: 1,
  },
  // Slide 2 specific - Chat bubbles, message icon, and sunburst
  chatBubble1: {
    position: 'absolute',
    left: 15,
    top: 100,
    width: 50,
    height: 40,
    zIndex: 1,
  },
  chatBubble2: {
    position: 'absolute',
    left: 35,
    top: 160,
    width: 60,
    height: 50,
    zIndex: 1,
  },
  chatBubble3: {
    position: 'absolute',
    left: 10,
    bottom: 340,
    width: 70,
    height: 55,
    zIndex: 1,
  },
  messageIcon: {
    position: 'absolute',
    left: 30,
    top: 70,
    width: 45,
    height: 45,
    zIndex: 1,
  },
  sunburst: {
    position: 'absolute',
    right: 20,
    top: 35,
    width: 80,
    height: 80,
    zIndex: 1,
  },
  // Slide 3 specific - Hearts
  heart1: {
    position: 'absolute',
    right: 25,
    top: 35,
    width: 60,
    height: 60,
    zIndex: 1,
  },
  heart2: {
    position: 'absolute',
    right: 35,
    top: 110,
    width: 50,
    height: 50,
    zIndex: 1,
  },
  heart3: {
    position: 'absolute',
    left: 25,
    bottom: 340,
    width: 55,
    height: 55,
    zIndex: 1,
  },
});