import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
var width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import { Dropdown } from "react-native-material-dropdown";
import Geolocation from "@react-native-community/geolocation";
import moment from "moment";
import { StackActions, NavigationActions } from "react-navigation";
import API from "../../common/API";
import HorizontalButton from "../../components/HorizontalButton";
import timeout from "../../common/Timeout";
import Loader from "../../common/Loader";
import AsyncStorage from "@react-native-community/async-storage";
import * as NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-simple-toast";
import Colors from "../../common/Colors";
import Fonts from "../../common/Fonts";
import BackHeader from "../../components/BackHeader";
import DateTimePicker from "react-native-modal-datetime-picker";
import LabelTextInput from "../../components/LabelTextInput";
import CustomButton2 from "../../components/CustomButton2";
import CustomButton from "../../components/CustomButton";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import ImagePicker from "react-native-image-crop-picker";
import UserModal from "../../common/UserModal";
import Con from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from "react-native-permissions";
var userMap = [];
var drawingurl = "";
let data1 = [
  { value: "Pending" },
  { value: "Complete" },
  { value: "Continue" },
  { value: "Customer Hold" },
  { value: "Awaiting Parts" },
  { value: "Awaiting Manufacturing" },
];
var fieldwork = [{ value: "Yes" }, { value: "No" }];
var drawingHelpid = "";
const radioItems = [
  {
    label: "Offline",
    size: 20,
    color: Colors.primary,
    selected: true,
    value: "2",
  },
  {
    label: "Online",
    color: Colors.primary,
    size: 20,
    selected: false,
    value: "1",
  },
];
var ImageFlatlist = [];
var TakeImage = [];
var docList = [];

var startdate = moment(new Date(), "YYYY-MM-DD")
  .add(1, "days")
  .format();
var todayDate = moment(startdate).format("DD");
var todayMonth = moment(startdate).format("MM");
var todayYear = moment(startdate).format("YYYY");
var LocalStore = [];
var SelectManager = [];
export default class EmpPending extends Component {
  constructor(props) {
    drawingurl = "";
    LocalStore = [];

    super(props);
    this.state = {
      isLoading: true,
      loading: true,
      WorkStatus: "",
      vendors: "Select Vendor",
      service: "Select Manager",
      fieldwork: "",
      refresh: false,
      dataMass: false,
      docName: "Choose file",
      dataSource: {},
      modalVisible: false,
      isDateTimePickerVisible: false,
      date: new Date(todayYear, todayMonth - 1, todayDate),
      visible: false,
      visible1: false,
      selectedItem: "",
      PrimaryUser: "",
      sort_direction: "DESC",
      userlist: [],
      vendorlist: [],
      SelectManager: [],
      remarks: "",
      vendorHelp: "",
      serviceHelp: "",
      drawingHelp: "",
      ManagerId: "",
      drawing: "Select Drawing",
      Venderid: "",
      drawinglist: [],
      drawingvalue: "",
      lineno: [],
      drawingid: "0",
      isValide: false,
      isNextDay: true,
      isSTARTWORK: true,
      isNext: false,
      modalVisible1: false,
      modalVisible2: false,
      reportModal:false,
      captureModal:false,
      DrawingModal: false,
      tId: "",
      capacity: '',
      arrayAdd: [
        {
          btn: "Add",
          LineNo: "Line No",
        },
      ],
      LineData: [
        {
          btn: "Add",
          LineNo: "Line No",
          label: "Add New..",
        },
      ],
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("type_id").then((typeId) => {
      this.setState({ tId: typeId });
    });
    setTimeout(() => {
      AsyncStorage.setItem("removeDigi", "0");
    }, 800);
    AsyncStorage.getItem("signature").then((signature) => {
      if (signature) {
      } else {
        setTimeout(() => {
          AsyncStorage.getItem("type_id").then((typeId) => {
            if (typeId != "4") {
              this.setState({ modalVisible1: true });
            }
          });
        }, 3000);
      }
    });

    AsyncStorage.getItem("Local").then((Local) => {
      LocalStore.push(JSON.parse(Local));
      this.setState({ refresh: !this.state.refresh });
      Local
        ? this.setState({
            lineno: LocalStore[0].ln,
            WorkStatus: LocalStore[0].status,
            fieldwork: LocalStore[0].fieldwork,
            vendorHelp: LocalStore[0].vendorHelp,
            //vendor yes then select vendor
            vendors: LocalStore[0].vendors,
            serviceHelp: LocalStore[0].serviceHelp,
            service: LocalStore[0].service,
            drawingHelp: LocalStore[0].drawingHelp,

            drawingid: LocalStore[0].did,
            drawing: LocalStore[0].drawingtype,
            LineData: JSON.parse(Local).LineData,
            venderid: LocalStore[0].droid,
            ManagerId: LocalStore[0].manid,
          })
        : "null";
    });
    userMap = [];
    this.PendingDetail();
    this.setState({ refresh: !this.state.refresh });
    radioItems.map((item) => {
      if (item.selected == true) {
        this.setState({ selectedItem: item.value });
      }
    });
  }

  fun = () => {
    this.setState({ refresh: !this.state.refresh });
    for (var i = 0; i < this.state.arrayAdd.length; i++) {
      var obj = {
        btn: "Delete",
      };
      this.state.LineData.push(obj);
      this.setState({ refresh: !this.state.refresh });
    }
  };

  remuve = (index) => {
    this.state.lineno.splice(index, 1);
    this.state.LineData.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };

  getPermissions = () => {
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
  };

  Permissions = () => {
    const cameraStatus = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });
    check(cameraStatus)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Toast.show(
              "This feature is not available (on this device / in this context)",
              Toast.SHORT
            );
            break;
          case RESULTS.DENIED:
            Toast.show(
              "The permission has not been requested / is denied but requestable",
              Toast.SHORT
            );
            this.getPermissions();
            break;
          case RESULTS.GRANTED:
            this.setState({ modalVisible: false, modalVisible2: false });
            this.SetCameraModalVisible(true);
            break;
          case RESULTS.BLOCKED:
            this.setState({ modalVisible: false, modalVisible2: false });
            setTimeout(() => {
              Toast.show(
                "The permission is Blocked and not requestable anymore",
                Toast.SHORT
              );
            }, 100);
            setTimeout(() => {
              openSettings().catch(() => console.warn("cannot open settings"));
            }, 2000);
            break;
        }
      })
      .catch((error) => {
        console.log("errror", error);
      });
  };

  isNext = () => {
    // var isValid = true;

    // var toaster = "";

    this.setState({ isValide: true });

    // if (this.state.lineno == '') {
    //   toaster = "Please enter Line No";
    //   isValid = false;
    // }

    // else if (this.state.Callfieldwork == '') {
    //   isValid = false;
    //   toaster = 'Please Select Field Work';
    // }

    // else if (this.state.vendorHelp == '') {
    //   isValid = false;
    //   toaster = 'Please Select Vendor Help';
    // }
    // else if (this.state.serviceHelp == '') {
    //   isValid = false;
    //   toaster = "Please Select Service Help"
    // }
    // else if (this.state.drawingHelp == '') {
    //   isValid = false;
    //   toaster = "Please Select Drawing"
    // } else {
    //   if (this.state.vendorHelp == 'Yes' && this.state.vendors == 'Select Vendor') {
    //     isValid = false;
    //     toaster = "Please Select Vendor"
    //   }
    //   else if (this.state.serviceHelp == 'Yes' && this.state.service == 'Select Manager') {
    //     isValid = false;
    //     toaster = "Please Select Manager"
    //   }
    //   else if (this.state.drawingHelp == 'Yes' && this.state.drawing == 'Select Drawing') {
    //     isValid = false;
    //     toaster = "Please Select Drowing Type"
    //   }

    // if (isValid) {
    var FieldID = "";
    var vendorHelpid = "";
    var serviceHelpid = "";

    if (this.state.fieldwork == "Yes") {
      FieldID = 1;
    } else {
      FieldID = 0;
    }
    if (this.state.vendorHelp == "Yes") {
      vendorHelpid = 1;
    } else {
      vendorHelpid = 0;
    }
    if (this.state.serviceHelp == "Yes") {
      serviceHelpid = 1;
    } else {
      serviceHelpid = 0;
    }

    var Request = {
      status: this.state.WorkStatus,
      call_id: this.props.navigation.state.params.item,
      so_no: this.state.dataSource.so_no,
      call_no: this.state.dataSource.call_no,
      ln: this.state.lineno,
      fieldid: FieldID,
      venderid: vendorHelpid,
      //vendor yes then select vendor
      vendoruser: this.state.venderid,
      serviceid: serviceHelpid,
      managerid: this.state.ManagerId,
      // drawingid: drawingHelpid,
      // drawingtype: this.state.drawingid
    };
    var Request2 = {
      status: this.state.WorkStatus,
      LineData: this.state.LineData,
      ln: this.state.lineno ? this.state.lineno : "",
      fieldwork: this.state.fieldwork,
      vendorHelp: this.state.vendorHelp,
      //vendor yes then select vendor
      vendors: this.state.vendors,
      serviceHelp: this.state.serviceHelp,
      service: this.state.service,
      manid: this.state.ManagerId,
      droid: this.state.venderid,
      // drawingHelp: this.state.drawingHelp,
      // drawingtype: this.state.drawing,
      did: this.state.drawingid,
      drawingurl: drawingurl,
    };

    AsyncStorage.setItem("one", JSON.stringify(Request));
    AsyncStorage.setItem("Local", JSON.stringify(Request2));
    console.log("fgvfv", Request);

    this.setState({ loading: false, submit: false });

    if (this.state.dataSource.call_type == 1) {
      this.props.navigation.navigate("CompleteWorkDetail");
    } else {
      this.props.navigation.navigate("EmpOffline");
    }

    // else {

    //   Toast.show(toaster, Toast.SHORT, );
    //   console.log('else call');
    // }
  };

  componentWillUnmount() {
    AsyncStorage.setItem("removeDigi", "0");
    ImageFlatlist=[];
  }

  PendingDetail = () => {
    console.log("scren will call ");

    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          AsyncStorage.getItem("pagelimit").then((pagelimit) => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: this.props.navigation.state.params.item,
              details: "Details",
            };
            console.log(API.call_get_details);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.call_get_details, {
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
                        res.json().then((res) => {
                          console.log("call_get_details :::  ", res);
                          if (res.status == "success") {
                            console.log(res.data.status, "jj");
                            if (res.data.status == 1) {
                              Toast.show("Call not found", Toast.SHORT);
                              this.props.navigation.goBack();
                            } else {
                              this.setState(
                                {
                                  loading: false,
                                  loading1: false,
                                  dataSource: res.data,
                                  capacity: res?.data?.capacity ?? '',
                                  userlist: res.users,
                                  vendorlist: res.vendor,
                                  drawinglist: res.drawing,
                                },
                                () => {
                                  (userMap = []), (SelectManager = []);
                                  var issecondery = this.state.dataSource
                                    .call_more_user;
                                  // var issecondery    =
                                  var isPrimary = this.state.dataSource
                                    .call_primary_user;

                                  AsyncStorage.setItem(
                                    "calltype",
                                    JSON.stringify(
                                      this.state.dataSource.call_type
                                    )
                                  );
                                  this.setState({ primaryUserID: isPrimary });
                                  for (
                                    var i = 0;
                                    i < this.state.userlist.length;
                                    i++
                                  ) {
                                    if (this.state.userlist[i].type_id == "2") {
                                      var obj = {
                                        name: this.state.userlist[i].name,
                                        id: this.state.userlist[i].id,
                                      };
                                      SelectManager.push(obj);
                                    }
                                    if (
                                      isPrimary == this.state.userlist[i].id
                                    ) {
                                      this.setState({
                                        PrimaryUser: this.state.userlist[i]
                                          .name,
                                      });
                                      this.setState({
                                        refresh: !this.state.refresh,
                                      });
                                    }
                                    // issecondery.split(",")
                                    // console.log('just fingd',issecondery.split(","));

                                    for (
                                      var j = 0;
                                      j < issecondery.length;
                                      j++
                                    ) {
                                      // console.log('issecondery',issecondery+' '+this.state.userlist[i].id);
                                      if (
                                        issecondery.split(",")[j] ==
                                        this.state.userlist[i].id
                                      ) {
                                        // console.log('yes',issecondery[j]);

                                        userMap.push(
                                          this.state.userlist[i].name
                                        );
                                        this.setState({
                                          refresh: !this.state.refresh,
                                        });
                                        console.log("userMap", userMap);
                                      }
                                    }
                                  }
                                }
                              );
                            }
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

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({
      date: date,
    });
    this._hideDateTimePicker();
  };

  _checkTitle() {
    const { date } = this.state;
    if (date > moment()) {
      return moment(date).format("DD/MM/YYYY");
    }
    return moment(date, "YYYY/MM/DD").format("DD/MM/YYYY");
  }

  setModalVisible(visible) {
    AsyncStorage.getItem("type_id").then((typeId) => {
      if (typeId != "4") {
        this.setState({ modalVisible1: visible });
      }
    });
  }
  setDrawingModal(visible) {
    this.setState({ DrawingModal: visible });
  }
  changeActiveRadioButton(index) {
    radioItems.map((item) => {
      item.selected = false;
    });
    radioItems[index].selected = true;
    this.setState({ refresh: !this.state.refresh });
    this.setState({ radioItems: radioItems }, () => {
      this.setState({ selectedItem: radioItems[index].value });
      console.log(this.state.radioItems);
    });
  }
  onShowService = () => {
    this.setState({ visible1: true });
  };
  onSelectService = (id, name) => {
    console.log(id, name);
    this.setState({
      service: name,
      ManagerId: id,

      visible1: false,
    });
  };
  onCancelService = () => {
    this.setState({
      visible1: false,
    });
  };
  onShowVendor = () => {
    this.setState({ visible: true });
  };
  onSelectVendor = (id, name) => {
    console.log(id, name);
    this.setState({
      vendors: name,
      venderid: id,
      visible: false,
    });
  };
  onCancelVendor = () => {
    this.setState({
      visible: false,
    });
  };

  GetLatLon() {
    if (this.state.remarks == "") {
      Toast.show("Please enter Remarks", Toast.SHORT);
    } else {
      this.setState({ isNextDay: false, loading: true });
      console.log("proccided");
      Geolocation.getCurrentPosition(
        (position) => {
          const lastPosition = JSON.stringify(position);
          this.setState({ lastPosition });
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          this.Next(lat, long);
        },
        (error) => {
          this.setState({ loading: false, isNextDay: true });
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
                    this.setState({ loading: false, isNextDay: false }, () => {
                      setTimeout(() => {
                        AsyncStorage.setItem("removeDigi", "0");
                      }, 500);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, isNextDay: true });
                  });
              } else {
                this.setState({ loading: false, isNextDay: true });
                Toast.show("Please Turn on Your Location", Toast.SHORT);
              }
            } else {
              this.setState({ loading: false, isNextDay: true });
              Toast.show(error.message, Toast.SHORT);
            }
          }, 50);
          console.log(error);
        },
        { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
      );
    }
  }

  pickMultiple2() {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      waitAnimationEnd: false,
      includeExif: true,
      loading: true,
      forceJpg: true,
      maxFiles: 10,
      compressImageQuality: 0.5,
      mediaType: "photo",
    })
      .then((images) => {
        for (let i = 0; i < images.length; i++) {
          second.push(images[i].data);
        }
        console.log(second);
        this.setState({
          modalVisible2: false,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          modalVisible: false,
          loading: false,
        });
        setTimeout(() => {
          Toast.show(e.toString(), Toast.LONG);
        }, 100);
        setTimeout(() => {
          openSettings().catch(() => console.warn("cannot open settings"));
        }, 2000);
      });
  }

  isSTARTWORK = () => {
    if (this.state.drawingHelp == "") {
      Toast.show("Please Select Drawing", Toast.SHORT);
    } else if (
      this.state.drawingHelp == "Yes" &&
      this.state.drawing == "Select Drawing"
    ) {
      Toast.show("Please Select Drowing Type", Toast.SHORT);
    } 
    else if (!this.state.capacity) {
     Toast.show("Please enter capacity.");
   }
    else {
      if (this.state.drawingHelp == "Yes") {
        drawingHelpid = 1;
      } else {
        drawingHelpid = 0;
      }
      this.setState({ isSTARTWORK: false, loading: true });
      Geolocation.getCurrentPosition(
        (position) => {
          const lastPosition = JSON.stringify(position);
          this.setState({ lastPosition });
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          this.StartWork(lat, long);
        },
        (error) => {
          this.setState({ loading: false, isSTARTWORK: true });
          setTimeout(() => {
            if (error.message == "No location provider available.") {
              if (Platform.OS == "android") {
                AsyncStorage.setItem("removeDigi", "1");
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                  interval: 10000,
                  fastInterval: 5000,
                })
                  .then((data) => {
                    this.isSTARTWORK();
                    this.setState(
                      { loading: false, isSTARTWORK: false },
                      () => {
                        setTimeout(() => {
                          AsyncStorage.setItem("removeDigi", "0");
                        }, 500);
                      }
                    );
                    console.log(data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                this.setState({ loading: false, isSTARTWORK: true });
                Toast.show("Please Turn on Your Location", Toast.SHORT);
              }
            } else if (
              error.message == "User denied access to location services."
            ) {
              this.setState({ loading: false, isSTARTWORK: true });
              Toast.show(
                "Please Allow access to location services.",
                Toast.SHORT
              );
              setTimeout(() => {
                openSettings().catch(() =>
                  console.warn("cannot open settings")
                );
              }, 2000);
            } else {
              this.setState({ loading: false, isSTARTWORK: true });
              Toast.show(error.message, Toast.SHORT);
            }
          }, 50);
          console.log(error);
        },
        { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
      );
    }
  };

  Next = (lat, lon) => {
    this.setState({ loading: true });
    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          var Request = {
            token: token,
            id: id,
            branch_id: branch_id,
            call_date: moment(this.state.date).format("YYYY-MM-DD"),
            remarks: this.state.remarks,
            call_id: this.state.dataSource.id,
            lat: lat,
            lon: lon,
            workstatus: this.state.WorkStatus,
          };
          var data = new FormData();
            data.append("jsondata", JSON.stringify(Request));
            ImageFlatlist.map((file, index) => {
              data.append(`report${index}`, file);
            });
          console.log(API.e_call_next_date);
          console.log("dateTransfer",JSON.stringify(data));
          NetInfo.fetch().then((state) => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.e_call_next_date, {
                  method: "POST",
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  body: data,
                })
                  .then((res) => {
                    if (res.status == 200) {
                      console.log(res);
                      this.setState({
                        loading: false,
                        submit: true,
                        isNextDay: true,
                      });
                      res.json().then((res) => {
                        console.log("e_call_next_date :::  ", res);
                        if (res.status == "success") {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Home" }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                          AsyncStorage.removeItem("one");
                          AsyncStorage.removeItem("two");
                          AsyncStorage.removeItem("three");
                          AsyncStorage.removeItem("four");
                          AsyncStorage.removeItem("DateArray");
                          AsyncStorage.removeItem("Local");
                          AsyncStorage.removeItem("ischeckData");
                          AsyncStorage.removeItem("iscryLock");
                          AsyncStorage.removeItem("isradioItems");
                          AsyncStorage.removeItem("isGlassDataDetail");
                          AsyncStorage.removeItem("isGlassData");
                          AsyncStorage.removeItem("TakeImage");
                          AsyncStorage.removeItem("calltype");
                          AsyncStorage.setItem("removeDigi", "1");
                          this.setState({ loading: false, isNextDay: true });
                        } else if (res.status == "failed") {
                          this.setState({ loading: false, isNextDay: true });
                          AsyncStorage.removeItem("id");
                          AsyncStorage.removeItem("username");
                          AsyncStorage.removeItem("password");
                          this.setState({ loading: false, isNextDay: true });
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
                        } else {
                          this.setState({
                            loading: false,
                            isNextDay: false,
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
                      this.setState({
                        loading: false,
                        loading1: false,
                        isNextDay: false,
                      });
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT);
                      }, 50);
                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: "Login" }),
                        ],
                      });
                      this.props.navigation.dispatch(resetAction);
                      this.setState({ loading: false, isNextDay: true });
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
                        this.setState({ loading: false, isNextDay: true });
                        console.log(e);
                        Toast.show("Something went wrong...", Toast.SHORT);
                      }
                    });
                  })
              ).catch((e) => {
                console.log(e);
                this.setState({ loading: false, isNextDay: true });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT
                );
              });
            } else {
              this.setState({ loading: false, isNextDay: true });
              Toast.show("Please Check your internet connection", Toast.SHORT);
            }
          });
        });
      });
    });
  };

  StartWork = (lat, lon) => {
     if (!this.state.capacity) {
     Toast.show("Please enter capacity.");
   }
    else {
    this.setState({ loading: true, isSTARTWORK: false });
    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          var Request = {
            token: token,
            id: id,
            branch_id: branch_id,
            call_no: this.state.dataSource.call_no,
            call_id: this.state.dataSource.id,
            so_no: this.state.dataSource.so_no,
            call_type: this.state.selectedItem,
            lat: lat,
            lon: lon,
            drawingid: drawingHelpid,
            drawingtype: this.state.drawingid,
            capacity:this.state.capacity
          };
          console.log(API.e_call_start_work);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then((state) => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.e_call_start_work, {
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
                      // this.setState({ loading: false, submit: true });
                      res.json().then((res) => {
                        console.log("e_call_start_work :::  ", res);
                        if (res.status == "success") {
                          AsyncStorage.setItem(
                            "calltype",
                            JSON.stringify(this.state.dataSource.call_type)
                          );
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Home" }),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                          AsyncStorage.setItem("removeDigi", "1");
                          this.setState({ loading: false, isSTARTWORK: true });
                        } else if (res.status == "failed") {
                          AsyncStorage.removeItem("id");
                          AsyncStorage.removeItem("username");
                          AsyncStorage.removeItem("password");
                          this.setState({ loading: false, isSTARTWORK: true });
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
                        } else {
                          this.setState({
                            loading: false,
                            isSTARTWORK: true,
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
                      this.setState({
                        loading: false,
                        loading1: false,
                        isSTARTWORK: true,
                      });
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
                        this.setState({ loading: false, isSTARTWORK: true });
                        console.log(e);
                        Toast.show("Something went wrong...", Toast.SHORT);
                      }
                    });
                  })
              ).catch((e) => {
                console.log(e);
                this.setState({ loading: false, isSTARTWORK: true });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT
                );
              });
            } else {
              this.setState({ loading: false, isSTARTWORK: true });
              Toast.show("Please Check your internet connection", Toast.SHORT);
            }
          });
        });
      });
    });
  }
  };

  DrawingRequist = () => {
    if (this.state.drawingid == "0") {
      Toast.show("Please Select Drawing Type", Toast.SHORT);
      this.setState({ DrawingModal: true });
    } else {
      this.setState({ loading: true, DrawingModal: false });
      AsyncStorage.getItem("id").then((id) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("branch_id").then((branch_id) => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              so_no: this.state.dataSource.so_no,
              call_no: this.state.dataSource.call_no,
              call_id: this.state.dataSource.id,
              drawingtype: this.state.drawingid,
            };
            console.log(API.drawing_request_popup);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.drawing_request_popup, {
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
                        // this.setState({ loading: false, submit: true });
                        res.json().then((res) => {
                          console.log("API.drawing_request_popup", res);
                          if (res.status == "success") {
                            userMap = [];
                            this.PendingDetail();
                            drawingurl = "";
                            setTimeout(() => {
                              Toast.show(res.message, Toast.SHORT);
                            }, 50);
                            this.setState({
                              dataSource: [],
                              userlist: [],
                              vendorlist: [],
                              drawinglist: [],
                              loading: false,
                            });
                          } else if (res.status == "failed") {
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
                          } else {
                            this.setState({ loading: false });
                            setTimeout(() => {
                              Toast.show(res.message, Toast.SHORT);
                            }, 50);
                          }
                        });
                      } else {
                        AsyncStorage.removeItem("id");
                        AsyncStorage.removeItem("username");
                        AsyncStorage.removeItem("password");
                        this.setState({ loading: false });

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
    }
  };

  upload = async (string) => {
    AsyncStorage.setItem("removeDigi", "1");
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log("====================1================");
      console.log(res);
      console.log("=====================1===============");
      this.setState(
        {
          reportModal: false,
          captureModal: false,
          loading: true,
        },
        () => {
          for (let i = 0; i < res.length; i++) {
            RNFetchBlob.fs
              .stat(res[i].uri)
              .then((value) => {
                console.log("====================2================");
                console.log(value);
                console.log("=====================2===============");
                if (value.size > 20000000) {
                  this.setState({ loading: false });
                  Toast.show(
                    "Large file can not upload",
                    Toast.SHORT,
                    Toast.BOTTOM
                  );
                } else {
                  var object = {
                    uri: "file://" + value.path,
                    name: "file://" + value.path,
                    type: res[i].type ? res[i].type : value.type,
                    visible: true,
                  };
                  if (string == 1) {
                    TakeImage.push(object);
                  } else if (string == 2) {
                    ImageFlatlist.push(object);
                  } else {
                    docList.push(object);
                  }
                  this.setState({ loading: false });
                }
                setTimeout(() => {
                  AsyncStorage.setItem("removeDigi", "0");
                }, 500);
              })
              .catch((e) => {
                if (res[i].size > 20000000) {
                  this.setState({ loading: false });
                  Toast.show(
                    "Large file can not upload",
                    Toast.SHORT,
                    Toast.BOTTOM
                  );
                } else {
                  var object = {
                    uri: res[i].uri,
                    name: res[i].uri,
                    type: res[i].type ? res[i].type : "file",
                    visible: true,
                  };
                  if (string == 1) {
                    TakeImage.push(object);
                  } else if (string == 2) {
                    ImageFlatlist.push(object);
                  } else {
                    docList.push(object);
                  }
                  this.setState({ loading: false });
                }
                setTimeout(() => {
                  AsyncStorage.setItem("removeDigi", "0");
                }, 500);
              });
          }
        }
      );
    } catch (err) {
      console.log("err0", err);
      if (DocumentPicker.isCancel(err)) {
        this.setState({
          captureModal: false,
          reportModal: false,
          loading: false,
        });
      } else {
        setTimeout(() => {
          Toast.show(JSON.stringify(err), Toast.SHORT, Toast.BOTTOM);
        }, 50);
        this.setState({
          captureModal: false,
          reportModal: false,
          loading: false,
        });
      }
      setTimeout(() => {
        AsyncStorage.setItem("removeDigi", "0");
      }, 500);
    }
  };
  setModalVisible2(visible) {
    this.setState({ modalVisible2: visible, modal: false });
  }
  setreportModalVisible(visibles) {
    this.setState({ reportModal: visibles, modal: false });
  }
  setcaptureModalVisible(cvisible) {
    this.setState({ captureModal: cvisible,reportModal:false, modal: false });
  }
  isRemuveReport = (index) => {
    ImageFlatlist.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };
  captureRemove = (index) => {
    TakeImage.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };

  Getid = (value) => {
    console.log(value);
    this.setState({ drawing: value });
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
        <Loader loading={this.state.loading} />
        <BackHeader
          backIcon={require("../../images/Left_arrow.png")}
          pageTitle="Call Details"
          back={() => {
            this.props.navigation.state.params.Navigate == "Home"
              ? this.props.navigation.navigate("Home")
              : this.props.navigation.goBack();
            this.props.navigation.state.params.Navigate == "Home"
              ? AsyncStorage.setItem("removeDigi", "1")
              : null;
          }}
        />
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
                      <Text style={styles.label}>SO No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_no}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Sales Order Line No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_line_no?this.state.dataSource.so_line_no:"-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Interseal Serial No.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.serial_no
                            ? this.state.dataSource.serial_no
                            : "-"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Status.</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.status == 1
                            ? "Running"
                            : "Pending"}
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
                      <Text style={styles.label}>Caller Name</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.caller_name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Origin</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.call_origin}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, { paddingTop: 10 }]}>
                      <Text style={styles.label}>BP Code</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.bo_code}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Company</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.cmp_name}
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
                          {this.state.dataSource.group2}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Type</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.a_calltype}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Problem</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.reported_problem}
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
                          {this.state.dataSource.assignname}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Assigned Time</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {moment(this.state.dataSource.assign_date).format(
                            "DD/MM/YYYY hh:mm a"
                          )}
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

              {this.props.navigation.state.params.sub_status == 1 ? (
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
                        {this.state.dataSource.call_type == 1
                          ? "Call Type: Online"
                          : "Call Type: Offline"}
                      </Text>

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
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: "column",
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    paddingBottom: 10,
                    borderTopLeftRadius: 5,
                    alignSelf: "center",
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
                        Call Type
                      </Text>

                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            paddingVertical: 20,
                          }}
                          refresh={this.state.refresh}
                        >
                          {radioItems.map((item, key) => (
                            <RadioButton
                              key={key}
                              button={item}
                              onClick={this.changeActiveRadioButton.bind(
                                this,
                                key
                              )}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.textInputView,
                      {
                        flexDirection: "row",
                        alignSelf: "center",
                        // marginBottom: 20,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: "column" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labela}>Drawing Required?</Text>

                        <Text style={styles.required}>*</Text>
                      </View>

                      <View
                        style={{
                          paddingHorizontal: 10,
                          height: 42,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: Colors.white,
                          borderWidth: 1,
                          borderRadius: 4,

                          borderColor: Colors.medium_gray,
                        }}
                      >
                        <View>
                          <Dropdown
                            disabled={this.state.tId == "4" ? true : false}
                            containerStyle={{
                              width:
                                this.state.drawingHelp == "Yes"
                                  ? width * 0.35
                                  : width * 0.8,
                              alignSelf: "flex-start",
                              paddingBottom: 15,
                            }}
                            inputContainerStyle={{ borderBottomColor: "white" }}
                            fontSize={15}
                            itemTextStyle={{
                              fontFamily: Fonts.regular,
                              color: Colors.primary,
                            }}
                            itemColor={Colors.black}
                            fontFamily={Fonts.regular}
                            selectedItemColor={Colors.black}
                            textColor={
                              this.state.drawingHelp
                                ? Colors.black
                                : Colors.dark_gray
                            }
                            value={
                              this.state.drawingHelp
                                ? this.state.drawingHelp
                                : "Drawing Required?"
                            }
                            onChangeText={(value) => {
                              this.setState({ drawingHelp: value });
                            }}
                            data={fieldwork}
                          />
                        </View>
                      </View>
                    </View>

                    {this.state.drawingHelp == "Yes" ? (
                      <View style={{ flexDirection: "column", marginLeft: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.labela}>Drawing Type</Text>
                          <Text style={styles.required}>*</Text>
                        </View>

                        <View
                          style={{
                            paddingHorizontal: 5,
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
                                width:
                                  this.state.drawingHelp == "Yes"
                                    ? width * 0.38
                                    : width * 0.8,
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
                                this.state.drawing != "Select Drawing"
                                  ? Colors.black
                                  : Colors.dark_gray
                              }
                              value={
                                this.state.drawing
                                  ? this.state.drawing
                                  : "Select Drawing"
                              }
                              onChangeText={(value) => {
                                drawingurl = "";
                                this.setState({
                                  drawing: value,
                                  refresh: !this.state.refresh,
                                });
                                for (
                                  let i = 0;
                                  i < this.state.drawinglist.length;
                                  i++
                                ) {
                                  if (
                                    this.state.drawinglist[i].value ==
                                    this.state.drawing
                                  ) {
                                    drawingurl = this.state.drawinglist[i].url;

                                    this.setState({
                                      drawingid: this.state.drawinglist[i].id,
                                    });
                                  }
                                }
                              }}
                              data={this.state.drawinglist}
                            />
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {drawingurl ? (
                    <View>
                      <TouchableOpacity
                        style={styles.Dbtn}
                        onPress={() => {
                          AsyncStorage.setItem("removeDigi", "1"),
                            Linking.openURL(drawingurl);
                        }}
                      >
                        <ImageBackground
                          resizeMode="contain"
                          style={{
                            height: 25,
                            width: 25,
                            marginRight: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          source={require("../../images/fill.png")}
                        >
                          <Image
                            style={{
                              height: 18,
                              width: 18,
                              tintColor: Colors.primary,
                            }}
                            source={require("../../images/eye.png")}
                          />
                        </ImageBackground>
                        <View>
                          <Text
                            allowFontScaling={false}
                            style={{
                              fontSize: 18,
                              color: Colors.white,

                              fontFamily: Fonts.medium,
                              textAlign: "center",
                            }}
                          >
                            View Drawing
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                    <View
                        style={{
                          paddingHorizontal: 20,
                          marginBottom:10
                        }}>

                        <LabelTextInput
                          required={true}
                          label={"Capacity"}
                          placeholder="Enter Capacity"
                          returnKeyType="next"
                          value={this.state.capacity}
                          onChangeText={(capacity) =>
                            this.setState({ capacity })
                          }
                        />
                        </View>

                </View>
              )}
              {this.props.navigation.state.params.sub_status == 1 ? (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: "column",
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    paddingBottom: 10,
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
                        Work Status
                      </Text>

                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>Status</Text>

                            <Text style={styles.required}>*</Text>
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
                                disabled={this.state.tId != "4" ? false : true}
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
                                  this.state.WorkStatus
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.WorkStatus
                                    ? this.state.WorkStatus
                                    : "Select Status"
                                }
                                onChangeText={(value) => {
                                  this.setState({ WorkStatus: value });
                                }}
                                data={data1}
                              />
                            </View>
                          </View>
                          
                                              <View
                        style={{
                          // paddingHorizontal: 20,
                          marginBottom:10
                        }}>

                        <LabelTextInput
                          required={true}
                          label={"Capacity"}
                          placeholder="Enter Capacity"
                          returnKeyType="next"
                          value={this.state.capacity}
                          onChangeText={(capacity) =>
                            this.setState({ capacity })
                          }
                        />
                        </View>


                        </View>
                        
                        {this.state.WorkStatus == "Continue" ||
                        this.state.WorkStatus == "" ||
                        this.state.WorkStatus == "Customer Hold" ||
                        this.state.WorkStatus == "Awaiting Parts" ||
                        this.state.WorkStatus ==
                          "Awaiting Manufacturing" ? null : (
                          <View>
                            <View style={{ flex: 1 }}>
                              <FlatList
                                data={this.state.LineData}
                                extraData={this.state.refresh}
                                renderItem={({ item, index }) => (
                                  <ScrollView
                                    // horizontal
                                    showsHorizontalScrollIndicator={false}
                                  >
                                    <View style={{ paddingVertical: 3 }}>
                                      {item.LineNo ? (
                                        <Text style={styles.labela}>
                                          {item.LineNo}
                                        </Text>
                                      ) : null}
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          width: "100%",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TextInput
                                          style={styles.input}
                                          required={true}
                                          placeholder="Enter Line No"
                                          returnKeyType="next"
                                          keyboardType="name-phone-pad"
                                          onChangeText={(text) => {
                                            //{value => this.setState({ search:value.replace(/\s/g, '') })}
                                            let { lineno } = this.state;
                                            lineno[index] = text.replace(
                                              /[^A-Za-z0-9]/g,
                                              ""
                                            );
                                            this.setState({ lineno });
                                          }}
                                          value={this.state.lineno[index]}
                                        />

                                        {item.btn == "Delete" ? (
                                          <TouchableOpacity
                                            onPress={() => this.remuve(index)}
                                            style={{
                                              marginTop: 0,
                                              marginRight: 6,
                                            }}
                                          >
                                            <View>
                                              <Image
                                                source={require("../../images/remove.png")}
                                                style={{
                                                  height: 30,
                                                  width: 30,
                                                }}
                                              />
                                            </View>
                                          </TouchableOpacity>
                                        ) : (
                                          <View>
                                            {item.btn == "Add" ? (
                                              <TouchableOpacity
                                                onPress={() => this.fun()}
                                                style={{ marginTop: 0 }}
                                              >
                                                <ImageBackground
                                                  source={require("../../images/primaryfill.png")}
                                                  style={{
                                                    height: 40,
                                                    width: 40,
                                                    marginLeft: 0,
                                                    marginTop: 0,

                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <View>
                                                    <Image
                                                      source={require("../../images/add.png")}
                                                      style={{
                                                        height: 15,
                                                        width: 15,
                                                        tintColor: Colors.white,
                                                      }}
                                                    />
                                                  </View>
                                                </ImageBackground>
                                              </TouchableOpacity>
                                            ) : null}
                                          </View>
                                        )}
                                      </View>

                                      <View
                                        style={{
                                          marginTop: 10,
                                          borderBottomWidth: 0.8,
                                          width: "100%",
                                          borderBottomColor: Colors.light_gray,
                                        }}
                                      />
                                    </View>
                                  </ScrollView>
                                )}
                              />
                            </View>

                            <View style={styles.textInputView}>
                              <View style={{ flexDirection: "row" }}>
                                <Text style={styles.labela}>
                                  Field work required or not?{" "}
                                </Text>

                                {/* <Text style={styles.required}>*</Text> */}
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
                                      this.state.fieldwork
                                        ? Colors.black
                                        : Colors.dark_gray
                                    }
                                    value={
                                      this.state.fieldwork
                                        ? this.state.fieldwork
                                        : "Field work Required?"
                                    }
                                    onChangeText={(value) => {
                                      if (value == "Yes") {
                                        this.setState({ fieldwork: value });
                                      } else {
                                        this.setState({ fieldwork: value });
                                      }
                                    }}
                                    data={fieldwork}
                                  />
                                </View>
                              </View>
                            </View>

                            <View
                              style={[
                                styles.textInputView,
                                { flexDirection: "row" },
                              ]}
                            >
                              <View style={{ flexDirection: "column" }}>
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={styles.labela}>
                                    Vendor help required?
                                  </Text>

                                  {/* <Text style={styles.required}>*</Text> */}
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
                                        width:
                                          this.state.vendorHelp == "Yes"
                                            ? width * 0.35
                                            : width * 0.8,
                                        alignSelf: "flex-start",
                                        paddingBottom: 15,
                                      }}
                                      fontSize={15}
                                      textColor={
                                        this.state.vendorHelp
                                          ? Colors.black
                                          : Colors.dark_gray
                                      }
                                      inputContainerStyle={{
                                        borderBottomColor: "white",
                                      }}
                                      data={fieldwork}
                                      itemTextStyle={{
                                        fontFamily: Fonts.regular,
                                        color: Colors.primary,
                                      }}
                                      itemColor={Colors.black}
                                      fontFamily={Fonts.regular}
                                      selectedItemColor={Colors.black}
                                      value={
                                        this.state.vendorHelp
                                          ? this.state.vendorHelp
                                          : "Vendor Required?"
                                      }
                                      onChangeText={(value) => {
                                        if (value == "No") {
                                          this.setState({
                                            vendorHelp: value,
                                            vendors: "Select Vendor",
                                          });
                                        } else {
                                          this.setState({ vendorHelp: value });
                                        }
                                      }}
                                    />
                                  </View>
                                </View>
                              </View>
                              {this.state.vendorHelp == "Yes" ? (
                                <View
                                  style={{
                                    flexDirection: "column",
                                    marginLeft: 10,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.labela}>Vendors</Text>
                                    <Text style={styles.required}>*</Text>
                                  </View>

                                  <TouchableOpacity
                                    style={{
                                      paddingHorizontal: 10,
                                      height: 42,
                                      justifyContent: "center",
                                      alignItems: "flex-start",
                                      backgroundColor: Colors.white,
                                      borderWidth: 1,
                                      width: width * 0.4,
                                      borderRadius: 4,

                                      borderColor: Colors.medium_gray,
                                    }}
                                    onPress={() => {
                                      this.onShowVendor();
                                    }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          color:
                                            this.state.vendors !=
                                            "Select Vendor"
                                              ? Colors.black
                                              : Colors.dark_gray,
                                          fontFamily: Fonts.regular,
                                        }}
                                      >
                                        {this.state.vendors}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              ) : null}
                            </View>
                            <View
                              style={[
                                styles.textInputView,
                                { flex: 1, flexDirection: "row" },
                              ]}
                            >
                              <View
                                style={{ flex: 1, flexDirection: "column" }}
                              >
                                <View
                                  style={{ flexDirection: "row", width: "80%" }}
                                >
                                  <Text style={styles.labela}>
                                    Service manager Required?
                                  </Text>

                                  {/* <Text style={styles.required}>*</Text> */}
                                </View>
                                {/* {this.state.fieldwork == "No" ?

                                  <View
                                    style={{
                                      paddingHorizontal: 10,
                                      height: 42,
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      backgroundColor: Colors.white,
                                      borderWidth: 1,

                                      borderRadius: 4,

                                      borderColor: Colors.medium_gray,
                                    }}>
                                    <View style={{
                                      width: this.state.serviceHelp == "Yes" ? width * 0.35 : width * 0.8,


                                    }}>
                                      <Text style={{ fontSize: 15, color: Colors.black, alignItems: 'center', fontFamily: Fonts.regular }}>
                                        {this.state.serviceHelp}
                                      </Text>

                                    </View>
                                  </View>
                                  : */}
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
                                        width:
                                          this.state.serviceHelp == "Yes"
                                            ? width * 0.35
                                            : width * 0.8,
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
                                        this.state.serviceHelp
                                          ? Colors.black
                                          : Colors.dark_gray
                                      }
                                      value={
                                        this.state.serviceHelp
                                          ? this.state.serviceHelp
                                          : "Service Required?"
                                      }
                                      onChangeText={(value) => {
                                        if (value == "No") {
                                          this.setState({
                                            serviceHelp: value,
                                            service: "Select Manager",
                                          });
                                        } else {
                                          this.setState({ serviceHelp: value });
                                        }
                                      }}
                                      data={fieldwork}
                                    />
                                  </View>
                                </View>
                                {/* } */}
                              </View>
                              {this.state.serviceHelp == "Yes" ? (
                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    marginLeft: 10,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <Text style={styles.labela}>
                                      Service Manager
                                    </Text>
                                    <Text style={styles.required}>*</Text>
                                  </View>
                                  <TouchableOpacity
                                    style={{
                                      marginTop: 17,
                                      paddingHorizontal: 10,
                                      height: 42,
                                      justifyContent: "center",
                                      alignItems: "flex-start",
                                      backgroundColor: Colors.white,
                                      borderWidth: 1,
                                      width: width * 0.4,
                                      borderRadius: 4,
                                      borderColor: Colors.medium_gray,
                                    }}
                                    onPress={() => {
                                      this.onShowService();
                                    }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          color:
                                            this.state.service !=
                                            "Select Manager"
                                              ? Colors.black
                                              : Colors.dark_gray,
                                          fontFamily: Fonts.regular,
                                        }}
                                      >
                                        {this.state.service}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              ) : null}
                            </View>
                            {/* 

                            <View style={[styles.textInputView, { flexDirection: 'row' }]}>
                              <View style={{ flexDirection: 'column', }}>
                                <View style={{ flexDirection: 'row', }}>
                                  <Text style={styles.labela}>Drawing Required?</Text>

                                  <Text style={styles.required}>*</Text>
                                </View>

                                <View
                                  style={{
                                    paddingHorizontal: 10,
                                    height: 42,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    backgroundColor: Colors.white,
                                    borderWidth: 1,

                                    borderRadius: 4,

                                    borderColor: Colors.medium_gray,
                                  }}>
                                  <View>
                                    <Dropdown
                                      containerStyle={{
                                        width: this.state.drawingHelp == "Yes" ? width * 0.35 : width * 0.8,
                                        alignSelf: 'flex-start',
                                        paddingBottom: 15,
                                      }}
                                      fontSize={15}


                                      itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                                      itemColor={Colors.black}
                                      fontFamily={Fonts.regular}
                                      selectedItemColor={Colors.black}
                                      textColor={this.state.drawingHelp ? Colors.black : Colors.dark_gray}
                                      value={this.state.drawingHelp ? this.state.drawingHelp : 'Drawing Required?'}
                                      onChangeText={value => {
                                        this.setState({ drawingHelp: value });

                                      }}
                                      data={fieldwork}
                                    />
                                  </View>
                                </View>
                              </View>

                              {this.state.drawingHelp == "Yes" ?
                                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.labela}>Drawing Type</Text>
                                    <Text style={styles.required}>*</Text>
                                  </View>

                                  <View
                                    style={{
                                      paddingHorizontal: 5,
                                      height: 42,
                                      justifyContent: 'center',
                                      alignItems: 'flex-start',
                                      backgroundColor: Colors.white,
                                      borderWidth: 1,

                                      borderRadius: 4,

                                      borderColor: Colors.medium_gray,
                                    }}>
                                    <View>
                                      <Dropdown
                                        containerStyle={{
                                          width: this.state.drawingHelp == "Yes" ? width * 0.38 : width * 0.8,
                                          alignSelf: 'flex-start',
                                          paddingBottom: 15,

                                        }}
                                        fontSize={15}
                                        itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                                        itemColor={Colors.black}
                                        fontFamily={Fonts.regular}
                                        selectedItemColor={Colors.black}
                                        textColor={this.state.drawing != 'Select Drawing' ? Colors.black : Colors.dark_gray}
                                        value={this.state.drawing ? this.state.drawing : 'Select Drawing'}


                                        onChangeText={value => {

                                          drawingurl = ""
                                          this.setState({ drawing: value, refresh: !this.state.refresh });
                                          for (let i = 0; i < this.state.drawinglist.length; i++) {

                                            if (this.state.drawinglist[i].value == this.state.drawing) {

                                              console.log('cvscv', this.state.drawinglist[i].url);

                                              drawingurl = this.state.drawinglist[i].url

                                              this.setState({ drawingid: this.state.drawinglist[i].id })
                                            }
                                          }

                                        }}
                                        data={this.state.drawinglist}
                                      />
                                    </View>
                                  </View>

                                </View>
                                : null}

                            </View>


                            {drawingurl ?
                              <TouchableOpacity style={styles.Dbtn} onPress={() => Linking.openURL(drawingurl)}>
                                <ImageBackground
                                  resizeMode="contain"
                                  style={{ height: 25, width: 25, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                                  source={require('../../images/fill.png')}>
                                  <Image style={{ height: 18, width: 18, tintColor: Colors.primary }} source={require('../../images/eye.png')} />
                                </ImageBackground>
                                <View

                                >
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      color: Colors.white,
                                      fontFamily: Fonts.medium,
                                    }}>

                                    View Drawing
                                   </Text>
                                </View>
                              </TouchableOpacity> : null} */}
                          </View>
                        )}
                        {this.state.WorkStatus == "Continue" ||
                        this.state.WorkStatus == "Customer Hold" ||
                        this.state.WorkStatus == "Awaiting Parts" ||
                        this.state.WorkStatus == "Awaiting Manufacturing" ? (
                          <View style={styles.textInputView}>
                            <View style={{}}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={styles.labela}>Date</Text>
                                <Text style={styles.required}>*</Text>
                              </View>
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
                                  {/* {moment(this.state.date).format('DD/MM/YYYY')} */}
                                  {moment(this.state.date).format("DD/MM/YYYY")}
                                </Text>
                              </TouchableOpacity>
                              <LabelTextInput
                                label="Remarks for User"
                                multiline={true}
                                required={true}
                                placeholder="Enter Remarks for User"
                                returnKeyType="next"
                                onChangeText={(remarks) =>
                                  this.setState({ remarks })
                                }
                                value={this.state.remarks}
                              />
                             <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: "column",
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    paddingBottom: 10,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderColor: Colors.light_gray,
                    shadowOffset: { width: 0, height: 5 },
                    shadowColor: Colors.medium_gray,
                    shadowOpacity: 0.8,
                    elevation: 2,
                    marginTop:10
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      overflow: "hidden",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 16,
                            fontFamily: Fonts.medium,
                            color: Colors.primary,
                          }}
                        >
                          Attach Report
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setreportModalVisible(true);
                        }}
                        style={{
                          alignSelf: "center",
                          flexDirection: "column",
                          marginRight: 12,
                        }}
                      >
                        <View
                          style={{
                            height: 70,
                            width: 70,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            borderColor: Colors.light_gray,
                            backgroundColor: Colors.light_gray,
                            borderWidth: 1,
                          }}
                        >
                          <ImageBackground
                            resizeMode="contain"
                            style={{
                              height: 60,
                              width: 60,
                              marginRight: 0,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            source={require("../../images/fill.png")}
                          >
                            <Image
                              style={{
                                height: 32,
                                width: 32,
                                tintColor: Colors.primary,
                              }}
                              source={require("../../images/add.png")}
                            />
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {ImageFlatlist.length > 0 ? (
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 10,
                      flexDirection: "column",
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      paddingBottom: 10,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderColor: Colors.light_gray,
                      shadowOffset: { width: 0, height: 5 },
                      shadowColor: Colors.medium_gray,
                      shadowOpacity: 0.8,
                      elevation: 2,
                      margin: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <FlatList
                        horizontal
                        extraData={this.state.refresh}
                        showsHorizontalScrollIndicator={false}
                        data={ImageFlatlist}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <View style={{ flex: 1, margin: 5 }}>
                            {item != "" ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  flex: 1,
                                }}
                              >
                                {item.type == "image/jpeg" && "image/png" ? (
                                  <Image
                                    style={{
                                      height: 250,
                                      width: 250,
                                      backgroundColor: Colors.light_gray,
                                      borderRadius: 10,
                                    }}
                                    source={{ uri: item.uri }}
                                    onError={(e) => console.log(e)}
                                  />
                                ) : (
                                  <TouchableOpacity
                                    resizeMode={"center"}
                                    style={{
                                      height: 250,
                                      width: 250,
                                      backgroundColor: Colors.light_gray,
                                      borderRadius: 10,
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                    onPress={() => {
                                      FileViewer.open(item.uri)
                                        .then(() => {
                                          AsyncStorage.setItem(
                                            "removeDigi",
                                            "1"
                                          );
                                          console.log("Success");
                                        })
                                        .catch((_err) => {
                                          setTimeout(() => {
                                            AsyncStorage.setItem(
                                              "removeDigi",
                                              "0"
                                            );
                                          }, 500);
                                          console.log("_err", _err);
                                          Toast.showWithGravity(
                                            _err.toString(),
                                            Toast.SHORT,
                                            Toast.CENTER
                                          );
                                        });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        position: "absolute",
                                        left: 15,
                                        bottom: 15,
                                        fontFamily: Fonts.regular,
                                        fontSize: 15,
                                        width: "80%",
                                      }}
                                    >
                                      {item.name
                                        ? item.name.split("/")[
                                            item.name.split("/").length - 1
                                          ]
                                        : ""}
                                    </Text>
                                    <Image
                                      style={{
                                        height: 30,
                                        width: 30,
                                        position: "absolute",
                                        bottom: 15,
                                        right: 15,
                                        tintColor: Colors.primary,
                                      }}
                                      source={require("../../images/attach.png")}
                                    />
                                  </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                  style={{
                                    height: 35,
                                    width: 25,
                                    marginLeft: -12,
                                    marginTop: 0,
                                  }}
                                  onPress={() => this.isRemuveReport(index)}
                                >
                                  <Image
                                    style={{ height: 22, width: 22 }}
                                    source={require("../../images/remove.png")}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  </View>
                ) : null}
                {/* <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: "column",
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    paddingBottom: 10,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderColor: Colors.light_gray,
                    shadowOffset: { width: 0, height: 5 },
                    shadowColor: Colors.medium_gray,
                    shadowOpacity: 0.8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      overflow: "hidden",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "left",
                            fontSize: 16,

                            // backgroundColor: Colors.light_gray,
                            fontFamily: Fonts.medium,
                            color: Colors.primary,
                          }}
                        >
                          Capture Attachment
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setcaptureModalVisible(true);
                        }}
                        style={{
                          alignSelf: "center",
                          flexDirection: "column",
                          marginRight: 12,
                        }}
                      >
                        <View
                          style={{
                            height: 70,
                            width: 70,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            borderColor: Colors.light_gray,
                            backgroundColor: Colors.light_gray,
                            borderWidth: 1,
                          }}
                        >
                          <ImageBackground
                            resizeMode="contain"
                            style={{
                              height: 60,
                              width: 60,
                              marginRight: 0,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            source={require("../../images/fill.png")}
                          >
                            <Image
                              style={{
                                height: 32,
                                width: 32,
                                tintColor: Colors.primary,
                              }}
                              source={require("../../images/add.png")}
                            />
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}
                {TakeImage.length > 0 ? (
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 10,
                      flexDirection: "column",
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      paddingBottom: 10,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      borderColor: Colors.light_gray,
                      shadowOffset: { width: 0, height: 5 },
                      shadowColor: Colors.medium_gray,
                      shadowOpacity: 0.8,
                      elevation: 2,
                      margin: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <FlatList
                        horizontal
                        extraData={this.state.refresh}
                        showsHorizontalScrollIndicator={false}
                        data={TakeImage}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <View style={{ flex: 1, margin: 5 }}>
                            {item != "" ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  flex: 1,
                                }}
                              >
                                {item.type == "image/jpeg" ||
                                item.type == "image/png" ||
                                item.type == "image/jpg" ? (
                                  <Image
                                    style={{
                                      height: 250,
                                      width: 250,
                                      backgroundColor: Colors.light_gray,
                                      borderRadius: 10,
                                    }}
                                    source={{ uri: item.uri }}
                                  />
                                ) : (
                                  <TouchableOpacity
                                    resizeMode={"center"}
                                    style={{
                                      height: 250,
                                      width: 250,
                                      backgroundColor: Colors.light_gray,
                                      borderRadius: 10,
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                    onPress={() => {
                                      FileViewer.open(item.uri)
                                        .then(() => {
                                          AsyncStorage.setItem(
                                            "removeDigi",
                                            "1"
                                          );
                                          console.log("Success");
                                        })
                                        .catch((_err) => {
                                          setTimeout(() => {
                                            AsyncStorage.setItem(
                                              "removeDigi",
                                              "0"
                                            );
                                          }, 500);
                                          console.log("_err", _err);
                                          Toast.showWithGravity(
                                            _err.toString(),
                                            Toast.SHORT,
                                            Toast.CENTER
                                          );
                                        });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        position: "absolute",
                                        left: 15,
                                        bottom: 15,
                                        fontFamily: Fonts.regular,
                                        fontSize: 15,
                                        width: "80%",
                                      }}
                                    >
                                      {item.name
                                        ? item.name.split("/")[
                                            item.name.split("/").length - 1
                                          ]
                                        : ""}
                                    </Text>
                                    <Image
                                      style={{
                                        height: 30,
                                        width: 30,
                                        position: "absolute",
                                        bottom: 15,
                                        right: 15,
                                        tintColor: Colors.primary,
                                      }}
                                      source={require("../../images/attach.png")}
                                    />
                                  </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                  style={{
                                    height: 35,
                                    width: 25,
                                    marginLeft: -12,
                                    marginTop: 0,
                                  }}
                                  onPress={() => this.captureRemove(index)}
                                >
                                  <Image
                                    style={{ height: 22, width: 22 }}
                                    source={require("../../images/remove.png")}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  </View>
                ) : null}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </View>
              ) : null}
              <View>
                {this.props.navigation.state.params.sub_status == 1 &&
                this.state.tId != "4" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-around",
                      marginLeft: 6,
                      alignSelf: "center",
                    }}
                  >
                    <CustomButton2
                      iconName={require("../../images/eye.png")}
                      name="View Drawing"
                      onPress={() => {
                        this.PendingDetail();
                        this.setState({ DrawingModal: true });
                      }}
                    />
                    <CustomButton2
                      iconName={
                        this.state.WorkStatus == "Continue" ||
                        this.state.WorkStatus == "Customer Hold" ||
                        this.state.WorkStatus == "Awaiting Parts" ||
                        this.state.WorkStatus == "Awaiting Manufacturing"
                          ? require("../../images/tick1.png")
                          : require("../../images/right.png")
                      }
                      name={
                        this.state.WorkStatus == "Continue" ||
                        this.state.WorkStatus == "Customer Hold" ||
                        this.state.WorkStatus == "Awaiting Parts" ||
                        this.state.WorkStatus == "Awaiting Manufacturing"
                          ? "SUBMIT"
                          : "NEXT"
                      }
                      onPress={() => {
                        if (this.state.WorkStatus == "") {
                          Toast.show(
                            "Please select your work status",
                            Toast.SHORT
                          );
                        } else if (
                          this.state.WorkStatus == "Pending" ||
                          this.state.WorkStatus == "Complete"
                        ) {
                          this.isNext();
                        } else if (
                          this.state.WorkStatus == "Continue" ||
                          this.state.WorkStatus == "Customer Hold" ||
                          this.state.WorkStatus == "Awaiting Parts" ||
                          this.state.WorkStatus == "Awaiting Manufacturing"
                        ) {
                          NetInfo.fetch().then((state) => {
                            if (state.isConnected) {
                              this.state.isNextDay ? this.GetLatLon() : null;
                            } else {
                              Toast.show(
                                "Please Check your internet connection",
                                Toast.SHORT
                              );
                            }
                          });
                        }
                      }}
                    />
                  </View>
                ) : (
                  <>
                    {this.state.tId != "4" && (
                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-around",
                          marginLeft: 6,
                          alignSelf: "center",
                        }}
                      >
                        <CustomButton2
                          iconName={require("../../images/eye.png")}
                          name="View Drawing"
                          onPress={() => {
                            this.setState({ DrawingModal: true });
                          }}
                        />
                        <CustomButton2
                          iconName={require("../../images/tick.png")}
                          name="START WORK"
                          onPress={() => {
                            NetInfo.fetch().then((state) => {
                              if (state.isConnected) {
                                this.state.isSTARTWORK
                                  ? this.isSTARTWORK()
                                  : null;
                              } else {
                                Toast.show(
                                  "Please Check your internet connection",
                                  Toast.SHORT
                                );
                              }
                            });
                          }}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* {this.state.dataSource.call_type == 2 ? null : */}
        {this.state.WorkStatus == "Continue" ||
        this.state.WorkStatus == "Customer Hold" ||
        this.state.WorkStatus == "Awaiting Parts" ||
        this.state.WorkStatus == "Awaiting Manufacturing" ? null : (
          <View
            style={{
              height: 60,
              width: 80,
              position: "absolute",
              bottom: 90,
              right: 25,
            }}
          >
            {this.state.tId != "4" && (
              <TouchableOpacity
                style={{
                  height: "100%",
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 32,
                  alignSelf: "center",

                  backgroundColor: Colors.primary,
                  elevation: 4,
                }}
                onPress={() => {
                  this.props.navigation.navigate("TakeVideo");
                }}
              >
                <Image
                  style={{ height: 38, width: 38, tintColor: "white" }}
                  source={require("../../images/At.png")}
                />
              </TouchableOpacity>
            )}
            {/* <View style={{elevation:3,backgroundColor:'white',marginTop:2}}>
          <Text style={{fontSize:12,fontFamily:Fonts.medium,padding:0.5,marginLeft:4,alignItems:'center'}}>Attachment</Text> 
          </View> */}
          </View>
        )}
        {/* {uri:'https://cdn3.iconfinder.com/data/icons/attachment-2/24/_video-512.png'} */}
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="date"
          minimumDate={this.state.date}
          //  datePickerModeAndroid = 'spinner'
        />
        <UserModal
          visible={this.state.visible1}
          onSelect={this.onSelectService}
          onCancel={this.onCancelService}
          options={SelectManager}
          navigation={this.state.navigation}
        />

        <UserModal
          visible={this.state.visible}
          onSelect={this.onSelectVendor}
          onCancel={this.onCancelVendor}
          options={this.state.vendorlist}
          navigation={this.state.navigation}
        />

        <Modal
          transparent={true}
          animationType={"fade"}
          visible={this.state.modalVisible2}
          onRequestClose={() => {}}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
            activeOpacity={1}
            onPressOut={() => {
              this.setModalVisible2(!this.state.modalVisible2);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                height: 140,
                width: "85%",
                borderRadius: 3,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.Permissions();
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../images/photo-camera.png")}
                    style={{ tintColor: Colors.black, height: 40, width: 40 }}
                  />
                  <Text style={{ paddingTop: 10, color: Colors.black }}>
                    Open Camera
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  width: 1,
                  backgroundColor: Colors.colorPrimary,
                  marginVertical: 35,
                }}
              />
              <TouchableWithoutFeedback onPress={this.pickMultiple2.bind(this)}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../images/gallery.png")}
                    style={{ tintColor: Colors.black, height: 40, width: 40 }}
                  />
                  <Text style={{ paddingTop: 10, color: Colors.black }}>
                    Open Gallery
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          ref={"updateModal"}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          visible={this.state.modalVisible1}
          position="bottom"
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={true}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={true}
          onRequestClose={() => {
            // this.setState({ modalVisible1: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPressOut={() => {
              // this.setState({modalVisible1: false});
            }}
          >
            <View style={styles.ModalContainer}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 10,
                    shadowRadius: 10,
                    width: width * 0.8,
                    //  minHeight: height * 0.4,
                    borderColor: "#f1f1f1",
                    borderWidth: 1,
                    backgroundColor: Colors.white,
                  }}
                >
                  <View
                    style={{
                      // flex: 1,
                      padding: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.bold,
                        paddingTop: 5,
                        paddingLeft: 5,
                      }}
                    >
                      Engineer Signature
                    </Text>
                    <Text style={styles.netAlertDesc}>
                      Your signature is required for us?
                    </Text>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: 10,
                      }}
                    >
                      <Image
                        resizeMode="cover"
                        source={require("../../images/digital-signature.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 2,
                        minWidth: width * 0.3,
                        backgroundColor: Colors.primary,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "flex-end",
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        this.setState({ modalVisible1: false }, () => {
                          this.props.navigation.navigate("Engineersignature");
                        });
                      }}
                    >
                      <ImageBackground
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                        source={require("../../images/fill.png")}
                      >
                        <Image
                          source={require("../../images/signature.png")}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: Colors.primary,
                            right: 7,
                          }}
                        />
                      </ImageBackground>
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: 18,
                          borderRadius: 4,
                          fontFamily: Fonts.bold,
                          marginLeft: 8,
                          bottom: 6,
                        }}
                      >
                        SIGN
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          ref={"updateModal"}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          visible={this.state.DrawingModal}
          // visible={true}
          position="bottom"
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={true}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={true}
          onRequestClose={() => {
            this.setState({ DrawingModal: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPressOut={() => {
              // this.setState({modalVisible1: false});
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 10,
                    shadowRadius: 10,
                    width: width * 0.8,
                    // minHeight: height * 0.3,
                    paddingVertical: 10,
                    borderColor: "#f1f1f1",
                    borderWidth: 1,
                    backgroundColor: Colors.white,
                  }}
                >
                  <View
                    style={{
                      padding: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Fonts.bold,
                        padding: 10,
                      }}
                    >
                      Drawing Request
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 10,
                        marginVertical: 4,
                        alignSelf: "center",
                        width: "90%",
                      }}
                    >
                      <Text style={styles.DrawingLabal}>SO No.</Text>
                      <Text style={{}}>:</Text>
                      {/* <View style={{  flexDirection: 'column' }}> */}
                      <Text style={[styles.value, { textAlign: "center" }]}>
                        {this.state.dataSource.so_no}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 0,
                        alignSelf: "center",
                        width: "90%",
                      }}
                    >
                      <Text style={styles.DrawingLabal}>Call No.</Text>
                      <Text style={{}}>:</Text>
                      {/* <View style={{  flexDirection: 'column' }}> */}
                      <Text style={[styles.value, { textAlign: "center" }]}>
                        {this.state.dataSource.call_no}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "column",
                        alignSelf: "center",
                        width: "78%",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 14,
                            paddingVertical: 3,
                            fontFamily: Fonts.medium,
                          }}
                        >
                          Drawing Type
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 5,
                          height: 42,
                          justifyContent: "center",
                          alignItems: "flex-start",
                          backgroundColor: Colors.white,

                          borderWidth: 1,
                          borderRadius: 4,
                          borderColor: Colors.light_gray,
                        }}
                      >
                        <View>
                          <Dropdown
                            containerStyle={{
                              width:
                                this.state.drawingHelp == "Yes"
                                  ? width * 0.38
                                  : width * 0.6,
                              alignSelf: "flex-start",
                              paddingBottom: 15,
                            }}
                            inputContainerStyle={{ borderBottomColor: "white" }}
                            fontSize={15}
                            itemTextStyle={{
                              fontFamily: Fonts.regular,
                              color: Colors.primary,
                            }}
                            itemColor={Colors.black}
                            fontFamily={Fonts.regular}
                            selectedItemColor={Colors.black}
                            textColor={
                              this.state.drawing != "Select Drawing"
                                ? Colors.black
                                : Colors.dark_gray
                            }
                            value={
                              this.state.drawing
                                ? this.state.drawing
                                : "Select Drawing"
                            }
                            onChangeText={(value) => {
                              drawingurl = "";
                              this.setState({
                                drawing: value,
                                refresh: !this.state.refresh,
                              });
                              for (
                                let i = 0;
                                i < this.state.drawinglist.length;
                                i++
                              ) {
                                if (
                                  this.state.drawinglist[i].value ==
                                  this.state.drawing
                                ) {
                                  drawingurl = this.state.drawinglist[i].url;

                                  this.setState({
                                    drawingid: this.state.drawinglist[i].id,
                                  });
                                }
                              }
                            }}
                            data={this.state.drawinglist}
                          />
                        </View>
                      </View>
                    </View>

                    {drawingurl ? (
                      // <View
                      //   style={{
                      //     flexDirection: 'row',
                      //     justifyContent: 'center',
                      //     alignSelf: 'center',
                      //     bottom: 30,
                      //     marginVertical: 0,
                      //     marginHorizontal: 10,
                      //   }}>

                      <TouchableOpacity
                        style={{
                          marginTop: 20,
                          padding: 2,
                          height: 38,
                          width: "30%",
                          alignSelf: "center",
                          minWidth: width * 0.5,
                          backgroundColor: Colors.primary,
                          borderRadius: 5,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                        onPress={() => {
                          this.setState({ DrawingModal: false }, () => {
                            AsyncStorage.setItem("removeDigi", "1"),
                              Linking.openURL(drawingurl);
                          });
                        }}
                      >
                        <ImageBackground
                          style={{
                            width: 30,
                            height: 30,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                          source={require("../../images/fill.png")}
                        >
                          <Image
                            source={require("../../images/eye.png")}
                            style={{
                              width: 20,
                              height: 20,
                              tintColor: Colors.primary,
                              right: 7,
                            }}
                          />
                        </ImageBackground>
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: 18,
                            borderRadius: 4,
                            fontFamily: Fonts.bold,
                            marginLeft: 8,
                            bottom: 0,
                          }}
                        >
                          View Drawing
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      // </View>
                      // <View
                      //   style={{
                      //     flexDirection: 'row',
                      //     justifyContent: 'center',
                      //     alignSelf: 'center',
                      //     bottom: 30,
                      //     marginVertical: 0,
                      //     marginHorizontal: 10,
                      //   }}>

                      <TouchableOpacity
                        style={{
                          marginTop: 20,
                          padding: 2,
                          height: 38,
                          width: "30%",
                          alignSelf: "center",
                          minWidth: width * 0.4,
                          backgroundColor: Colors.primary,
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                          // flexDirection:'row'
                        }}
                        onPress={() => {
                          // this.props.navigation.navigate('Engineersignature')
                          this.DrawingRequist();
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: 18,
                            borderRadius: 4,
                            fontFamily: Fonts.bold,
                            marginLeft: 8,
                            bottom: 0,
                          }}
                        >
                          Request
                        </Text>
                      </TouchableOpacity>
                    )
                    // </View>
                    }
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
                  transparent={true}
                  animationType={"fade"}
                  visible={this.state.reportModal}
                  onRequestClose={() => {}}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }}
                    activeOpacity={1}
                    onPressOut={() => {
                      this.setreportModalVisible(!this.state.reportModal);
                    }}
                  >
                    <View style={styles.ModalInsideView}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.Permissions();
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("../../images/photo-camera.png")}
                            style={{
                              tintColor: Colors.black,
                              height: 40,
                              width: 40,
                            }}
                          />
                          <Text style={{ paddingTop: 10, color: Colors.black }}>
                            Open Camera
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <View
                        style={{
                          width: 1,
                          backgroundColor: Colors.colorPrimary,
                          marginVertical: 35,
                        }}
                      />
                      <TouchableWithoutFeedback onPress={() => this.upload(2)}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("../../images/gallery.png")}
                            style={{
                              tintColor: Colors.black,
                              height: 40,
                              width: 40,
                            }}
                          />
                          <Text style={{ paddingTop: 10, color: Colors.black }}>
                            Open Gallery
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableOpacity>
                </Modal>
                <Modal
                  transparent={true}
                  animationType={"fade"}
                  visible={this.state.captureModal}
                  onRequestClose={() => {}}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }}
                    activeOpacity={1}
                    onPressOut={() => {
                      this.setcaptureModalVisible(!this.state.captureModal);
                    }}
                  >
                    <View style={styles.ModalInsideView}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.Permissions();
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("../../images/photo-camera.png")}
                            style={{
                              tintColor: Colors.black,
                              height: 40,
                              width: 40,
                            }}
                          />
                          <Text style={{ paddingTop: 10, color: Colors.black }}>
                            Open Camera
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                      <View
                        style={{
                          width: 1,
                          backgroundColor: Colors.colorPrimary,
                          marginVertical: 35,
                        }}
                      />
                      <TouchableWithoutFeedback onPress={() => this.upload(1)}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("../../images/gallery.png")}
                            style={{
                              tintColor: Colors.black,
                              height: 40,
                              width: 40,
                            }}
                          />
                          <Text style={{ paddingTop: 10, color: Colors.black }}>
                            Open Gallery
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableOpacity>
                </Modal>
      </SafeAreaView>
    );
  }
}

class RadioButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onClick}
        activeOpacity={0.8}
        style={[{ flexDirection: "row", flex: 1 }, styles.radioButton]}
      >
        <View
          style={[
            styles.radioButtonHolder,
            {
              flexDirection: "column",
              height: this.props.button.size,
              width: this.props.button.size,
              borderColor: this.props.button.color,
            },
          ]}
        >
          {this.props.button.selected ? (
            <View
              style={[
                styles.radioIcon,
                {
                  flexDirection: "row",
                  height: this.props.button.size / 2,
                  width: this.props.button.size / 2,
                  backgroundColor: Colors.primary,
                },
              ]}
            />
          ) : null}
        </View>
        <Text style={[styles.labelX, { color: this.props.button.color }]}>
          {this.props.button.label}
        </Text>
      </TouchableOpacity>
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
    paddingVertical: 2,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  Dbtn: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    width: "90%",
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
    minHeight: height * 0.4,
    borderColor: "#f1f1f1",
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  netAlertContent: {
    flex: 1,
    padding: 0,
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
  DrawingLabal: {
    padding: 2,
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.dark_gray,
    width: width * 0.2,
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
  radioButton: {
    //  flexDirection: 'row',
    margin: 0,
  },

  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },

  radioIcon: {
    //  flexDirection:'row',
    borderRadius: 50,
  },

  labelX: {
    top: 0,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  canterlabel: {
    textAlign: "center",
    marginTop: 12,
    color: Colors.primary,
    fontSize: 18,
    paddingVertical: 3,
    fontFamily: Fonts.bold,
  },
  input: {
    padding: 8,
    paddingVertical: Platform.OS == "ios" ? 12 : 6,
    // paddingHorizontal: 50,
    fontSize: 16,
    fontFamily: Fonts.regular,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 4,
    width: "80%",
    // textAlignVertical: "top",
    borderColor: Colors.medium_gray,
  },
  ModalInsideView: {
    flexDirection: "row",

    backgroundColor: "#fff",
    height: 140,
    width: "85%",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
