import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import Login from "../screens/Login";
import  ForgetPassword  from "../screens/ForgetPassword";
import { BirdDetails } from "../screens";

const Stack = createNativeStackNavigator();

export default App = () => {
  // const { fontLoaded } = useFonts({
  //   regular: require("../Assets/fonts/OpenSans-Medium.ttf"),
  //   light: require("../Assets/fonts/OpenSans-Light.ttf"),
  //   bold: require("../Assets/fonts/OpenSans-Bold.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontLoaded) await SplashScreen.hideAsync();
  // }, fontLoaded);

  // if (!fontLoaded) return null;

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Bottom Navigation"
          component={BottomTabNavigation}
          options={{ 
            headerShown: false ,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear"
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ 
            headerShown: false ,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear"
          }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{ 
            headerShown: true ,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear"
          }}
        />
        <Stack.Screen
          name="BirdDetails"
          component={BirdDetails}
          options={{ 
            headerShown: true ,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 500,
    fontSize: 20,
  },
});
