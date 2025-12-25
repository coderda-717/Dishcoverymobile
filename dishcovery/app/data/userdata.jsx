export const userData = {
  id: 1,
  firstName: "Adegoke",
  lastName: "Uchechukwu",
  username: "@Uchecooks",
  email: "Adechukwu25@gmail.com",
  password: "**********",
  profileImage: "https://i.pravatar.cc/300?img=50",
  stats: {
    recipiesTried: 36,
    favourites: 25,
    reviews: 5
  },
  preferences: {
    dietary: ["Vegetarian", "Gluten-Free"],
    favoriteCuisines: ["Nigerian", "Italian", "Asian"]
  }
  
};

export default function UserData() {
  return null;
}
// For backend integration, replace with:
/*
import { useAuth } from '../context/AuthContext';
const { user } = useAuth();
*/