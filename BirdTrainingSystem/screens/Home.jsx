import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  FlatList,
  Pressable,
  SafeAreaView,
  RefreshControl,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import { Colors } from "../constants/theme";

import { Course } from "../constants/viewListCourse";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BirdDetails from "./BirdDetails";
import { SliderBox } from "react-native-image-slider-box";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as _ from "lodash";
import Loader from "../Components/Loader";
import { Picker } from "@react-native-picker/picker";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Home = ({ route }) => {
  const navigation = useNavigation();
  // loading
  const [loading, setLoading] = useState(false);

  // data customer bird
  const [dataCustomerBird, setDataCustomerBird] = useState([]);

  const [dataBirdSpecies, setDataBirdSpecies] = useState([]);

  const [dataBase, setDataBase] = useState([]);

  async function getSelectDefault() {
    setLoading(true);
    // getData storage
    const getDataId = await AsyncStorage.getItem("dataId").then((val) =>
      JSON.parse(val)
    );
    // fetch data
    const result = await axios(
      "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        params: { customerId: getDataId?.customerId },
      }
    ).finally(() => {
      setLoading(false);
    });
    if (result.status === 200) {
      const getDefault = await AsyncStorage.getItem("defaultBird").then((val) =>
        JSON.parse(val)
      );
      setLoading(true);

      const getBirdSpecies = result.data.filter((params) => {
        if (getDefault === false) {
          return JSON.stringify(params.id) === JSON.stringify(getDataId.birdId);
        } else {
          return JSON.stringify(params.isDefault).indexOf(true) > -1;
        }
      });

      setDataCustomerBird(getBirdSpecies);

      const getSpecies = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/trainingcourse-species",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          params: { birdSpeciesId: getBirdSpecies[0].birdSpeciesId },
        }
      );
      if (getSpecies.status === 200) {
        setDataBase(getSpecies.data);
        setDataBirdSpecies(getSpecies.data);
      }
    }
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      getSelectDefault();
    }, [])
  );

  const getBirdPicture = dataCustomerBird.map((item) => item.picture);
  const getBirdName = dataCustomerBird.map((item) => item.name);

  // get category data bird species
  const [filterCart, setFilterCart] = useState([]);

  async function getCategoryFilter() {
    try {
      setLoading(true);
      const res = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/birdskill",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (res) {
        setFilterCart(res.data);
      }
    } catch (err) {
      alert(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCategoryFilter();
      setColorSelect()
    }, [])
  );

  // Refresh cycle
  const [refreshing, setRefreshing] = useState(false);

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
      getCategoryFilter();
      getSelectDefault();
    });
  };

  // Search and filter
  const [search, setSearch] = useState("");

  const [colorSelect, setColorSelect] = useState(null);

  const onSearch = (text) => {
    if (text == "") {
      setSearch(text);
      setDataBirdSpecies(dataBase);
    } else {
      let tempList = dataBase.filter((item) => {
        const itemToSearch = item.title
          ? item.title.trim().toLowerCase()
          : "".trim().toLowerCase();
        const itemBase = text.trim().toLowerCase();
        return itemToSearch.indexOf(itemBase) > -1;
      });
      setDataBirdSpecies(tempList);
      setSearch(text);
    }
  };

  const onFilterSelect = (item) => {
    if (item == "All") {
      setDataBirdSpecies(dataBase);
    } else {
      let tempList = dataBase.filter((params) => {
        return params.birdSkills.map((val) => val.name).indexOf(item) > -1;
      });

      setDataBirdSpecies(tempList);
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <SafeAreaView>
        {/* avatar and bird name sheet */}
        <View style={style.appBar}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Bird picture */}
            {getBirdPicture && (
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
            {getBirdName && (
              <Text style={style.userStyle}>{getBirdName[0]}</Text>
            )}
          </View>
        </View>
        {/* content filter and training program */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          style={style.appBarWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
          }
        >
          {/* Search Bar */}
          <View style={style.searchContainer}>
            <TouchableOpacity style={{ flexDirection: "row" }}>
              <Feather
                name="search"
                size={24}
                style={{
                  marginHorizontal: 10,
                  color: Colors.black,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                marginRight: 10,
                borderRadius: 12,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: 5,
                  lineHeight: 24,
                  fontSize: 16,
                }}
                value={search}
                placeholder="What courses you're looking for..."
                placeholderTextColor={"gray"}
                onChangeText={(txt) => {
                  onSearch(txt);
                  setSearch(txt);
                }}
              />
            </View>
          </View>

          {/*Show all course show  */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
              }}
            >
              <Text style={style.textStyle}>Training Program</Text>
              <View style={{ marginRight: 40 }}>
                <TouchableOpacity onPress={toggleModal}>
                  <Ionicons name="options-outline" size={35} color="black" />
                </TouchableOpacity>
              </View>

              <Modal visible={isModalVisible} transparent>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={{
                      width: "40%",
                      height: "80%",
                      backgroundColor: "#fafafa",
                      paddingVertical: 30,
                      borderRadius: 20,
                      elevation: 10,
                      marginRight: 10,
                    }}
                  >
                    {/* FILTER section */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: wp(5.5),
                          fontWeight: "800",
                          color: "#404040",
                          width: 100,
                        }}
                      >
                        Filter Courses
                      </Text>
                      <TouchableOpacity onPress={toggleModal}>
                        <Ionicons
                          name="md-close-outline"
                          size={35}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginTop: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          marginHorizontal: 10,
                          height: "95%",
                          width: "100%",
                        }}
                      >
                        <ScrollView showsHorizontalScrollIndicator={false}>
                          {filterCart
                            .sort((a, b) => {
                              if (a.id < b.id) return -1;
                              if (a.id > b.id) return 1;
                              return 0;
                            })
                            .map((value, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    setColorSelect(index);
                                    onFilterSelect(value.name);
                                  }}
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <View
                                    style={{
                                      marginTop: 8,
                                      width: wp(25),
                                    }}
                                  >
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        color:
                                          index === (colorSelect || 0)
                                            ? Colors.red
                                            : "#404040",

                                        fontWeight:
                                          index === (colorSelect || 0)
                                            ? 700
                                            : 500,
                                        fontSize: wp(4),
                                      }}
                                    >
                                      {value.name}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      marginTop: 5,
                                      borderWidth: 4,
                                      borderRadius: 999,
                                      borderColor:
                                        index === (colorSelect || 0)
                                          ? Colors.red
                                          : Colors.offWhite,
                                    }}
                                  ></View>
                                </TouchableOpacity>
                              );
                            })}
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            {/* inside course bird */}
            <View
              entering={FadeInDown.delay((index = 100)).duration(600)}
              style={{
                flex: 1,
                marginHorizontal: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                paddingBottom: wp(40),
              }}
            >
              {dataBirdSpecies.length === 0 ? (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      flexShrink: 1,
                      flexWrap: "wrap",
                      fontSize: wp(5.5),
                      width: "auto",
                      fontWeight: "700",
                      color: "#404040",
                      textAlign: "center",
                      opacity: 0.5,
                    }}
                  >
                    No new course added to your bird species !!
                  </Text>
                </View>
              ) : (
                dataBirdSpecies.map((val, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: wp(44),
                        height: wp(65),
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "relative",
                        paddingHorizontal: 16,
                        paddingVertical: 24,
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        navigation.navigate("BirdDetails", {
                          getTrainingCourseId: val.id,
                          dataCustomer: dataCustomerBird,
                        });
                      }}
                    >
                      <Animated.Image
                        source={{ uri: val.picture }}
                        style={{
                          width: wp(44),
                          height: wp(65),
                          position: "absolute",
                          borderRadius: 30,
                        }}
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: wp(44),
                          height: hp(28),
                          borderBottomLeftRadius: 25,
                          borderBottomRightRadius: 25,
                        }}
                      />
                      {/* course name */}
                      <Text
                        style={{
                          width: "100%",
                          fontSize: wp(4.5),
                          textAlign: "center",
                          color: "#ffffff",
                          fontWeight: 600,
                        }}
                      >
                        {val.title}
                      </Text>
                      {/* course rating and category */}
                      <View
                        style={{
                          marginTop: 10,
                          flexDirection: "row",
                          justifyContent: "center",
                          alignContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp(3),
                            color: "#ffffff",
                            fontWeight: 400,
                            marginRight: 10,
                          }}
                        >
                          {val.birdSkills.length} New Skills
                        </Text>
                        <View
                          style={{
                            borderLeftWidth: 1,
                            borderColor: "#ffffff",
                            marginRight: 10,
                          }}
                        ></View>
                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp(3),
                              color: "#ffffff",
                              fontWeight: 400,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="timer-outline"
                              size={wp(3)}
                            />{" "}
                            {val.totalSlot} Slot
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {loading ? <Loader /> : null}
    </>
  );
};

export default Home;

const style = StyleSheet.create({
  textStyle: {
    marginHorizontal: 15,
    fontSize: wp(5.5),
    letterSpacing: 0.2,
    fontWeight: "800",
    paddingLeft: 5,
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
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 15,
    overflow: "hidden",
  },
});
