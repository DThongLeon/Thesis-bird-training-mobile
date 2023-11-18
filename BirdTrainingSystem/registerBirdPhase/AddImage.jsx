import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styled from "styled-components";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Formik } from "formik";
import { BirdName, Course } from "../constants/viewListCourse";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const AddImage = ({ route }) => {
  const [payload, setPayload] = useState({});
  const [defaultBird, setDefaultBird] = useState(false);
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const [profilePicture, setProfilePicture] = useState("");

  const imageNull = require("./../Assets/images/beach.png");

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
    let a = await ImagePicker.launchImageLibraryAsync(options);
    if (!a.canceled) {
      setImage(a.assets[0].uri);
    }
  };

  const pickCamera = async () => {
    let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
    let a = await ImagePicker.launchCameraAsync(options);
    if (!a.canceled) {
      setImage(a.assets[0].uri);
    }
  };

  const ActionPressSheet = () => {
    const options = [
      "Take new picture",
      "Choose a picture from gallery",
      "Cancel",
    ];
    const destructiveButtonIndex = 2;
    const icons = [];
    showActionSheetWithOptions(
      {
        autoFocus: true,
        showSeparators: true,
        containerStyle: style.container,
        textStyle: style.text,
        separatorStyle: style.separator,
        options,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            pickCamera();
            break;
          case 1:
            // Save
            pickImage();
            break;
          case 2:
            // Delete
            break;
        }
      }
    );
  };

  useEffect(() => {
    AsyncStorage.getItem("AcceptToken").then((val) => {
      if (val) {
        setPayload(jwtDecode(val, { body: true }));
      }
    });
  }, []);

  const onSubmitForm = () => {
    const form = new FormData();
    form.append("Pictures", {
      uri: image,
      type: "image/jpeg",
      name: "bird-image",
    });
    form.append("CustomerId", payload.id);
    form.append("Name", route.params.birdName);
    form.append("BirdSpeciesId", route.params.birdSpeciesId);
    form.append("IsDefault", true);

    try {
      const response = fetch(
        "http://13.214.85.41/api/trainingcourse-customer/register-bird",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: form,
        }
      ).then((response) => {
        if (response.status === 200) {
          navigation.navigate('Bottom Navigation', payload.id)
        }
      })
        
    } catch (err) {}
  };

  return (
    <View style={{ height: "100%" }}>
      {/* back button */}
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
          }}
          onPress={() => {
            AsyncStorage.removeItem("AcceptToken");
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
      </Animated.View>
      {/* content add image action sheet and camera */}
      {BirdName.map((val, index) => {
        return (
          <StyledContainer>
            <LoginPageTitle>
              Choose image or take a picture of your bird
            </LoginPageTitle>
            {/* image selection action sheet */}
            <View
              style={{
                marginTop: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity onPress={ActionPressSheet}>
                {image == null ? (
                  <ImageBackground
                    source={require("./../Assets/images/beach.png")}
                    resizeMode="contain"
                    style={{
                      height: 155,
                      width: 155,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    imageStyle={{
                      borderRadius: 9999,
                      borderColor: Colors.primary,
                      borderWidth: 2,
                    }}
                  >
                    {/* icon camera to edit profile */}
                    <View
                      style={{
                        position: "relative",
                        marginTop: wp(32.5),
                        marginLeft: wp(32),
                      }}
                    >
                      <AntDesign name="edit" size={30} />
                    </View>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={{ uri: image }}
                    resizeMode="contain"
                    style={{
                      height: 155,
                      width: 155,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    imageStyle={{
                      borderRadius: 9999,
                      borderColor: Colors.primary,
                      borderWidth: 2,
                    }}
                  >
                    {/* icon camera to edit profile */}
                    <View
                      style={{
                        position: "relative",
                        marginTop: wp(32.5),
                        marginLeft: wp(32),
                      }}
                    >
                      <AntDesign name="edit" size={30} />
                    </View>
                  </ImageBackground>
                )}
              </TouchableOpacity>
            </View>
            {/* button next */}
            <InnerContainer>
              <StyledFromArea>
                <TouchableOpacity
                  style={{
                    padding: 15,
                    backgroundColor: Colors.yellow,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    height: 50,
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
                  onPress={onSubmitForm}
                >
                  <ButtonText>Next</ButtonText>
                </TouchableOpacity>
              </StyledFromArea>
            </InnerContainer>
          </StyledContainer>
        );
      })}
    </View>
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
  border-radius: 10px;
  font-size: 15px;
  height: 50px;
  margin-vertical: 3px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.black};
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
  margin-top: 50px;
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
  margin-top: 20px;
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
export default AddImage;

const style = StyleSheet.create({
  container: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  text: {
    textAlign: "center",
    color: "blue",
    fontWeight: 500,
    paddingLeft: "20%",
  },
  separator: {
    width: "100%",
  },
});
