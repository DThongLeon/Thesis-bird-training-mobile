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
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import axios from "axios";
import Loader from "../Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

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

        // setDataCustomerBird(dataFilter);

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
              // setDataCourseRegister(result.data);
            } else {
              // alert(`error mess: ${result}`);
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

  getCustomerBird();
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
    };
  },
});

const Progress = ({ route }) => {
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // async function registerForPushNotificationsAsync() {
  //   let token;

  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   // if (Device.isDevice) {
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== "granted") {
  //     alert("Failed to get push token for push notification!");
  //     return;
  //   }
  //   // Learn more about projectId:
  //   // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  //   token = (
  //     await Notifications.getExpoPushTokenAsync({
  //       projectId: "b690b9fd-9cee-4dbb-bdab-0a5e6bdc8cd4",
  //     })
  //   ).data;
  //   console.log("token", token);
  //   // } else {
  //   //   alert("Must use physical device for Push Notifications");
  //   // }

  //   return token;
  // }

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // function scheduleNotificationsHandler() {
  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "testing push notification",
  //       body: "hooyah",
  //       data: { username: "thong" },
  //     },
  //     trigger: {
  //       seconds: 1,
  //     },
  //   });
  // }
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

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 5000, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
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

  const getCourseRegistered = getDataCourseRegister.filter((par) => {
    return JSON.stringify(par.status).indexOf("Registered") > -1;
  });

  const getCourseConfirm = getDataCourseRegister.filter((res) => {
    return JSON.stringify(res.status).indexOf("Confirmed") > -1;
  });

  const getCourseTraining = getDataCourseRegister.filter((par) => {
    return par.status === "Training";
  });

  const getCourseCancel = getDataCourseRegister.filter((par) => {
    return JSON.stringify(par.status).indexOf("Cancel") > -1;
  });

  const getCourseDone = getDataCourseRegister.filter((par) => {
    return JSON.stringify(par.status).indexOf("TrainingDone") > -1;
  });

  const getCourseComplete = getDataCourseRegister.filter((par) => {
    return JSON.stringify(par.status).indexOf("Complete") > -1;
  });

  {
    /* <TouchableOpacity
        onPress={async () => {
          await scheduleNotificationsHandler();
        }}
      >
        <Text>local testnoti</Text>
      </TouchableOpacity> */
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* avatar and action sheet */}
      <View style={style.appBar}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Bird picture */}
          {getBirdPicture == null ? (
            <Image
              source={require("./../Assets/images/beach.png")}
              style={{
                height: wp(12),
                width: wp(12),
                borderRadius: wp(12),
                borderColor: Colors.primary,
                borderWidth: 1,
              }}
            />
          ) : (
            <Image
              source={{ uri: getBirdPicture[0] }}
              style={{
                height: wp(12),
                width: wp(12),
                borderRadius: wp(12),
                borderColor: Colors.primary,
                borderWidth: 1,
              }}
            />
          )}
          {/* bird name */}
          {getBirdName && <Text style={style.userStyle}>{getBirdName}</Text>}
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handle"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
        }
      >
        <View>
          <View
            entering={FadeInRight.delay((index = 100)).duration(600)}
            style={{ marginHorizontal: 10 }}
          >
            {/* Registered */}
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Registered</Text>

                {getCourseRegistered.length === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SeeAll", {
                        val: getCourseRegistered,
                        getTitle: "Registered",
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

            {getCourseRegistered.length === 0 ? (
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getCourseRegistered.map((value, index) => {
                  return (
                    <View key={value.id}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("DetailsOnGoing", {
                            value,
                          });
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
                                numberOfLines={2}
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
                                {moment(
                                  value.registeredDate,
                                  "DDMMYYYY"
                                ).format("DD/MM/YYYY")}
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

            {/* Training */}
            <View style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Training</Text>
                {getCourseTraining.length === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SeeAll", {
                        val: getCourseTraining,
                        getTitle: "Training",
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
            {getCourseTraining.length === 0 ? (
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
                    Stand by for server Assigned and Confirm Trainer for your
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getCourseTraining.map((value, index) => {
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
                                numberOfLines={2}
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
                                {moment(
                                  value.registeredDate,
                                  "DDMMYYYY"
                                ).format("DD/MM/YYYY")}
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

            {/* Ready to Pickup */}
            <View style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Ready to Pickup</Text>

                {getCourseDone.length === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SeeAll", {
                        val: getCourseDone,
                        getTitle: "Training Done",
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
            {getCourseDone.length === 0 ? (
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
                  Your's Bird is not training into any courses
                </Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getCourseDone.map((value, index) => {
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
                                numberOfLines={2}
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
                              marginVertical: 20,
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
                                {moment(
                                  value.registeredDate,
                                  "DDMMYYYY"
                                ).format("DD/MM/YYYY")}
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

            {/* Cancel */}
            <View style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Cancel</Text>
                {getCourseCancel.length === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SeeAll", {
                        val: getCourseCancel,
                        getTitle: "Cancel",
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

            {getCourseCancel.length === 0 ? (
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
                    You don't have any course Cancel yet
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getCourseCancel.map((value, index) => {
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
                                numberOfLines={2}
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
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>

        {/* already have a  certificate */}
        <View style={{ flex: 1 }}>
          <View
            entering={FadeInUp.delay((index = 100)).duration(600)}
            style={{ marginHorizontal: 10, paddingBottom: 40 }}
          >
            <View style={{}}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Bird's Certificate</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SeeAll", {
                  val: getCourseComplete,
                  getTitle: "Certificate",
                });
              }}
            >
              <View style={{ paddingBottom: 40 }}>
                <View
                  style={{
                    borderColor: Colors.grey,
                    width: "90%",
                    height: hp(13),
                    borderRadius: 10,
                    borderWidth: 2,
                    marginVertical: 10,
                    marginHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("./../Assets/images/certificate.png")}
                    style={{
                      height: wp(15),
                      width: wp(15),
                      marginHorizontal: 20,
                      backgroundColor: "transparent",
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      flexWrap: "wrap",
                      fontSize: wp(3.5),
                      color: "#404040",
                      fontWeight: 500,
                    }}
                  >
                    Earn certificate when your bird done training
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default Progress;

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
