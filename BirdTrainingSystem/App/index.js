import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import { BirdDetails, ForgetPassword,Welcome, Login } from "../screens";


export default App = () => {
  const Stack = createNativeStackNavigator();
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
      <Stack.Navigator initialRouteName="Welcome">
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
          name="Welcome"
          component={Welcome}
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
            headerShown: false ,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear"
          }}
        />
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 500,
    fontSize: 20,
  },
});
