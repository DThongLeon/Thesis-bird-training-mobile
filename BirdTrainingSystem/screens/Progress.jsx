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
import { Category } from "../constants/categories";
import { find, includes } from "lodash";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { isMoment } from "moment";
import axios from "axios";
import Loader from "../Components/Loader";

const Progress = ({ route }) => {
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
      const response = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: { customerId: route.params.customerId },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (response) {
        const dataFilter = response.data.filter((params) => {
          return (
            JSON.stringify(params.birdSpeciesId).indexOf(route.params.val) > -1
          );
        });

        setDataCustomerBird(dataFilter);
        async function getRegisteredCourse() {
          try {
            const res = await axios(
              "http://13.214.85.41/api/trainingcourse-customer/registered-birdtrainingcourse",
              {
                method: "get",
                headers: {
                  Accept: "application/json",
                },
                params: {
                  birdId: response.data[0].id,
                  customerId: response.data[0].customerId,
                },
              }
            );

            if (res) {
              setDataCourseRegister(res.data);
            } else {
              alert(`error mess: ${res}`);
            }
          } catch (err) {
            alert(err);
          }
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
    }, [route.params])
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
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons size={25} name="notifications"></Ionicons>
          </TouchableOpacity>
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

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SeeAll", {
                      val: getDataCourseRegister,
                      status: "Registered",
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
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getDataCourseRegister.map((value, index) => {
                return value.status == "Registered" ? (
                  <View key={value.id}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("DetailsOnGoing", {});
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
                ) : null;
              })}
            </ScrollView>
            {/* Confirmed */}
            <View style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={style.textStyle}>Confirmed</Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SeeAll", {
                      val: getDataCourseRegister,
                      status: "Confirmed",
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
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getDataCourseRegister.map((value, index) => {
                return value.status == "Confirmed" ? (
                  <View key={value.id}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("DetailsOnGoing", {
                          params: getDataCourseRegister,
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
                ) : null;
              })}
            </ScrollView>
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

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SeeAll", {
                      val: getDataCourseRegister,
                      status: "Training",
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
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getDataCourseRegister.map((value, index) => {
                return value.status == "Training" ? (
                  <View key={value.id}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("DetailsOnGoing", {
                          params: getDataCourseRegister,
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
                ) : null;
              })}
            </ScrollView>
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

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SeeAll", {
                      val: getDataCourseRegister,
                      status: "Cancel",
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
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getDataCourseRegister.map((value, index) => {
                return value.status == "Cancel" ? (
                  <View key={value.id}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("DetailsOnGoing", {
                          params: getDataCourseRegister,
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
                ) : null;
              })}
            </ScrollView>
          </View>
        </View>

        {/* already have a  certificate */}
        <View style={{ flex: 1 }}>
          <Certificate />
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export const Certificate = () => {
  return (
    <View
      entering={FadeInUp.delay((index = 100)).duration(600)}
      style={{ marginHorizontal: 10, paddingBottom: 30 }}
    >
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={style.textStyle}>Bird's Certificate</Text>

          <TouchableOpacity>
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
        </View>
      </View>
      <TouchableOpacity>
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
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("./../Assets/images/certificate.jpg")}
              style={{
                height: wp(15),
                width: wp(15),
                marginHorizontal: 20,
                backgroundColor: "#fafafa",
              }}
            />
            <Text
              style={{
                flex: 1,
                flexWrap: "wrap",
                fontSize: wp(3.5),
                letterSpacing: 0.2,
                color: "#404040",
              }}
            >
              Earn Certificate when complete traintrainingtraininging
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
