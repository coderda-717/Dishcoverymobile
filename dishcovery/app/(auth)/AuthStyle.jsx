import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../theme/theme";

 const AuthStyles = StyleSheet.create({
    scrollContent: {
    flexGrow: 1,
    padding: 24,
    // paddingTop: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 40,
  },
   logo: {
    width: 223,
    height: 120,
    marginBottom: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: SIZES.heading,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.grey,
    fontSize: SIZES.regular,
    textAlign: "center",
  },
  label: {
        color: COLORS.grey,
    fontSize: SIZES.regular,
    textAlign: "left",
  },
  formContainer: {
    // marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  link: {
    textAlign: "center",
    color: COLORS.red,
    marginBottom: 50,
    fontSize: SIZES.regular,
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
    fontWeight: "400",
       fontSize: SIZES.regular,
    marginBottom: 24,
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