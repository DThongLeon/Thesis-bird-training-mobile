import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "../constants/theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Octicons,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components";

const WorkshopDetails = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    let { selectedEvent } = route.params;

    setSelectedEvent(selectedEvent);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView>
        <ImageBackground
          source={selectedEvent?.image}
          resizeMethod="auto"
          style={{
            height: 250,
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
              marginTop: wp(15),
            }}
          >
            {/* calendar */}
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 20,
                marginVertical: wp(20),
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={style.name}>{selectedEvent?.name} </Text>
                <Text style={style.title}>{selectedEvent?.title} </Text>
                <Text style={style.name}>
                  Starting:{" "}
                  {moment(selectedEvent?.startingTime, "YYYYMMDD")
                    .format("hh:mm A")
                    .toUpperCase()}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
                  width: 60,
                  height: 60,
                  backgroundColor: Colors.white,
                  marginRight: 25,
                }}
              >
                <LinearGradient
                  colors={["#439DFEE8", "#F687FFE8"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    position: "absolute",
                    width: 60,
                    height: 60,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></LinearGradient>
                <Text style={style.monthStyle}>
                  {moment(selectedEvent?.startingTime, "YYYYMMDD")
                    .format("MMM")
                    .toUpperCase()}
                </Text>
                <Text style={style.dateStyle}>
                  {moment(selectedEvent?.startingTime, "YYYYMMDD")
                    .format("DD")
                    .toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* back button */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
        </Animated.View>

        {/* footer contain desc */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              textAlign: "justify",
              flex: 1,
              flexWrap: "wrap",
              fontSize: wp(4),
              fontWeight: "400",
              opacity: 0.7,
              color: "#404040",
            }}
          >
            {selectedEvent?.desc}{" "}
          </Text>

          <Text
            style={{
              textAlign: "justify",
              flex: 1,
              flexWrap: "wrap",
              fontSize: wp(4),
              fontWeight: "400",
              opacity: 0.7,
              color: "#404040",
            }}
          >
            {selectedEvent?.desc}{" "}
          </Text>
        </View>

        {/* location */}
        <View style={{ marginHorizontal: 20 }}>
          <Text
            style={{
              marginVertical: 5,
              fontSize: wp(6),
              color: Colors.black,
            }}
          >
            Location
          </Text>
          <View style={{ height: 200 }}>
            <MapView style={{ height: 200, borderRadius: 30 }} />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          height: hp(13),
          width: wp("100%"),
          borderRadius: 20,
          backgroundColor: Colors.brownEa,
          position: "relative",
          bottom: -20,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 25,
          }}
        >
          <View style={{ top: -10 }}>
            <Text
              style={{ opacity: 0.5, fontSize: wp(4), color: Colors.black }}
            >
              PRICE
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{ opacity: 0.8, fontSize: wp(5.5), color: Colors.black }}
              >
                1.99$
              </Text>
              <Text
                style={{ opacity: 0.8, fontSize: wp(5.5), color: Colors.black }}
              >
                /person
              </Text>
            </View>
          </View>
          <ButtonLogin>
            <Text
              style={{ color: "#404040", fontWeight: 600, fontSize: wp(4.5) }}
            >
              Check-in
            </Text>
          </ButtonLogin>
        </View>
      </View>
    </View>
  );
};

export default WorkshopDetails;

const style = StyleSheet.create({
  title: {
    marginVertical: 5,
    fontSize: wp(6),
    color: Colors.white,
  },
  name: {
    opacity: 0.5,
    fontSize: wp(4),
    color: Colors.white,
  },
  monthStyle: {
    opacity: 0.7,
    fontSize: wp(3.8),
    textAlign: "center",
    fontWeight: "500",
    color: Colors.black,
  },
  dateStyle: {
    fontSize: wp(6),
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.black,
  },
});
export const ButtonLogin = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  background-color: ${Colors.yellow};
  align-items: center;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 10px;
`;
