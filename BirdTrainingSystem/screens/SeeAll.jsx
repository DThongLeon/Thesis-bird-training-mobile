import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "../constants/theme";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Category } from "../constants/categories";
import { find, includes } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { isMoment } from "moment";

const SeeAll = ({ route }) => {
  const navigation = useNavigation();

  const [getData, setGetData] = useState(route.params.val);

  return (
    <View style={{ marginHorizontal: 10 }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Go back button */}
        <View
          // entering={FadeIn.delay(200).duration(1000)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 2,
              marginVertical: 30,
              borderRadius: 9999,
              marginLeft: 16,
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
              fontSize: wp(5),
              letterSpacing: 0.2,
              marginLeft: wp(3),
              color: "#404040",
              fontWeight: 800,
            }}
          >
            {route.params.getTitle}
          </Text>
        </View>

        {/* content */}
        <View>
          {getData.length === 0 ? (
            <View style={{ paddingBottom: 30 }}>
              <View
                style={{
                  borderColor: Colors.grey,
                  width: "90%",
                  height: hp(8),
                  borderRadius: 10,
                  borderWidth: 2,
                  marginVertical: 10,
                  marginHorizontal: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    flexShrink: 1,
                    flexWrap: "wrap",
                    fontSize: wp(4),
                    width: "auto",
                    fontWeight: "700",
                    color: "#404040",
                    textAlign: "center",
                  }}
                >
                  You don't have any Course Registered.
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {getData.map((value, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (route.params.getTitle === "Certificate") {
                        navigation.navigate("Certificate", {
                          value: getData,
                        });
                      } else {
                        navigation.navigate("DetailsOnGoing", {
                          value,
                        });
                      }
                    }}
                    key={value.id}
                    style={{
                      marginTop: 10,
                      marginHorizontal: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ImageBackground
                      source={{ uri: value.trainingCoursePicture }}
                      resizeMethod="auto"
                      borderRadius={18}
                      style={{
                        width: wp(70),
                        height: hp(20),
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
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: 18,
                        }}
                      />
                      <View
                        style={{
                          alignItems: "flex-start",
                          marginVertical: 20,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            paddingLeft: 15,
                          }}
                        >
                          <View
                            style={{
                              borderWidth: 1,
                              borderRadius: 12,
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 1,
                              paddingHorizontal: 5,
                              height: "auto",
                              borderColor: Colors.white,
                              width: "auto",
                            }}
                          >
                            <Text style={{ color: "white" }}>
                              {" "}
                              {value.status}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: wp(5),
                              fontWeight: "800",
                              color: "white",
                            }}
                          >
                            {value.trainingCourseTitle}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          marginHorizontal: 20,
                          marginVertical: 15,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(4),
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          {value.totalSlot} total Slot
                        </Text>
                      </View>
                    </ImageBackground>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          marginTop: 10,
                          width: wp(4),
                          height: wp(1),
                          borderRadius: 10,
                          flexDirection: "row",
                          marginHorizontal: 1.5,
                        }}
                      ></View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SeeAll;
