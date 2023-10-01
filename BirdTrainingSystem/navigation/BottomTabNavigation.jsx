import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Home, Search, Profile } from "../screens/index";
import { Colors } from "../constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

const tabArr = [
  {
    route: "Home",
    label: "Home",
    icon: "home",
    component: Home,
    color: Colors.green,
  },
  {
    route: "Search",
    label: "Search",
    icon: "bell",
    component: Search,
    color: Colors.green,
  },
  {
    route: "Profile",
    label: "Profile",
    icon: "account",
    component: Profile,
    color: Colors.green,
  },
];
const BottomTabNavigation = () => {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";

  return (
    <Tab.Navigator
      shifting={true}
      activeColor="#e91e63"
      tab
      barStyle={{
        backgroundColor: Colors.white,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 70,
        width: "auto",
      }}
    >
      {tabArr.map((res, index) => {
        return (
          <Tab.Screen
            key={index}
            name={res.route}
            component={res.component}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name={res.icon}
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
