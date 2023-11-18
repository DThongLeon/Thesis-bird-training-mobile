import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "../constants/theme";
import React from "react";
import { Events } from "../constants/event";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const Workshop = () => {
  return (
    <Animated.View
      entering={FadeInDown.delay((index = 100))
        .duration(600)
        .springify()
        .damping(10)}
      style={{ flex: 1 }}
    >
      <Text style={style.textStyle}>Featured</Text>
      <View style={{ flex: 1, paddingBottom: 50 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* inProgress event */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: wp(5),
                fontWeight: "600",
                paddingLeft: 5,
                color: "#404040",
              }}
            >
              In-progress
            </Text>
            <InProgressEvent />
          </View>
          {/* out of date */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: wp(5),
                fontWeight: "600",
                paddingLeft: 5,
                color: "#404040",
              }}
            >
              Out Of Date
            </Text>
            <OutOfDate />
          </View>
          {/* out of date */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: wp(5),
                fontWeight: "600",
                paddingLeft: 5,
                color: "#404040",
              }}
            >
              Out Of Date
            </Text>
            <OutOfDate />
          </View>
          {/* out of date */}
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: wp(5),
                fontWeight: "600",
                paddingLeft: 5,
                color: "#404040",
              }}
            >
              Out Of Date
            </Text>
            <OutOfDate />
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export const InProgressEvent = () => {
  const navigation = useNavigation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {Events.map((item, index) => {
        return (
          <View>
            {item.type === "in-progress" ? (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  navigation.navigate("WorkshopDetails", {
                    selectedEvent: item,
                  });
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}
                >
                  <ImageBackground
                    source={item.image}
                    resizeMethod="auto"
                    borderRadius={20}
                    style={{
                      width: wp(80),
                      height: hp(25),
                      justifyContent: "space-between",
                    }}
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: hp(20),
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                      }}
                    />
                    {/* <View
                      style={{
                        alignItems: "flex-end",
                        marginVertical: 20,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 15,
                          width: 60,
                          height: 60,
                          backgroundColor: Colors.white,
                          marginRight: 25,
                        }}
                      >
                        <Text style={style.monthStyle}>
                          {moment(item.startingTime, "YYYYMMDD")
                            .format("MMM")
                            .toUpperCase()}
                        </Text>
                        <Text style={style.dateStyle}>
                          {moment(item.startingTime, "YYYYMMDD")
                            .format("DD")
                            .toUpperCase()}
                        </Text>
                      </View>
                    </View> */}

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginVertical: 15,
                      }}
                    >
                      <Text style={style.name}> {item.name} </Text>
                      <Text style={style.title}> {item.title} </Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
};

export const OutOfDate = () => {
  const navigation = useNavigation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {Events.map((item, index) => {
        return (
          <View>
            {item.type === "out-of-date" ? (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  navigation.navigate("WorkshopDetails", {
                    selectedEvent: item,
                  });
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}
                >
                  <ImageBackground
                    source={item.image}
                    resizeMethod="auto"
                    borderRadius={20}
                    style={{
                      width: wp(80),
                      height: hp(25),
                      justifyContent: "space-between",
                    }}
                  >
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: hp(20),
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                      }}
                    />
                    <View
                      style={{
                        alignItems: "flex-end",
                        marginVertical: 20,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 15,
                          width: 60,
                          height: 60,
                          backgroundColor: Colors.white,
                          marginRight: 25,
                        }}
                      >
                        <Text style={style.monthStyle}>
                          {moment(item.startingTime, "YYYYMMDD")
                            .format("MMM")
                            .toUpperCase()}
                        </Text>
                        <Text style={style.dateStyle}>
                          {moment(item.startingTime, "YYYYMMDD")
                            .format("DD")
                            .toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        marginHorizontal: 20,
                        marginVertical: 15,
                      }}
                    >
                      <Text style={style.name}> {item.name} </Text>
                      <Text style={style.title}> {item.title} </Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Workshop;

const style = StyleSheet.create({
  textStyle: {
    marginHorizontal: 15,
    fontSize: wp(8),
    fontWeight: "600",
    paddingLeft: 5,
    color: "#404040",
    paddingTop: 20,
  },

  title: {
    fontSize: wp(6),
    color: Colors.white,
  },

  name: {
    opacity: 0.5,
    fontSize: wp(5),
    color: Colors.white,
  },

  monthStyle: {
    opacity: 0.7,
    fontSize: wp(4),
    textAlign: "center",
    fontWeight: "400",
    color: "#404040",
  },
  dateStyle: {
    fontSize: wp(6),
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.black,
  },
});
