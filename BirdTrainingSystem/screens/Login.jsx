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
  Modal,
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

  // success case
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

  // fail case
  const [getError, setError] = useState(false);

  const ErrorPopUp = ({ children, error }) => {
    const [errModal, setErrModal] = useState(error);

    useEffect(() => {
      toggleErr();
    }, [error]);
    const toggleErr = () => {
      if (error) {
        setErrModal(true);
      } else {
        setErrModal(false);
      }
    };
    return (
      <Modal transparent error={errModal}>
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

  // set async storage for customerID and birdId

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
          if (token.role === "Customer") {
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
                  // filter data with default value === true
                  const dataFilter = res.data.filter((params) => {
                    return JSON.stringify(params.isDefault).indexOf(true) > -1;
                  });
                  setVisible(true);
                  setTimeout(() => {
                    if (dataFilter.length === 0) {
                      setVisible(false);
                      AsyncStorage.setItem("defaultBird", JSON.stringify(true));
                      navigation.navigate("Register");
                    } else {
                      setVisible(false);
                      // setAsyncStorage to store id customer and bird Id
                      const birdAndCustomer = {
                        birdId: dataFilter[0].birdSpeciesId,
                        customerId: dataFilter[0].customerId,
                      };
                      AsyncStorage.setItem(
                        "dataId",
                        JSON.stringify(birdAndCustomer)
                      );
                      AsyncStorage.setItem(
                        "defaultBird",
                        JSON.stringify(dataFilter[0].isDefault)
                      );
                      navigation.navigate("BottomTabNavigation");
                    }
                  }, 2000);
                  setLoading(false);
                }
              }
              getSelectDefault();
            } catch (err) {
              alert(err);
            }
          } else {
            setError(true);
          }
        } else if (result.status === 400) {
          setTimeout(() => {
            setError(true);
          }, 2000);
        }
      })
      .catch((err) => {
        setError(true);
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
              source={require("./../Assets/images/bird.png")}
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
                  <ModalPopUp visible={visible}>
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <LottieView
                        source={require("./../Assets/loading/check-correct.json")}
                        autoPlay
                        loop={true}
                        style={{
                          width: 200,
                          height: 200,
                        }}
                        // onAnimationFinish={{}}
                      ></LottieView>
                      <Text
                        style={{
                          fontSize: wp(5.5),
                          color: "#404040",
                          fontWeight: 800,
                          textAlign: "center",
                        }}
                      >
                        Login Successfully
                      </Text>
                    </View>
                  </ModalPopUp>

                  <ButtonLogin onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </ButtonLogin>
                  {getError == true && (
                    <ErrorPopUp error={getError}>
                      <View
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setError(false);
                          }}
                          style={{
                            alignItems: "flex-end",
                            width: "100%",
                          }}
                        >
                          <Ionicons
                            name="md-close-outline"
                            size={30}
                            color="black"
                          />
                        </TouchableOpacity>
                        <LottieView
                          source={require("./../Assets/loading/error.json")}
                          autoPlay
                          loop={true}
                          style={{
                            top: -20,
                            width: 250,
                            height: 250,
                          }}
                        ></LottieView>
                        <Text
                          style={{
                            top: -20,
                            fontSize: wp(5),
                            color: "red",
                            fontWeight: 800,
                            textAlign: "center",
                          }}
                        >
                          Error occurred {"\n"} Please try again !!
                        </Text>
                      </View>
                    </ErrorPopUp>
                  )}
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
