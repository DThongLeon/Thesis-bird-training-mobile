import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import styled from "styled-components";
import Constants from "expo-constants";
import { Colors } from "../constants/theme";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const statusBarHeight = Constants.statusBarHeight;
const Stack = createNativeStackNavigator();

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      {/* <BackgroundImage><Text>Start Coding</Text></BackgroundImage> */}
      <InnerContainer>
        <LoginLogo
          resizeMode="cover"
          source={require("./../Assets/images/bird.jpg")}
        ></LoginLogo>
        <LoginPageTitle>Bird-Training System</LoginPageTitle>
        <SubTitle>Account Login</SubTitle>

        <Formik
          initialValues={{ email: "", password: "" }}
            // validate={values => {
            //   const errors = {};
            //   if (!values.email) {
            //     errors.email = 'Required';
            //   } else if (
            //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            //   ) {
            //     errors.email = 'Invalid email address';
            //   }
            //   return errors;
            // }}
          onSubmit={(values) => {
            navigation.navigate("Bottom Navigation", {
              screen: "BottomTabNavigation"

            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values,errors,touched }) => (
            <StyledFromArea>
              <MyTextInput
                label={"Email Address"}
                icon={"mail"}
                placeholder={"abc@gmail.com"}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              >
                {/* {errors.email && touched.email && errors.email} */}
              </MyTextInput>

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
              >
                {/* {errors.password && touched.password && errors.password} */}
              </MyTextInput>

              <ButtonLogin onPress={handleSubmit}>
                <ButtonText>Login</ButtonText>
              </ButtonLogin>
              <Line />

              <TextLink type="submit"  onPress={() => navigation.navigate("ForgetPassword")}>
                <TextLinkContent>Forget your password?</TextLinkContent>
              </TextLink>
            </StyledFromArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

export const BackgroundImage = ({ children }) => {
  return (
    <View>
      <ImageBackground
        source={require("./../Assets/images/leaves.jpg")}
        style={{ height: "100%" }}
      />
      <View style={{ position: "absolute" }}>{children}</View>
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
  margin-bottom: 10px;
  opacity: 0.5;
  border-width: 1px;
`;

export const LabeledInput = styled.Text`
  color: ${Colors.darkLight};
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
  background-color: ${Colors.brownC8};
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
  padding-top: ${statusBarHeight}px;
  background-color: ${Colors.white};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const LoginLogo = styled.Image`
  width: 250px;
  height: 250px;
`;

export const LoginPageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  padding: 10px;
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
  height: 1px;
  margin-vertical: 1px;
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
  padding: 10px;
`;

export const TextLinkContent = styled.Text`
  justify-content: center;
  align-items: center;
  color: ${"blue"};
  font-size: 14px;
`;

export default Login;
