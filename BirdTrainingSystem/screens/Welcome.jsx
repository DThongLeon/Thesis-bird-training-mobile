import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Colors } from "./../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <Animated.View
      exiting={FadeOutDown.delay((index = 100)).duration(600)}
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* background image */}
      <ImageBackground
        source={require("./../Assets/images/lake.png")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
      <View
        style={{
          padding: 5,
          justifyContent: "space-between",
          paddingBottom: 50,
          marginHorizontal: 5,
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(3,105,161,0.8)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            position: "absolute",
            bottom: 0,
          }}
        />
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 45,
          }}
        >
          Welcome to Training Academy
        </Text>
        <Text
          style={{
            color: Colors.brown65,
            fontWeight: 500,
            fontSize: 16,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Training your bird a new level expert
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f97316",
            padding: 10,
            borderRadius: 15,
            width: 160,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 25,
            marginBottom: 5,
            marginHorizontal: "28.5%",
          }}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            Let's Go
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Welcome;
