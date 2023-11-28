import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  ImageBackground,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";

const TrainingReport = ({ route }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const navigation = useNavigation();

  console.log("route.params.val.evidence", typeof route.params.val.evidence);
  return (
    <View>
      <ImageBackground
        source={{ uri: route.params.val.birdSkillPicture }}
        resizeMethod="auto"
        style={{
          height: 200,
          width: wp("100%"),
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: hp(20),
          }}
        ></LinearGradient>
        <View
          style={{
            marginLeft: 10,
            marginTop: wp(23),
            alignItems: "flex-start",
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              marginHorizontal: 10,
              flexWrap: "wrap",
              fontSize: wp(3.5),
              fontWeight: "500",
            }}
          ></Text>
        </View>
      </ImageBackground>
      {/* go back */}
      <View
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
      </View>
      {/* course slot title */}
      <Text
        style={{
          marginVertical: 10,
          marginHorizontal: 15,
          fontSize: wp(6),
          fontWeight: "700",
          paddingLeft: wp(4),
          color: "#404040",
          position: "relative",
        }}
      >
        BirdSkill: {route.params.val.birdSkillName}
      </Text>
      {/* trainer */}
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          paddingLeft: 10,
          marginHorizontal: 20,
        }}
      >
        <FontAwesome5
          name="chalkboard-teacher"
          size={24}
          color="#404040"
          style={{
            marginRight: 10,
          }}
        />
        <Text
          style={{
            fontSize: wp(4),
            fontWeight: "500",
            color: "#404040",
            position: "relative",
          }}
        >
          Trainer: {route.params.val.trainerName}
        </Text>
      </View>
      {/* Progression */}
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          paddingLeft: 10,
          marginHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: wp(4.5),
            fontWeight: "500",
            color: "#404040",
            marginRight: 20,
          }}
        >
          Progress:
        </Text>
        <Text
          style={{
            fontSize: wp(4),
            fontWeight: "600",
            color: "green",
          }}
        >
          {route.params.val.trainingProgression * 100}%
        </Text>
      </View>
      {/* evidence */}
      {route.params.val.evidence == null ? (
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
            Your's Bird is still training this skills
            {"\n"}
            No feedback yet
          </Text>
        </View>
      ) : (
        <View
          style={{
            marginTop: 30,
            borderColor: Colors.grey,
            borderRadius: 10,
            marginVertical: 10,
            marginHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: wp(4.5),
              fontWeight: "500",
              color: "#404040",
              marginRight: 20,
            }}
          >
            Trainer Video Feedback:
          </Text>
          <Video
            ref={video}
            style={{
              width: wp(90),
              height: hp(30),
            }}
            source={{
              uri: route.params.val.evidence,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <Button
            title={status.isPlaying ? "Pause" : "Play"}
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
          />
        </View>
      )}
    </View>
  );
};

export default TrainingReport;
const style = StyleSheet.create({
  textStyle: {
    fontSize: wp(4),
    fontWeight: "700",
    color: "#404040",
  },

  shadowProp: {
    borderTopWidth: 0,
  },

  haveBorder: {
    borderTopWidth: 0.8,
    borderColor: "rgba(0,0,0,0.32)",
  },

  userStyle: {
    fontSize: wp(5),
    fontWeight: "600",
    paddingLeft: 10,
    color: "#404040",
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
