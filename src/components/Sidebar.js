import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import {
  NavigationActions,
  NavigationEvents,
  StackActions,
} from "react-navigation";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import Colors from "../common/Colors";
import HexagonGray from "./HexagonGray";
import HexagonPrimary from "./HexagonPrimary";
import Fonts from "../common/Fonts";
import Cust from "../components/CustomButton";

import API from "../common/API";
import timeout from "../common/Timeout";
import Loader from "../common/Loader";
import Toast from "react-native-simple-toast";
import * as NetInfo from "@react-native-community/netinfo";

class DrawerLabel extends React.Component {
  render() {
    return (
      <View style={{ backgroundColor: "transperent", flexDirection: "column" }}>
        <TouchableOpacity
          style={{ paddingVertical: 8, paddingLeft: 10 }}
          onPress={this.props.drawerPress}
        >
          <View style={{ flexDirection: "row" }}>
            {this.props.iconPath ? (
              <View style={styles.iconDrawer}>
                <Image
                  source={this.props.iconPath}
                  style={{ height: 24, width: 24, tintColor: Colors.primary }}
                />
              </View>
            ) : null}
            <View style={styles.textContainer}>
              <Text style={styles.textDrawer1}>{this.props.label} </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 0.5,
            width: "100%",
            backgroundColor: Colors.light_gray,
          }}
        />
      </View>
    );
  }
}

class DrawerMainLabel extends React.Component {
  render() {
    return (
      <View style={{ backgroundColor: "transperent" }}>
        <TouchableOpacity
          style={{ paddingVertical: 4 }}
          onPress={this.props.drawerPress}
        >
          <View style={{ flexDirection: "row" }}>
            <ImageBackground
              source={require("../images/fill.png")}
              style={{ height: 40, width: 40, marginLeft: 10 }}
            >
              <View style={styles.iconDrawer}>
                <Image
                  source={this.props.iconPath}
                  style={{ height: 20, width: 20, tintColor: Colors.primary }}
                />
              </View>
            </ImageBackground>
            <View style={styles.textContainer}>
              <Text style={styles.textDrawer}>{this.props.label} </Text>
            </View>
            <View style={[styles.iconDrawer, { paddingRight: 20 }]}>
              <Icon
                name={this.props.toogle}
                color={Colors.white}
                style={{ height: 24, width: 24 }}
                size={24}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

var CallData = [];

export default class Sidebar extends React.Component {
  constructor() {
    CallData = [];
    super();

    this.state = {
      visible: false,
      visible1: false,
      type_id: "",
      loading: false,
      customer_master: "",
      UserName: "",
      permission: "",
      tId: "",
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("type_id").then((typeId) => {
      this.setState({ tId: typeId });
    });
    AsyncStorage.getItem("type_id").then((type_id) => {
      AsyncStorage.getItem("name").then((name) => {
        AsyncStorage.getItem("permission").then((permission) => {
          AsyncStorage.getItem("customer_master").then((customer_master) => {
            this.setState(
              {
                type_id: type_id,
                UserName: name,
                customer_master: customer_master,
                permission: JSON.parse(permission),
              },
              () => {
                if (this.state.permission.includes("12")) {
                  CallData.push({ key: "pending", title: "PENDING" });
                }
                if (this.state.permission.includes("13")) {
                  CallData.push({ key: "assigned", title: "ASSIGNED" });
                }
                if (this.state.permission.includes("20")) {
                  CallData.push({ key: "completed", title: "COMPLETED" });
                }
                // setTimeout(() => {
                console.log("Permission CallData", CallData);
                // }, 500);
              }
            );
          });
        });
      });
    });
  }

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
                    AsyncStorage.removeItem("permission");
                    AsyncStorage.setItem("removeDigi", "0");
                    CallData = [];
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

  home() {
    const { navigation } = this.props;
    return (
      <View
        style={{
          backgroundColor: "transparent",
          // marginTop: -width * 0.35 + 10,
        }}
      >
        <TouchableOpacity
          style={{ paddingVertical: 4 }}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <ImageBackground
              source={require("../images/fill.png")}
              style={{ height: 40, width: 40, marginLeft: 10 }}
            >
              <View style={styles.iconDrawer}>
                <Image
                  source={require("../images/home.png")}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: Colors.primary,
                  }}
                />
              </View>
            </ImageBackground>
            <View style={styles.textContainer}>
              <Text
                style={{
                  paddingTop: 2,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: Colors.white,
                }}
              >
                Home
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  work() {
    const { navigation } = this.props;
    return (
      <View
        style={{
          backgroundColor: "transparent",
          // marginTop: -width * 0.35 + 10,
        }}
      >
        <TouchableOpacity
          style={{ paddingVertical: 4 }}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <ImageBackground
              source={require("../images/fill.png")}
              style={{ height: 40, width: 40, marginLeft: 10 }}
            >
              <View style={styles.iconDrawer}>
                <Image
                  source={require("../images/line.png")}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: Colors.primary,
                  }}
                />
              </View>
            </ImageBackground>
            <View style={styles.textContainer}>
              <Text
                style={{
                  paddingTop: 2,
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: Colors.white,
                }}
              >
                Start/End Work
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <NavigationEvents />
        <Loader loading={this.state.loading} />
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.primary,
            overflow: "hidden",
          }}
        >
          <View style={styles.container}>
            <View
              style={{
                flex: 1,
                zIndex: 999,
                position: "relative",
              }}
            >
              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    top: -width * 0.025,
                    right: 0,
                    height: width * 0.4,
                  }}
                >
                  <Image
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                    resizeMode="contain"
                    source={require("../images/Tri.png")}
                  />
                </View>

                <View style={{ paddingVertical: 0, marginBottom: 12 }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 20,
                      textAlign: "left",
                      fontFamily: Fonts.medium,
                      paddingHorizontal: 20,
                      paddingVertical: 0,
                    }}
                  >
                    {this.state.UserName
                      ? "Welcome" + " " + this.state.UserName
                      : null}
                  </Text>
                </View>

                {this.home()}

                {this.state.type_id == 1 ? (
                  <View>
                    <DrawerMainLabel
                      label="Master"
                      toogle={this.state.visible ? "angle-up" : "angle-down"}
                      iconPath={require("../images/master.png")}
                      drawerPress={() => {
                        this.setState({ visible: !this.state.visible });
                      }}
                    />
                    {this.state.visible ? (
                      <View
                        style={{ backgroundColor: "#f1f1f1", marginTop: 10 }}
                      >
                        <DrawerLabel
                          label="Spare Master"
                          //   iconPath={require('../images/home.png')}
                          drawerPress={() => {
                            navigation.navigate("SpareMaster");
                            navigation.closeDrawer();
                          }}
                        />

                        <DrawerLabel
                          label="Drawing Master"
                          //   iconPath={require('../images/home.png')}
                          drawerPress={() => {
                            navigation.navigate("DrawingMasterMain");

                            navigation.closeDrawer();
                          }}
                        />

                        <DrawerLabel
                          label="User Master"
                          // iconPath={require('../images/home.png')}
                          drawerPress={() => {
                            navigation.navigate("UserMaster");
                            navigation.closeDrawer();
                          }}
                        />

                        <DrawerLabel
                          label="Vendor Master"
                          // iconPath={require('../images/home.png')}
                          drawerPress={() => {
                            navigation.navigate("VendorMaster");
                            navigation.closeDrawer();
                          }}
                        />
                        {this.state.customer_master == 1 ? (
                          <DrawerLabel
                            label="Customer Master"
                            // iconPath={require('../images/home.png')}
                            drawerPress={() => {
                              navigation.navigate("CustomerMaster");
                              navigation.closeDrawer();
                            }}
                          />
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {this.state.type_id == 2 ? (
                  <View>
                    <DrawerMainLabel
                      label="Master"
                      toogle={this.state.visible ? "angle-up" : "angle-down"}
                      iconPath={require("../images/master.png")}
                      drawerPress={() => {
                        this.setState({ visible: !this.state.visible });
                      }}
                    />
                    {this.state.visible ? (
                      <View
                        style={{ backgroundColor: "#f1f1f1", marginTop: 10 }}
                      >
                        {this.state.permission.includes("6") ? (
                          <DrawerLabel
                            label="Spare Master"
                            //   iconPath={require('../images/home.png')}
                            drawerPress={() => {
                              navigation.navigate("SpareMaster");
                              navigation.closeDrawer();
                            }}
                          />
                        ) : null}

                        {this.state.permission.includes("7") ? (
                          <DrawerLabel
                            label="Drawing Master"
                            //   iconPath={require('../images/home.png')}
                            drawerPress={() => {
                              navigation.navigate("DrawingMasterMain");
                              navigation.closeDrawer();
                            }}
                          />
                        ) : null}

                        {/* <DrawerLabel
                        label="User Master"
                        // iconPath={require('../images/home.png')}
                        drawerPress={() => {
                          navigation.navigate('UserMaster');
                          navigation.closeDrawer();
                        }}
                      /> */}
                        {this.state.permission.includes("8") ? (
                          <DrawerLabel
                            label="Vendor Master"
                            // iconPath={require('../images/home.png')}
                            drawerPress={() => {
                              navigation.navigate("VendorMaster");
                              navigation.closeDrawer();
                            }}
                          />
                        ) : null}

                        {this.state.customer_master == 1 ? (
                          this.state.permission.includes("9") ? (
                            <DrawerLabel
                              label="Customer Master"
                              // iconPath={require('../images/home.png')}
                              drawerPress={() => {
                                navigation.navigate("CustomerMaster");
                                navigation.closeDrawer();
                              }}
                            />
                          ) : null
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {this.state.type_id == 2 ? (
                  <DrawerMainLabel
                    label="Call Management"
                    iconPath={require("../images/call_register.png")}
                    drawerPress={() => {
                      navigation.navigate("CallManagement", {
                        isAaray: CallData,
                      });
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {this.state.type_id == 2 || 3 ? (
                  <DrawerMainLabel
                    label="Calls (Work)"
                    iconPath={require("../images/call_register.png")}
                    drawerPress={() => {
                      navigation.navigate("Home");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {this.state.type_id == 2 || (3 && this.state.tId != "4") ? (
                  <DrawerMainLabel
                    label="Send SMS"
                    iconPath={require("../images/email.png")}
                    drawerPress={() => {
                      navigation.navigate("SendSMS");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {/* {this.state.type_id == 2 || 3 ? <DrawerMainLabel
                  label="Leave Management"

                  iconPath={require('../images/leave.png')}
                  drawerPress={() => {
                    navigation.navigate('ManageLeaves');
                    navigation.closeDrawer();
                  }}
                /> : null} */}

                {this.state.type_id != 2 && this.state.tId != "4" ? (
                  <DrawerMainLabel
                    label="End Work"
                    iconPath={require("../images/line.png")}
                    drawerPress={() => {
                      navigation.navigate("EndWork");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {this.state.type_id == 2 ? (
                  this.state.permission.includes("22") ? (
                    <DrawerMainLabel
                      label="Start/End Work"
                      iconPath={require("../images/line.png")}
                      drawerPress={() => {
                        navigation.navigate("StartEndWork");
                        navigation.closeDrawer();
                      }}
                    />
                  ) : null
                ) : null}

                {this.state.type_id == 2 ? (
                  this.state.permission.includes("17") ? (
                    <DrawerMainLabel
                      label="Drawing Request"
                      iconPath={require("../images/drawing.png")}
                      drawerPress={() => {
                        navigation.navigate("DrawingRequest");
                        navigation.closeDrawer();
                      }}
                    />
                  ) : null
                ) : null}

                {this.state.type_id == 3 ? (
                  <DrawerMainLabel
                    label="Drawing Request"
                    iconPath={require("../images/drawing.png")}
                    drawerPress={() => {
                      navigation.navigate("DrawingRequestEngineer");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {this.state.type_id == 3 ? (
                  <DrawerMainLabel
                    label="Engineer signature"
                    iconPath={require("../images/line.png")}
                    drawerPress={() => {
                      navigation.navigate("Engineersignature");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}

                {this.state.type_id == 2 ? (
                  <DrawerMainLabel
                    label="Manager signature"
                    iconPath={require("../images/line.png")}
                    drawerPress={() => {
                      navigation.navigate("Engineersignature");
                      navigation.closeDrawer();
                    }}
                  />
                ) : null}
                {/* {this.state.type_id == 2 ?
                  this.state.permission.includes('25') ?
                    <DrawerMainLabel
                      label="Spare Recommended"
                      iconPath={require('../images/spare.png')}
                      drawerPress={() => {
                        navigation.navigate('SpareRecommended', { Navigate: '' });
                        navigation.closeDrawer();
                      }}
                    /> : null
                  : null}

                <DrawerMainLabel
                  label="Spare Required"
                  iconPath={require('../images/spare.png')}
                  drawerPress={() => {
                    navigation.navigate('SpareRequired');
                    navigation.closeDrawer();
                  }}
                /> */}

                {this.state.type_id == 2 ? (
                  this.state.permission.includes("18") ? (
                    <DrawerMainLabel
                      label="Customer Feedback"
                      iconPath={require("../images/feedback.png")}
                      drawerPress={() => {
                        navigation.navigate("CustomerFeedback");
                        navigation.closeDrawer();
                      }}
                    />
                  ) : null
                ) : null}

                {this.state.type_id == 2 ? (
                  this.state.permission.includes("27") ? (
                    <DrawerMainLabel
                      label="Reports"
                      iconPath={require("../images/report.png")}
                      drawerPress={() => {
                        navigation.navigate("Reports");
                        navigation.closeDrawer();
                      }}
                    />
                  ) : null
                ) : null}

                {/* 
                {this.state.type_id == 2 || 3 ?
                  this.state.permission.includes('2') ?
                    <DrawerMainLabel
                      label="Change Password"
                      iconPath={require('../images/password.png')}
                      drawerPress={() => {
                        navigation.navigate('ChangePassword');
                        navigation.closeDrawer();

                      }}
                    /> : null

                  : null} */}

                <DrawerMainLabel
                  label="Change Password"
                  iconPath={require("../images/password.png")}
                  drawerPress={() => {
                    navigation.navigate("ChangePassword");
                    navigation.closeDrawer();
                  }}
                />

                <DrawerMainLabel
                  label="Change Passcode"
                  iconPath={require("../images/password.png")}
                  drawerPress={() => {
                    navigation.navigate("ChangePin");
                    navigation.closeDrawer();
                  }}
                />

                {this.state.type_id == 2 || 3 ? (
                  <View
                    style={{
                      backgroundColor: "transparent",
                      paddingBottom: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{ paddingVertical: 4 }}
                      onPress={() => {
                        this.Logout();
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <ImageBackground
                          source={require("../images/fill.png")}
                          style={{ height: 40, width: 40, marginLeft: 10 }}
                        >
                          <View style={styles.iconDrawer}>
                            <Image
                              source={require("../images/logout.png")}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: Colors.primary,
                              }}
                            />
                          </View>
                        </ImageBackground>
                        <View style={styles.textContainer}>
                          <Text
                            style={{
                              paddingTop: 2,
                              fontSize: 16,
                              fontFamily: Fonts.regular,
                              color: Colors.white,
                            }}
                          >
                            Logout
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.8,
    backgroundColor: "transparent",
  },
  mainDrawer: { paddingVertical: 4, backgroundColor: "transparent", margin: 2 },
  iconDrawer: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  textDrawer: {
    paddingTop: 2,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  textDrawer1: {
    paddingVertical: 4,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
});
