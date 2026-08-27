import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  Image,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  RefreshControl,
} from "react-native";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
var pendingArray = [];
import Colors from "../../common/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-material-dropdown";
import Fonts from "../../common/Fonts";
import RadioButton from "../../components/RadioButton";
import API from "../../common/API";
import timeout from "../../common/Timeout";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-community/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import Toast from "react-native-simple-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  StackActions,
  NavigationActions,
  NavigationEvents,
} from "react-navigation";
var Time;
var date = "";
export default class Today extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      modalVisible: false,
      pendingData: [],
      radioItems: [],
      selectedItem: "",
      sort_direction: "desc",
      order_field: "call_date",
      page: 0,
      search: "",
      Time: "",
      itempress: "",
      Timee: "",
      isDateTimePickerVisible: false,
      grp: "",
      grpId: "",
      grpData: [],
      FilterVisible: false,
      refresh: false,
    };
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  ClearFilter = () => {
    pendingArray = [];
    date = "";
    this.setState(
      {
        page: 0,
        pendingData: [],
        search: "",
        loading1: false,
        grp: "",
        grpId: "",
      },
      () => {
        setTimeout(() => {
          this.Pending();
        }, 500);
      }
    );
  };
  Pending = () => {
    if (pendingArray.includes(this.state.page)) {
    } else {
      if (pendingArray.length < 1) {
        this.setState({ loading: true });
      } else {
        this.setState({ loading1: true });
      }
      pendingArray.push(this.state.page);
      AsyncStorage.getItem("id").then((id) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("branch_id").then((branch_id) => {
            AsyncStorage.getItem("pagelimit").then((pagelimit) => {
              var Request = {
                token: token,
                id: id,
                branch_id: branch_id,
                order_field: this.state.order_field,
                order_type: this.state.sort_direction,
                search: this.state.search,
                start: this.state.page,
                limit: pagelimit,
                group: this.state.grp,
                fdate: date ? moment(date).format("YYYY-MM-DD") : "",
              };
              console.log(API.e_call_list_pending);
              console.log(JSON.stringify(Request));
              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.e_call_list_pending, {
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
                          this.setState({ loading: false, loading1: false });
                          if (this.state.grp || date) {
                            this.setState({
                              FilterVisible: true,
                              refresh: !this.state.refresh,
                            });
                          } else {
                            this.setState({
                              FilterVisible: false,
                              refresh: !this.state.refresh,
                            });
                          }
                          res.json().then((res) => {
                            console.log("m_pending :::  ", res);
                            if (res.status == "success") {
                              this.setState({
                                loading: false,
                                loading1: false,
                                pendingData: this.state.pendingData.concat(
                                  res.data
                                ),
                                // radioItems: res.sort_by,
                                grpData: res.call_group,
                                page:
                                  parseInt(this.state.page) +
                                  parseInt(pagelimit),
                              });
                              // this.Start();
                            } else if (res.status == "failed") {
                              this.setState({
                                loading: false,
                                loading1: false,
                              });
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
                              this.setState({
                                loading: false,
                                loading1: false,
                                message: res.message,
                                radioItems: res.sort_by,
                              });
                              // if(this.state.page != 0){
                              //   setTimeout(()=> {
                              //     Toast.show(res.message, Toast.SHORT, );

                              //   }, 50)
                              // }
                            }
                          });
                        } else {
                          console.log(res);
                          AsyncStorage.removeItem("id");
                          AsyncStorage.removeItem("username");
                          AsyncStorage.removeItem("password");
                          this.setState({ loading: false, loading1: false });
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
                        NetInfo.fetch().then((state) => {
                          if (!state.isConnected) {
                            Toast.show(
                              "Please Check your internet connection",
                              Toast.SHORT
                            );
                            this.props.navigation.goBack();
                          } else {
                            this.setState({ loading: false, loading1: false });
                            console.log(e);
                            Toast.show("Something went wrong...", Toast.SHORT);
                          }
                        });
                      })
                  ).catch((e) => {
                    console.log(e);
                    this.setState({ loading: false, loading1: false });
                    Toast.show(
                      "Please Check your internet connection",
                      Toast.SHORT
                    );
                  });
                } else {
                  this.setState({ loading: false, loading1: false });
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

  _handleDatePicked = (date0) => {
    date = date0;
    this._hideDateTimePicker();
    this.setModalVisible(false);
    {
      this.state.loading;
    }
    this.setState({ page: 0, pendingData: [], loading1: false }, () => {
      pendingArray = [];
      this.Pending();
    });
  };

  componentDidMount() {
    pendingArray = [];
    this.Pending();
    this.state.radioItems.map((item) => {
      if (item.value == this.state.order_field) {
        this.setState({ order_field: item.value });
      }
    });

    // setTimeout(()=> {
    //   this.Pending();
    //     //  Toast.show('ppp', Toast.SHORT, );
    //   }, 10000)

    this.Start();
  }

  Start = () => {
    this.setState({ loading: true });
    Time = setInterval(() => {
      var H = new Date().getHours();
      var M = new Date().getMinutes();
      var SEC = new Date().getSeconds();
      this.setState(
        {
          Time:
            moment(new Date()).format("YYYY-MM-DD") +
            " " +
            H +
            ":" +
            M +
            ":" +
            SEC,
          loading: false,
        },
        () => {
          // console.log("time",this.state.Time);
        }
      );
    }, 1000);
  };

  RejectBtn = (item) => {
    if (this.state.Time > item.exptime) {
      Toast.show("Time Expired", Toast.SHORT);
    } else {
      this.setState({ loading: true });
      var Request = {};
      AsyncStorage.getItem("id").then((id) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("branch_id").then((branch_id) => {
            Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: item.id,
            };
            console.log(API.delete_assign_call);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.delete_assign_call, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Request),
                  })
                    .then((res) => {
                      console.log("json", JSON.res);
                      if (res.status == 200) {
                        console.log(res);
                        this.setState({
                          loading: false,
                          loading1: false,
                          submit: false,
                        });
                        res.json().then((res) => {
                          console.log("delete_assign_call", res);
                          if (res.status == "success") {
                            this.setState(
                              {
                                loading: false,
                                loading1: false,
                                pendingData: [],
                              },
                              () => {
                                this.Pending();
                                Toast.show(res.message, Toast.SHORT);
                              }
                            );
                            // this.setState({
                            //   loading: false,
                            //   loading1: false,
                            //   pendingData:[]
                            // });

                            // this.Pending();
                            // this.setState({refresh:!this.state.refresh})
                            // console.log("ssss");
                            //   Toast.show(res.message, Toast.SHORT, );

                            // setTimeout(() => {
                            //     Toast.show(
                            //       res.message,
                            //       Toast.SHORT,
                            //
                            //     );
                            //   }, 50);
                          } else if (res.status == "failed") {
                            this.setState({
                              loading: false,
                              loading1: false,
                              submit: false,
                            });
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
                            this.setState({
                              loading: false,
                              loading1: false,
                              message: res.message,
                            });
                            console.log("%c HELLO", res);

                            setTimeout(() => {
                              Toast.show(res.message, Toast.SHORT);
                            }, 50);
                          }
                        });
                      } else {
                        AsyncStorage.removeItem("id");
                        AsyncStorage.removeItem("username");
                        AsyncStorage.removeItem("password");
                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({ routeName: "Login" }),
                          ],
                        });
                        this.props.navigation.dispatch(resetAction);

                        this.setState({
                          loading: false,
                          loading1: false,
                          submit: false,
                        });
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
                          this.setState({
                            loading: false,
                            loading1: false,
                            submit: false,
                          });
                          console.log(e);
                          Toast.show("Something went wrong...", Toast.SHORT);
                        }
                      });
                    })
                ).catch((e) => {
                  console.log(e);
                  this.setState({
                    loading: false,
                    loading1: false,
                    submit: false,
                  });
                  Toast.show(
                    "Please Check your internet connection",
                    Toast.SHORT
                  );
                });
              } else {
                this.setState({
                  loading: false,
                  loading1: false,
                  submit: false,
                });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT
                );
              }
            });
          });
        });
      });
    }
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "100%",
          backgroundColor: Colors.white,
        }}
      />
    );
  };

  setModalVisible(visible) {
    if (this.state.pendingData.length < 1) {
      Toast.show("No More pending call found...", Toast.SHORT);
    } else {
      this.setState({ modalVisible: visible });
    }
  }

  changeActiveRadioButton(index) {
    pendingArray = [];
    this.setState(
      {
        order_field: this.state.radioItems[index].value,
        modalVisible: false,
        page: 0,
        pendingData: [],
      },
      () => {
        setTimeout(() => {
          this.Pending();
        }, 500);
      }
    );
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: "column" }}
        onPress={() => {
          if (this.state.sort_direction == "asc") {
            pendingArray = [];
            this.setState(
              {
                sort_direction: "desc",
                page: 0,
                pendingData: [],
              },
              () => {
                this.Pending();
              }
            );
          } else {
            pendingArray = [];
            this.setState(
              {
                sort_direction: "asc",
                page: 0,
                pendingData: [],
              },
              () => {
                this.Pending();
              }
            );
          }
        }}
      >
        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == "desc"
                ? Colors.dark_gray
                : Colors.primary,
            right: 10,
          }}
          source={require("../../images/up.png")}
        />

        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == "desc"
                ? Colors.primary
                : Colors.dark_gray,
            right: 10,
          }}
          source={require("../../images/down.png")}
        />
      </TouchableOpacity>
    );
  };

  renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          height: Platform.OS == "ios" ? 60 : 60,
          paddingTop: Platform.OS == "ios" ? 0 : 0,
          width: width * 0.95,
          backgroundColor: "#F6F6F6",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignSelf: "center",
            backgroundColor: Colors.white,
            width: "100%",
            flex: 1,
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Icon
              name="search"
              size={20}
              color={Colors.primary}
              style={{
                height: 25,
                width: 35,
                paddingLeft: 10,
                alignSelf: "center",
              }}
            />
            <TextInput
              ref="searchText"
              style={styles.textInput}
              placeholder="Search"
              returnKeyType="search"
              value={this.state.search}
              onChangeText={(search) => this.setState({ search })}
              underlineColorAndroid="transparent"
              onSubmitEditing={() => {
                this.setState({ page: 0, pendingData: [] }, () => {
                  pendingArray = [];
                  this.Pending();
                });
              }}
            />

            {this.state.search.length < 1 ? null : (
              <TouchableOpacity
                onPress={() => {
                  pendingArray = [];
                  this.refs.searchText.clear();
                  this.setState(
                    {
                      page: 0,
                      pendingData: [],
                      search: "",
                    },
                    () => {
                      this.Pending();
                    }
                  );
                }}
                style={{ alignSelf: "center", right: 2 }}
              >
                <Icon
                  name="times"
                  size={20}
                  color={Colors.medium_gray}
                  style={{
                    marginTop: 2,
                    height: 25,
                    width: 35,
                  }}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={{ alignSelf: "center", right: 2 }}
            >
              <Icon
                name="filter"
                size={20}
                color={Colors.primary}
                style={{
                  marginTop: 2,
                  height: 25,
                  width: 35,
                }}
              />
            </TouchableOpacity>

            {this.sortByDirection()}
          </View>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={{ padding: 30 }}>
        {this.state.loading1 ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : null}
      </View>
    );
  };

  handleLoadMore = () => {
    this.Pending();
  };

  pullDown = () => {
    pendingArray = [];
    this.setState({ page: 0, pendingData: [] }, () => {
      setTimeout(() => {
        this.Pending();
      }, 500);
    });
  };

  _refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.loading}
        onRefresh={() => this.pullDown()}
        tintColor={Colors.primary}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={(payload) => {
            console.log("onwillfocus");
            this.Start();
          }}
          onWillBlur={(payload) => {
            console.log("onwillblur");
            clearInterval(Time);
          }}
        />
        {this.state.page == 0 &&
        this.state.pendingData.length < 1 &&
        this.state.loading == false &&
        this.state.loading1 == false ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            refreshControl={this._refreshControl()}
          >
            {this.renderHeader()}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  color: Colors.regular,
                  fontSize: 16,
                }}
              >
                {this.state.message}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.pendingData}
            keyboardShouldPersistTaps="handled"
            refreshControl={this._refreshControl()}
            ListHeaderComponent={this.renderHeader()}
            onEndReached={() => {
              AsyncStorage.getItem("pagelimit").then((pagelimit) => {
                if (pagelimit) {
                  if (this.state.pendingData.length >= pagelimit) {
                    this.handleLoadMore();
                  }
                }else{
                  this.handleLoadMore();
                }
              });
            }}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  marginBottom: 5,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  // borderWidth: 1,
                  // borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  // borderBottomLeftRadius: 5,
                  // borderColor: Colors.light_gray,
                  // shadowOffset: {width: 0, height: 5},
                  // shadowColor: Colors.medium_gray,
                  // shadowOpacity: 0.8,
                  // elevation:3
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        this.props.navigation.navigate("EmpPending", {
                          item: item.id,
                          sub_status: item.sub_status,
                        });
                      } else {
                        Toast.show(
                          "Please Check your internet connection",
                          Toast.SHORT
                        );
                      }
                    });
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      width: width * 0.95,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        paddingBottom: 5,
                      }}
                    >
                      <Text
                        style={{
                          margin: 5,
                          fontSize: 16,
                          fontFamily: Fonts.medium,
                          color: Colors.primary,
                          paddingLeft: 5,
                          paddingVertical: 3,
                        }}
                      >
                        Call No. {item.call_no}
                      </Text>
                      {/*                    
                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Call Date
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                        <Text style={styles.value}>
                         {moment(item.date).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                    </View> */}
                      <View style={[styles.rowItem, { paddingRight: 90 }]}>
                        <Text style={styles.label}>Company</Text>
                        <View style={{ flex: 1, flexDirection: "column" }}>
                          <Text style={styles.value}>{item.name}</Text>
                        </View>
                      </View>
                      {/* <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                        Call Type
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.call_type == "1" ? "Online" : "Offline"}
                        </Text>
                      </View>
                    </View> */}
                      {/* 
                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Caller Name
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.caller_name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Reported Problem
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.reported_problem}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                        Group
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.group2}
                        </Text>
                      </View>
                    </View>

                    {item.sub_status == 1 ? <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                        Call Type
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.call_type == "1" ? "Online" : "Offline"}
                        </Text>
                      </View>
                    </View>
                    : null 
                    } */}
                      <View style={{ marginHorizontal: 10, paddingTop: 40 }} />
                    </View>
                    {/* <View style={{zIndex: 1, bottom: -20,right:-20, position: 'absolute', }}>
                 <ImageBackground source={require('../images/primaryfill.png')} style={{height:90, opacity:0.2, width:90, alignItems:'center', justifyContent:'center',  tintColor: Colors.primary}} >
                    <Image style={{height:30, width:30, tintColor: Colors.white, alignSelf: 'center', }} source={require('../images/edit.png')}/>
                 </ImageBackground>
                    </View> */}
                    <View style={{ backgroundColor: "red" }} />
                    {item.sub_status == 1 ? (
                      <View style={styles.statusLabel}>
                        <View
                          style={[
                            styles.absoluteView,
                            {
                              justifyContent: "flex-start",
                              alignItems: "flex-end",
                            },
                          ]}
                        >
                          <View
                            style={{
                              padding: 5,
                              backgroundColor: Colors.green,
                              alignSelf: "flex-end",
                              minWidth: 80,
                              minHeight: 30,
                              borderBottomLeftRadius: 10,
                            }}
                          >
                            <Text
                              style={styles.statusLabelText}
                              numberOfLines={3}
                            >
                              Running
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.statusLabel}>
                        <View
                          style={[
                            styles.absoluteView,
                            {
                              justifyContent: "flex-start",
                              alignItems: "flex-end",
                            },
                          ]}
                        >
                          <View
                            style={{
                              padding: 5,
                              backgroundColor: Colors.red,
                              alignSelf: "flex-end",
                              minWidth: 80,
                              minHeight: 30,
                              borderBottomLeftRadius: 10,
                            }}
                          >
                            <Text
                              style={styles.statusLabelText}
                              numberOfLines={3}
                            >
                              Pending
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    {/* {item.sub_status == 1 ? null:
                        <View style={styles.statusLabel2}>
                        {item.exptime == this.state.Time ?null:

                        <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}>
                        <Image
                        style={{height:24 , width:24 , tintColor:Colors.red, marginLeft:7 , marginTop:3 }}
                        source={require('../../images/trash.png')}
                        />
                        </TouchableOpacity>
                        }
                            </View>
                                } */}
                    {/* <TouchableOpacity style={styles.LeftAbsoluteButton}>
                      <View style={{flexDirection:'row' , justifyContent:'space-around'  , alignItems:'center'}}>
                        <Image
                        style={{height:24 , width:24 , tintColor:Colors.white  , marginLeft:7 , marginTop:3 }}
                        source={require('../../images/tick.png')}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.white,
                            right:6,
                            fontFamily: Fonts.regular,
                          }}>
                          Accept
                        </Text>
                      </View>
                    </TouchableOpacity> */}
                    {/* 
                     {this.state.Time > item.exptime ?
                   null :  
                    <TouchableOpacity 
                    onPress={() => this.RejectBtn(item)}
                    style={styles.RejetctLeftAbsoluteButton}>
                    <View style={{flexDirection:'row' , justifyContent:'space-around'  , alignItems:'center'}}>
                        <Image
                        style={{height:18 , width:18 , tintColor:Colors.white  , marginLeft:7 , marginTop:7 }}
                        source={require('../../images/close.png')}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.white,
                            right:6,
                            marginTop:4,
                            fontFamily: Fonts.regular,
                          }}>
                        Reject
                        </Text>
                      </View>
                    </TouchableOpacity>
                     }   */}
                    {/* <TouchableOpacity style={{height:20 , alignSelf:'flex-end' , right:100 ,   
                                                  width: 100 , backgroundColor:Colors.red}}></TouchableOpacity> */}
                    {/* <TouchableOpacity
                        style={{
                          overflow: 'hidden',
                            width: 115,
                            height: 40,
                            position: 'absolute',
                            top: 40,
                            alignSelf: 'center',
                            right: -80,
                            borderTopLeftRadius: 50,
                            borderBottomLeftRadius: 60,
                            backgroundColor:Colors.primary,
                        }}>
                        <View style={styles.absoluteView}>
                          <Image
                            style={{
                              tintColor: Colors.white,
                              alignSelf: 'center',
                              height: 25,
                              width: 25,
                              marginTop: -1,
                              right: 23,
                            }}
                            source={require('../../images/X-icon.png')}
                          />
                        </View>
                      </TouchableOpacity> */}
                    <TouchableOpacity
                      style={styles.RightAbsoluteButton}
                      onPress={() => {
                        NetInfo.fetch().then((state) => {
                          if (state.isConnected) {
                            this.props.navigation.navigate("EmpPending", {
                              item: item.id,
                              sub_status: item.sub_status,
                            });
                          } else {
                            Toast.show(
                              "Please Check your internet connection",
                              Toast.SHORT
                            );
                          }
                        });
                      }}
                    >
                      <View
                        style={{ height: 8, backgroundColor: Colors.primary }}
                      />
                      <View style={styles.absoluteView}>
                        <Image
                          style={styles.whiteImage}
                          source={require("../../images/eye.png")}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {this.state.FilterVisible ? (
          <TouchableOpacity
            style={{ width: "100%", height: height * 0.07, marginTop: 20 }}
            onPress={() => {
              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  this.ClearFilter();
                } else {
                  Toast.show(
                    "Please Check your internet connection",
                    Toast.SHORT,
                    Toast.BOTTOM
                  );
                }
              });
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                borderRadius: 0,
              }}
            >
              <ImageBackground
                resizeMode="cover"
                style={{
                  top: 4,
                  flex: 0.3,
                  height: 40,
                  width: 40,
                  marginHorizontal: 5,
                  marginVertical: 0.5,
                }}
                source={require("../../images/fill.png")}
              >
                <Icon
                  name="filter"
                  size={20}
                  color={Colors.primary}
                  style={{
                    height: 18,
                    width: 18,
                    tintColor: Colors.primary,
                    marginVertical: 12,
                    marginHorizontal: 11,
                  }}
                />
              </ImageBackground>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: Colors.white,
                  fontFamily: Fonts.regular,
                  alignSelf: "center",
                }}
              >
                Clear Filter
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <Modal
          ref={"updateModal"}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          visible={this.state.modalVisible}
          position="bottom"
          animationType={"fade"}
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={true}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={true}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPressOut={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: "100%",
                    minHeight: "40%",
                    maxHeight: "50%",
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderColor: Colors.dark_gray,
                  }}
                >
                  <View style={{}}>
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        paddingVertical: 10,
                        borderBottomColor: Colors.light_gray,
                        borderBottomWidth: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,

                          color: Colors.black,
                          fontFamily: Fonts.regular,
                        }}
                      >
                        SORT BY
                      </Text>
                    </View>
                    <ScrollView>
                      <View style={{ flex: 1, margin: 12 }}>
                        <DateTimePicker
                          isVisible={this.state.isDateTimePickerVisible}
                          onConfirm={this._handleDatePicked}
                          onCancel={this._hideDateTimePicker}
                          mode="date"
                        />
                        <View>
                          <Text style={styles.labela}>Date</Text>
                          <TouchableOpacity
                            style={{
                              padding: 15,
                              paddingVertical: 10,
                              paddingHorizontal: 10,
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              backgroundColor: Colors.white,
                              borderWidth: 1,
                              borderRadius: 4,
                              paddingTop: 10,
                              borderColor: Colors.medium_gray,
                            }}
                            onPress={() => {
                              this._showDateTimePicker();
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: Fonts.regular,
                                color: Colors.black,
                              }}
                            >
                              {date ? moment(date).format("DD/MM/YY") : ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>Group</Text>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 10,
                              height: 42,
                              justifyContent: "center",
                              alignItems: "flex-start",
                              backgroundColor: Colors.white,
                              borderWidth: 1,

                              borderRadius: 4,

                              borderColor: Colors.medium_gray,
                            }}
                          >
                            <View>
                              <Dropdown
                                containerStyle={{
                                  width: width * 0.8,
                                  alignSelf: "flex-start",
                                  paddingBottom: 15,
                                }}
                                inputContainerStyle={{
                                  borderBottomColor: "white",
                                }}
                                fontSize={15}
                                itemTextStyle={{
                                  fontFamily: Fonts.regular,
                                  color: Colors.primary,
                                }}
                                itemColor={Colors.black}
                                fontFamily={Fonts.regular}
                                selectedItemColor={Colors.black}
                                textColor={
                                  this.state.grp
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.grp
                                    ? this.state.grp
                                    : "Select Group"
                                }
                                onChangeText={(value, id) => {
                                  this.setState(
                                    { grp: value, grpId: id },
                                    () => {
                                      this._handleDatePicked();
                                    }
                                  );
                                }}
                                data={this.state.grpData}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                      {/* {console.log("first", this.state.radioItems)}
                      {this.state.radioItems.map((item, key) => (
                        <RadioButton
                          key={key}
                          button={item}
                          selected={this.state.order_field}
                          onClick={this.changeActiveRadioButton.bind(this, key)}
                        />
                      ))} */}
                    </ScrollView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    //  margin: 10,
    backgroundColor: "#f1f1f1",
  },
  btn: {
    width: 300,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginVertical: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  radioButton: {
    marginTop: 6,
    marginLeft: 25,
    flexDirection: "row",
  },
  selectedText: {
    fontSize: 18,
    color: "white",
  },

  ModalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  netAlert: {
    overflow: "hidden",
    borderRadius: 10,
    shadowRadius: 10,
    width: width * 0.8,
    minHeight: height * 0.3,
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
  textInput: {
    marginTop: 2,
    paddingVertical: Platform.OS == "ios" ? 6 : 6,
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.medium,
    paddingHorizontal: 5,
  },
  label: {
    padding: 2,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.dark_gray,
    width: width * 0.3,
    paddingLeft: 15,
  },
  value: {
    padding: 2,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.primary,
    width: 150,
  },
  RightAbsoluteButton: {
    overflow: "hidden",
    width: 80,
    height: 40,
    position: "absolute",
    bottom: -3,
    alignSelf: "center",
    right: -30,
    borderTopLeftRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: Colors.primary,
  },

  LeftAbsoluteButton: {
    overflow: "visible",
    width: 110,
    height: 30,
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    left: 7,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  RejetctLeftAbsoluteButton: {
    overflow: "visible",
    width: 110,
    height: 30,
    position: "absolute",
    bottom: 5,
    alignSelf: "center",
    left: 10,
    borderRadius: 25,
    backgroundColor: Colors.red,
  },
  absoluteView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
    backgroundColor: "transparent",
  },
  whiteImage: {
    tintColor: Colors.white,
    alignSelf: "center",
    marginLeft: 9,
    height: 25,
    width: 25,
  },
  rowItem: { flex: 1, flexDirection: "row" },
  primaryImage: {
    tintColor: Colors.primary,
    alignSelf: "center",
    height: 20,
    width: 20,
  },
  statusLabelText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  absoluteView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 30,
    backgroundColor: "transparent",
  },
  statusLabel: {
    transform: [{ rotate: "-0deg" }],
    overflow: "visible",
    width: 120,
    minHeight: 40,
    position: "absolute",
    top: 0,
    alignSelf: "center",
    right: -30,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.white,
  },
  statusLabel2: {
    overflow: "visible",
    width: 40,
    minHeight: 40,
    position: "absolute",
    top: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    right: 0,
  },
  textInputView: {
    flexDirection: "column",
  },
  labela: {
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
