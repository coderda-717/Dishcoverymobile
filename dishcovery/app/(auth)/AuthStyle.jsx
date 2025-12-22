import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../theme/theme";

 const AuthStyles = StyleSheet.create({
    scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 0.2,
    
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 27,
    marginTop: 15,
  },
   logo: {
    width: 223,
    height: 120,
    marginBottom: 11,
    resizeMode: "contain",
  },
  title: {
    fontSize: SIZES.heading,
    fontWeight: "550",
    color: COLORS.black,
    marginBottom: 14,
    fontFamily: 'GoogleSans-Regular',
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: SIZES.regular,
    textAlign: "center",
    fontFamily: 'GoogleSans-Regular',
    marginTop: -10,
  },
  label: {
    color: COLORS.grey,
    fontSize: SIZES.regular,
    textAlign: "left",
    fontFamily: 'GoogleSans-Regular',
    marginBottom: 2,
    marginTop: -5,
  },
  formContainer: {
     marginTop: -10,
     marginBottom: -5,
  },
  buttonContainer: {
    marginTop: 7,
    marginBottom: -10,
  },
  link: {
    textAlign: "center",
    color: COLORS.red,
    marginBottom: 42,
    fontSize: SIZES.regular,
    fontFamily: 'GoogleSans-Regular',
  },
  image1: {
    position: "absolute",
    width: 130,
    height: 130,
    resizeMode: "contain",
    left: -50,
    top: 0,
  },
  forgotLink: {
    textAlign: "right",
    fontWeight: "200",
       fontSize: SIZES.regular,
    marginBottom: 12,
    marginTop: 33,
    fontFamily: 'GoogleSans-Regular',
  },
  image2: {
    position: "absolute",
    width: 224,
    height: 207,
    resizeMode: "contain",
    left: -40,
    top: -30,
  },

})


export default AuthStyles;