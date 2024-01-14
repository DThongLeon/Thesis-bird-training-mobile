import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Constants from "expo-constants";
import { Colors } from "../constants/theme";
import { Formik } from "formik";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const statusBarHeight = Constants.statusBarHeight;

const RegisterBirdName = ({ navigation }) => {
  const [selectValue, setSelectedValue] = useState(null);

  const [dataSpecies, setDataSpecies] = useState([]);

  const [dataBirdId, setDataBirdId] = useState(null);

  const [dataSpeciesFilter, setDataFilter] = useState(null);

  const [text, onChangeText] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handleChangeText = () => useState(true);
  const handleBlurText = () => useState(false);
  const pickerRef = useRef();

  const nameValidationSchema = yup.object().shape({
    name: yup.string("").required("Bird Name is Required").matches("^[a-zA-Z0-9_]{3,20}$", "Name is not valid, please try again!"),
  });

  open = () => {
    pickerRef.current.focus();
  };

  close = () => {
    pickerRef.current.blur();
  };

  // get bird species
  const [dataStorage, setDataStorage] = useState();
  const [getDefaultBirdFromLogin, setDefaultBirdFromLogin] = useState();
  useEffect(() => {
    fetch("http://13.214.85.41/api/trainingcourse-customer/birdspecies", {
      method: "get",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          const getDataBirdId = AsyncStorage.getItem("dataId").then((res) =>
            setDataBirdId(JSON.parse(res))
          );
          const getDataId = AsyncStorage.getItem("AcceptToken").then((val) => {
            setDataStorage(JSON.parse(val));
          });
          const getDefault = AsyncStorage.getItem("defaultBird").then((val) => {
            setDefaultBirdFromLogin(JSON.parse(val));
          });
          setDataSpecies(json);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <ScrollView
      style={{ height: "100%" }}
      keyboardShouldPersistTaps={"handled"}
    >
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <LoginPageTitle>Enter your pet name and type</LoginPageTitle>

          <Formik
            validationSchema={nameValidationSchema}
            initialValues={{ name: "" }}
            onSubmit={(values) => {
              navigation.navigate("AddImage", {
                birdName: values.name,
                birdSpeciesId: selectValue,
                storage: dataStorage,
                birdDefaultLogin: getDefaultBirdFromLogin,
              });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <StyledFromArea>
                <MyTextInput
                  placeholder={"@example: Steve"}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  keyboardType="default"
                ></MyTextInput>
                {errors.name && (
                  <Text style={{ fontSize: wp(4), top: -10, color: "red" }}>
                    {errors.name}
                  </Text>
                )}

                {/* Picker value bird */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: 15,
                      fontWeight: "bold",
                      marginRight: wp(2),
                    }}
                  >
                    Bird Species:
                  </Text>
                  <View
                    style={{
                      width: "75%",
                      borderColor: Colors.grey,
                      borderWidth: 1,
                      height: wp(14),
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      prompt="Choose type of bird species"
                      placeholder="Choose type bird"
                      ref={pickerRef}
                      selectedValue={selectValue}
                      onValueChange={(item, index) => {
                        setSelectedValue(item);
                      }}
                      mode="dialog"
                    >
                      {dataSpecies.map((val) => {
                        return (
                          <Picker.Item
                            key={val.id}
                            label={val.name}
                            value={val.id}
                          ></Picker.Item>
                        );
                      })}
                    </Picker>
                  </View>
                </View>
                {/* Next button */}
                <ButtonLogin
                  style={{
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
                  onPress={handleSubmit}
                >
                  <ButtonText>Next</ButtonText>
                </ButtonLogin>
              </StyledFromArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </ScrollView>
  );
};

export const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View style={{ marginTop: 10 }}>
      <LeftIcons>
        <Ionicons name={icon} size={26} color={Colors.darkLight} />
      </LeftIcons>
      <LabeledInput>{label}</LabeledInput>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcons
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={26}
            color={Colors.darkLight}
          />
        </RightIcons>
      )}
    </View>
  );
};

//input field
export const StyledTextInput = styled.TextInput`
  padding: 15px 55px 15px 15px;
  font-size: 15px;
  height: 50px;
  margin-vertical: 3px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.black};
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const LabeledInput = styled.Text`
  color: ${Colors.black};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcons = styled.View`
  left: 15px;
  top: 30px;
  position: absolute;
  z-index: 1;
`;

export const RightIcons = styled.TouchableOpacity`
  right: 15px;
  top: 30px;
  position: absolute;
  z-index: 1;
`;

///button
export const ButtonLogin = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${Colors.yellow};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 50px;
  margin-vertical: 40px;
`;

export const ButtonText = styled.Text`
  color: ${Colors.black};
  font-size: 15px;
  font-weight: bold;
`;

//container
export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  width: 100%;
  height: 100%;
  margin-top: 20px;
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  margin-vertical: 50px;
`;

export const LoginLogo = styled.Image`
  width: 200px;
  height: 200px;
`;

export const LoginPageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  padding: 10px 10px 20px 10px;
  color: ${Colors.brown65};
`;

export const SubTitle = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  font-style: italic;
  color: ${Colors.black};
`;

export const StyledFromArea = styled.View`
  width: 90%;
  justify-content: space-between;
  flex-direction: column;
`;

export const Line = styled.View`
  width: 100%;
  height: 0.5px;
  margin-vertical: 20px;
  background-color: ${Colors.black};
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-items: center;
  color: ${Colors.darkLight};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-left: 70px;
  padding: 10px;
  width: 60%;
`;

export const TextLinkContent = styled.Text`
  justify-content: center;
  align-items: center;
  color: ${"blue"};
  font-size: 15px;
  width: 100%;
  letter-spacing: 0.3px;
`;

export default RegisterBirdName;
