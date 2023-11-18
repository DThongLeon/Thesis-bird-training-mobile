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
import * as Progress from "react-native-progress";

const DetailsOnGoing = ({ navigation, route }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.offWhite,
      }}
    >
      <ScrollView>
        <ImageBackground
          // source={route.params.value.image}
          resizeMethod="auto"
          style={{
            height: 200,
            width: wp("100%"),
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: hp(20),
            }}
          ></LinearGradient>
          <View
            style={{
              marginLeft: 10,
              marginTop: wp(23),
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                color: Colors.white,
                marginHorizontal: 10,
                flexWrap: "wrap",
                fontSize: wp(3.5),
                fontWeight: "500",
              }}
            >
              {route?.params?.value?.desc}
            </Text>
          </View>
        </ImageBackground>

        {/* back button */}
        <View
          // entering={FadeIn.delay(200).duration(500)}
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
              fontSize: wp(8),
              fontWeight: "700",
              paddingLeft: wp(4),
              color: "#fafafa",
              position: "relative",
            }}
          >
            {route?.params?.value?.name}
          </Text>
        </View>

        {/* Progress status */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: wp(5),
              letterSpacing: 0.2,
              marginTop: wp(6),
              color: "#404040",
              fontWeight: 800,
            }}
          >
            Waiting for Assign
          </Text>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingVertical: 10,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                color: "#404040",
                fontWeight: 500,
                marginBottom: 5,
              }}
            >
              Start Date
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                width: 60,
                height: 65,
                backgroundColor: Colors.white,
                shadowColor: "#000",
                shadowOffset: {
                  width: 1,
                  height: 5,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 15,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  top: -2,
                  height: 13,
                  backgroundColor: "red",
                  width: "100%",
                  borderTopRightRadius: wp(2),
                  borderTopLeftRadius: wp(2),
                }}
              />
              <Text style={style.monthStyle}>
                DEC
                {/* {moment(item.startingTime, "YYYYMMDD")
                .format("MMM")
                .toUpperCase()} */}
              </Text>
              <Text style={style.dateStyle}>
                21
                {/* {moment(item.startingTime, "YYYYMMDD").format("DD").toUpperCase()} */}
              </Text>
            </View>
          </View>
        </View>

        
        {/* Exercise show bird progress  */}
        <Text
          style={{
            fontSize: wp(6),
            fontWeight: "600",
            paddingLeft: 10,
            paddingTop: 20,
            paddingBottom: 20,
            color: "#404040",
            marginHorizontal: 10,
          }}
        >
          Exercise
        </Text>
        <SectionBirdSlot />
      </ScrollView>
    </View>
  );
};



export const SectionBirdSlot = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      {Data.map((val, index) => {
        return (
          <View
            style={{
              paddingBottom: 20,
            }}
          >
            {/* section header */}
            <View
              style={{
                borderWidth: val.finish == true ? 0.8 : 0,
                borderColor:
                  val.finish == true ? "rgba(0,0,0,0.32)" : Colors.white,
                height: wp(20),
                width: "88%",
                marginLeft: 20,
                marginRight: 20,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                backgroundColor:
                  val.finish == false ? "rgba(0,0,0,0.32)" : Colors.white,
                opacity: val.finish == false ? 0.7 : 1,
              }}
              key={index}
            >
              {/* clickable to details when trainer finish learning */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("TrainingReport", {
                    val,
                  });
                }}
                disabled={val.finish == false}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 13,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* icon image show skill */}
                    <Image
                      // source={val.image}
                      style={{
                        borderRadius: 25,
                        width: wp(13),
                        height: wp(13),
                      }}
                    />
                    {/* progress status mark green or grey when not complete */}
                    <View
                      style={{
                        paddingLeft: 10,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={style.userStyle}>{val.title}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 8,
                          marginTop: 5,
                        }}
                      >
                        <Progress.Bar color="green" borderColor="black" progress={0.2222} width={wp(35)} />
                      </View>
                    </View>
                  </View>
                  {val.finish == true ? (
                    <View style={{ flexDirection: "row" }}>
                      <AntDesign name="checkcircle" size={24} color={"green"} />
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={wp(6)}
                        color={"green"}
                      />
                    </View>
                  ) : (
                    <FontAwesome name={"lock"} size={28} color={"black"} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* section slot */}
            {/* <TouchableWithoutFeedback disabled={true}>
              <View
                style={{
                  height: "auto",
                  width: "88%",
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginLeft: 20,
                  marginTop: -5,
                  marginRight: 0,
                  backgroundColor: Colors.white,
                  shadowColor: "#000",
                  shadowOffset: {
                    height: 1,
                    width: 0.5,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 4.5,
                  elevation: 10,
                  overflow: "hidden",
                }}
              >
                {val.data.map((index) => {
                  return (
                    <View
                      style={[
                        index === Data.length
                          ? style.shadowProp
                          : style.haveBorder,
                        {
                          height: 80,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: 10,
                          backgroundColor:
                            index.isComplete == false
                              ? "rgba(0,0,0,0.32)"
                              : null,
                        },
                      ]}
                    >
                      <View style={{}}>
                        <Text
                          style={{
                            paddingLeft: 10,
                            fontSize: wp(5),
                            fontWeight: "800",
                            color: "#404040",
                          }}
                        >
                          Starting time:
                        </Text>
                        <Text
                          style={{
                            fontSize: wp(4),
                            fontWeight: "500",
                            paddingLeft: 20,
                            color: "#404040",
                          }}
                        >
                          Slot:{" "}
                          {moment(index.slot, "YYYYMMDD")
                            .format("hh:mm A")
                            .toUpperCase()}
                        </Text>
                      </View>

                      <View>
                        {index.isComplete == true ? (
                          <AntDesign
                            name="checkcircle"
                            size={24}
                            color={"green"}
                          />
                        ) : (
                          <View>
                            <Text style={style.textStyle}>
                              Status: Not Start Yet
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </TouchableWithoutFeedback> */}
          </View>
        );
      })}
    </SafeAreaView>
  );
};

export default DetailsOnGoing;
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

  monthStyle: {
    opacity: 0.7,
    fontSize: wp(4),
    textAlign: "center",
    fontWeight: "400",
    color: "#404040",
  },
  dateStyle: {
    fontSize: wp(5),
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.black,
  },
});
