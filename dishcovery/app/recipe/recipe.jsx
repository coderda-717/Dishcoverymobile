// app/recipe/recipe.jsx
const recipes = [
  {
    id: 1,
    name: "Classic Pancakes",
    categories: ["Breakfast"],
    time: "20 mins",
    aboutrecipe: "Fluffy homemade pancakes perfect for a quick breakfast.",
    flag: "USA",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef: {
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Chef Amelia",
      timePosted: "2h ago",
    },
  },
  {
    id: 2,
    name: "Spaghetti Bolognese",
    categories: ["Lunch"],
    time: "45 mins",
    aboutrecipe: "A rich and hearty Italian pasta dish with meat sauce.",
    flag: "IT",
    image: require("../../assets/images/recipeimages/jollof.png") ,
    chef: {
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Chef Marco",
      timePosted: "4h ago",
    },
  },
  {
    id: 3,
    name: "Jollof Rice",
    categories: ["Lunch", "Dinner"],
    time: "1 hr",
    aboutrecipe: "Spicy and flavorful West African rice cooked in tomato sauce.",
    flag: "NG",
    image: require("../../assets/images/recipeimages/jollof.png"),            
    chef: {
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Chef Ada",
      timePosted: "1d ago",
    },
  },
  {
    id: 4,
    name: "Fruit Smoothie",
    categories: ["Drinks"],
    time: "10 mins",
    aboutrecipe: "A refreshing mix of tropical fruits blended to perfection.",
    flag: "GH",
    image: require("../../assets/images/recipeimages/jollof.png"),          
    chef: {
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Chef Kofi",
      timePosted: "3h ago",
    },
  },
  {
    id: 5,
    name: "Chocolate Muffins",
    categories: ["Snacks"],
    time: "25 mins",
    aboutrecipe: "Moist chocolate muffins with a gooey center.",
    flag: "UK",
    image: require("../../assets/images/recipeimages/jollof.png"),             
    chef: {
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Chef Emma",
      timePosted: "5h ago",
    },
  },

  {
    id: 6,
    name: "Jollof Rice",
    categories: ["Lunch", "Dinner"],
    time: "90 mins",
    aboutrecipe: "A Popular West African Rice Dish, That Is Cooked In A Single Pot With A Flavorful Tomatoes Based Sauce, Vegetables Like Onions...",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef:{
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        author: "Alison Werner",
       timePosted: "30 mins ago",   
  },
},

  {
    id: 7,
    title: "Seafood Okra Soup",
    categories: ["Lunch"],
    time: "30 mins",
    aboutrecipe: "A well known Nigerian soup that has okra as it's primary ingredient. It may include other vegetables like onions...",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef:{
      image: "https://randomuser.me/api/portraits/women/5.jpg",  
      author: "Ola Sharon",
      timeAgo: "30 mins ago",
    }, 
  },
  // ... add more recipes
];


export default recipes;
