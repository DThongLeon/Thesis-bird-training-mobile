import React from "react";
import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
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
