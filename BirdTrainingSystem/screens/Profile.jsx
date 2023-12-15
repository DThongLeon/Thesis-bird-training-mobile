import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Octicons,
  SimpleLineIcons,
  Feather,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ceil } from "lodash";
import Loader from "../Components/Loader";
import styled from "styled-components";

const Profile = () => {
  const navigation = useNavigation();
  // loading
  const [loading, setLoading] = useState(false);
  const [dataBird, setDataBird] = useState([]);

  async function getDataBird() {
    setLoading(true);
    try {
      // getData storage
      const getDataId = await AsyncStorage.getItem("dataId").then((val) =>
        JSON.parse(val)
      );
      const res = await axios(
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
      if (res.status === 200) {
        const getDefault = await AsyncStorage.getItem("defaultBird").then(
          (val) => JSON.parse(val)
        );

        const dataFilter = res.data.filter((params) => {
          if (getDefault === false) {
            return (
              JSON.stringify(params.id) === JSON.stringify(getDataId.birdId)
            );
          } else {
            return JSON.stringify(params.isDefault).indexOf(true) > -1;
          }
        });

        setDataBird(dataFilter);
      }
    } catch (err) {
      alert(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getDataBird();
    }, [])
  );

  // success case
  const [visibleLogOut, setVisibleLogOut] = useState(false);

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

  const getBirdPicture = dataBird.map((item) => item.picture);
  const getBirdName = dataBird.map((item) => item.name);
  const getBirdSpeciesName = dataBird.map((val) => val.birdSpeciesName);
  const getBirdDefault = dataBird.map((val) => val?.isDefault);

  const onHandleUpdateDefaultBird = () => {
    const form = new FormData();
    form.append("Picture", {
      uri: dataBird[0].picture,
      type: "image/jpeg",
      name: "bird-image",
    });
    form.append("Id", dataBird[0].id);
    form.append("Name", dataBird[0].name);
    form.append("BirdSpeciesId", dataBird[0].birdSpeciesId);
    form.append("IsDefault", true);

    try {
      const response = fetch(
        "http://13.214.85.41/api/trainingcourse-customer/update-bird",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: form,
        }
      ).then((result) => {
        if (result.status === 200) {
          navigation.navigate("Home");
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
      getDataBird();
    });
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.lightWhite,
        }}
      >
        <ScrollView
          key={index}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
          }
        >
          {/* picture , type , name of bird */}
          <View
            style={{
              marginTop: 60,
              marginLeft: wp(5),
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            {getBirdPicture && (
              <ImageBackground
                source={{ uri: getBirdPicture[0] }}
                resizeMode="contain"
                style={{
                  height: 130,
                  width: 130,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                imageStyle={{
                  borderRadius: 9999,
                  borderColor: Colors.primary,
                  borderWidth: 2,
                }}
              />
            )}

            {/* bird name name type */}
            <View
              style={{
                marginLeft: wp(5),
              }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {getBirdName && (
                  <View
                    style={{
                      flexDirection: "row",
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
                        marginBottom: 10,
                        maxWidth: wp(50),
                      }}
                    >
                      Bird:
                    </Text>
                    <Text
                      style={{
                        flexShrink: 1,
                        flexWrap: "wrap",
                        fontSize: wp(5.5),
                        width: "auto",
                        fontWeight: "700",
                        color: "#404040",
                        maxWidth: wp(40),
                        marginLeft: 10,
                      }}
                    >
                      {getBirdName[0]}
                    </Text>
                  </View>
                )}

                {getBirdSpeciesName && (
                  <Text
                    style={{
                      flexShrink: 1,
                      flexWrap: "wrap",
                      fontSize: wp(4),
                      marginTop: 5,
                      textAlign: "center",
                      fontWeight: "500",
                      color: "#404040",
                      maxWidth: wp(40),
                    }}
                  >
                    Type: {getBirdSpeciesName[0]}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Manage profile */}
          <View
            style={{
              marginTop: 40,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile");
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderColor: Colors.grey,
                }}
              >
                <MaterialIcons name="edit" size={24} color={Colors.primary} />
                <Text
                  style={{
                    marginLeft: 24,
                    fontSize: wp(4.5),
                    textAlign: "center",
                    fontWeight: "500",
                    color: Colors.primary,
                  }}
                >
                  Manage Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Switch Account */}
          <View
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SwitchAccount");
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderColor: Colors.grey,
                }}
              >
                <MaterialCommunityIcons
                  name="account-convert"
                  size={24}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    marginLeft: 24,
                    fontSize: wp(4.5),
                    textAlign: "center",
                    fontWeight: "500",
                    color: Colors.primary,
                  }}
                >
                  Switch / Register new Bird
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Payment or Order */}
          {/* <View
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderColor: Colors.grey,
                }}
              >
                <FontAwesome
                  name="credit-card"
                  size={24}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    marginLeft: 24,
                    fontSize: wp(4.5),
                    textAlign: "center",
                    fontWeight: "500",
                    color: Colors.primary,
                  }}
                >
                  Payment
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Log out */}
          <View
            style={{
              marginTop: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisibleLogOut(true);
              }}
            >
              <ModalPopUp visible={visibleLogOut}>
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
                    Are you sure you want to logout this account?
                  </Text>
                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setVisibleLogOut(false)}
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
                    {/* proceed logout */}
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleLogOut(false);
                        const token = AsyncStorage.getItem("AcceptToken");
                        if (token != null) {
                          AsyncStorage.removeItem("AcceptToken");
                          AsyncStorage.removeItem("dataId");
                          navigation.dispatch(StackActions.popToTop());
                        }
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
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ModalPopUp>

              <View
                style={{
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderColor: Colors.grey,
                }}
              >
                <AntDesign name="deleteuser" size={24} color={Colors.red} />
                <Text
                  style={{
                    marginLeft: 24,
                    fontSize: wp(4.5),
                    textAlign: "center",
                    fontWeight: "500",
                    color: "red",
                  }}
                >
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* set default bird */}
          {getBirdDefault[0] === false && (
            <View
              style={{
                width: "80%",
                marginTop: hp(5),
                marginLeft: wp(10),
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <TouchableOpacity
                  type="submit"
                  onPress={() => setVisible(true)}
                >
                  <Text
                    style={{
                      fontSize: wp(4),
                      textAlign: "center",
                      fontWeight: "500",
                      color: Colors.primary,
                    }}
                  >
                    Set your bird as the default Bird?
                  </Text>
                </TouchableOpacity>
              </View>

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
                    This action will make this bird will show up on the next
                    login
                    {"\n"}
                    Proceed that?
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
                        onHandleUpdateDefaultBird()
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
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ModalPopUp>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {loading ? <Loader /> : null}
    </>
  );
};

export const TextLink = styled.TouchableOpacity``;

export const TextLinkContent = styled.Text`
  justify-content: center;
  align-items: center;
  color: ${"black"};
  font-size: 14px;
  width: 100%;
  letter-spacing: 0.3px;
`;

export default Profile;
