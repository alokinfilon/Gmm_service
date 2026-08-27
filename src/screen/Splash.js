import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  Linking,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import HexagonGray from "../components/HexagonGray";
import HexagonPrimary from "../components/HexagonPrimary";
import OneSignal from "react-native-onesignal";
import Colors from "../common/Colors";
import Fonts from "../common/Fonts";
import OTPTextView from "../components/OTPTextView";
import API from "../common/API";
import timeout from "../common/Timeout";
import Loader from "../common/Loader";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions } from "react-navigation";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from "react-native-permissions";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import Geolocation from "@react-native-community/geolocation";
var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
var notification = "";
var isopenResult = {};
const android_version = 1.7;
const ios_version = 1.0;
var androidurl = "";
var iosurl = "";

export default class Splash extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    token: "",
  });
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      modalVisible2: false,
      txt: "",
      typid: "",
      sms: "",
      id: "",
      modalVisible: false,
      code: "",
      loading: false,
      lat: "",
      long: "",
    };

    OneSignal.init("caae04b4-7e4a-49b0-b90d-b1f47417682b", {
      kOSSettingsKeyAutoPrompt: true,
    });
    console.log(OneSignal);
    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
    OneSignal.addEventListener("ids", this.onIds);
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.configure();
    OneSignal.setLogLevel(6, 0);
    let requiresConsent = false;
    OneSignal.setRequiresUserPrivacyConsent(requiresConsent);
    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2);
    OneSignal.setSubscription(true);
  }

  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible });
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
          this.appVersion(this.state.lat, this.state.long);
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
                  console.log("sdsdsd", err);
                  this.GetLatLon();
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

  Notification = (res) => {
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
        if (notification == "") {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Home",
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          if (notification.c_id) {
            if (notification.c_type == "callassign") {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "EmpPending",
                    params: {
                      item: notification.c_id,
                      Navigate: "Home",
                    },
                  }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            } else if (notification.c_type == "callswip") {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "EmpPending",
                    params: {
                      item: notification.c_id,
                      Navigate: "Home",
                    },
                  }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            } else if (notification.c_type == "drawing") {
              if (res.data.type_id == 2) {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: "ViewDrawingMasterMain",
                      params: {
                        item: notification.c_id,
                        Navigate: "Home",
                        name: "Master",
                      },
                    }),
                  ],
                });
                this.props.navigation.dispatch(resetAction);
              } else if (res.data.type_id == 3) {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: "ViewDrawingMasterMain",
                      params: {
                        item: notification.c_id,
                        Navigate: "Home",
                      },
                    }),
                  ],
                });
                this.props.navigation.dispatch(resetAction);
              }
            } else if (notification.c_type == "join_call") {
              var obj = {
                SnakBarText: isopenResult.notification.payload.body,
                SnakBar: true,
              };
              AsyncStorage.setItem("join_call", JSON.stringify(obj));
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "Home",
                  }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            } else if (notification.c_type == "call_workstart work") {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "EmpPending",
                    params: {
                      item: notification.c_id,
                      sub_status: 1,
                      Navigate: "Home",
                    },
                  }),
                ],
              });
              this.props.navigation.dispatch(resetAction);
            } else if (notification.c_type == "spare") {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: "SpareRecommended",
                    params: {
                      Navigate: "Home",
                    },
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
          }
        }
      }
      // 1
    } else {
      if (notification.c_id) {
        if (notification.c_type == "callassign") {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "EmpPending",
                params: {
                  item: notification.c_id,
                  Navigate: "Home",
                },
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else if (notification.c_type == "callswip") {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "EmpPending",
                params: {
                  item: notification.c_id,
                  Navigate: "Home",
                },
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else if (notification.c_type == "drawing") {
          if (res.data.type_id == 2) {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "ViewDrawingMasterMain",
                  params: {
                    item: notification.c_id,
                    name: "Master",
                    Navigate: "Home",
                  },
                }),
              ],
            });
            this.props.navigation.dispatch(resetAction);
          } else if (res.data.type_id == 3) {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "ViewDrawingMasterMain",
                  params: {
                    item: notification.c_id,
                    Navigate: "Home",
                  },
                }),
              ],
            });
            this.props.navigation.dispatch(resetAction);
          }
        } else if (notification.c_type == "join_call") {
          var obj = {
            SnakBarText: isopenResult.notification.payload.body,
            SnakBar: true,
          };
          AsyncStorage.setItem("join_call", JSON.stringify(obj));
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Home",
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else if (notification.c_type == "call_workstart work") {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "EmpPending",
                params: {
                  item: notification.c_id,
                  sub_status: 1,
                  Navigate: "Home",
                },
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else if (notification.c_type == "spare") {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "SpareRecommended",
                params: {
                  Navigate: "Home",
                },
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
      }
    }
  };

  checklogin = (laa, longg) => {
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
      } else {
        AsyncStorage.getItem("id").then((id) => {
          if (id) {
            this.setState({ loading: true });
            AsyncStorage.getItem("token").then((token) => {
              AsyncStorage.getItem("username").then((username) => {
                AsyncStorage.getItem("password").then((password) => {
                  var Request = {
                    token: token,
                    security: 1,
                    username: username,
                    password: password,
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
                          .then((res) => {
                            if (res.status == 200) {
                              console.log(res);
                              res.json().then((res) => {
                                console.log("login:::  ", res);
                                if (res.status == "success") {
                                  this.setState({
                                    typid: res.data.type_id,
                                    sms: res.sms_panel,
                                  });
                                  AsyncStorage.setItem("id", res.data.id);
                                  AsyncStorage.setItem(
                                    "username",
                                    res.data.username
                                  );
                                  AsyncStorage.setItem("name", res.data.name);
                                  AsyncStorage.setItem("email", res.data.email);
                                  AsyncStorage.setItem(
                                    "branch_id",
                                    res.data.branch_id
                                  );
                                  AsyncStorage.setItem(
                                    "type_id",
                                    res.data.type_id
                                  );
                                  AsyncStorage.setItem(
                                    "digit_password",
                                    res.data.digit_password
                                  );
                                  AsyncStorage.setItem("password", password);
                                  if (res.start_day == 1) {
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
                                    this.Notification(res);
                                  }
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
                                      NavigationActions.navigate({
                                        routeName: "Login",
                                      }),
                                    ],
                                  });
                                  this.props.navigation.dispatch(resetAction);
                                } else {
                                  AsyncStorage.removeItem("id");
                                  AsyncStorage.removeItem("username");
                                  AsyncStorage.removeItem("password");
                                  this.setState({ loading: false });

                                  const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [
                                      NavigationActions.navigate({
                                        routeName: "Login",
                                      }),
                                    ],
                                  });
                                  this.props.navigation.dispatch(resetAction);
                                }
                              });
                            } else {
                              AsyncStorage.removeItem("id");
                              AsyncStorage.removeItem("username");
                              AsyncStorage.removeItem("password");
                              this.setState({ loading: false });
                              setTimeout(() => {
                                Toast.show(res.message, Toast.SHORT);
                              }, 50);
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({
                                    routeName: "Login",
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
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
                      Toast.show(
                        "Please Check your internet connection",
                        Toast.SHORT
                      );
                    }
                  });
                });
              });
            });
          } else {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: "Login" })],
            });
            this.props.navigation.dispatch(resetAction);
          }
        });
      }
    });
  };

  appVersion = () => {
    this.setState({ loading: true });
    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        var Request = {
          security: 1,
        };
        console.log(API.app_version);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.app_version, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(Request),
              })
                .then((res) => {
                  console.log(res.status);
                  if (res.status == 200) {
                    res.json().then((res) => {
                      console.log("app_version:::  ", res, res.status);
                      if (res.status == "success") {
                        AsyncStorage.setItem("pagelimit", res.data.page_limit);
                        AsyncStorage.setItem(
                          "customer_master",
                          res.data.customer_master
                        );
                        AsyncStorage.setItem("removeDigi", "0");
                        this.setState({ txt: res.data.maintenance_msg });
                        console.log("app_version:::  ", res);
                        androidurl = res.data.android_url;
                        iosurl = res.data.ios_url;
                        if (res.data.maintenance == 1) {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Maintenance",
                                // Maintenance
                                params: { txt: this.state.txt },
                              }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else {
                          if (Platform.OS == "android") {
                            if (android_version == res.data.android_version) {
                              console.log("gb", android_version);
                              if (id) {
                                this.checklogin(this.state.lat, this.state.long);
                              } else {
                                const resetAction = StackActions.reset({
                                  index: 0,
                                  actions: [
                                    NavigationActions.navigate({
                                      routeName: "Login",
                                    }),
                                  ],
                                });
                                this.props.navigation.dispatch(resetAction);
                              }
                            } else {
                              this.setModalVisible2(true);
                            }
                          } else {
                            if (ios_version == res.data.ios_version) {
                              if (id) {
                                this.checklogin(this.state.lat, this.state.long);
                              } else {
                                const resetAction = StackActions.reset({
                                  index: 0,
                                  actions: [
                                    NavigationActions.navigate({
                                      routeName: "Login",
                                    }),
                                  ],
                                });
                                this.props.navigation.dispatch(resetAction);
                              }
                            } else {
                              this.setModalVisible2(true);
                            }
                          }
                        }
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
                        }, 50);
                        this.setState({ data: res, loading: false });
                      }
                    });
                  } else {
                    AsyncStorage.removeItem("id");
                    AsyncStorage.removeItem("username");
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({ routeName: "Login" }),
                      ],
                    });
                    this.props.navigation.dispatch(resetAction);
                  }
                })

                .catch((e) => {
                  this.setState({ loading: false });
                  console.log('e',e);
                  Toast.show("Something went wrong...", Toast.SHORT);
                })
            ).catch((e) => {
              console.log(e);
              this.setState({ loading: false });
              Toast.show("Please Check your internet connection", Toast.SHORT);
            });
          } else {
            this.setState({ loading: false });
            Toast.show("Please Check your internet connection", Toast.SHORT);
          }
        });
      });
    });
  };

  componentDidMount() {
    OneSignal.setLocationShared(true);

    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);

    this.DidMount();
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

  DidMount = () => {
    setTimeout(() => {
      AsyncStorage.getItem("token").then((DeviceId) => {
        if (!DeviceId) {
          console.log("true", DeviceId);
          OneSignal.setLocationShared(true);
          OneSignal.inFocusDisplaying(2);
          OneSignal.addEventListener("received", this.onReceived);
          OneSignal.addEventListener("opened", this.onOpened);
          OneSignal.addEventListener("ids", this.onIds);
          this.onReceived = this.onReceived.bind(this);
          this.onOpened = this.onOpened.bind(this);
          this.onIds = this.onIds.bind(this);
          this.DidMount();
        } else {
          if (notification) {
            console.log("notification", notification);
            this.setState({ modalVisible: true });
          } else {
            if (this.state.lat) {
              this.appVersion();
            } else {
              this.GetLatLon();
            }
          }
        }
      });
    }, 200);
  };

  Logout = () => {
    const { navigation } = this.props;
    this.setState({ loading: true });
    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        var Request = {
          id: id,
          token: token,
        };
        console.log(API.logout);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.logout, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(Request),
              })
                .then((res) => res.json())
                .then((res) => {
                  console.log("logout RESPONCE:::  ", res);
                  if (res.status == "success") {
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

                    navigation.closeDrawer();
                  } else {
                    if (res.message) {
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT);
                      }, 300);
                    }
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

                    navigation.closeDrawer();
                    this.setState({ loading: false });
                  }
                })
                .catch((e) => {
                  NetInfo.fetch().then((state) => {
                    if (!state.isConnected) {
                      Toast.show(
                        "Please Check your internet connection",
                        Toast.SHORT
                      );
                    } else {
                      this.setState({ loading: false });
                      console.log(e);
                      Toast.show("Something went wrong...", Toast.SHORT);
                    }
                  });
                })
            ).catch((e) => {
              console.log(e);
              this.setState({ loading: false });
              Toast.show("Please Check your internet connection", Toast.SHORT);
            });
          } else {
            this.setState({ loading: false });
            Toast.show("Please Check your internet connection", Toast.SHORT);
          }
        });
      });
    });
  };

  Digit_Password = () => {
    Keyboard.dismiss();
    if (this.state.code.length < 0) {
      Toast.show("Please enter your passcode", Toast.SHORT);
    } else {
      this.setState({ loading: true });
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          AsyncStorage.getItem("id").then((id) => {
            AsyncStorage.getItem("password").then((password) => {
              var Request = {
                token: token,
                branch_id: branch_id,
                id: id,
                password: this.state.code,
              };
              // this.state.code 4
              console.log("Request", JSON.stringify(Request));

              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.check_digit_password, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(Request),
                    })
                      .then((res) => {
                        console.log(res);

                        if (res.status == 200) {
                          res.json().then((res) => {
                            console.log("Digit_Password", res);
                            this.setState({ loading: false, code: "" });

                            if (res.status == "success") {
                              this.setModalVisible(false);
                              this.appVersion(this.state.lat, this.state.long);
                              this.setState({
                                loading: false,
                                passcodeVisible: false,
                                Load: false,
                              });
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
                                  NavigationActions.navigate({
                                    routeName: "Login",
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                              this.setModalVisible(false);
                            } else {
                              setTimeout(() => {
                                Toast.show(res.message, Toast.SHORT);
                              }, 100);
                              this.setState({ code: "" });
                              this.setState({ loading: false });
                            }
                          });
                        } else {
                          AsyncStorage.removeItem("id");
                          AsyncStorage.removeItem("username");
                          AsyncStorage.removeItem("password");
                          this.setState({ loading: false, loading1: false });
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT);
                          }, 50);
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Login",
                              }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                          this.setState({ loading: false, loading1: false });
                        }
                      })
                      .catch((e) => {
                        NetInfo.fetch().then((state) => {
                          if (!state.isConnected) {
                            Toast.show(
                              "Please Check your internet connection",
                              Toast.SHORT
                            );
                            this.props.navigation.goBack();
                          } else {
                            this.setState({ loading: false });
                            console.log(e);
                            Toast.show("Something went wrong...", Toast.SHORT);
                          }
                        });
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
                  Toast.show(
                    "Please Check your internet connection",
                    Toast.SHORT
                  );
                }
              });
            });
          });
        });
      });
    }
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log(
      "%c Oh my ! ",
      "background: #222; color: #bada55",
      notification
    );
  }

  onOpened(openResult) {
    notification = openResult.notification.payload.additionalData;
    isopenResult = openResult;
    console.log(
      "Message: ",
      "background: #222; color: #bada55",
      openResult.notification.payload.body
    );
    console.log(
      "Data: ",
      "background: #222; color: #bada55",
      openResult.notification.payload.additionalData
    );
    console.log(
      "isActive:, ",
      "background: #222; color: #bada55",
      openResult.notification.isAppInFocus
    );
    console.log("openResult: ", "background: #222; color: #bada55", openResult);
  }

  onIds(device) {
    AsyncStorage.setItem("token", JSON.stringify(device.userId));
    console.log("device device device", device);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={styles.MainContainer}>
          <StatusBar
            hidden
            barStyle="dark-content"
            backgroundColor={Colors.primary}
          />
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                top: -40,
                right: -45,
                position: "absolute",
                opacity: 0.5,
              }}
            >
              <HexagonPrimary />
            </View>

            <View
              style={{
                bottom: -40,
                left: -45,
                position: "absolute",
                opacity: 0.5,
              }}
            >
              <HexagonGray />
            </View>
            <Image
              resizeMode="contain"
              source={require("../images/logo.png")}
              style={{ width: width * 0.8, height: width * 0.5 }}
            />
          </View>
        </View>

        <Modal
          ref={"updateModal"}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          visible={this.state.modalVisible2}
          position="bottom"
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={false}
          onRequestClose={() => {
            //        alert('Modal Closed');
          }}
        >
          <View style={styles.ModalContainer}>
            <View style={styles.netAlert}>
              <View style={styles.netAlertContent}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Image
                    resizeMode="cover"
                    source={require("../images/update.png")}
                    style={{ width: width, height: width }}
                  />
                </View>
                <Text style={styles.netAlertTitle}>Update Required</Text>
                <Text style={styles.netAlertDesc}>
                  Please update our app for an improved experience!! This
                  version is no longer supported.
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 20,
                  marginHorizontal: 30,

                  backgroundColor: Colors.primary,
                }}
              >
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => this.get()}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 18,
                      fontFamily: Fonts.bold,
                    }}
                  >
                    Update Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          ref={"updateModal"}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          visible={this.state.modalVisible}
          position="bottom"
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={false}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={false}
          onRequestClose={() => {
            //        alert('Modal Closed');
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.netAlert}>
              <View style={styles.netAlertContent}>
                <Loader loading={this.state.loading} />

                <View style={styles.container}>
                  <View
                    style={{
                      flex: 1,
                      zIndex: 999,
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <KeyboardAvoidingView
                      style={{ flex: 1 }}
                      behavior="height"
                      enabled
                      keyboardVerticalOffset={0}
                    >
                      <ScrollView
                        contentContainerStyle={{ flex: 1 }}
                        keyboardDismissMode="interactive"
                      >
                        <View style={{ flex: 0.4, flexDirection: "column" }}>
                          <View
                            style={{
                              flexDirection: "column",
                              width: width * 0.8,

                              alignItems: "flex-start",
                              justifyContent: "center",
                              paddingTop: 80,
                              paddingVertical: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: Fonts.bold,
                                color: Colors.dark_gray,
                                // transform: [{ scale: scaleText }]
                              }}
                            >
                              Enter your passcode here
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                paddingTop: 5,
                                textAlign: "left",
                                fontFamily: Fonts.medium,
                                color: Colors.medium_gray,
                                // transform: [{ scale: scaleText }]
                              }}
                            >
                              Your pin contains atleast 4 digits.
                            </Text>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  paddingTop: 5,
                                  paddingLeft: 5,

                                  fontFamily: Fonts.medium,
                                  color: Colors.medium_gray,
                                }}
                              />
                            </View>
                          </View>
                        </View>

                        {/* <OTPTextView
                          // autoFocus={true}
                          containerStyle={styles.textInputContainer}
                          onSubmitEditing={() => {
                            this.Digit_Password();
                          }}
                          handleTextChange={(text) => {
                            if (text.length == 4) {
                              console.log(text);

                              this.setState({ code: text }, () => {
                                this.Digit_Password();
                              });
                            } else {
                              this.setState({ code: text });
                            }
                          }}
                          inputCount={4}
                          keyboardType="numeric"
                        /> */}

                        <OTPTextView
                          autoFocus={false}
                          code={this.state.code}
                          onSubmitEditing={() => this.Digit_Password()}
                          handleTextChange={(code) => this.setState({ code })}
                        />

                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            alignItems: "center",
                            bottom: 80,
                            paddingVertical: 4,
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: Colors.primary,
                          }}
                          onPress={() => {
                            NetInfo.fetch().then((state) => {
                              if (state.isConnected) {
                                this.Digit_Password();
                              } else {
                                Toast.show(
                                  "Please Check your internet connection",
                                  Toast.SHORT
                                );
                              }
                            });
                          }}
                        >
                          <ImageBackground
                            resizeMode="contain"
                            style={{
                              height: 40,
                              width: 40,
                              marginRight: 10,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            source={require("../images/fill.png")}
                          >
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                tintColor: Colors.primary,
                              }}
                              source={require("../images/right.png")}
                            />
                          </ImageBackground>
                          <View>
                            <Text
                              style={{
                                fontSize: 18,
                                marginHorizontal: 10,
                                color: Colors.white,
                                fontFamily: Fonts.bold,
                              }}
                            >
                              Verify
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </ScrollView>
                      {/* <CustomButton
                              iconName={require('../images/logout.png')}
                              name="Logout"
                              onPress={() => {
                                this.Logout();
                              }}
                            /> */}
                    </KeyboardAvoidingView>
                  </View>

                  <View
                    style={{
                      zIndex: 1,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      position: "absolute",
                      zIndex: 99,
                    }}
                  />
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
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: width * 0.12,
                    alignItems: "center",
                    //  borderWidth:1,
                    justifyContent: "center",

                    backgroundColor: Colors.red,
                    marginVertical: 0,
                  }}
                  onPress={() => {
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        this.Logout();
                      } else {
                        Toast.show(
                          "Please Check your internet connection",
                          Toast.SHORT
                        );
                      }
                    });
                  }}
                >
                  {/* <ImageBackground
                resizeMode="contain"
                style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                source={require('../images/fill.png')}> */}
                  <Image
                    style={{ height: 30, width: 30, tintColor: Colors.white }}
                    source={require("../images/logout.png")}
                  />
                  {/* </ImageBackground> */}
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        marginHorizontal: 10,
                        color: Colors.white,
                        fontFamily: Fonts.bold,
                      }}
                    >
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  get = () => {
    if (Platform.OS == "android") {
      Linking.openURL(androidurl);
    } else if (Platform.OS == "ios") {
      Linking.openURL(iosurl);
    }
  };
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  circle: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    backgroundColor: Colors.colorAccent,
    position: "absolute",
    zIndex: -1,
  },
  logo: { width: width * 0.8, height: width * 0.12 },
  ModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  netAlert: {
    overflow: "hidden",
    borderRadius: 10,
    shadowRadius: 10,
    width: width,
    height: height,
    borderColor: "#f1f1f1",
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  netAlertContent: {
    flex: 1,
    padding: 20,
    //  marginTop:20,
  },
  netAlertTitle: {
    fontSize: 20,
    paddingTop: 20,
    color: Colors.black,
    textAlign: "center",
    fontFamily: Fonts.bold,
  },
  netAlertDesc: {
    fontSize: 16,
    paddingTop: 10,
    alignSelf: "center",
    width: width * 0.8,
    color: Colors.dark_gray,
    fontFamily: Fonts.light,
    paddingVertical: 5,
    textAlign: "center",
  },
  hexagon: {
    width: 100,
    height: 70,
    opacity: 0.8,
    transform: [{ rotate: "-90deg" }],
  },
  hexagonInner: {
    width: 100,
    height: 70,
    backgroundColor: Colors.primary,
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderTopWidth: 25,
    borderTopColor: Colors.primary,
  },
  hexagonBefore: {
    position: "absolute",
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderBottomWidth: 25,
    borderBottomColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  txt: {
    color: Colors.colorPrimary,
    fontSize: 15,
    fontFamily: Fonts.Regular,
  },
  text: {
    marginLeft: 5,
    color: Colors.colorPrimary,
    fontSize: 17,
    fontFamily: Fonts.medium,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 60,

    paddingVertical: Platform.OS == "ios" ? 12 : 8,
    borderRadius: 5,
    width: width * 0.4,

    // position:'absolute',
    alignSelf: "center",
    // bottom:100,

    backgroundColor: Colors.colorPrimary,
  },
});

// https://www.androidusbdrivers.com/xiaomi-redmi-5a-mci3b-usb-drivers/
// https://github.com/bear1030?tab=repositories
