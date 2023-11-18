import React, { useCallback, useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Home, Workshop, Profile, Progress } from "../screens/index";
import { Colors } from "../constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigation = ({ route }) => {
  const [changeRoute, setChangeRoute] = useState(null);

  console.log("Change Route: ", changeRoute);

  // useFocusEffect(
  //   useCallback(() => {
  //     setChangeRoute(route.params);
  //   }, [route.params])
  // );

  useEffect(() => {
    setChangeRoute(route.params);
  }, [route.params]);

  // console.log(changeRoute);
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  return (
    <>
    {console.log('co chang hay khong',changeRoute)}
      {changeRoute ? (
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
            height: 65,
          }}
        >
          {/* Hpome */}
          <Tab.Screen
            key={index}
            name={"Home"}
            component={Home}
            initialParams={changeRoute}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  color={color}
                  name={"home"}
                  size={28}
                  style={{ top: -10 }}
                />
              ),
              tabBarLabel: <Text style={styles.tabBarLabel}>Home</Text>,
            }}
          />
          {/* Progress */}
          <Tab.Screen
            key={index}
            initialParams={changeRoute}
            name={"Progress"}
            component={Progress}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons
                  color={color}
                  name={"md-stats-chart"}
                  size={24}
                  style={{ top: -10 }}
                />
              ),
              tabBarLabel: <Text style={styles.tabBarLabel}>Progress</Text>,
            }}
          />
          {/* Profile */}
          <Tab.Screen
            key={index}
            name={"Profile"}
            children={() => <Profile  route={changeRoute}/>}
            // initialParams={changeRoute}
            // component={Profile}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  color={color}
                  name={"account"}
                  size={28}
                  style={{ top: -10 }}
                />
              ),
              tabBarLabel: <Text style={styles.tabBarLabel}>Profile</Text>,
            }}
          />
        </Tab.Navigator>
      ) : null}
    </>
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

export default BottomTabNavigation;
