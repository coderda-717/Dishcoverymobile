// recipe/recipe.js
// Fixed to match backend structure with single category string

const recipes = [
  {
    id: 1,
    name: "Jollof Rice",
    category: "Nigerian", // Single string instead of array
    prepTime: 30,
    cookingTime: 60,
    rating: 4.8,
    description: "A popular West African dish made with rice, tomatoes, and spices. Perfectly spiced and rich in flavor!",
    ingredients: [
      "2 cups long-grain rice",
      "4 large tomatoes",
      "2 red bell peppers",
      "1 onion",
      "3 tablespoons tomato paste",
      "1/4 cup vegetable oil",
      "2 cups chicken stock",
      "1 teaspoon curry powder",
      "1 teaspoon thyme",
      "2 bay leaves",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Blend tomatoes, peppers, and half the onion until smooth",
      "Heat oil in a large pot and fry the remaining chopped onion",
      "Add tomato paste and fry for 2-3 minutes",
      "Pour in the blended mixture and cook for 15-20 minutes",
      "Add curry powder, thyme, and bay leaves",
      "Stir in the rice and coat with the sauce",
      "Pour in the chicken stock and bring to a boil",
      "Reduce heat, cover, and simmer for 30-40 minutes",
      "Fluff with a fork and serve hot"
    ],
    image: require("../../assets/images/recipeimages/jollof.png"),
    likes: 245,
    comments: 38,
    chef: {
      name: "Chef Tolu",
      image: "https://i.pravatar.cc/80?img=12",
      timePosted: "2 days ago"
    }
  },
  {
    id: 2,
    name: "Egusi Soup",
    category: "Nigerian",
    prepTime: 20,
    cookingTime: 45,
    rating: 4.6,
    description: "Traditional Nigerian soup made with melon seeds, leafy vegetables, and assorted meat. Rich and hearty!",
    ingredients: [
      "2 cups ground egusi (melon seeds)",
      "500g assorted meat",
      "200g dried fish",
      "2 cups chopped spinach or bitter leaf",
      "1/2 cup palm oil",
      "2 tablespoons ground crayfish",
      "3 scotch bonnet peppers",
      "1 onion",
      "2 stock cubes",
      "Salt to taste"
    ],
    instructions: [
      "Cook assorted meat with onion, stock cubes, and salt until tender",
      "Add dried fish and cook for 5 minutes",
      "Heat palm oil in another pot",
      "Add ground egusi and fry for 2-3 minutes, stirring constantly",
      "Gradually add meat stock to the egusi mixture",
      "Add ground crayfish and blended peppers",
      "Simmer for 15 minutes",
      "Add the cooked meat and fish",
      "Add chopped vegetables and cook for 5 minutes",
      "Serve hot with fufu, pounded yam, or rice"
    ],
    image: require("../../assets/images/recipeimages/okra.png"),
    likes: 189,
    comments: 27,
    chef: {
      name: "Chef Ngozi",
      image: "https://i.pravatar.cc/80?img=45",
      timePosted: "5 days ago"
    }
  },
  {
    id: 3,
    name: "Fried Rice",
    category: "Continental",
    prepTime: 25,
    cookingTime: 35,
    rating: 4.7,
    description: "Colorful and flavorful fried rice with mixed vegetables, chicken, and prawns. Perfect for special occasions!",
    ingredients: [
      "3 cups cooked long-grain rice (cooled)",
      "200g chicken breast, diced",
      "150g prawns",
      "1 cup mixed vegetables (carrots, peas, green beans, corn)",
      "2 eggs, beaten",
      "3 tablespoons vegetable oil",
      "2 cloves garlic, minced",
      "1 onion, diced",
      "3 tablespoons soy sauce",
      "1 teaspoon curry powder",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Heat 1 tablespoon oil in a wok or large pan",
      "Scramble the eggs and set aside",
      "Add remaining oil and sauté garlic and onion",
      "Add diced chicken and cook until done",
      "Add prawns and cook for 2 minutes",
      "Add mixed vegetables and stir-fry for 3 minutes",
      "Add the cooled rice and break up any lumps",
      "Add soy sauce, curry powder, salt, and pepper",
      "Stir-fry everything together for 5-7 minutes",
      "Add scrambled eggs and mix well",
      "Serve hot with coleslaw or fried plantain"
    ],
    image: require("../../assets/images/recipeimages/friedrice.png"),
    likes: 312,
    comments: 45,
    chef: {
      name: "Chef Adeola",
      image: "https://i.pravatar.cc/80?img=33",
      timePosted: "1 week ago"
    }
  },
  {
    id: 4,
    name: "Chicken Stir Fry",
    category: "Chinese",
    prepTime: 15,
    cookingTime: 20,
    rating: 4.5,
    description: "Quick and healthy chicken stir fry with crisp vegetables and savory sauce. Ready in 35 minutes!",
    ingredients: [
      "500g chicken breast, sliced thin",
      "2 bell peppers, sliced",
      "1 cup broccoli florets",
      "1 carrot, julienned",
      "3 cloves garlic, minced",
      "1-inch ginger, grated",
      "3 tablespoons soy sauce",
      "2 tablespoons oyster sauce",
      "1 tablespoon cornstarch",
      "2 tablespoons vegetable oil",
      "1 teaspoon sesame oil",
      "Spring onions for garnish"
    ],
    instructions: [
      "Marinate chicken with 1 tablespoon soy sauce and cornstarch for 10 minutes",
      "Heat vegetable oil in a wok over high heat",
      "Stir-fry chicken until cooked through, remove and set aside",
      "Add more oil if needed, sauté garlic and ginger",
      "Add all vegetables and stir-fry for 3-4 minutes",
      "Return chicken to the wok",
      "Add remaining soy sauce and oyster sauce",
      "Toss everything together for 2 minutes",
      "Drizzle with sesame oil",
      "Garnish with spring onions and serve with rice"
    ],
    image: require("../../assets/images/recipeimages/stirfrymac.png"),
    likes: 178,
    comments: 22,
    chef: {
      name: "Chef Wei",
      image: "https://i.pravatar.cc/80?img=68",
      timePosted: "3 days ago"
    }
  },
  {
    id: 5,
    name: "Margherita Pizza",
    category: "Italian",
    prepTime: 90,
    cookingTime: 15,
    rating: 4.9,
    description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil. Simple yet delicious!",
    ingredients: [
      "500g pizza dough",
      "200ml pizza sauce",
      "250g fresh mozzarella",
      "Fresh basil leaves",
      "2 tablespoons olive oil",
      "2 cloves garlic, minced",
      "Salt to taste",
      "Cherry tomatoes (optional)"
    ],
    instructions: [
      "Preheat oven to 250°C (480°F)",
      "Roll out pizza dough to desired thickness",
      "Mix pizza sauce with garlic and olive oil",
      "Spread sauce evenly on the dough",
      "Tear mozzarella and distribute over the sauce",
      "Add cherry tomatoes if using",
      "Season with salt",
      "Bake for 12-15 minutes until crust is golden",
      "Remove from oven and add fresh basil leaves",
      "Drizzle with olive oil and serve immediately"
    ],
    image: require("../../assets/images/recipeimages/placeholder.png"),
    likes: 421,
    comments: 56,
    chef: {
      name: "Chef Giuseppe",
      image: "https://i.pravatar.cc/80?img=15",
      timePosted: "4 days ago"
    }
  },
  {
    id: 6,
    name: "Tacos al Pastor",
    category: "Mexican",
    prepTime: 30,
    cookingTime: 25,
    rating: 4.7,
    description: "Authentic Mexican tacos with marinated pork, pineapple, and fresh toppings. A fiesta in your mouth!",
    ingredients: [
      "500g pork shoulder, thinly sliced",
      "1 fresh pineapple, sliced",
      "3 dried guajillo chiles",
      "2 cloves garlic",
      "1 onion",
      "2 tablespoons achiote paste",
      "1/4 cup white vinegar",
      "Corn tortillas",
      "Fresh cilantro",
      "Lime wedges",
      "Diced onion for serving"
    ],
    instructions: [
      "Soak dried chiles in hot water for 20 minutes",
      "Blend chiles, garlic, half the onion, achiote paste, and vinegar",
      "Marinate pork in the chile mixture for at least 2 hours",
      "Grill pineapple slices until caramelized",
      "Cook marinated pork in a hot pan or grill",
      "Chop cooked pork into small pieces",
      "Warm corn tortillas",
      "Fill tortillas with pork and grilled pineapple",
      "Top with cilantro, diced onion, and lime juice",
      "Serve immediately with salsa"
    ],
    image: require("../../assets/images/recipeimages/spaghetti.png"),
    likes: 267,
    comments: 34,
    chef: {
      name: "Chef Carlos",
      image: "https://i.pravatar.cc/80?img=51",
      timePosted: "1 day ago"
    }
  },
  {
    id: 7,
    name: "Pounded Yam & Egusi",
    category: "Nigerian",
    prepTime: 20,
    cookingTime: 40,
    rating: 4.8,
    description: "Traditional Nigerian meal with smooth pounded yam and rich egusi soup. Pure comfort food!",
    ingredients: [
      "1kg white yam",
      "Water for boiling",
      "For Egusi soup (see Egusi Soup recipe #2)"
    ],
    instructions: [
      "Peel and cut yam into medium chunks",
      "Boil yam until very soft (about 30 minutes)",
      "Drain excess water, leaving just enough to pound",
      "Use a mortar and pestle or yam pounder",
      "Pound vigorously until smooth and stretchy",
      "Add small amounts of water if too dry",
      "Continue pounding until desired consistency",
      "Form into smooth balls",
      "Serve hot with egusi soup",
      "Enjoy with your hands for authentic experience"
    ],
    image: require("../../assets/images/recipeimages/placeholder.png"),
    likes: 198,
    comments: 29,
    chef: {
      name: "Chef Emeka",
      image: "https://i.pravatar.cc/80?img=22",
      timePosted: "6 days ago"
    }
  },
  {
    id: 8,
    name: "Pasta Carbonara",
    category: "Italian",
    prepTime: 10,
    cookingTime: 20,
    rating: 4.6,
    description: "Creamy Roman pasta with eggs, cheese, and pancetta. Simple ingredients, restaurant-quality taste!",
    ingredients: [
      "400g spaghetti",
      "200g pancetta or bacon",
      "4 egg yolks",
      "1 whole egg",
      "100g Parmesan cheese, grated",
      "Black pepper to taste",
      "Salt for pasta water"
    ],
    instructions: [
      "Bring a large pot of salted water to boil",
      "Cook spaghetti according to package directions",
      "Meanwhile, dice and fry pancetta until crispy",
      "In a bowl, whisk egg yolks, whole egg, and half the cheese",
      "Add generous black pepper to egg mixture",
      "Reserve 1 cup pasta cooking water before draining",
      "Add hot pasta to the pancetta pan (off heat)",
      "Quickly mix in egg mixture, stirring constantly",
      "Add pasta water gradually to create creamy sauce",
      "Serve immediately with remaining cheese and black pepper"
    ],
    image: require("../../assets/images/recipeimages/placeholder.png"),
    likes: 356,
    comments: 41,
    chef: {
      name: "Chef Marco",
      image: "https://i.pravatar.cc/80?img=77",
      timePosted: "2 days ago"
    }
  }
];

export default recipes;