import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Home, Workshop, Profile, Progress } from "../screens/index";
import { Colors } from "../constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { AddImage, RegisterBirdName } from "../registerBirdPhase";
const Stack = createStackNavigator();

const Register = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";

  return (
    <Stack.Navigator>
      <Stack.Screen
        key={index}
        name={"RegisterBirdName"}
        component={RegisterBirdName}
        options={{
          headerShown: false,
        }}
      />
      {/* Progress */}
      <Stack.Screen
        key={index}
        name={"AddImage"}
        component={AddImage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 11,
    position: "relative",
    padding: 0,
    bottom: 15,
    color: "#404040",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default Register;
