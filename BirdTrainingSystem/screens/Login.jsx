import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Constants from "expo-constants";
import { Colors } from "../constants/theme";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import axios from "axios";
import * as yup from "yup";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { login_api } from "../Components/login_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode, encode } from "base-64";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Loader from "../Components/Loader";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const statusBarHeight = Constants.statusBarHeight;
const Stack = createNativeStackNavigator();

const Login = ({ navigation }) => {
  const [text, onChangeText] = useState("");
  const [payload, setPayload] = useState({});

  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  // set data bird and data to base into
  const [dataBirdChosen, setDataBirdChosen] = useState([]);

  const [dataBirdToBase, setDataBirdToBase] = useState([]);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string("")
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string("")
      .min(3, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

  const handleLogin = (value) => {
    setLoading(true);
    login_api({
      email: value.email,
      password: value.password,
    })
      .then((result) => {
        if (result.status === 200) {
          const token = jwtDecode(result.data);
          AsyncStorage.setItem("AcceptToken", JSON.stringify(token));
          try {
            async function getSelectDefault() {
              const res = await axios(
                "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
                {
                  method: "get",
                  headers: {
                    Accept: "application/json",
                  },
                  params: { customerId: token.id },
                }
              ).finally(() => {
                setLoading(false);
              });

              if (res.status === 200) {
                console.log('Login customeer bird: ', res.data);
                const dataFilter = res.data.filter((params) => {
                  return JSON.stringify(params.isDefault).indexOf(true) > -1;
                });
                if (dataFilter.length === 0) {
                  navigation.navigate("Register");
                } else {
                  let params = {
                    val: dataFilter[0].birdSpeciesId,
                    customerId: dataFilter[0].customerId
                  };
                  console.log(params);
                  navigation.navigate("Bottom Navigation", params);
                }
              }
            }
            getSelectDefault();
          } catch (err) {
            alert(err);
          }
        } else if (result.status === 400) {
          alert("Password or email incorrect please try again");
        }
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View
      entering={FadeInUp.delay((index = 100))
        .duration(600)
        .springify()
        .damping(10)}
    >
      <ScrollView
        style={{ height: "100%", backgroundColor: Colors.white }}
        keyboardShouldPersistTaps={"handled"}
      >
        <StyledContainer>
          <StatusBar style="dark" />
          <InnerContainer>
            <LoginLogo
              resizeMode="cover"
              source={require("./../Assets/images/bird.jpg")}
            ></LoginLogo>
            <LoginPageTitle>Training Academy</LoginPageTitle>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <StyledFromArea>
                  <MyTextInput
                    label={"Email Address"}
                    icon={"mail"}
                    placeholder={"abc@gmail.com"}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  ></MyTextInput>
                  {errors.email && (
                    <Text style={{ fontSize: wp(4), top: -10, color: "red" }}>
                      {errors.email}
                    </Text>
                  )}

                  <MyTextInput
                    label={"Password"}
                    icon={"lock-closed"}
                    placeholder={"**********"}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  ></MyTextInput>
                  {errors.password && (
                    <Text style={{ fontSize: wp(4), top: -10, color: "red" }}>
                      {errors.password}
                    </Text>
                  )}

                  <ButtonLogin onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </ButtonLogin>
                  <Line />

                  <TextLink
                    type="submit"
                    onPress={() => navigation.navigate("ForgetPassword")}
                  >
                    <TextLinkContent>Forget your password?</TextLinkContent>
                  </TextLink>
                </StyledFromArea>
              )}
            </Formik>
          </InnerContainer>
        </StyledContainer>
      </ScrollView>
      {loading ? <Loader /> : null}
    </View>
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
    <View>
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
  background-color: ${Colors.offWhite};
  padding: 15px 55px 15px 55px;
  border-radius: 10px;
  font-size: 15px;
  height: 50px;
  margin-vertical: 3px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: ${Colors.offWhite};
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
  margin-vertical: 15px;
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
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const LoginLogo = styled.Image`
  width: 200px;
  height: 200px;
`;

export const LoginPageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  padding: 0px 10px 40px 10px;
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

export default Login;
