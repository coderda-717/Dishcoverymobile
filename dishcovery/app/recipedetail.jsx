// app/recipe/[id].jsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { recipes as recipeData } from "./recipe/recipe";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const recipe = recipeData.find((r) => r.id === parseInt(id));
  const router = useRouter();

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 15 }}>
        <Ionicons name="arrow-back" size={24} color="red" />
      </TouchableOpacity>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{recipe.name}</Text>
        <Text style={styles.info}>
          {recipe.type} • {recipe.time} • {recipe.country}
        </Text>
        <Text style={styles.about}>{recipe.aboutrecipe}</Text>

        <View style={styles.chefContainer}>
          <Image source={{ uri: recipe.chef.image }} style={styles.chefImage} />
          <View>
            <Text style={styles.chefName}>{recipe.chef.name}</Text>
            <Text style={styles.postTime}>{recipe.chef.timePosted}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 250 },
  content: { padding: 16 },
  name: { fontSize: 24, fontWeight: "700", color: "#000" },
  info: { color: "#555", marginVertical: 4 },
  about: { color: "#333", marginTop: 10, lineHeight: 20 },
  chefContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  chefImage: { width: 45, height: 45, borderRadius: 25, marginRight: 10 },
  chefName: { fontWeight: "600", color: "#000" },
  postTime: { color: "#666", fontSize: 12 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
});
