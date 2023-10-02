import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps={"handled"}  style={style.appBarWrapper}>
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

        <View style={style.searchContainer}>
          <TouchableOpacity onPress={Keyboard.dismiss} style={{ flexDirection: "row" }}>
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
              backgroundColor: Colors.secondary,
              marginRight: 10,
              borderRadius: 12,
            }}
          >
            <TextInput style={{
              width: '100%',
              height: '100%',
              paddingHorizontal: 5,
              }}
              // value= ""
              onPressIn={() => {
              }}
              placeholder="What courses you're looking for..."
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    marginVertical: 15,
    height: 45
  },
});
