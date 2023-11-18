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
        <View>
          {getData.map((val, index) => {
            return val.status === route.params.status ? (
              <TouchableOpacity
                onPress={(val) => {
                  navigation.navigate("DetailsOnGoing", {});
                }}
                key={index}
                style={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  source={{ uri: val.trainingCoursePicture }}
                  resizeMethod="auto"
                  borderRadius={18}
                  style={{
                    width: wp(60),
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
                        <Text style={{ color: "white" }}> {val.status}</Text>
                      </View>
                      <Text
                        style={{
                          fontSize: wp(5),
                          fontWeight: "800",
                          color: "white",
                        }}
                      >
                        {val.trainingCourseTitle}
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
                      {val.totalSlot} total Slot
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
            ) : null;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SeeAll;
