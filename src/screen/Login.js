import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  AppState,
  TouchableOpacity,
} from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from "react-native-permissions";
import API from "../common/API";
import timeout from "../common/Timeout";
import Loader from "../common/Loader";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import base64 from "react-native-base64";
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;

import Colors from "../common/Colors";
import Fonts from "../common/Fonts";

import { StackActions, NavigationActions } from "react-navigation";
import HexagonGray from "../components/HexagonGray";
import HexagonPrimary from "../components/HexagonPrimary";
import CustomButton from "../components/CustomButton";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";

export default class Login extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: "",
      password: "",
      appState: AppState.currentState,
      inputBorderColor: Colors.medium_gray,
      typeid: "",
      sms: "",
      typid: "",
      lat: "",
      long: "",
      submit: true,
    };

    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.usernameRef = this.updateRef.bind(this, "username");
    this.passwordRef = this.updateRef.bind(this, "password");
  }

  componentDidMount() {
    async function requestAll() {
      const locationStatus = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
      });
      const photoLibrary = Platform.select({
        android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });
      const cameraStatus = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });
      const isLocationStatus = await request(locationStatus);
      const isPhotoLibrary = await request(photoLibrary);
      const IsCameraStatus = await request(cameraStatus);

      return { isLocationStatus, isPhotoLibrary, IsCameraStatus };
    }
    requestAll().then((statuses) => console.log(statuses));
  }

  checklogin = (laa, longg) => {
    if (this.state.username == "") {
      Toast.show("Please enter your username", Toast.SHORT);
    } else if (this.state.password == "") {
      Toast.show("Please enter your password", Toast.SHORT);
    } else {
      this.setState({ loading: true });
      AsyncStorage.getItem("id").then((id) => {
        AsyncStorage.getItem("token").then((token) => {
          var Request = {
            security: 1,
            token: token,
            username: this.state.username,
            password: this.state.password,
            lat: laa,
            long: longg,
          };
          console.log(API.login);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then((state) => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.login, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(Request),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log("Login RESPONCE:::  ", res);
                    if (res.status == "success") {
                      AsyncStorage.setItem("id", res.data.id);
                      AsyncStorage.setItem("username", res.data.username);
                      AsyncStorage.setItem("name", res.data.name);
                      AsyncStorage.setItem("email", res.data.email);
                      AsyncStorage.setItem("branch_id", res.data.branch_id);
                      AsyncStorage.setItem("type_id", res.data.type_id);
                      AsyncStorage.setItem(
                        "digit_password",
                        res.data.digit_password
                      );
                      AsyncStorage.setItem("password", this.state.password);
                      AsyncStorage.setItem(
                        "permission",
                        JSON.stringify(res.permission)
                      );
                      AsyncStorage.setItem("removeDigi", "1");
                      this.setState({
                        typid: res.data.type_id,
                        sms: res.sms_panel,
                      });
                      AsyncStorage.getItem("type_id").then((typeId) => {
                        if (typeId == "4") {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Home",
                              }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else if (res.start_day == 1) {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "StartWork",
                                params: {
                                  typid: this.state.typid,
                                  sms: this.state.sms,
                                },
                              }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else if (res.start_day == 2) {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "DayEnd",
                              }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else {
                          if (res.data.type_id == 3) {
                            if (res.sms_panel == 1) {
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({
                                    routeName: "SendSMSLogin",
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                            } else {
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({
                                    routeName: "Home",
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                              console.log("one");
                            }
                          } else {
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: "Home",
                                }),
                              ],
                            });
                            this.props.navigation.dispatch(resetAction);
                            console.log("two");
                          }
                        }
                      });
                      this.setState({ loading: false });
                    } else if (res.status == "failed") {
                      this.setState({ loading: false });
                      AsyncStorage.removeItem("id");
                      AsyncStorage.removeItem("username");
                      AsyncStorage.removeItem("name");
                      AsyncStorage.removeItem("email");
                      AsyncStorage.removeItem("branch_id");
                      AsyncStorage.removeItem("type_id");
                      AsyncStorage.removeItem("digit_password");
                      AsyncStorage.removeItem("password");
                      AsyncStorage.removeItem("customer_master");
                      AsyncStorage.removeItem("join_call");
                      AsyncStorage.setItem("removeDigi", "0");
                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: "Login" }),
                        ],
                      });
                      this.props.navigation.dispatch(resetAction);
                    } else {
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT);
                      }, 300);
                      this.setState({ loading: false });
                    }
                  })
                  .catch((e) => {
                    this.setState({ loading: false });
                    console.log(e);
                    Toast.show("Something went wrong...", Toast.SHORT);
                  })
              ).catch((e) => {
                console.log(e);
                this.setState({ loading: false });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT
                );
              });
            } else {
              this.setState({ loading: false });
              Toast.show("Please Check your internet connection", Toast.SHORT);
            }
          });
        });
      });
    }
  };

  updateRef(name, ref) {
    this[name] = ref;
  }

  onSubmitUsername() {
    console.log(this.password);
  }

  GetLatLon() {
    this.setState({ submit: false, loading: true });
    Geolocation.getCurrentPosition(
      (position) => {
        const lastPosition = JSON.stringify(position);
        this.setState({ lastPosition });
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          loading: false,
          submit: false,
        });
        if (this.state.lat) {
          this.checklogin(this.state.lat, this.state.long);
        }
      },
      (error) => {
        console.log("error", error);
        this.setState({ loading: false, submit: true });
        setTimeout(() => {
          if (error.message == "No location provider available.") {
            if (Platform.OS == "android") {
              AsyncStorage.setItem("removeDigi", "1");
              RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
              })
                .then((data) => {
                  console.log(data);
                  this.GetLatLon();
                  this.setState({ loading: false, submit: false }, () => {
                    setTimeout(() => {
                      AsyncStorage.setItem("removeDigi", "0");
                    }, 500);
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.setState({ loading: false, submit: true });
              Toast.show("Please Turn on Your Location", Toast.SHORT);
            }
          } else if (
            error.message == "User denied access to location services."
          ) {
            this.setState({ loading: false, submit: true });
            Toast.show(
              "Please Allow access to location services.",
              Toast.SHORT
            );
            setTimeout(() => {
              openSettings().catch(() => console.warn("cannot open settings"));
            }, 2000);
          } else {
            this.setState({ loading: false, submit: true });
            Toast.show(error.message, Toast.SHORT);
          }
        }, 50);
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <Loader loading={this.state.loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          style={{ flex: 1, backgroundColor: Colors.white }}
        >
          <View
            style={{
              flex: 1,
              zIndex: 999,
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: width,
                  alignItems: "center",
                  // justifyContent: 'center',
                  paddingTop: 75,
                }}
              >
                <Image
                  resizeMode="contain"
                  source={require("../images/logo.png")}
                  style={{ width: width * 0.7, height: width * 0.4 }}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  paddingBottom: 10,
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.primary,
                    fontFamily: Fonts.medium,
                  }}
                >
                  Login{" "}
                </Text>
                <View
                  style={{
                    height: 1,
                    width: "80%",
                    backgroundColor: "#f2f2f2",
                    marginVertical: 3,
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  width: width,
                  paddingHorizontal: width * 0.1,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.label}>Username</Text>

                  <Text style={styles.required}>*</Text>
                </View>
                <TextInput
                  placeholder="Enter Username"
                  style={[
                    styles.textInput,
                    {
                      textAlignVertical: this.props.multiline
                        ? "top"
                        : "center",
                      borderColor: this.state.inputBorderColor,
                      minHeight: this.props.multiline ? 100 : null,
                    },
                  ]}
                  onFocus={() =>
                    this.setState({ inputBorderColor: Colors.primary })
                  }
                  onBlur={() =>
                    this.setState({ inputBorderColor: Colors.medium_gray })
                  }
                  onChangeText={(username) => this.setState({ username })}
                  returnKeyType={"next"}
                  onSubmitEditing={(event) => {
                    this.refs.Password.focus();
                  }}
                />

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.label}>Password</Text>

                  <Text style={styles.required}>*</Text>
                </View>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      textAlignVertical: this.props.multiline
                        ? "top"
                        : "center",
                      borderColor: this.state.inputBorderColor,
                      minHeight: this.props.multiline ? 100 : null,
                    },
                  ]}
                  onFocus={() =>
                    this.setState({ inputBorderColor: Colors.primary })
                  }
                  onBlur={() =>
                    this.setState({ inputBorderColor: Colors.medium_gray })
                  }
                  ref="Password"
                  placeholder="Enter Password"
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  onSubmitEditing={() => {
                    this.GetLatLon();
                  }}
                  onChangeText={(password) => this.setState({ password })}
                />

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ResetPassword");
                  }}
                >
                  <Text
                    style={{
                      marginTop: 15,
                      color: Colors.primary,
                      fontSize: 14,
                      textAlign: "right",
                      fontFamily: Fonts.medium,
                    }}
                  >
                    Reset Password?
                  </Text>
                </TouchableOpacity>

                <CustomButton
                  iconName={require("../images/right.png")}
                  name="Login"
                  onPress={() => {
                    this.GetLatLon();
                  }}
                />
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              zIndex: 1,
              top: -50,
              right: -50,
              position: "absolute",
              opacity: 0.5,
            }}
          >
            <HexagonPrimary />
          </View>

          <View
            style={{
              zIndex: 1,
              bottom: -50,
              left: -50,
              position: "absolute",
              opacity: 0.5,
            }}
          >
            <HexagonGray />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    flexDirection: "column",
    paddingTop: Platform.OS === "ios" ? 0 : 0,
  },
  textInput: {
    padding: 15,
    paddingVertical: Platform.OS == "ios" ? 12 : 6,
    paddingHorizontal: 10,
    fontSize: 16,

    fontFamily: Fonts.regular,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 4,
  },
  label: {
    marginTop: 15,
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
  required: {
    marginTop: 15,
    color: "red",
    fontSize: 14,
    paddingLeft: 3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
});
