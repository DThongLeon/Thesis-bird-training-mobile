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
import React, { useState } from "react";
import styled from "styled-components";
import Constants from "expo-constants";
import { Colors } from "../constants/theme";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";

const statusBarHeight = Constants.statusBarHeight;

const ForgetPassword = () => {
  const [hidePassword, setHidePassword] = useState(true);

  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  return (
    <ScrollView style={{height: '100%', backgroundColor: Colors.white}} keyboardShouldPersistTaps={"handled"}>
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <LoginPageTitle>Training Academy</LoginPageTitle>
        
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          onSubmit={(values) => {
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
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

              <MyTextHidePassword
                label={"Confirm Password"}
                icon={"lock-closed"}
                placeholder={"**********"}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry={hideConfirmPassword}
                isPassword={true}
                hideConfirmPassword={hideConfirmPassword}
                setHideConfirmPassword={setHideConfirmPassword}
              ></MyTextHidePassword>

              <ButtonLogin onPress={handleSubmit}>
                <ButtonText>Enter</ButtonText>
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

export const MyTextHidePassword = ({
  label,
  icon,
  isPassword,
  hideConfirmPassword,
  setHideConfirmPassword,
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
            setHideConfirmPassword(!hideConfirmPassword);
          }}
        >
          <Ionicons
            name={hideConfirmPassword ? "md-eye-off" : "md-eye"}
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
  margin-vertical: 30px;
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
  padding: 10px 10px 40px 10px;
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

export default ForgetPassword;
