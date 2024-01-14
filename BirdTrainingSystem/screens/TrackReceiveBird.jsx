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
import React, { useCallback, useState } from "react";
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
import { find, includes } from "lodash";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment, { isMoment } from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const TrackReceiveBird = ({ route }) => {
  const navigation = useNavigation();

  // loading
  const [loading, setLoading] = useState(false);

  const [dataCustomerBird, setDataCustomerBird] = useState([]);

  const [getDataCourseRegister, setDataCourseRegister] = useState([]);

  const [getDataTrainingCourseRegister, setDataTrainingCourseRegister] =
    useState([]);

  const [refreshing, setRefreshing] = useState(false);

  async function getCustomerBird() {
    try {
      setLoading(true);
      // getData storage
      const getDataId = await AsyncStorage.getItem("dataId").then((val) =>
        JSON.parse(val)
      );
      // fetching
      const response = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: { customerId: getDataId?.customerId },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (response) {
        const getDefault = await AsyncStorage.getItem("defaultBird").then(
          (val) => JSON.parse(val)
        );

        setLoading(true);

        const dataFilter = response.data.filter((params) => {
          if (getDefault === false) {
            return (
              JSON.stringify(params.id) === JSON.stringify(getDataId.birdId)
            );
          } else {
            return JSON.stringify(params.isDefault).indexOf(true) > -1;
          }
        });

        setDataCustomerBird(dataFilter);

        async function getRegisteredCourse() {
          setLoading(true);
          try {
            const result = await axios(
              "http://13.214.85.41/api/trainingcourse-customer/registered-birdtrainingcourse",
              {
                method: "get",
                headers: {
                  Accept: "application/json",
                },
                params: {
                  birdId: dataFilter[0].id,
                  customerId: dataFilter[0].customerId,
                },
              }
            );

            if (result) {
              setDataCourseRegister(result.data);
            } else {
              alert(`error mess: ${result}`);
            }
          } catch (err) {
            alert(err);
          }
          setLoading(false);
        }
        getRegisteredCourse();
        setLoading(false);
      } else {
        alert(`error mess: ${response}`);
      }
      setLoading(false);
    } catch (err) {
      alert(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCustomerBird();
    }, [])
  );

  const getBirdPicture = dataCustomerBird.map((item) => item.picture);
  const getBirdName = dataCustomerBird.map((item) => item.name);

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
      getCustomerBird();
    }, 1000);
  };

  const getCourseConfirm = getDataCourseRegister.filter((res) => {
    return JSON.stringify(res.status).indexOf("Confirmed") > -1;
  });

  const getCourseComplete = getDataCourseRegister.filter((par) => {
    return JSON.stringify(par.status).indexOf("Complete") > -1;
  });

  return (
    <View style={{ marginHorizontal: 10 }}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handle"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
        }
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
            Send Bird /Completed Course
          </Text>
        </View>

        {/* content */}
        {/* <View>
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
                  You don't have any Course Training Done.
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
                          borderRadius: 18,
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
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            style={{
                              fontSize: wp(4),
                              fontWeight: "500",
                              color: "white",
                            }}
                          >
                            Registered Date
                          </Text>
                          <Text
                            style={{
                              fontSize: wp(3.5),
                              fontWeight: "400",
                              color: "white",
                            }}
                          >
                            {moment(value.registeredDate, "DDMMYYYY").format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: "white",
                            height: wp(8),
                            width: wp(1),
                            marginHorizontal: 10,
                          }}
                        />
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
        </View> */}

        {/* Ready to send bird to system */}
        <View style={{ marginTop: 5 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={style.textStyle}>Send Bird</Text>
            {getCourseConfirm.length === 0 ? null : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SeeAll", {
                    val: getCourseConfirm,
                    getTitle: "Send Bird",
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp(4),
                      fontWeight: "500",
                      paddingLeft: 5,
                      color: "green",
                    }}
                  >
                    See all
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={wp(6)}
                    color={"green"}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {getCourseConfirm.length === 0 ? (
          <View style={{ paddingBottom: 30 }}>
            <View
              style={{
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
                }}
              >
                Stand by for server Assigned and Confirm Trainer for your Bird
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getCourseConfirm.map((value, index) => {
              return (
                <View key={value.id}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("DetailsOnGoing", { value });
                    }}
                    style={{
                      marginHorizontal: 10,
                      display: "flex",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <ImageBackground
                      source={{ uri: value.trainingCoursePicture }}
                      resizeMethod="auto"
                      borderRadius={18}
                      style={{
                        width: wp(65),
                        height: hp(23),
                        justifyContent: "space-between",
                      }}
                    >
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0.6 }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          height: hp(23),
                          borderRadius: 18,
                        }}
                      />
                      <View
                        style={{
                          alignItems: "flex-start",
                          marginTop: 10,
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
                              {value.status}
                            </Text>
                          </View>
                          <Text
                            style={{
                              marginTop: 5,
                              flexShrink: 1,
                              flexWrap: "wrap",
                              maxWidth: wp(50),
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
                          alignItems: "center",
                          marginHorizontal: 20,
                          marginVertical: 15,
                        }}
                      >
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            style={{
                              fontSize: wp(4),
                              fontWeight: "500",
                              color: "white",
                            }}
                          >
                            Registered Date
                          </Text>
                          <Text
                            style={{
                              fontSize: wp(3.5),
                              fontWeight: "400",
                              color: "white",
                            }}
                          >
                            {moment(value.registeredDate, "DDMMYYYY").format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: "white",
                            height: wp(8),
                            width: wp(1),
                            marginHorizontal: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: wp(4),
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          {value.totalSlot} Slot
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
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Completed Status */}
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={style.textStyle}>Course Completed</Text>
            {getCourseComplete.length === 0 ? null : (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SeeAll", {
                    val: getCourseComplete,
                    getTitle: "Ready to pick up",
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp(4),
                      fontWeight: "500",
                      paddingLeft: 5,
                      color: "green",
                    }}
                  >
                    See all
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={wp(6)}
                    color={"green"}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {getCourseComplete.length === 0 ? (
          <View style={{ paddingBottom: 30 }}>
            <View
              style={{
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
                }}
              >
                Your bird is not ready to pick up for now. Please wait !!
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getCourseComplete.map((value, index) => {
              return (
                <View key={value.id}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("DetailsOnGoing", { value });
                    }}
                    style={{
                      marginHorizontal: 10,
                      display: "flex",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <ImageBackground
                      source={{ uri: value.trainingCoursePicture }}
                      resizeMethod="auto"
                      borderRadius={18}
                      style={{
                        width: wp(65),
                        height: hp(23),
                        justifyContent: "space-between",
                      }}
                    >
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0.6 }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          height: hp(23),
                          borderRadius: 18,
                        }}
                      />
                      <View
                        style={{
                          alignItems: "flex-start",
                          marginTop: 10,
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
                              {value.status}
                            </Text>
                          </View>
                          <Text
                            style={{
                              marginTop: 5,
                              flexShrink: 1,
                              flexWrap: "wrap",
                              maxWidth: wp(50),
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
                          alignItems: "center",
                          marginHorizontal: 20,
                          marginVertical: 15,
                        }}
                      >
                        <View style={{ flexDirection: "column" }}>
                          <Text
                            style={{
                              fontSize: wp(4),
                              fontWeight: "500",
                              color: "white",
                            }}
                          >
                            Registered Date
                          </Text>
                          <Text
                            style={{
                              fontSize: wp(3.5),
                              fontWeight: "400",
                              color: "white",
                            }}
                          >
                            {moment(value.registeredDate, "DDMMYYYY").format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: "white",
                            height: wp(8),
                            width: wp(1),
                            marginHorizontal: 10,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: wp(4),
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          {value.totalSlot} Slot
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
                </View>
              );
            })}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

export default TrackReceiveBird;

const style = StyleSheet.create({
  textStyle: {
    marginHorizontal: 15,
    fontSize: wp(5.5),
    fontWeight: "600",
    paddingLeft: 10,
    color: "#404040",
  },

  userStyle: {
    fontSize: wp(5.5),
    fontWeight: "600",
    paddingLeft: 20,
    color: "#404040",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: wp(50),
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
