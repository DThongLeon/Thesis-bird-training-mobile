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
// import { Marquee } from "@animatereactnative/marquee";
import axios from "axios";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import MarqueeView from "react-native-marquee-view";
import Loader from "../Components/Loader";

const SwitchAccount = ({ route }) => {
  const navigation = useNavigation();
  // loading
  const [loading, setLoading] = useState(false);

  // data customer bird
  const [dataCustomerBird, setDataCustomerBird] = useState([]);

  // const [refreshing, setRefreshing] = useState(false);
  // const RefreshCycle = () => {
  //   setRefreshing(true);
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     setRefreshing(false);
  //     getCustomerBird();
  //   });
  // };

  async function getAllCustomerBird() {
    const response = await axios(
      "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
        params: { customerId: route.params.val },
      }
    ).finally(() => {
      setLoading(false);
    });
    if (response.status === 200) {
      setDataCustomerBird(response.data);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllCustomerBird();
    }, [])
  );

  return (
    <SafeAreaView>
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
        navigation.navigate('Register')
      }}
        style={{
          marginTop: 5,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          <Text></Text>
        </View>
      </TouchableOpacity>

      {/* Show bird customer*/}
      <View
        style={{
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
          Your Bird
        </Text>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            borderColor: Colors.grey,
            width: "88%",
            height: hp(13),
            borderRadius: 10,
            borderWidth: 2,
            marginVertical: 10,
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

      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default SwitchAccount;
