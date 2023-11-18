import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  ImageBackground,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { Data } from "../constants/viewListCourse";
import { useNavigation } from "@react-navigation/native";

const TrainingReport = ({ navigation, route }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        position: "absolute",
      }}
    >
      <TouchableOpacity
        style={{
          padding: 2,
          marginVertical: 30,
          borderRadius: 9999,
          marginLeft: 20,
          backgroundColor: Colors.white,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons
          name="chevron-back-outline"
          size={wp(7)}
          strokeWidth={10}
          color="black"
        />
      </TouchableOpacity>
      <Text
        style={{
          marginHorizontal: 15,
          fontSize: wp(6),
          fontWeight: "700",
          paddingLeft: wp(4),
          color: "black",
          position: "relative",
        }}
      >
        {route.params.val.title}
      </Text>
    </View>
  );
};

export default TrainingReport;
const style = StyleSheet.create({
  textStyle: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#404040",
  },

  shadowProp: {
    borderTopWidth: 0,
  },

  haveBorder: {
    borderTopWidth: 0.8,
    borderColor: "rgba(0,0,0,0.32)",
  },

  userStyle: {
    fontSize: wp(5),
    fontWeight: "600",
    paddingLeft: 10,
    color: "#404040",
  },

  appBar: {
    paddingVertical: 15,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchContainer: {
    marginTop: 10,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
  },
});
