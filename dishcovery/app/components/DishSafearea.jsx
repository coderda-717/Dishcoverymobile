import React from "react";
import { Keyboard, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DishSafeAreaView = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.conatainer]}>{children}</SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 24,
    backgroundColor: "#fff",
  },
});

export default DishSafeAreaView;
