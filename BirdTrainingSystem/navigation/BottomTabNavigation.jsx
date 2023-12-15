import { StyleSheet, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Home, Profile, Progress } from "../screens/index";
import { Colors } from "../constants/theme";
import { useTheme } from "react-native-paper";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigation = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  return (
    <Tab.Navigator
      shifting={true}
      activeColor={"#e91e63"}
      barStyle={{
        backgroundColor: Colors.white,
        position: "absolute",
        bottom: -12,
        right: 0,
        left: 0,
        elevation: 0,
        height: 75,
      }}
    >
      {/* Home */}
      <Tab.Screen
        key={index}
        name={"Home"}
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              color={color}
              name={"home"}
              size={30}
              style={{ top: -5 }}
            />
          ),
          tabBarLabel: <Text style={styles.tabBarLabel}>Home</Text>,
        }}
      />
      {/* Progress */}
      <Tab.Screen
        key={index}
        name={"Progress"}
        component={Progress}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              color={color}
              name={"md-stats-chart"}
              size={30}
              style={{ top: -5 }}
            />
          ),
          tabBarLabel: <Text style={styles.tabBarLabel}>Progress</Text>,
        }}
      />
      {/* Profile */}
      <Tab.Screen
        key={index}
        name={"Profile"}
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              color={color}
              name={"account"}
              size={30}
              style={{ top: -5 }}
            />
          ),
          tabBarLabel: <Text style={styles.tabBarLabel}>Profile</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    position: "relative",
    padding: 0,
    bottom: 15,
    color: "#404040",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default BottomTabNavigation;
