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
    flag: "🇳🇬",
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
    flag: "🇬🇭",
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
    flag: "",
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
        name: "Alison Werner",
       timePosted: "30 mins ago",   
  },
},

  {
    id: 7,
    name: "Seafood Okra Soup",
    categories: ["Lunch"],
    time: "30 mins",
    aboutrecipe: "A well known Nigerian soup that has okra as it's primary ingredient. It may include other vegetables like onions...",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef:{
      image: "https://randomuser.me/api/portraits/women/5.jpg",  
      name: "Ola Sharon",
      timePosted: "30 mins ago",
    }, 
  },

  {
    id: 8,
    name: "Fried Plantains",
    categories: ["Breakfast", "Snacks"],
    time: "15 mins",
    aboutrecipe: "Sweet and caramelized ripe plantains fried to golden perfection. A popular West African side dish or snack.",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef: {
      image: "https://randomuser.me/api/portraits/men/8.jpg",
      name: "Chef Kwame",
      timePosted: "1 hr ago",
    },
  },
  {
    id: 9,
    name: "Egusi Soup",
    categories: ["Lunch", "Dinner"],
    time: "75 mins",
    aboutrecipe: "Rich Nigerian soup made from ground melon seeds, leafy vegetables, and assorted meats or fish. Typically served with pounded yam or fufu.",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef: {
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      name: "Chef Ngozi",
      timePosted: "5 days ago",
    },
  },

  {
    id: 10,
    name: "Pounded Yam",
    categories: ["Lunch", "Dinner"],
    time: "50 mins",
    aboutrecipe: "Smooth yam dough ('swallow') served with soups like egusi or ogbono. Popular in South-West (Yoruba), North-Central, and Eastern Nigeria",
    flag: "🇳🇬",
    image: require("../../assets/images/recipeimages/jollof.png"),
    chef: {
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      name: "Chef Adeola",
      timePosted: "30 mins ago",
    },
   }, 
  // ... add more recipes
];


export default recipes;
