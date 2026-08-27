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
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  AppState,
  Linking,
  KeyboardAvoidingView,
} from "react-native";
var width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import RNFetchBlob from "rn-fetch-blob";
import Colors from "../../common/Colors";
import ImageViewer from "react-native-image-zoom-viewer";
import Fonts from "../../common/Fonts";
import BackHeader from "../../components/BackHeader";
import DateTimePicker from "react-native-modal-datetime-picker";

import moment from "moment";
import { StackActions, NavigationActions } from "react-navigation";
import API from "../../common/API";
import timeout from "../../common/Timeout";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-community/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-simple-toast";

var userListArray = [];
var vendorListArray = [];
var drawingListArray = [];
var userMap = [];
var isLine = [];

export default class EmpCompleted extends Component {
  constructor(props) {
    isLine = [];
    super(props);
    this.state = {
      appState: AppState.currentState,
      appVisible: false,
      loading: true,
      refresh: false,
      dataMass: false,
      docName: "Choose file",
      dataSource: [
        { call_id: "98989", company_name: "GMM", date: "4/09/2019" },
      ],
      modalVisible: false,
      isDateTimePickerVisible: false,
      date: new Date(),
      textInputs: [],
      history: [],
      vendorlist: [],
      drawinglist: [],
      imagePath: "",
      Attachment: false,
      isReport: false,
      Isimage: [],
      radioItems: [
        {
          label: "Date",
          selected: false,
        },

        {
          label: "Capacity",
          selected: false,
        },

        {
          label: "Material",
          selected: false,
        },
        {
          label: "O.D",
          selected: false,
        },
      ],
      selectedItem: "",
      sort_direction: "DESC",
    };
  }

  componentDidMount() {
    userMap = [];
    AppState.addEventListener("change", this._handleAppStateChange);
    this.CompletedDetail();
    this.setState({ refresh: !this.state.refresh });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    AsyncStorage.setItem("removeDigi", "0");
  }
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      setTimeout(() => {
        AsyncStorage.setItem("removeDigi", "0");
      }, 500);

      console.log("222App has come to the foreground!");
    }
  };
  Attachment(value) {
    this.setState({ Isimage: value });
  }

  Report(value) {
    this.setState({ Isimage: value });
  }

  CompletedDetail = () => {
    this.setState({ loading: true });

    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          AsyncStorage.getItem("pagelimit").then((pagelimit) => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: this.props.navigation.state.params.item.id,
            };
            console.log(API.e_call_complete_view);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.e_call_complete_view, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Request),
                  })
                    .then((res) => {
                      if (res.status == 200) {
                        res.json().then((res) => {
                          console.log("call_get_details :::  ", res);
                          if (res.status == "success") {
                            this.setState(
                              {
                                dataSource: res.data,
                                userlist: res.users,
                                history: res.history,
                                vendorlist: res.vendor,
                                drawinglist: res.drawing,
                                imagePath: res.img_path,
                                // call_date: res.data.call_date,
                                // caller_name: res.data.caller_name,
                                // call_origin: res.data.call_origin,
                                // bo_code: res.data.bo_code,
                                // cmp_name: res.data.cmp_name,
                                // installation_address: res.data.installation_address,
                                // group2: res.data.group2,
                                // reported_problem: res.data.reported_problem,
                                // entry_date: res.data.entry_date
                              },
                              () => {
                                console.log(
                                  "this.state.history",
                                  this.state.history
                                );
                                //  if( (Array.isArray(this.state.history[1].line_no))){
                                //    console.log('true',Array.isArray(this.state.history[1].line_no));
                                //  }else{
                                //    console.log('false');

                                //  }
                                let k = 0;
                                for (
                                   k = 0;
                                  k < this.state.history.length;
                                  k++
                                ) {
                                  if (
                                    this.state.history[k].line_no[0] == null
                                  ) {
                                    // console.log('not one');

                                    //                                   isLine = ['-']
                                    console.log("cal one time cal");
                                  } else if (
                                    this.state.history[k].line_no[0] == "[]"
                                  ) {
                                    console.log("not two");
                                    isLine = ["-"];
                                  } else {
                                    for (
                                      let j = 0;
                                      j < this.state.history[k].line_no.length;
                                      j++
                                    ) {
                                      var obj = {
                                        name:
                                          this.state.history[k].line_no[j] ==
                                            null
                                            ? "-"
                                            : this.state.history[k].line_no[j],
                                      };
                                      isLine.push(obj);
                                    }
                                    console.log("isLine", isLine);
                                  }
                                }

                                userListArray = [];
                                for (
                                  var i = 0;
                                  i < this.state.userlist.length;
                                  i++
                                ) {
                                  userListArray[
                                    this.state.userlist[i].id
                                  ] = this.state.userlist[i];
                                }

                                vendorListArray = [];
                                for (
                                  var i = 0;
                                  i < this.state.vendorlist.length;
                                  i++
                                ) {
                                  vendorListArray[
                                    this.state.vendorlist[i].id
                                  ] = this.state.vendorlist[i];
                                }

                                drawingListArray = [];
                                for (
                                  var i = 0;
                                  i < this.state.drawinglist.length;
                                  i++
                                ) {
                                  drawingListArray[
                                    this.state.drawinglist[i].id
                                  ] = this.state.drawinglist[i];
                                }

                                userMap = [];

                                var issecondery = this.state.dataSource
                                  .call_more_user;
                                var isPrimary = this.state.dataSource
                                  .call_primary_user;

                                console.log("isPrimary", isPrimary);

                                this.setState({
                                  primaryUserID: isPrimary,
                                  loading: false,
                                  loading1: false,
                                });

                                for (
                                  var i = 0;
                                  i < this.state.userlist.length;
                                  i++
                                ) {
                                  if (isPrimary == this.state.userlist[i].id) {
                                    this.setState({
                                      PrimaryUser: this.state.userlist[i].name,
                                      refresh: !this.state.refresh,
                                      loading: false,
                                      loading1: false,
                                    });
                                  }

                                  for (var j = 0; j < issecondery.length; j++) {
                                    if (
                                      issecondery.split(",")[j] ==
                                      this.state.userlist[i].id
                                    ) {
                                      userMap.push(this.state.userlist[i].name);
                                      console.log("last");

                                      this.setState({
                                        refresh: !this.state.refresh,
                                        loading: false,
                                        loading1: false,
                                      });
                                    }
                                  }
                                }
                              }
                            );
                          } else if (res.status == "failed") {
                            this.setState({ loading: false, loading1: false });
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
                            setTimeout(() => {
                              Toast.show(res.message, Toast.SHORT);
                            }, 50);
                          }
                        });
                      } else {
                        AsyncStorage.removeItem("id");
                        AsyncStorage.removeItem("username");
                        AsyncStorage.removeItem("password");
                        this.setState({ loading: false, loading1: false });

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
                this.props.navigation.goBack();
              }
            });
          });
        });
      });
    });
  };

  callMoreUser = (item) => {
    // console.log('item',item);
    // console.log('history',this.state.history)
    // console.log('"[" + item.call_more_user + "]"',item.call_more_user.split(","),"or",item.call_more_user.split(",") != "");

    if (item.call_more_user.split(",") == "") {
      console.log(item.call_more_user.split(",") == "");
      return JSON.parse(tem.call_more_user.split(",")).map((data) => {
        console.log("userListArray[data]", userListArray[data]);
        return (
          <View>
            <Text style={styles.value}>{userListArray[data]["name"]}</Text>
          </View>
        );
      });
    }
  };

  renderSeal = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', flex: 1, bottom: 5 }}>
        <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, width: 45, textAlign: 'center' }}>{item.soNo ? item.soNo : '-'}</Text>
        <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, width: 100, textAlign: 'center' }}>{item.intersealNo ? item.intersealNo : '-'}</Text>
        <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, width: 60, textAlign: 'center' }}>{item.location ? item.location : '-'}</Text>
        <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, width: 60, textAlign: 'center' }}>{item.plant ? item.plant : '-'}</Text>
        <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, width: 110, textAlign: 'center' }}>{item.remarks ? item.remarks : '-'}</Text>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    if (item.status == "2") {
      return (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            flexDirection: "column",
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            // borderLeftWidth: 6,
            // borderLeftColor: Colors.medium_gray,
            borderBottomLeftRadius: 5,
            borderColor: Colors.light_gray,
            shadowOffset: { width: 0, height: 5 },
            shadowColor: Colors.medium_gray,
            shadowOpacity: 0.8,
            elevation: 3,
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
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  margin: 5,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.primary,
                  paddingLeft: 5,
                  paddingVertical: 8,
                }}
              >
                Call {index != 0 ? "Swiped" : "Assigned"}
              </Text>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Service Engineer</Text>
                {item.call_primary_user && item.call_primary_user != "0" ? (
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      <Text style={styles.value}>
                        {userListArray[item.call_primary_user]["name"]}
                      </Text>
                    ) : (
                      <Text style={styles.value}>-</Text>
                    )}
                  </View>
                ) : null}
              </View>

              {item.call_more_user ? (
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Service Engineer</Text>
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      this.callMoreUser(item)
                    ) : (
                      <Text style={styles.value}>-</Text>
                    )}
                  </View>
                </View>
              ) : null}

              <View style={styles.rowItem}>
                <Text style={styles.label}>Assigned By</Text>
                {item.assign_by_user && item.assign_by_user != "0" ? (
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      <Text style={styles.value}>
                        {userListArray[item.assign_by_user]["name"]}
                      </Text>
                    ) : (
                      <Text style={styles.value}>-</Text>
                    )}
                  </View>
                ) : null}
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Assigned Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Remarks</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>{item.remark_for_user}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (item.status == "3") {
      return (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            flexDirection: "column",
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            // borderLeftWidth: 6,
            // borderLeftColor: Colors.medium_gray,
            borderBottomLeftRadius: 5,
            borderColor: Colors.light_gray,
            shadowOffset: { width: 0, height: 5 },
            shadowColor: Colors.medium_gray,
            shadowOpacity: 0.8,
            elevation: 3,
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
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  margin: 5,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.primary,
                  paddingLeft: 5,
                  paddingVertical: 8,
                }}
              >
                Start Work
              </Text>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Service Engineer</Text>
                {item.call_primary_user && item.call_primary_user != "0" ? (
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      <Text style={styles.value}>
                        {userListArray[item.call_primary_user]["name"]}
                      </Text>
                    ) : (
                      <Text style={styles.value}>-</Text>
                    )}
                  </View>
                ) : null}
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Work Start Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Location</Text>
                <View
                  style={{
                    width: "46%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 8,
                  }}
                >
                  {item.lat_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          this.setState({ appVisible: true });
                        Linking.openURL(item.lat_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lat_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {item.lon_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          this.setState({ appVisible: true });
                        Linking.openURL(item.lon_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lon_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (item.status == "4" || item.status == "6") {
      return (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            flexDirection: "column",
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            // borderLeftWidth: 6,
            // borderLeftColor: Colors.medium_gray,
            borderBottomLeftRadius: 5,
            borderColor: Colors.light_gray,
            shadowOffset: { width: 0, height: 5 },
            shadowColor: Colors.medium_gray,
            shadowOpacity: 0.8,
            elevation: 3,
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
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  margin: 5,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.primary,
                  paddingLeft: 5,
                  paddingVertical: 8,
                }}
              >
                Call - {item.status == 4 ? "Pending" : "Complete"}
              </Text>

              <FlatList
                showsVerticalScrollIndicator={false}
                data={isLine}
                listKey={(item, index) => "D" + index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Line No {index + 1}.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>{item.name}</Text>
                      </View>
                    </View>
                  );
                }}
              />

              <View style={styles.rowItem}>
                <Text style={styles.label}>Field Work Required</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {item.field_work == "1" ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Vendor Help</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {item.vendor_help == "1" ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              {item.vendor_help == "1" ? (
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Vendor Name</Text>
                  {item.vendor_id && item.vendor_id != "0" ? (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      {vendorListArray.length > 0 ? (
                        <Text style={styles.value}>
                          {vendorListArray[item.vendor_id]["name"]}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.rowItem}>
                <Text style={styles.label}>Service Manager Required</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {item.service_manager == "1" ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              {item.service_manager == "1" ? (
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Service Manager</Text>
                  {item.manager_id && item.manager_id != "0" ? (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      {userListArray.length > 0 ? (
                        <Text style={styles.value}>
                          {userListArray[item.manager_id]["name"]}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.rowItem}>
                <Text style={styles.label}>Drawing Required</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {item.drawing == "1" ? "Yes" : "No"}
                  </Text>
                </View>
              </View>

              {item.drawing == "1" ? (
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Drawing Type</Text>
                  {item.drawing_type_id && item.drawing_type_id != "0" ? (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      {drawingListArray.length > 0 ? (
                        <Text style={styles.value}>
                          {drawingListArray[item.drawing_type_id]["value"]}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.rowItem}>
                <Text style={styles.label}>Work Start Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Work End Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.end_day_time).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Location</Text>
                <View
                  style={{
                    width: "46%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 8,
                  }}
                >
                  {item.lat_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          this.setState({ appVisible: true });
                        Linking.openURL(item.lat_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lat_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {item.lon_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          Linking.openURL(item.lon_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lon_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {this.state.dataSource.call_type == "1" ? (
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Report</Text>
                  <View
                    style={{
                      width: "46%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginTop: 8,
                    }}
                  >
                    {item.report_link ? (
                      <TouchableOpacity
                        style={{}}
                        onPress={() =>
                          this.props.navigation.navigate("ViewPdf", {
                            pdf: item.report_link,
                          })
                        }
                      >
                        <Image
                          style={{
                            height: 50,
                            width: 50,
                            tintColor: Colors.primary,
                          }}
                          source={require("../../images/pdf.png")}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              ) : (
                <View>
                  {this.state.dataSource.call_type == "1" ? (
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Report</Text>
                      <View
                        style={{
                          width: "46%",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          marginTop: 8,
                        }}
                      >
                        {item.report_link ? (
                          <TouchableOpacity
                            style={{}}
                            onPress={() =>
                              this.props.navigation.navigate("ViewPdf", {
                                pdf: item.report_link,
                              })
                            }
                          >
                            <Image
                              style={{
                                height: 50,
                                width: 50,
                                tintColor: Colors.primary,
                              }}
                              source={require("../../images/pdf.png")}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.rowItem, { flexDirection: "column" }]}>
                      <Text style={styles.label}>Report</Text>
                      <View style={{ marginTop: 8 }}>
                        {item.report.report.length > 0 ? (
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            data={item.report.report}
                            listKey={(item, index) => "D" + index.toString()}
                            numColumns={2}
                            renderItem={({ item, index }) => {
                              return (
                                <View style={{ margin: 5 }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({ isReport: true }, () => {
                                        this.Report(
                                          this.state.imagePath +
                                          item.folder +
                                          "/" +
                                          item.file
                                        );
                                      });
                                    }}
                                  >
                                    {item.file.split(".")[1] == "jpeg" &&
                                      "png" &&
                                      "jpg" ? (
                                      <Image
                                        style={{
                                          height: width * 0.4,
                                          width: (width * 0.9) / 2.1,
                                          marginLeft: 2,
                                          backgroundColor: "#f3f3f3",
                                        }}
                                        resizeMode="contain"
                                        source={{
                                          uri:
                                            this.state.imagePath +
                                            item.folder +
                                            "/" +
                                            item.file,
                                        }}
                                      />
                                    ) : (
                                      <View
                                        style={{
                                          height: width * 0.4,
                                          width: (width * 0.9) / 2.1,
                                          marginLeft: 2,
                                          backgroundColor: "#ccc",
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TouchableOpacity
                                          activeOpacity={0.2}
                                          onPress={() => {
                                            console.log('iiii', this.state.imagePath + item.folder + "/" + item.file);
                                            AsyncStorage.setItem(
                                              "removeDigi",
                                              "1"
                                            );
                                            Linking.openURL(
                                              this.state.imagePath +
                                              item.folder +
                                              "/" +
                                              item.file
                                            );
                                          }}
                                        >
                                          <Image
                                            style={{
                                              height: 50,
                                              width: 50,
                                              tintColor: Colors.primary,
                                            }}
                                            //  resizeMode="contain"
                                            source={require("../../images/attach.png")}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                  </TouchableOpacity>

                                  {this.state.isReport ? (
                                    <Modal
                                      style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 20,
                                      }}
                                      visible={this.state.isReport}
                                      position="bottom"
                                      backdrop={true}
                                      coverScreen={true}
                                      backdropPressToClose={true}
                                      backdropOpacity={0.5}
                                      transparent={true}
                                      swipeToClose={true}
                                    >
                                      <View
                                        style={{
                                          flex: 1,
                                          backgroundColor: "black",
                                        }}
                                      >
                                        <View
                                          style={{
                                            flex: 0.06,
                                            flexDirection: "row",
                                            alignSelf: "flex-end",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <TouchableOpacity
                                            style={{
                                              width: 40,
                                              height: 40,
                                              marginRight: 10,
                                              marginTop: 2,
                                            }}
                                            onPress={() => {
                                              this.downloadImage();
                                            }}
                                          >
                                            <ImageBackground
                                              resizeMode="contain"
                                              style={{
                                                height: 36,
                                                width: 36,
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                              source={require("../../images/primaryfill.png")}
                                            >
                                              <Image
                                                style={{
                                                  height: 28,
                                                  width: 28,
                                                  tintColor: "white",
                                                }}
                                                source={require("../../images/down-arrow.png")}
                                              />
                                            </ImageBackground>
                                          </TouchableOpacity>

                                          <TouchableOpacity
                                            style={{
                                              width: 40,
                                              height: 40,
                                              marginLeft: 10,
                                              marginTop: 5,
                                            }}
                                            onPress={() =>
                                              this.setState({ isReport: false })
                                            }
                                          >
                                            <Image
                                              style={{ height: 28, width: 28 }}
                                              source={require("../../images/remove.png")}
                                            />
                                          </TouchableOpacity>
                                        </View>

                                        <View style={{ flex: 0.94, bottom: 0 }}>
                                          <ImageViewer
                                            renderIndicator={() => null}
                                            //  index={this.state.index}
                                            enableSwipeDown={true}
                                            onSwipeDown={() => {
                                              this.setState({
                                                Attachment: false,
                                              });
                                            }}
                                            imageUrls={[
                                              { url: this.state.Isimage },
                                            ]}
                                          />
                                        </View>
                                      </View>
                                    </Modal>
                                  ) : null}
                                </View>
                              );
                            }}
                            keyExtractor={(item, index) => item.toString()}
                          />
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              )}
              <View style={[styles.rowItem, { flexDirection: "column" }]}>
                <Text style={styles.label}>Attachment</Text>
                <View style={{ marginTop: 8 }}>
                  {item.attachment.length > 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={item.attachment}
                      numColumns={2}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ margin: 5 }}>
                            <TouchableOpacity
                              activeOpacity={0.2}
                              onPress={() => {
                                item.file.split(".")[1] == "jpeg" &&
                                  "png" &&
                                  "jpg"
                                  ? null
                                  : this.setState({ Attachment: true }, () => {
                                    this.Attachment(
                                      this.state.imagePath +
                                      item.folder +
                                      "/" +
                                      item.file
                                    );
                                  });
                              }}
                            >
                              {item.file.split(".")[1] == "jpeg" &&
                                "png" &&
                                "jpg" ? (
                                <Image
                                  style={{
                                    height: width * 0.4,
                                    width: (width * 0.9) / 2.1,
                                    marginLeft: 2,
                                    backgroundColor: "#f3f3f3",
                                  }}
                                  resizeMode="contain"
                                  source={{
                                    uri:
                                      this.state.imagePath +
                                      item.folder +
                                      "/" +
                                      item.file,
                                  }}
                                />
                              ) : (
                                <View
                                  style={{
                                    height: width * 0.4,
                                    width: (width * 0.9) / 2.1,
                                    marginLeft: 2,
                                    backgroundColor: "#ccc",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TouchableOpacity
                                    activeOpacity={0.2}
                                    onPress={() => {
                                      AsyncStorage.setItem("removeDigi", "1");
                                      Linking.openURL(
                                        this.state.imagePath +
                                        item.folder +
                                        "/" +
                                        item.file
                                      );
                                    }}
                                  >
                                    <Image
                                      style={{
                                        height: 50,
                                        width: 50,
                                        tintColor: Colors.primary,
                                      }}
                                      //  resizeMode="contain"
                                      source={require("../../images/attach.png")}
                                    />
                                  </TouchableOpacity>
                                </View>
                              )}
                            </TouchableOpacity>
                            {this.state.Attachment ? (
                              <SafeAreaView
                                style={{
                                  flex: 1,
                                  backgroundColor: Colors.primary,
                                }}
                              >
                                <View style={{ height: 10 }} />
                                <Modal
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 20,
                                  }}
                                  visible={this.state.Attachment}
                                  // position="bottom"
                                  // backdrop={true}
                                  // coverScreen={true}
                                  // backdropPressToClose={true}
                                  // backdropOpacity={0.5}
                                  transparent={true}
                                // swipeToClose={true}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      backgroundColor: "black",
                                    }}
                                  >
                                    <View
                                      style={{
                                        flex: 0.06,
                                        flexDirection: "row",
                                        alignSelf: "flex-end",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <TouchableOpacity
                                        style={{
                                          width: 40,
                                          height: 40,
                                          marginRight: 10,
                                          marginTop: 2,
                                        }}
                                        onPress={() => {
                                          this.downloadImage();
                                        }}
                                      >
                                        <ImageBackground
                                          resizeMode="contain"
                                          style={{
                                            height: 36,
                                            width: 36,
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                          source={require("../../images/primaryfill.png")}
                                        >
                                          <Image
                                            style={{
                                              height: 28,
                                              width: 28,
                                              tintColor: "white",
                                            }}
                                            source={require("../../images/down-arrow.png")}
                                          />
                                        </ImageBackground>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        style={{
                                          width: 40,
                                          height: 40,
                                          marginLeft: 10,
                                          marginTop: 5,
                                        }}
                                        onPress={() =>
                                          this.setState({ Attachment: false })
                                        }
                                      >
                                        <Image
                                          style={{ height: 28, width: 28 }}
                                          source={require("../../images/remove.png")}
                                        />
                                      </TouchableOpacity>
                                    </View>

                                    <View style={{ flex: 0.94, bottom: 0 }}>
                                      <ImageViewer
                                        renderIndicator={() => null}
                                        //  index={this.state.index}
                                        enableSwipeDown={true}
                                        onSwipeDown={() => {
                                          this.setState({ Attachment: false });
                                        }}
                                        imageUrls={[
                                          { url: this.state.Isimage },
                                        ]}
                                      />
                                    </View>
                                  </View>
                                </Modal>
                              </SafeAreaView>
                            ) : null}
                          </View>
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (item.status == "5") {
      return (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            flexDirection: "column",
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            // borderLeftWidth: 6,
            // borderLeftColor: Colors.medium_gray,
            borderBottomLeftRadius: 5,
            borderColor: Colors.light_gray,
            shadowOffset: { width: 0, height: 5 },
            shadowColor: Colors.medium_gray,
            shadowOpacity: 0.8,
            elevation: 3,
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
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  margin: 5,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.primary,
                  paddingLeft: 5,
                  paddingVertical: 8,
                }}
              >
                Call - Continue
              </Text>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Call Next Date</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.call_date).format("DD/MM/YYYY")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Service Engineer</Text>
                {item.call_primary_user && item.call_primary_user != "0" ? (
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      <Text style={styles.value}>
                        {userListArray[item.call_primary_user]["name"]}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Work Start Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Work End Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.end_day_time).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Remarks</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>{item.remark_for_user}</Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Location</Text>
                <View
                  style={{
                    width: "46%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 8,
                  }}
                >
                  {item.lat_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          this.setState({ appVisible: true });
                        Linking.openURL(item.lat_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lat_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {item.lon_img ? (
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        AsyncStorage.setItem("removeDigi", "1"),
                          this.setState({ appVisible: true });
                        Linking.openURL(item.lon_link);
                      }}
                    >
                      <Image
                        style={{ height: 60, width: 60 }}
                        source={{ uri: item.lon_img }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (item.status == "8") {
      return (
        <View
          style={{
            flex: 1,
            marginBottom: 10,
            flexDirection: "column",
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderTopLeftRadius: 5,
            // borderLeftWidth: 6,
            // borderLeftColor: Colors.medium_gray,
            borderBottomLeftRadius: 5,
            borderColor: Colors.light_gray,
            shadowOffset: { width: 0, height: 5 },
            shadowColor: Colors.medium_gray,
            shadowOpacity: 0.8,
            elevation: 3,
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
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  margin: 5,
                  fontSize: 16,
                  fontFamily: Fonts.medium,
                  color: Colors.primary,
                  paddingLeft: 5,
                  paddingVertical: 8,
                }}
              >
                Branch Transfer
              </Text>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Transfer By</Text>
                {item.assign_by_user && item.assign_by_user != "0" ? (
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    {userListArray.length > 0 ? (
                      <Text style={styles.value}>
                        {userListArray[item.assign_by_user]["name"]}
                      </Text>
                    ) : (
                      <Text style={styles.value}>-</Text>
                    )}
                  </View>
                ) : null}
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Transfer Time</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>
                    {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                  </Text>
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Transfer Reason</Text>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={styles.value}>{item.remark_for_user}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  downloadImage = () => {
    var date = new Date();
    var image_URL = this.state.Isimage;
    var ext = this.getExtention(image_URL);
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: "Image",
      },
    };
    config(options)
      .fetch("GET", image_URL)
      .then((res) => {
        console.log(res);

        Toast.show("Image Downloaded Successfully.", Toast.SHORT);
      });
  };

  getExtention = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require("../../images/Left_arrow.png")}
          pageTitle="Completed Call"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <Loader loading={this.state.loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          style={{ flex: 1, backgroundColor: Colors.white }}
        >
          <ScrollView
            style={{ flex: 1, backgroundColor: "#f1f1f1" }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container} refresh={this.state.refresh}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: { width: 0, height: 5 },
                  shadowColor: Colors.medium_gray,
                  shadowOpacity: 0.8,
                  elevation: 3,
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
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Call No. {this.state.dataSource.call_no}
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Status.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.status == 8
                            ? "Completed"
                            : "Completed"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>SO No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_no
                            ? this.state.dataSource.so_no
                            : "-"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Sales Order Line No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_line_no
                            ? this.state.dataSource.so_line_no
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Serial No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.serial_no
                            ? this.state.dataSource.serial_no
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Date</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.call_date
                            ? moment(this.state.dataSource.call_date).format(
                              "DD/MM/YYYY"
                            )
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Caller Name</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.caller_name
                            ? this.state.dataSource.caller_name
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Origin</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.call_origin
                            ? this.state.dataSource.call_origin
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, { paddingTop: 10 }]}>
                      <Text style={styles.label}>BP Code</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.bo_code
                            ? this.state.dataSource.bo_code
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Company</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.cmp_name
                            ? this.state.dataSource.cmp_name
                            : "-"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Address</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.installation_address
                            ? this.state.dataSource.installation_address
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Email</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.email
                            ? this.state.dataSource.email
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Phone</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.phone
                            ? this.state.dataSource.phone
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Group</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.group2
                            ? this.state.dataSource.group2
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Type</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.a_calltype
                            ? this.state.dataSource.a_calltype
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Description</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.description
                            ? this.state.dataSource.description
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Problem</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.reported_problem
                            ? this.state.dataSource.reported_problem
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Time</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.entry_date
                            ? moment(this.state.dataSource.entry_date).format(
                              "DD/MM/YYYY hh:mm a"
                            )
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Service Engineer</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.PrimaryUser
                            ? this.state.PrimaryUser
                            : " -"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Service Engineer</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        {userMap ? (
                          <View>
                            {userMap.map((data) => {
                              return <Text style={styles.value}> {data}</Text>;
                            })}
                          </View>
                        ) : (
                          <Text style={styles.value}> -</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Assigned By</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.assignname
                            ? this.state.dataSource.assignname
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Assigned Time</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.assign_date
                            ? moment(this.state.dataSource.assign_date).format(
                              "DD/MM/YYYY hh:mm a"
                            )
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Remarks</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.remark_for_user
                            ? this.state.dataSource.remark_for_user
                            : "-"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Branch Name</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.branch_name
                            ? this.state.dataSource.branch_name
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Transferred</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.transferred
                            ? this.state.dataSource.transferred
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Old Branch Name</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.old_branch_name
                            ? this.state.dataSource.old_branch_name
                            : "-"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Capacity</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.capacity
                            ? this.state.dataSource.capacity
                            : "-"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: { width: 0, height: 5 },
                  shadowColor: Colors.medium_gray,
                  shadowOpacity: 0.8,
                  elevation: 3,
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
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Call Generated
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Type</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 15,
                            fontFamily: Fonts.bold,
                            color: Colors.primary,
                          }}
                        >
                          {this.state.dataSource.call_type == "1"
                            ? "Online"
                            : "Offline"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.call_no}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>LN Call Date</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {moment(this.state.dataSource.ln_call_date).format(
                            "DD/MM/YYYY"
                          )}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Date</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {moment(this.state.dataSource.call_date).format(
                            "DD/MM/YYYY"
                          )}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Time</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {moment(this.state.dataSource.entry_date).format(
                            "DD/MM/YYYY hh:mm a"
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* person details */}
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: { width: 0, height: 5 },
                  shadowColor: Colors.medium_gray,
                  shadowOpacity: 0.8,
                  elevation: 3,
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
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Contact Person details
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Person Name</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history[this.state.history.length - 1] ? this.state.history[this.state.history.length - 1].person_name : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>WhatsApp Mobile No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history[this.state.history.length - 1] && this.state.history[this.state.history.length - 1].mobile_no ? this.state.history[this.state.history.length - 1].mobile_no : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Plant Address</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history[this.state.history.length - 1] && this.state.history[this.state.history.length - 1].plant_address ? this.state.history[this.state.history.length - 1].plant_address : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Location</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history[this.state.history.length - 1] && this.state.history[this.state.history.length - 1].location ? this.state.history[this.state.history.length - 1].location : '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: { width: 0, height: 5 },
                  shadowColor: Colors.medium_gray,
                  shadowOpacity: 0.8,
                  elevation: 3,
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
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Client and Equipment Details
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Email Id</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).email : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Make</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).make : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Equipment </Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).equp : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Capacity</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).capacity : '-'}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Seal Details
                    </Text>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Seal Model</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).seal : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Shaft diameter (mm)</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).daimeter : '-'}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Process Details
                    </Text>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reaction Type</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).reacton : '-'}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Operating parameters
                    </Text>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Batch time (hours)</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).batchTime : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Process Temp (°C)</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).procTemp : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Process Min. Temp (°C)</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).procTempMin : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Process Max. Temp (°C)</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).procTempMax : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Pressure/ vacuum</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).pressure : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Rpm</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).rpm : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Rpm Min</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).rpmMin : '-'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Rpm Max</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).rpmMax : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Motor Current</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).motor : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Motor Min</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).motorMin : '-'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Motor Max</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.history && this.state.history.extra && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].extra).motorMax : '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>


              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: "column",
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: { width: 0, height: 5 },
                  shadowColor: Colors.medium_gray,
                  shadowOpacity: 0.8,
                  elevation: 3,
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
                      paddingBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}
                    >
                      Interseal Details
                    </Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      {!this.state.history && !this.state.history[this.state.history.length - 1] ? null : (
                        <>
                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, color: Colors.black, width: 45, textAlign: 'center' }}>{"So No."}</Text>
                            <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, color: Colors.black, width: 100, textAlign: 'center' }}>{"Interseal Serial Number"}</Text>
                            <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, color: Colors.black, width: 60, textAlign: 'center' }}>{"Location"}</Text>
                            <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, color: Colors.black, width: 60, textAlign: 'center' }}>{"Plant"}</Text>
                            <Text style={{ padding: 5, borderWidth: 1, borderColor: Colors.light_gray, fontSize: 9, color: Colors.black, width: 110, textAlign: 'center' }}>{"Additional Remark"}</Text>
                          </View>
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            data={this.state.history && this.state.history[this.state.history.length - 1] ? JSON.parse(this.state.history[this.state.history.length - 1].seal_details) : []}
                            renderItem={this.renderSeal}
                            keyExtractor={(item, index) => index.toString()}
                          />
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                {this.state.loading ? null : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.history}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="date"
        //  datePickerModeAndroid = 'spinner'
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
    //  margin: 10,
    backgroundColor: "#f1f1f1",
  },
  btn: {
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    width: width,
    alignItems: "center",
    justifyContent: "center",
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
  },
  RightAbsoluteButton: {
    overflow: "hidden",
    width: 120,
    height: 60,
    position: "absolute",
    bottom: -3,
    alignSelf: "center",
    right: -45,
    borderTopLeftRadius: 120,
    borderBottomRightRadius: 120,
    backgroundColor: Colors.primary,
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
    height: 30,
    width: 30,
  },
  rowItem: { flex: 1, flexDirection: "row", paddingVertical: 2 },
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
  textInputView: {
    flexDirection: "column",
  },
});