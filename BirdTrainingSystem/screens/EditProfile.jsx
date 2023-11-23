import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styled from "styled-components";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Formik } from "formik";
import { BirdName, Course } from "../constants/viewListCourse";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import { Picker } from "@react-native-picker/picker";
import * as yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ route }) => {
  const [dataSpecies, setDataSpecies] = useState([]);

  const [customerBirdInfo, setCustomerBirdInfo] = useState([]);

  const [hidePassword, setHidePassword] = useState(true);

  const [baseDataToFilter, setBaseDataToFilter] = useState([]);

  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

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
    console.log("(image)", a.assets[0].uri);
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

  async function getCustomerBird() {
    try {
      // getData storage
      const getDataId = await AsyncStorage.getItem("dataId").then((val) =>
        JSON.parse(val)
      );

      const res = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/customer-bird",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: { customerId: getDataId?.customerId },
        }
      );
      if (res) {
        setBaseDataToFilter(res.data);

        const getDefault = await AsyncStorage.getItem("defaultBird").then(
          (val) => JSON.parse(val)
        );
        console.log("getDefault", getDefault);

        console.log("result", res.data);
        const dataFilter = res.data.filter((params) => {
          if (getDefault === false) {
            console.log("params.birdSpeciesId", params.birdSpeciesId);
            return JSON.stringify(params.id).indexOf(getDataId?.birdId) > -1;
          } else {
            return JSON.stringify(params.isDefault).indexOf(true) > -1;
          }
        });

        setCustomerBirdInfo(dataFilter);
      }
    } catch (err) {
      alert(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCustomerBird();
    }, [])
  );

  // useEffect(() => {
  //   fetch("http://13.214.85.41/api/trainingcourse-customer/birdspecies", {
  //     method: "get",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       if (json) {
  //         const dataSpecies = route.params.birdSpeciesId;

  //         const filterSpeciesRemainder = baseDataToFilter.filter((val) => {
  //           return !dataSpecies.includes(val.birdSpeciesId);
  //         });

  //         const filterSpecies = json.filter((val) => {
  //           return !filterSpeciesRemainder
  //             .map((val) => val.birdSpeciesId)
  //             .includes(val.id);
  //         });
  //         setDataSpecies(filterSpecies);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  const [selectValue, setSelectedValue] = useState(selectValue);

  const pickerRef = useRef();

  open = () => {
    pickerRef.current.focus();
  };

  close = () => {
    pickerRef.current.blur();
  };

  const nameValidationSchema = yup.object().shape({
    name: yup.string("").required("Bird Name is Required"),
  });

  const onHandleUpdateBird = (value) => {
    const form = new FormData();
    form.append("Picture", {
      uri: image ? image : customerBirdInfo[0].picture,
      type: "image/jpeg",
      name: "bird-image",
    });
    form.append("Id", customerBirdInfo[0].id);
    form.append("Name", value);
    form.append("BirdSpeciesId", customerBirdInfo[0].birdSpeciesId);
    form.append("IsDefault", customerBirdInfo[0].isDefault);

    console.log(form);
    try {
      const response = fetch(
        "http://13.214.85.41/api/trainingcourse-customer/update-bird",
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: form,
        }
      )
        .then((result) => {
          if (result.status === 200) {
            navigation.navigate("Bottom Navigation");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh cycle
  const [refreshing, setRefreshing] = useState(false);

  const RefreshCycle = () => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
      getCustomerBird();
      getSelectDefault();
    });
  };

  return (
    <ScrollView
      style={{ height: "100%", flex: 1 }}
      keyboardShouldPersistTaps={"handled"}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
      }
    >
      {customerBirdInfo.map((val, index) => {
        return (
          <View key={index}>
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
                  backgroundColor: "#fff",
                  padding: 2,
                  marginVertical: 30,
                  borderRadius: 9999,
                  marginLeft: 20,
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
            </Animated.View>
            {/* content add image action sheet and camera */}
            <StyledContainer>
              <LoginPageTitle>Edit Profile</LoginPageTitle>
              {/* image selection action sheet */}
              <View
                style={{
                  marginTop: 30,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={ActionPressSheet}>
                  {image == null ? (
                    <ImageBackground
                      source={{ uri: val.picture }}
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
                          marginLeft: wp(30),
                        }}
                      >
                        <Entypo name="camera" size={30} />
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
                          marginLeft: wp(30),
                        }}
                      >
                        <Entypo name="camera" size={30} />
                      </View>
                    </ImageBackground>
                  )}
                </TouchableOpacity>

                {/* pick type */}
                <Formik
                  validationSchema={nameValidationSchema}
                  initialValues={{ name: "" }}
                  onSubmit={(vale) => {
                    onHandleUpdateBird(vale.name);
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <StyledFromArea>
                      <MyTextInput
                        label={"Name"}
                        placeholder={"@example: Steve"}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        keyboardType="email-address"
                      ></MyTextInput>
                      {errors.name && (
                        <Text
                          style={{ fontSize: wp(4), top: -10, color: "red" }}
                        >
                          {errors.name}
                        </Text>
                      )}
                      {/* Picker value bird */}
                      {/* <View
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
                            fontSize: 13,
                            fontWeight: "600",
                            marginRight: wp(2),
                          }}
                        >
                          Change Species :
                        </Text>
                        <View
                          style={{
                            width: "65%",
                            borderColor: Colors.grey,
                            borderWidth: 1,
                            height: wp(14),
                            borderRadius: 10,
                          }}
                        >
                          <Picker
                            style={{
                              borderRadius: 20,
                            }}
                            placeholder="Choose type bird"
                            ref={pickerRef}
                            selectedValue={selectValue}
                            onValueChange={(item, index) => {
                              setSelectedValue(item);
                            }}
                            mode="dialog"
                          >
                            <Picker.Item
                              style={{ fontSize: 15 }}
                              label={"Please choose a type bird"}
                              value={null}
                              enabled={false}
                            ></Picker.Item>
                            {dataSpecies.map((val, index) => {
                              return (
                                <Picker.Item
                                  key={index}
                                  label={val.name}
                                  value={val.id}
                                ></Picker.Item>
                              );
                            })}
                          </Picker>
                        </View>
                      </View> */}
                      <StyledFromArea>
                        <ButtonLogin
                          style={{
                            marginTop: 20,
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
                          <ButtonText>Save</ButtonText>
                        </ButtonLogin>
                      </StyledFromArea>
                    </StyledFromArea>
                  )}
                </Formik>
              </View>
              {/* button next */}
            </StyledContainer>
          </View>
        );
      })}
      {/* back button */}
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
  margin-left: 30px;
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
export default EditProfile;

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
