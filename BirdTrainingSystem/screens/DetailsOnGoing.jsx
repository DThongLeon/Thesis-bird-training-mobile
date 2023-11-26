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
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import axios from "axios";
import Loader from "../Components/Loader";

const DetailsOnGoing = ({ route }) => {
  const navigation = useNavigation();
  console.log(route.params.value);
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [getDataTrainingProgress, setDataTrainingProgress] = useState([]);

  const [getDataCourseProgressSlot, setDataCourseProgressSlot] = useState([]);

  async function getBirdTrainingCourseProgress() {
    setLoading(true);
    try {
      const result = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/registered-birdtrainingcourseprogress",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: {
            birdTrainingCourseId: route.params.value.id,
          },
        }
      ).finally(() => {
        setLoading(false);
      });

      if (result.status === 200) {
        setDataTrainingProgress(result.data);
        setLoading(false);
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      getBirdTrainingCourseProgress();
    }, [])
  );

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
      getBirdTrainingCourseProgress();
    }, 1000);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.offWhite,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
        }
      >
        <ImageBackground
          source={{ uri: route.params.value.trainingCoursePicture }}
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
            ></Text>
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
              fontSize: wp(6),
              fontWeight: "700",
              paddingLeft: wp(4),
              color: "#fafafa",
              position: "relative",
            }}
          >
            {route?.params?.value?.trainingCourseTitle}
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
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {route?.params?.value.startTrainingDate ? (
              <Text
                style={{
                  fontSize: wp(5),
                  letterSpacing: 0.2,
                  marginTop: wp(6),
                  color: "green",
                  fontWeight: 800,
                }}
              >
                Assigned
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: wp(5),
                  letterSpacing: 0.2,
                  marginTop: wp(4),
                  color: "#404040",
                  fontWeight: 800,
                }}
              >
                Waiting for Assign
              </Text>
            )}
            <Text
              style={{
                fontSize: wp(4),
                letterSpacing: 0.2,
                color: "#404040",
                letterSpacing: 0.2,
                fontWeight: 600,
              }}
            >
              Status: {route.params.value.status}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                color: "#404040",
                fontWeight: 700,
                marginBottom: 5,
                textAlign: "right",
              }}
            >
              Training Date
            </Text>
            {route?.params?.value.startTrainingDate ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
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
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                  }}
                />
                <Text style={style.monthStyle}>
                  {moment(route?.params?.value.startTrainingDate, "DDMMYYYY")
                    .format("MMM")
                    .toUpperCase()}
                  {"-"}
                  {moment(route?.params?.value.startTrainingDate, "DDMMYYYY")
                    .format("DD")
                    .toUpperCase()}
                </Text>
                <Text style={style.dateStyle}>
                  {moment(route?.params?.value.startTrainingDate, "DDMMYYYY")
                    .format("YY")
                    .toUpperCase()}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: wp(3.5),
                  color: "#404040",
                  fontWeight: 400,
                }}
              >
                Not start yet
              </Text>
            )}
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
        <View style={{ flex: 1 }}>
          {getDataTrainingProgress.length === 0 ? (
            <View
              style={{
                paddingBottom: 30,
              }}
            >
              <View
                style={{
                  marginTop: hp(10),
                  borderColor: Colors.grey,
                  width: "90%",
                  height: hp(13),
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
                    color: "red",
                    marginBottom: 10,
                    textAlign: "center",
                    marginHorizontal: 20,
                  }}
                >
                  Stand by for server Assigned Trainer and slot skills for your
                  Bird
                </Text>
                <Text
                  style={{
                    flexShrink: 1,
                    flexWrap: "wrap",
                    fontSize: wp(4),
                    width: "auto",
                    fontWeight: "700",
                    color: "#404040",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                >
                  Sorry for this inconvenience !!
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {getDataTrainingProgress.map((val, index) => {
                return (
                  <View
                    style={{
                      paddingBottom: 20,
                    }}
                  >
                    {/* section header */}
                    <View
                      style={{
                        borderWidth: val.status == "Training" ? 1 : 0,
                        borderColor:
                          val.status == "Training" ? "#404040" : Colors.white,
                        height: wp(20),
                        width: "88%",
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 10,
                        backgroundColor:
                          val.status == "Training"
                            ? "rgba(0,0,0,0.32)"
                            : Colors.white,
                        opacity: val.status == "Training" ? 0.3 : 1,
                      }}
                      key={index}
                    >
                      {/* clickable to details when trainer finish learning */}
                      <TouchableOpacity
                        onPress={() => {
                          // navigation.navigate("TrainingReport", {
                          //   val,
                          // });
                        }}
                        disabled={val.status == "Training"}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 13,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            {/* icon image show skill */}
                            <Image
                              source={{ uri: val.birdSkillPicture }}
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
                              <Text style={style.userStyle}>
                                {val.birdSkillName}
                              </Text>
                              <Text
                                style={{
                                  fontSize: wp(3),
                                  fontWeight: "500",
                                  paddingLeft: 10,
                                  color: "#404040",
                                }}
                              >
                                Trainer: {val.trainerName}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginLeft: 8,
                                  marginTop: 5,
                                }}
                              >
                                <Progress.Bar
                                  color="green"
                                  borderColor="black"
                                  progress={val.trainingProgression}
                                  width={wp(35)}
                                />
                              </View>
                            </View>
                            <Text
                              style={{
                                fontSize: wp(3.5),
                                fontWeight: "500",
                                color: "#404040",
                              }}
                            >
                              Slot: {val.totalTrainingSlot}
                            </Text>
                          </View>

                          {val.status == "Training" && (
                            <FontAwesome
                              name={"lock"}
                              size={28}
                              color={"black"}
                            />
                          )}
                          {val.status == "Pass" && (
                            <View
                              style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: wp(3.5),
                                  fontWeight: "600",
                                  color: "#404040",
                                }}
                              >
                                {val.status}
                              </Text>
                              <AntDesign
                                name="checkcircle"
                                size={24}
                                color={"green"}
                              />
                            </View>
                          )}
                          {val.status == "NotPass" && (
                            <View
                              style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: wp(3.5),
                                  fontWeight: "600",
                                  color: "#404040",
                                }}
                              >
                                {val.status}
                              </Text>
                              <MaterialIcons
                                name="error"
                                size={24}
                                color="red"
                              />
                            </View>
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
                      > */}
                    {/* {val.data.map((index) => {
                          return ( */}
                    {/* <View
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
                        > */}
                    {/* <View style={{}}>
                            <Text
                              style={{
                                paddingLeft: 10,
                                fontSize: wp(4),
                                fontWeight: "800",
                                color: "#404040",
                              }}
                            >
                              Starting time:
                            </Text>
                            <Text
                              style={{
                                fontSize: wp(3),
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
                          </View> */}

                    {/* <View>
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
                          </View> */}
                    {/* </View> */}
                    {/* );
                        })} */}
                    {/* </View> */}
                    {/*  </TouchableWithoutFeedback> */}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
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
                        <Progress.Bar
                          color="green"
                          borderColor="black"
                          progress={0.2222}
                          width={wp(35)}
                        />
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
    fontSize: wp(3.4),
    fontWeight: "800",
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
    opacity: 0.9,
    fontSize: wp(3.5),
    textAlign: "center",
    fontWeight: "400",
    color: "#404040",
  },
  dateStyle: {
    fontSize: wp(5),
    textAlign: "center",
    fontWeight: "700",
    color: Colors.black,
  },
});
