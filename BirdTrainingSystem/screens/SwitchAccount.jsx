import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  FlatList,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../constants/theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Octicons,
  EvilIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import axios from "axios";
import {
  CommonActions,
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import MarqueeView from "react-native-marquee-view";
import Loader from "../Components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RadioGroup from "react-native-radio-buttons-group";

const SwitchAccount = ({ route }) => {
  const navigation = useNavigation();
  // loading
  const [loading, setLoading] = useState(false);

  // data customer bird
  const [dataCustomerBird, setDataCustomerBird] = useState([]);

  // filter get species
  const [dataSelected, setDataSelected] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
      getAllCustomerBird();
    });
  };

  async function getAllCustomerBird() {
    setLoading(true);
    // getData storage
    const getDataId = await AsyncStorage.getItem("dataId").then((val) =>
      JSON.parse(val)
    );
    let result = await axios(
      "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
        params: { customerId: getDataId.customerId },
      }
    ).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    if (result.status == 200) {
      const getDefault = await AsyncStorage.getItem("defaultBird").then((val) =>
        JSON.parse(val)
      );

      const getBirdSpecies = result.data.filter((params) => {
        if (getDefault === false) {
          return JSON.stringify(params.id).indexOf(getDataId.birdId) > -1;
        } else {
          return JSON.stringify(params.isDefault).indexOf(true) > -1;
        }
      });

      setDataSelected(getBirdSpecies);
      setDataCustomerBird(result.data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllCustomerBird();
    }, [])
  );

  const [visible, setVisible] = useState(false);

  const ModalPopUp = ({ children, visible }) => {
    useEffect(() => {
      toggleModel();
    }, [visible]);

    const [showModal, setShowModal] = useState(visible);

    const toggleModel = () => {
      if (visible) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };
    return (
      <Modal transparent visible={showModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fafafa",
              paddingVertical: 30,
              paddingHorizontal: 20,
              borderRadius: 20,
              elevation: 10,
            }}
          >
            {children}
          </View>
        </View>
      </Modal>
    );
  };

  const [switchData, setSwitch] = useState(false);

  const ModalSwitchBird = ({ children, visible }) => {
    useEffect(() => {
      toggleModel();
    }, [visible]);

    const [showModal, setShowModal] = useState(visible);

    const toggleModel = () => {
      if (visible) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };
    return (
      <Modal transparent visible={showModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fafafa",
              paddingVertical: 30,
              paddingHorizontal: 20,
              borderRadius: 20,
              elevation: 10,
            }}
          >
            {children}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
        }
      >
        <View
          style={{
            height: wp(25),
            width: wp("100%"),
          }}
        ></View>
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
              fontSize: wp(5),
              fontWeight: "700",
              color: "#404040",
              position: "relative",
            }}
          >
            Switch / Register new Bird
          </Text>
        </View>

        {/* register new bird */}
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
            // AsyncStorage.removeItem("dataId");
          }}
          style={{
            marginTop: 5,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ModalPopUp visible={visible}>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: wp(5.5),
                  color: "#404040",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                Are you sure you want to Register new bird to this account?
              </Text>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={{
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 15,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      fontSize: wp(4.5),
                      textAlign: "center",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                    AsyncStorage.removeItem("defaultBird");
                    const setDefault = AsyncStorage.setItem(
                      "defaultBird",
                      JSON.stringify(false)
                    );
                    navigation.navigate("RegisterBirdName");
                  }}
                  style={{
                    backgroundColor: "blue",
                    padding: 10,
                    borderRadius: 15,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      fontSize: wp(4.5),
                      textAlign: "center",
                      color: "#ffffff",
                      fontWeight: 600,
                    }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalPopUp>
          <View
            style={{
              borderColor: Colors.grey,
              width: "88%",
              height: hp(6),
              borderRadius: 10,
              borderWidth: 2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="pluscircleo"
              size={wp(8)}
              color="#404040"
              style={{ borderRadius: 9999 }}
            />
            <Text
              style={{
                marginLeft: 10,
                flexWrap: "wrap",
                fontSize: wp(4.5),
                color: "#404040",
                fontWeight: 600,
              }}
            >
              Register New Bird
            </Text>
          </View>
        </TouchableOpacity>

        {/* Show bird customer*/}
        <View
          style={{
            marginTop: hp(5),
            alignItems: "flex-start",
            justifyContent: "center",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              flexWrap: "wrap",
              fontSize: wp(5.5),
              color: "#404040",
              fontWeight: 700,
            }}
          >
            All Your Bird
          </Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 30,
          }}
        >
          {dataCustomerBird.map((val, index) => {
            return (
              <View
                key={val.id}
                style={{
                  borderWidth: 2,
                  borderColor: Colors.grey,
                  height: wp(20),
                  width: "88%",
                  borderRadius: 10,
                  backgroundColor: Colors.white,
                  // opacity:  1,
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.removeItem("dataId");
                    AsyncStorage.removeItem("defaultBird");
                    const birdAndCustomer = {
                      birdId: val.id,
                      customerId: val.customerId,
                    };
                    AsyncStorage.setItem(
                      "dataId",
                      JSON.stringify(birdAndCustomer)
                    );
                    AsyncStorage.setItem(
                      "defaultBird",
                      JSON.stringify(val.isDefault)
                    );
                    navigation.navigate("Home");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{ uri: val.picture }}
                        style={{
                          borderColor: Colors.grey,
                          borderWidth: 1,
                          borderRadius: 25,
                          width: wp(13),
                          height: wp(13),
                        }}
                      />
                      <View
                        style={{
                          paddingLeft: 20,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            width: wp(45),
                            fontSize: wp(4),
                            fontWeight: "700",
                            color: "#404040",
                          }}
                        >
                          Bird Name: {val.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            width: wp(45),
                            fontSize: wp(3),
                            fontWeight: "500",
                            color: "#404040",
                          }}
                        >
                          Type : {val.birdSpeciesName}
                        </Text>
                      </View>
                    </View>
                    {/* select radio button custom */}
                    <View
                      style={{
                        borderColor: Colors.grey,
                        backgroundColor:
                          val.id === dataSelected[0].id ? "green" : null,
                        borderWidth: 3,
                        borderRadius: 99,
                        width: wp(5),
                        height: wp(5),
                        marginRight: 20,
                      }}
                    ></View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default SwitchAccount;
