import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Colors } from "../constants/theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components";

const BirdDetails = ({ navigation, route }) => {
  const receiveValue = route.params.value;
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={"handled"}
    >
      <SafeAreaView style={{ backgroundColor: Colors.brown76, flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={style.appBar}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: Colors.black,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 20,
                  marginVertical: 15,
                }}
              >
                <Ionicons name="arrow-undo" size={22} />
              </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: Colors.white,
            alignItems: "center",
            flex: 1,
            marginTop: 140,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          }}
        >
          <View
            style={{
              top: -100,
              position: "absolute",
              width: 200,
              height: 200,
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 50,
              }}
              source={receiveValue.image}
            />
          </View>

          <Text style={{ marginTop: 150, fontSize: 30, fontWeight: "bold" }}>
            {receiveValue.name}
          </Text>

          <Text style={{ marginVertical: 15, fontSize: 20 }}>
            {receiveValue.details}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "orange",
                padding: 15,
                borderRadius: 12,
                marginRight: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <FontAwesome5
                  size={20}
                  name="chalkboard-teacher"
                ></FontAwesome5>
                <Text
                  style={{
                    marginHorizontal: 8,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Trainer
                </Text>
              </View>
              <Text>{receiveValue.trainer}</Text>
            </View>
          </View>
          <ButtonLogin
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ButtonText>Register</ButtonText>
          </ButtonLogin>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default BirdDetails;

const style = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export const ButtonLogin = styled.TouchableOpacity`
  width: 80%;
  padding: 15px;
  background-color: ${Colors.yellow};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 50px;
  margin-vertical: 100px;
`;

export const ButtonText = styled.Text`
  color: ${Colors.black};
  font-size: 15px;
  font-weight: bold;
`;
