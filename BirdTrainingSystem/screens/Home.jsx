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
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

import { Category } from "../constants/categories";
import { Course } from "../constants/viewListCourse";
import { useNavigation } from "@react-navigation/native";
import BirdDetails from "./BirdDetails";

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        style={style.appBarWrapper}
      >
        <View style={style.appBar}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: Colors.black,
              }}
            />
            <Text style={style.userStyle}>Bird</Text>
          </View>

          <View>
            <Ionicons size={25} name="location"></Ionicons>
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
              size={24}
              style={{
                marginHorizontal: 10,
                color: Colors.grey,
              }}
            ></Feather>
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
                width: "100%",
                height: "100%",
                paddingHorizontal: 5,
              }}
              // value= ""
              onPressIn={() => {}}
              placeholder="What courses you're looking for..."
            />
          </View>
        </View>

        {/* Filter section */}
        <View>
          <Text style={style.textStyle}>Categories</Text>
          <CategoryFilter></CategoryFilter>
        </View>

        <View>
          <Text style={style.textStyle}>Popular Course</Text>
          <CourseBird></CourseBird>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const CategoryFilter = () => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Category.map((value, index) => {
          return (
            <TouchableOpacity
              style={{
                marginVertical: 20,
                backgroundColor: index === 0 ? Colors.red : Colors.white,
                marginRight: 30,
                paddingHorizontal: 15,
                paddingVertical: 12,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 15,
              }}
            >
              <Text
                style={{
                  color: index === 0 ? Colors.white : Colors.black,
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

export const CourseBird = () => {
  const navigation = useNavigation();
  return (
    <View>
      <ScrollView alwaysBounceVertical showsVerticalScrollIndicator={false}>
        {Course.map((val) => {
          return (
            <Pressable
              onPress={ () => {
                navigation.navigate("BirdDetails" , {
                  screen: "BirdDetails",
                })
              }}
              style={{
                marginVertical: 20,
                backgroundColor: Colors.white,
                paddingHorizontal: 15,
                paddingVertical: 12,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                
                source={val.image}
                style={{
                  height: 200,
                  resizeMode:"center",
                }}
              />
              <Text
                style={{
                  color: Colors.black,
                }}
              >
                {val.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
export default Home;

const style = StyleSheet.create({
  textStyle: {
    fontSize: 25,
    // fontFamily: "Opens-Sans",
    fontWeight: "500",
  },
  appBarWrapper: {
    marginHorizontal: 22,
  },
  userStyle: {
    fontSize: 20,
    // fontFamily: "Opens-Sans",
    fontWeight: "500",
    paddingLeft: 10,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 20,
    paddingHorizontal: 16,
    height: 50,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 15,
  },
});
