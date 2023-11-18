import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { StackActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ceil } from "lodash";
import Loader from "../Components/Loader";

const Profile = ({  route }) => {

  console.log('Profile: ', route)
  const navigation = useNavigation();
  // loading
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [dataBird, setDataBird] = useState([]);

  async function getDataBird() {
    try {
      setLoading(true);
      const res = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          // params: { customerId: route.customerId },
          params: { customerId: route.customerId },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (res.status === 200) {
        const dataFilter = res.data.filter((params) => {
          return (
            JSON.stringify(params.birdSpeciesId).indexOf(
              // route.val
              route.val
            ) > -1
          );
        });
        console.log(res.data)
        setName(res.data.map((params) => {
          params.name
        }));
        setDataBird(dataFilter);
      }
    } catch (err) {
      alert(err);
    }
  }

  
  const getBirdPicture = dataBird.map((item) => item.picture);
  const getBirdName = dataBird.map((item) => item.name);
  const getBirdSpeciesName = dataBird.map((val) => val.birdSpeciesName);
  const getBirdSpeciesId = dataBird.map((val) => val.birdSpeciesId)

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

  useFocusEffect(
    useCallback(() => {
      getDataBird();
    }, [route])
  );


  useEffect(() => {


  }, [route])

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
                      {name}
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
                navigation.navigate("EditProfile", { val: route.val, customerId: route.customerId, birdSpeciesId: getBirdSpeciesId });
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
                navigation.navigate("SwitchAccount", {
                  val: route.val
                });
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
          <View
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
                <FontAwesome name="credit-card" size={24} color={Colors.primary} />
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
          </View>

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
                const token = AsyncStorage.getItem("AcceptToken");
                if (token != null) {
                  AsyncStorage.removeItem("AcceptToken");
                  navigation.dispatch(StackActions.popToTop());
                }
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
        </ScrollView>
        {/* {route.map((item, index) => {
        
      })} */}
      </SafeAreaView>
      {loading ? <Loader /> : null}
    </>
  );
};

export default Profile;
