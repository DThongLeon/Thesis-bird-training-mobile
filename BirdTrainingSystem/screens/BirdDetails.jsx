import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  FlatList,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../constants/theme";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  Octicons,
  EvilIcons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
// import { Marquee } from "@animatereactnative/marquee";
import axios from "axios";
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import MarqueeView from "react-native-marquee-view";
import Loader from "../Components/Loader";
import LottieView from "lottie-react-native";
import { useStripe } from "@stripe/stripe-react-native";

const BirdDetails = ({ route }) => {
  // loading
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const item = route.params.getId;

  const [customerBird, setCustomerBird] = useState(route.params.dataCustomer);
  const [trainingCourse, setTrainingCourse] = useState({});

  // get session slot
  const [carouselData, setCarouselData] = useState([]);

  async function getTrainingId() {
    try {
      setLoading(true);
      const res = await axios(
        "http://13.214.85.41/api/trainingcourse-customer/trainingcourse-id",
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
          params: { trainingCourseId: route.params.getTrainingCourseId },
        }
      ).finally(() => {
        setLoading(false);
      });
      if (res) {
        setTrainingCourse(res.data);
        setCarouselData(res.data.birdSkills);

        const getCustomerId = customerBird.map((val) => val.id);
        const dataFilter = res.data.registeredBird;

        const result = dataFilter.filter((val) => {
          return val === getCustomerId[0];
        });

        if (result[0] === getCustomerId[0]) {
          setIsRegister(true);
        } else {
          setIsRegister(false);
        }
      }
    } catch (err) {
      alert(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getTrainingId();
    }, [])
  );

  const [isRegister, setIsRegister] = useState(false);

  const handleRegister = async () => {
    const userData = {
      birdId: customerBird[0].id,
      trainingCourseId: trainingCourse.id,
      customerId: customerBird[0].customerId,
      totalPrice: trainingCourse.totalPrice,
    };
    try {
      const res = await axios.post(
        "http://13.214.85.41/api/trainingcourse-customer/register-trainingcourse"
        // userData
      );
      if (res.status === 200) {
        setVisible(true);
        setTimeout(() => {
          setIsRegister((value) => !value);
          setVisible(false);
        }, 2000);
      } else if (result.status === 400) {
        setTimeout(() => {
          setErrorCase(true);
        }, 2000);
      }
    } catch (err) {
      setErrorCase(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsRegister();
    }, [])
  );

  const [refreshing, setRefreshing] = useState(false);

  const RefreshCycle = () => {
    setLoading(true);
    setRefreshing(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
      getTrainingId();
    }, 1000);
  };
  const [getPaymentId, setPaymentId] = useState("");

  async function payMentIntentMethod() {
    await axios("http://192.168.1.173:4000/payments/intents", {
      method: "post",
      headers: {
        Accept: "application/json",
      },
      params: {
        amount: trainingCourse.totalPrice,
      },
    }).then((res) => {
      setPaymentId(res.data.paymentIntent);
    });
  }

  // success case
  const [visible, setVisible] = useState(false);

  const ModalPopUp = ({ children, visible }) => {
    const [showModal, setShowModal] = useState(visible);

    useEffect(() => {
      toggleModel();
    }, [visible]);
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
  const [getErrorCase, setErrorCase] = useState(false);

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

  // const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } =
  //   useStripe();
  const onCheckout = async () => {
    // 1. Create a payment intent
    // payMentIntentMethod();

    // 2. Initialize the Payment sheet
    // const initResponse = await initPaymentSheet({
    //   merchantDisplayName: "Thesis-BirdTraining System",
    //   paymentIntentClientSecret: getPaymentId,
    // });
    // if (initResponse.error) {
    //   console.log(initResponse.error);
    //   alert("Something went wrong");
    // }
    // 3. Present the Payment Sheet from Stripe
    // const paymentResponse = await presentPaymentSheet();

    // if (paymentResponse.error) {
    //   alert(
    //     `Error code: ${paymentResponse.error.code}`,
    //     paymentResponse.error.message
    //   );
    // }

    // const getPaymentIntent = retrievePaymentIntent(getPaymentId)
    // console.log('getPaymentIntent', (await getPaymentIntent).paymentIntent)
    // 4. If payment ok -> create the order
    handleRegister();
  };

  return (
    <View
      style={{
        backgroundColor: Colors.offWhite,
        flex: 1,
      }}
    >
      <Image
        source={{ uri: trainingCourse.picture }}
        style={{
          resizeMode: "stretch",
          width: wp(100),
          height: hp(38),
        }}
      />
      {/* back button */}
      <View
        entering={FadeIn.delay(200).duration(1000)}
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
            marginLeft: 16,
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
      {/* title desctip and register button */}
      <View
        entering={FadeInUp.delay((index = 100)).duration(600)}
        style={{
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingLeft: 20,
          paddingRight: 20,
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#fafafa",
          paddingTop: 25,
          marginTop: -35,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={RefreshCycle} />
          }
        >
          {/* price and title */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: wp(7),
                fontWeight: 700,
                color: "#404040",
                fontSize: wp(8),
              }}
            >
              {trainingCourse.title}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: wp(7),
                fontWeight: 600,
                color: Colors.brownEa,
                fontSize: wp(6),
              }}
            >
              Price: {trainingCourse.totalPrice} VND
            </Text>
          </View>

          {/* description */}
          <Text
            style={{
              fontSize: wp(5),
              letterSpacing: 0.2,
              marginTop: wp(6),
              color: "#404040",
              fontWeight: 800,
            }}
          >
            About Course:
          </Text>
          <Text
            style={{
              fontSize: wp(3.5),
              letterSpacing: 0.2,
              marginTop: wp(2),
              color: "#404040",
              paddingHorizontal: 10,
            }}
          >
            {trainingCourse.description}
          </Text>

          {/* duration and trainer */}
          <Text
            style={{
              fontSize: wp(5),
              letterSpacing: 0.2,
              marginTop: wp(6),
              color: "#404040",
              fontWeight: 800,
            }}
          >
            More about course
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                paddingVertical: 20,
              }}
            >
              <AntDesign name="clockcircle" size={wp(5)} color="skyblue" />
              <View
                style={{
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{ color: "#404040", fontWeight: 500, fontSize: wp(4) }}
                >
                  {trainingCourse.totalSlot} Slot
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 20,
                marginHorizontal: 10,
              }}
            >
              <MaterialCommunityIcons name="bird" size={wp(6)} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#404040",
                    fontWeight: 600,
                    fontSize: wp(4),
                    marginLeft: 10,
                  }}
                >
                  Type:
                </Text>
                <Text
                  style={{
                    color: "#404040",
                    fontWeight: 400,
                    fontSize: wp(4),
                    marginLeft: 10,
                  }}
                >
                  {trainingCourse.birdSpeciesName}
                </Text>
              </View>
            </View>
          </View>

          {/* Carousel slide show */}
          <MarqueeView speed={0.1} loop={true} delay={0} autoPlay={true}>
            <View
              style={{
                width: "100%",
                marginRight: wp(45),
                marginHorizontal: 10,
                paddingVertical: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {carouselData.map((data, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      source={{ uri: data.picture }}
                      style={{
                        borderRadius: 25,
                        width: wp(12),
                        height: wp(12),
                      }}
                    />
                    <Text
                      style={{
                        width: wp(20),
                        fontSize: wp(3.5),
                        letterSpacing: 0.2,
                        marginTop: wp(2),
                        color: "#404040",
                        paddingHorizontal: 10,
                        textAlign: "center",
                      }}
                    >
                      {data.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </MarqueeView>

          {/* details bird earn skill */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: wp(5),
                fontWeight: 600,
                letterSpacing: 0.2,
                marginTop: wp(6),
                color: "#404040",
              }}
            >
              Your bird will learn:
            </Text>

            {carouselData.map((val) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                    width: "100%",
                  }}
                >
                  <AntDesign name="checkcircle" size={24} color={"green"} />
                  <Text
                    style={{
                      marginHorizontal: 10,
                      marginLeft: 20,
                      fontSize: wp(4.5),
                      fontWeight: 600,
                      color: "#404040",
                      flexWrap: "wrap",
                      width: "80%",
                    }}
                  >
                    {val.description}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* certificate */}
          <View
            style={{
              marginTop: 10,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: wp(5),
                fontWeight: 600,
                letterSpacing: 0.2,
                marginTop: 10,
                color: "#404040",
              }}
            >
              Earn your certificate:
            </Text>

            <View
              style={{
                borderColor: Colors.grey,
                width: "90%",
                height: hp(13),
                borderRadius: 10,
                borderWidth: 2,
                marginVertical: 10,
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("./../Assets/images/certificate.png")}
                style={{
                  height: wp(15),
                  width: wp(15),
                  marginHorizontal: 20,
                  backgroundColor: "transparent",
                }}
              />
              <Text
                style={{
                  flex: 1,
                  flexWrap: "wrap",
                  fontSize: wp(3.5),
                  color: "#404040",
                  fontWeight: 500,
                }}
              >
                Earn certificate when your bird done training
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: wp(6),
                fontWeight: 600,
                letterSpacing: 0.2,
                marginTop: 10,
                color: "#404040",
              }}
            >
              Try it now !!
            </Text>
          </View>
        </ScrollView>
        {/* button register */}
        <View
          style={{
            height: "15%",
          }}
        >
          {isRegister ? (
            <ButtonDisabled disabled>
              <Feather name="check-circle" size={24} color="green" />
              <Text
                style={{
                  margin: "auto",
                  paddingLeft: wp(4),
                  color: Colors.green,
                  fontWeight: 700,
                  fontSize: wp(6),
                }}
              >
                Registered
              </Text>
            </ButtonDisabled>
          ) : (
            <View>
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
                    Registered course for your bird successfully !
                  </Text>
                </View>
              </ModalPopUp>
              <ButtonLogin onPress={onCheckout}>
                <Text
                  style={{
                    color: "#404040",
                    fontWeight: 700,
                    fontSize: wp(4.5),
                  }}
                >
                  Register
                </Text>
              </ButtonLogin>
              {getErrorCase == true && (
                <ErrorPopUp error={getError}>
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setErrorCase(false);
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
            </View>
          )}
        </View>
      </View>
      {loading ? <Loader /> : null}
    </View>
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
  width: 196px;
  height: 50px;
  background-color: ${Colors.yellow};
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
`;

export const ButtonDisabled = styled.TouchableOpacity`
  width: 196px;
  height: 50px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  flex-direction: row;
`;

export const ButtonText = styled.Text`
  color: ${Colors.black};
  font-size: 15px;
  font-weight: bold;
`;
