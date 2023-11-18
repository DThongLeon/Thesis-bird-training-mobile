import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigation from "../navigation/BottomTabNavigation";
import {
  BirdDetails,
  ForgetPassword,
  Welcome,
  Login,
  WorkshopDetails,
  DetailsOnGoing,
  EditProfile,
  SeeAll,
  TrainingReport,
  SwitchAccount,
} from "../screens";
import Register from "../navigation/Register";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import AppLoading from 'expo-app-loading';


if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

export default App = () => {
  const Stack = createNativeStackNavigator();
  const [getDataBird, setBirdData] = useState([]);
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
    <ActionSheetProvider>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Bottom Navigation"
          component={BottomTabNavigation}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{
            headerShown: true,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="BirdDetails"
          component={BirdDetails}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="WorkshopDetails"
          component={WorkshopDetails}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />

        <Stack.Screen
          name="DetailsOnGoing"
          component={DetailsOnGoing}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="SeeAll"
          component={SeeAll}
          options={{
            headerShown: true,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
        <Stack.Screen
          name="TrainingReport"
          component={TrainingReport}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />

        <Stack.Screen
          name="SwitchAccount"
          component={SwitchAccount}
          options={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "column",
            CardStyleInterpolation: "linear",
          }}
        />
      </Stack.Navigator>
    </ActionSheetProvider>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: 500,
    fontSize: 20,
  },
});
