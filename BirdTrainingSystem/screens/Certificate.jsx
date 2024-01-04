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

  // get pdf view *****************************************
  const [birdCertificatePDF, setBirdCertificatePDF] = useState("");

  async function getCertificatedCoursePdf() {
    setLoading(true);
    try {
      const response = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/birdcertificatepicture-requestedId-base64",
        {
          method: "get",
          headers: {
            Accept: "image/png",
          },
          params: { birdTrainingCourseId: route.params.value[0].id },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setBirdCertificatePDF(res.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {}
  }
  useFocusEffect(
    useCallback(() => {
      getCertificatedCoursePdf();
    }, [])
  );

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
      getCertificatedCourse();
      getCertificatedCoursePdf();
    }, 1000);
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
                marginBottom: 10,
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
                  width: 60,
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

        <View>
          <Image
            style={{ resizeMode: "contain", width: wp(100), height: wp(90) }}
            source={{ uri: `data:image/png;base64,${birdCertificatePDF}` }}
          ></Image>
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default Certificate;

const style = StyleSheet.create({
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
    fontWeight: "bold",
    color: Colors.black,
  },
});
