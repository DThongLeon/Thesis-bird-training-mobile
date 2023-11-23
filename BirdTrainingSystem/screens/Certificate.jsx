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
import moment from "moment";
import axios from "axios";
import Loader from "../Components/Loader";

const Certificate = ({ route }) => {
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [birdCertificate, setBirdCertificate] = useState([]);

  async function getCertificatedCourse() {
    setLoading(true);
    try {
      const response = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/birdcertificate-requestedId",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: { birdTrainingCourseId: route.params.value[0].id },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (response.status === 200) {
        setBirdCertificate(response.data);
      }
    } catch (error) {}
  }

  useFocusEffect(
    useCallback(() => {
      getCertificatedCourse();
    }, [])
  );

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
      getCertificatedCourse();
    }, 1000);
  };

  console.log(birdCertificate.birdCertificateViewModel?.picture);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
        }
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: wp(5.5),
                fontWeight: "600",
                color: "blue",
              }}
            >
              Course:
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginRight: 15,
                fontSize: wp(5.5),
                fontWeight: "600",
                color: "#404040",
              }}
            >
              {birdCertificate.birdCertificateViewModel?.title}
            </Text>
          </View>

          <View
            style={{
              alignItems: "flex-end",
              flexDirection: "column",
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                marginRight: 20,
                fontSize: wp(4.5),
                fontWeight: "600",
                color: "#404040",
              }}
            >
              Received
            </Text>
            {birdCertificate && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
                  width: 70,
                  height: 60,
                  backgroundColor: Colors.white,
                  marginRight: 25,
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
                <Text style={style.monthStyle}>
                  {moment(birdCertificate.receiveDate, "YYYYMMDD")
                    .format("MMM")
                    .toUpperCase()}
                  -
                  {moment(birdCertificate.receiveDate, "YYYYMMDD")
                    .format("YY")
                    .toUpperCase()}
                </Text>
                <Text style={style.dateStyle}>
                  {moment(birdCertificate.receiveDate, "YYYYMMDD")
                    .format("DD")
                    .toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ marginHorizontal: 20, }}>
          <ImageBackground
            resizeMethod="auto"
            style={{
              width: wp(90),
              height: hp(35),

              justifyContent: "space-between",
            }}
            source={{
              uri: birdCertificate.birdCertificateViewModel?.picture,
            }}
          />
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default Certificate;

const style = StyleSheet.create({
  monthStyle: {
    opacity: 0.7,
    fontSize: wp(4),
    textAlign: "center",
    fontWeight: "400",
    color: "#404040",
    padding: 2,
  },
  dateStyle: {
    fontSize: wp(6),
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.black,
  },
});
