import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Loader = () => {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
    >
      <LottieView
        source={require("../Assets/loading/loading.json")}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
        }}
      ></LottieView>
    </View>
  );
};

export default Loader;
