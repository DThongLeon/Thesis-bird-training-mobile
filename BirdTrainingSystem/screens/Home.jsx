import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useRef } from "react";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

import { Category } from "../constants/categories";
import { Course } from "../constants/viewListCourse";
import { useNavigation } from "@react-navigation/native";
import BirdDetails from "./BirdDetails";
import { SliderBox } from "react-native-image-slider-box";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Home = () => {
  const birdArr = ["bird1", "bird2", "bird3", "bird4", "bird5"];

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handle"}
        style={style.appBarWrapper}
      >
        {/* avatar and action sheet */}
        <View style={style.appBar}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                height: wp(12),
                width: wp(12),
                borderRadius: wp(12),
                backgroundColor: Colors.black,
              }}
            />
            <Text style={style.userStyle}>Bird</Text>
          </TouchableOpacity>

          <View style={{ marginRight: 10 }}>
            <Ionicons size={25} name="notifications"></Ionicons>
          </View>
        </View>

        {/* Search Bar */}
        <View style={style.searchContainer}>
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            style={{ flexDirection: "row" }}
          >
            <Feather
              name="search"
              size={22}
              style={{
                marginHorizontal: 10,
                color: Colors.black,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.white,
              marginRight: 10,
              borderRadius: 12,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                paddingHorizontal: 5,
                lineHeight: 24,
                fontSize: 16,
              }}
              // value= ""
              onPressIn={() => {}}
              placeholder="What courses you're looking for..."
              placeholderTextColor={"gray"}
            />
          </View>
        </View>

        {/* Filter section */}
        <View style={{ marginTop: 20 }}>
          <Text style={style.textStyle}>Categories</Text>
          <CategoryFilter />
        </View>

        {/*Show all course show  */}
        <View style={{ flex: 1 }}>
          <Text style={style.textStyle}>Course</Text>
          <CourseBird/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const CategoryFilter = () => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {Category.map((value, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{
                display: 'flex',
                alignItems: "center",
                marginLeft: 16,
                marginVertical: 20,
              }}
            >
              <Image
                source={value.image}
                style={{
                  borderRadius: 24,
                  width: wp(26),
                  height: wp(24),
                }}
              />
              <Text
                style={{
                  color: '#404040',
                  fontWeight: 500,
                  fontSize: wp(3),
                  marginTop: 8
                }}
              >
                {value.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const Carousel = () => {
  const arr = [
    require("./../Assets/images/bird.jpg"),
    require("./../Assets/images/leaves.jpg"),
  ];
  return (
    <View style={{ flex: 1, alignItems: "center",marginHorizontal: 15, marginTop: 20 }}>
      <SliderBox
        images={arr}
        dotColor={Colors.black}
        inactiveDotColor={Colors.grey}
        ImageComponentStyle={{ borderRadius: 20, width: "80%", marginTop: 10 }}
        autoplay
        circleLoop
      />
    </View>
  );
};

export const CourseBird = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        paddingBottom: 30
      }}
    >
      {Course.map((val, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={{
              width: wp(44),
              height: wp(65),
              display: "flex",
              justifyContent: "flex-end",
              position: "relative",
              paddingHorizontal: 16,
              paddingVertical: 24,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Image
              source={val.image}
              style={{
                width: wp(44),
                height: wp(65),
                position: "absolute",
                borderRadius: 40,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


export default Home;

const style = StyleSheet.create({
  textStyle: {
    marginHorizontal: 15,
    fontSize: wp(6),
    fontWeight: "600",
    paddingLeft: 5,
    color: '#404040'
  },

  appBarWrapper: {
    marginVertical: 20,
  },

  userStyle: {
    fontSize: wp(6),
    fontWeight: "600",
    paddingLeft: 10,
    color: '#404040'
  },

  appBar: {
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchContainer: {
    marginTop: 20,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
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
