import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  AppState,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
var width = Dimensions.get("window").width;
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import Colors from "../../common/Colors";
import CustomButton from "../../components/CustomButton";
import Fonts from "../../common/Fonts";
import BackHeader from "../../components/BackHeader";
import { StackActions, NavigationActions } from "react-navigation";
import API from "../../common/API";
import timeout from "../../common/Timeout";
import Loader from "../../common/Loader";
import * as NetInfo from "@react-native-community/netinfo";
import Geolocation from "@react-native-community/geolocation";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { RNCamera } from "react-native-camera";
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from "rn-fetch-blob";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import LabelTextInput from "../../components/LabelTextInput";
import { Dropdown } from "react-native-material-dropdown";

import Video from "react-native-video";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from "react-native-permissions";
import { log } from "react-native-reanimated";
// var isImageFLat = [];
var ImageFlatlist = [];
var TakeImage = [];
var docList = [];
var Datasorce = [];

export default class CompleteWorkDetail_Next extends Component {
  constructor(props) {
    ImageFlatlist = [];
    docList = [];
    super(props);
    this.state = {
      appState: AppState.currentState,
      loading: false,
      refresh: false,
      dataMass: false,
      src1: [],
      CameraModalVisible: false,
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      cambtn: true,
      videobtn: true,
      flesh: false,
      submit: true,
      modal: true,
      isRecording: false,
      mime: "",
      mimeType: "",
      NewLink: "",
      videobtn1: true,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: "contain",
      duration: 0.0,
      currentTime: 0.0,
      paused: true,
      TakeImage: [],

      personName: "",
      mobileNo: "",
      email: "",
      plantAddress: "",
      location: "",

      make: "",
      equp: "",
      equpId: 0,
      // capacity: "",
      yearMake: "",
      makeInput: "",
      makeVisible: false,
      seal: "",
      daimeter: "",
      reacton: "",
      batchTime: "",
      // procTemp: "",
      procTempMin: "",
      procTempMax: "",
      pressure: "",
      // rpm: "",
      rpmMin: "",
      rpmMax: "",
      motor: "",
      // motorMin: "",
      // motorMax: "",
      intertial: "Yes",
      // label: "Capacity(kl)",
      typess: 0,
      sealNo: 0,
      multiData: [],
      remarks: "",
      feedback: "",
    };
    this.FirstTimeCall();
  }

  onLoad = (data) => {
    this.setState({ duration: data.duration });
  };

  onProgress = (data) => {
    this.setState({ currentTime: data.currentTime });
  };

  onEnd = () => {
    this.setState({ paused: true });
  };

  onAudioBecomingNoisy = () => {
    this.setState({ paused: true });
  };

  componentDidMount() {
    // AppState.addEventListener('change', this._handleAppStateChange);
  }
  FirstTimeCall = () => {
    AsyncStorage.getItem("one").then((one) => {
      console.log("one::", one);
      AsyncStorage.getItem("TakeImage").then((value) => {
        this.setState({ src1: JSON.parse(one) }, () => {
          TakeImage = JSON.parse(value) ? JSON.parse(value) : [];
          Datasorce = JSON.parse(value) ? JSON.parse(value) : [];
          this.setState({ refresh: !this.state.refresh });
          console.log("call", TakeImage);
        });
      });
    });
  };

  componentWillUnmount() {
    AsyncStorage.setItem("removeDigi", "0");
  }
  clear = () => {
    this.setState({
      make: "",
      equp: "",
      // capacity: "",
      yearMake: "",
      makeInput: "",
      makeVisible: false,
      seal: "",
      daimeter: "",
      reacton: "",
      batchTime: "",
      // procTemp: "",
      pressure: "",
      // rpm: "",
      rpmMax: "",
      rpmMin: "",
      personName: "",
      mobileNo: "",
      email: "",
      plantAddress: "",
      location: "",
    });
  };
  isRemuve2 = (index, item) => {
    console.log("index, item", index, item);
    TakeImage.splice(index, 1);

    setTimeout(() => {
      AsyncStorage.setItem("TakeImage", JSON.stringify(TakeImage));
    }, 100);

    this.setState({ refresh: !this.state.refresh });
  };

  SetCameraModalVisible(visible) {
    this.setState({
      CameraModalVisible: visible,
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
    });
  }

  setModalVisible(visible, st) {
    this.setState({ modalVisible: visible, modal: true, typess: st });
  }

  setModalVisible2(visible, st) {
    this.setState({ modalVisible2: visible, modal: false, typess: st });
  }

  setModalVisible3(visible, st) {
    this.setState({ modalVisible3: visible, modal: false, typess: st });
  }

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
            this.setState({
              modalVisible: false,
              modalVisible2: false,
              modalVisible3: false,
            });
            this.SetCameraModalVisible(true);
            break;
          case RESULTS.BLOCKED:
            this.setState({
              modalVisible: false,
              modalVisible2: false,
              modalVisible3: false,
            });
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

  pickMultiple() {
    AsyncStorage.setItem("removeDigi", "1");
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      loading: true,
      forceJpg: true,
      maxFiles: 10,
      compressImageQuality: 0.5,
      mediaType: "",
      mime: "",
    })
      .then((images) => {
        for (let i = 0; i < images.length; i++) {
          var object = {
            uri: images[i].path,
            name: images[i].path,
            type: images[i].mime,
            visible: true,
          };
          if (this.state.typess == 1) {
            ImageFlatlist.push(object);
          } else if (this.state.typess == 3) {
            docList.push(object);
          }
        }
        setTimeout(() => {
          AsyncStorage.setItem("removeDigi", "0");
        }, 500);

        console.log("Temp data", ImageFlatlist);
        this.setState({
          modalVisible: false,
          loading: false,
        });
      })
      .catch((e) => {
        console.log("e", e);

        this.setState({
          modalVisible: false,
          loading: false,
        });

        setTimeout(() => {
          Toast.show(e.toString(), Toast.LONG);
        }, 100);
        setTimeout(() => {}, 2000);
      });
  }

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
          modalVisible: false,
          modalVisible2: false,
          modalVisible3: false,
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
          modalVisible2: false,
          modalVisible: false,
          modalVisible3: false,
          loading: false,
        });
      } else {
        setTimeout(() => {
          Toast.show(JSON.stringify(err), Toast.SHORT, Toast.BOTTOM);
        }, 50);
        this.setState({
          modalVisible2: false,
          modalVisible: false,
          modalVisible3: false,
          loading: false,
        });
      }
      setTimeout(() => {
        AsyncStorage.setItem("removeDigi", "0");
      }, 500);
    }
  };

  pickMultiple2() {
    AsyncStorage.setItem("removeDigi", "1");
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      waitAnimationEnd: false,
      includeExif: true,
      loading: true,
      forceJpg: true,
      maxFiles: 10,
      compressImageQuality: 0.5,
      mediaType: "any",
      mime: "",
    })
      .then((images) => {
        console.log("SSS12341233", images);
        this.setState({ mime: images[0].mime });

        for (let i = 0; i < images.length; i++) {
          var object = {
            uri: images[i].path,
            name: images[i].path,
            type: images[i].mime,
            visible: true,
          };

          TakeImage.push(object);
        }
        setTimeout(() => {
          AsyncStorage.setItem("removeDigi", "0");
        }, 500);

        console.log("Temp data", TakeImage);

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
        setTimeout(() => {}, 2000);
      });
  }

  saveSign = (ImageFlatlist1, TakeImage2, doclist2) => {
    if (this.state.intertial) {
      if (!this.state.personName) {
        Toast.show("Please enter person name.");
        return;
      }
      if (!this.state.mobileNo) {
        Toast.show("Please enter whatsapp no.");
        return;
      }
      if (!this.state.email) {
        Toast.show("Please enter email");
        return;
      }
      if (this.state.mobileNo.length < 10) {
        Toast.show("Please enter valid whatsapp no.");
        return;
      }
      if (!this.state.plantAddress) {
        Toast.show("Please enter plant address.");
        return;
      }
      if (!this.state.equp) {
        Toast.show("Please enter equpment.");
        return;
      }
      // if (!this.state.capacity) {
      //   Toast.show("Please enter capacity.");
      //   return;
      // }
      if (!this.state.make) {
        Toast.show("Please select make.");
        return;
      }
      if (this.state.makeVisible && !this.state.makeInput) {
        Toast.show("Please enter other make.");
        return;
      }
      if (!this.state.yearMake) {
        Toast.show("Please enter year make.");
        return;
      }
      if (!this.state.seal) {
        Toast.show("Please select seal modal.");
        return;
      }
      if (!this.state.daimeter) {
        Toast.show("Please enter shaft daimeter.");
        return;
      }
      if (!this.state.reacton) {
        Toast.show("Please enter reaction type.");
        return;
      }
      if (!this.state.batchTime) {
        Toast.show("Please enter batch time.");
        return;
      }
      if (!this.state.pressure) {
        Toast.show("Please enter pressure/vacuum.");
        return;
      }
      if (!this.state.motor) {
        Toast.show("Please enter motor current.");
        return;
      }
      if (!this.state.feedback) {
        Toast.show("Please select customer feedback.");
        return;
      }
    } else if (!this.state.feedback) {
      Toast.show("Please select customer feedback.");
      return;
    }
    this.setState({ loading: true, submit: false });
    Geolocation.getCurrentPosition(
      (position) => {
        const lastPosition = JSON.stringify(position);
        this.setState({ lastPosition });

        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        this.setState({ loading: true, submit: false });
        this.offlineproceed(lat, long, ImageFlatlist1, TakeImage2, doclist2);
      },
      (error) => {
        this.setState({ loading: false, submit: true });
        setTimeout(() => {
          if (error.message == "No location provider available.") {
            if (Platform.OS == "android") {
              AsyncStorage.setItem("removeDigi", "1");
              RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 1000000,
                fastInterval: 50000,
              })
                .then((data) => {
                  console.log(data);
                  this.setState({ loading: true, submit: false }, () => {
                    this.saveSign();
                    setTimeout(() => {
                      AsyncStorage.setItem("removeDigi", "0");
                    }, 500);
                  });
                })
                .catch((err) => {
                  this.setState({ loading: false, submit: true });
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
        console.log("dd", error);
      },
      { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
    );
    // }
  };

  offlineproceed(lat, long, ImageFlatlist1, TakeImage2, doclist2) {
    this.setState({ loading: true, submit: false });
    AsyncStorage.getItem("id").then((id) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("branch_id").then((branch_id) => {
          AsyncStorage.getItem("signature").then((signature) => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              signature: "",
              lat: lat,
              long: long,
              first: this.state.src1,
              third: {
                image: "",
                report: "",
              },
              ig: signature,

              person_name: this.state.personName,
              mobile_no: this.state.mobileNo,
              email: this.state.email,
              plant_address: this.state.plantAddress,
              location: this.state.location,

              make: this.state.make,
              equp: this.state.equp,
              // capacity: this.state.capacity,
              yearMake: this.state.yearMake,
              makeInput: this.state.makeInput,
              seal: this.state.seal,
              daimeter: this.state.daimeter,
              reacton: this.state.reacton,
              batchTime: this.state.batchTime,
              procTempMin: this.state.procTempMin,
              procTempMax: this.state.procTempMax,
              pressure: this.state.pressure,
              rpmMin: this.state.rpmMin,
              rpmMax: this.state.rpmMax,
              motor: this.state.motor,
              remarks: this.state.remarks,
              sealNo: this.state.sealNo,
              multiData: this.state.multiData,
              feedback:this.state.feedback
            };
            var data = new FormData();
            data.append("jsondata", JSON.stringify(Request));
            ImageFlatlist1.map((file, index) => {
              data.append(`image${index}`, file);
            });
            TakeImage2.map((file, index) => {
              data.append(`report${index}`, file);
            });
            doclist2.map((file, index) => {
              data.append(`feedbackdocument${index}`, file);
            });

            console.log(data);
            console.log("API", API.e_call_complete_offline);
            console.log("Request", JSON.stringify(data));
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                timeout(
                  60000,
                  fetch(API.e_call_complete_offline, {
                    method: "POST",
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    body: data,
                  })
                    .then((res) => {
                      console.log(res);

                      if (res.status == 200) {
                        this.setState({ submit: true });
                        res.json().then((res) => {
                          console.log("e_call_complete_offline:::  ", res);

                          if (res.status == "success") {
                            TakeImage = [];
                            ImageFlatlist = [];
                            docList = [];
                            AsyncStorage.removeItem("one");
                            AsyncStorage.removeItem("two");
                            AsyncStorage.removeItem("three");
                            AsyncStorage.removeItem("calltype");
                            AsyncStorage.removeItem("Local");
                            AsyncStorage.removeItem("TakeImage");

                            this.setState({
                              loading: false,
                              loading1: false,
                              submit: true,
                            });
                            AsyncStorage.removeItem("UpdateSignature");
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: "Home",
                                }),
                              ],
                            });
                            this.props.navigation.dispatch(resetAction);
                            AsyncStorage.setItem("removeDigi", "1");
                          } else if (res.status == "failed") {
                            this.setState({
                              loading: false,
                              loading1: false,
                              submit: true,
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
                            TakeImage = [];
                            ImageFlatlist = [];
                            docList = [];
                            AsyncStorage.removeItem("one");
                            AsyncStorage.removeItem("two");
                            AsyncStorage.removeItem("three");
                            AsyncStorage.removeItem("calltype");
                            AsyncStorage.removeItem("Local");
                            AsyncStorage.removeItem("TakeImage");
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
                              submit: true,
                              message: res.message,
                            });
                            if (res.message == "No call found...") {
                              setTimeout(() => {
                                Toast.show(res.message, Toast.SHORT);
                              }, 50);
                              TakeImage = [];
                              ImageFlatlist = [];
                              docList = [];
                              AsyncStorage.removeItem("one");
                              AsyncStorage.removeItem("two");
                              AsyncStorage.removeItem("three");
                              AsyncStorage.removeItem("calltype");
                              AsyncStorage.removeItem("Local");
                              AsyncStorage.removeItem("TakeImage");
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({
                                    routeName: "Home",
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                              AsyncStorage.setItem("removeDigi", "1");
                            }
                          }
                        });
                      } else {
                        AsyncStorage.removeItem("id");
                        AsyncStorage.removeItem("username");
                        AsyncStorage.removeItem("password");
                        this.setState({
                          loading: false,
                          loading1: false,
                          submit: true,
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
                        } else {
                          this.setState({
                            loading: false,
                            loading1: false,
                            submit: true,
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
                    submit: true,
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
                  submit: true,
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
    });
  }

  isRemuve = (index) => {
    ImageFlatlist.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };
  isRemuve3 = (index) => {
    docList.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };

  takeRecord = async () => {
    if (this.camera) {
      this.setState({ isRecording: true, cambtn: false });
      var date = new Date();
      const options = {
        quality: "480p",
        maxDuration: 3600,
        maxFileSize: 100000000 * 1024 * 1024,
      };
      let result = null;
      try {
        result = await this.camera.recordAsync(options);

        console.log(result);
        var video1 = result.uri;
        var name11 = video1.split(".");
        var object = {
          uri: result.uri,
          name: result.uri,
          type: "video/" + name11[1],
          visible: true,
        };
        this.setState({ cambtn: true });

        if (this.state.typess == 1) {
          ImageFlatlist.push(object);
          console.log("ImageFlatlist", ImageFlatlist);
        } else if (this.state.typess == 2) {
          TakeImage.push(object);
          console.log("TakeImage", TakeImage);
        } else {
          docList.push(object);
          console.log("docList", docList);
        }

        this.setState({
          modalVisible: false,
          modalVisible2: false,
          modalVisible3: false,
          loading: false,
        });
        this.SetCameraModalVisible(!this.state.CameraModalVisible);
      } catch (err) {
        console.warn("VIDEO RECORD FAIL", err.message, err);
        Toast.show(err.message.toString(), Toast.LONG);
        this.setState({
          modalVisible: false,
          modalVisible2: false,
          modalVisible3: false,
          loading: false,
        });
      }
    }
  };

  stopRecord = () => {
    if (this.camera) {
      this.setState({ isRecording: false });
      this.camera.stopRecording();
      this.setState({
        modalVisible: false,
        modalVisible2: false,
        modalVisible3: false,
        loading: false,
      });
    }
  };
  getArray = () => {
    let array = [];
    if (this.state.sealNo) {
      for (let i = 0; i < parseInt(this.state.sealNo); i++) {
        array.push({
          soNo: "",
          intersealNo: "",
          location: "",
          plant: "",
          remarks: "",
        });
      }
    }
    this.setState({ multiData: array });
    // return array
  };
  render() {
    const { navigate } = this.props.navigation;
    const { multiData } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Modal
          transparent={true}
          animationType={"fade"}
          visible={this.state.CameraModalVisible}
          onRequestClose={() => {}}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              <StatusBar
                hidden={false}
                barStyle="dark-content"
                backgroundColor={Colors.primary}
              />
              <BackHeader
                backIcon={require("../../images/Left_arrow.png")}
                pageTitle="Images/Video"
                back={() => {
                  this.SetCameraModalVisible(!this.state.CameraModalVisible);
                }}
              />

              <RNCamera
                ref={(ref) => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: "Permission to use camera",
                  message: "We need your permission to use your camera",
                  buttonPositive: "Ok",
                  buttonNegative: "Cancel",
                }}
              />
              {this.state.isRecording ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 60,
                      width: 60,
                      backgroundColor: Colors.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 30,
                    }}
                    onPress={this.stopRecord.bind(this)}
                  >
                    <ImageBackground
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
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
                        source={require("../../images/pause_icon.png")}
                      />
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <View>
                    {this.state.cambtn ? (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 10,
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            height: 60,
                            width: 60,
                            backgroundColor: Colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 30,
                          }}
                          onPress={this.takePicture.bind(this)}
                        >
                          <ImageBackground
                            resizeMode="contain"
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            source={require("../../images/fill.png")}
                          >
                            <Image
                              style={{
                                height: 25,
                                width: 25,
                                tintColor: Colors.primary,
                              }}
                              source={require("../../images/photo-camera.png")}
                            />
                          </ImageBackground>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>

                  <View>
                    <View
                      style={{
                        position: "absolute",
                        bottom: 10,
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                    >
                      {this.state.isRecording ? null : (
                        <TouchableOpacity
                          style={{
                            height: 60,
                            width: 60,
                            backgroundColor: Colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 30,
                          }}
                          onPress={this.takeRecord.bind(this)}
                        >
                          <ImageBackground
                            resizeMode="contain"
                            style={{
                              height: 50,
                              width: 50,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            source={require("../../images/fill.png")}
                          >
                            <Image
                              style={{
                                height: 36,
                                width: 36,
                                tintColor: Colors.primary,
                              }}
                              source={require("../../images/play_circle.png")}
                            />
                          </ImageBackground>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
          <StatusBar
            hidden={false}
            barStyle="dark-content"
            backgroundColor={Colors.primary}
          />
          <BackHeader
            backIcon={require("../../images/Left_arrow.png")}
            pageTitle="Service Report"
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
              <View style={{ marginHorizontal: 10 }}>
                <View style={styles.textInputView}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.labela}>Is Interseal?</Text>
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
                        containerStyle={{
                          width: width * 0.9,
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
                          this.state.intertial ? Colors.black : Colors.dark_gray
                        }
                        value={
                          this.state.intertial
                            ? this.state.intertial
                            : "Select Interseal status"
                        }
                        onChangeText={(value) => {
                          if (value == "No") {
                            this.clear();
                          }
                          this.setState({
                            intertial: value == "Yes" ? true : false,
                          });
                        }}
                        data={intertialData}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.container} refresh={this.state.refresh}>
                {this.state.intertial ? (
                  <>
                    <View style={{ width: "100%", marginBottom: 20 }}>
                      <LabelTextInput
                        label="How many seals are installed?"
                        placeholder="Enter seals installed"
                        returnKeyType="next"
                        max={2}
                        keyboardType="number-pad"
                        value={this.state.sealNo}
                        onChangeText={(sealNo) =>
                          this.setState({ sealNo }, () => {
                            this.getArray();
                          })
                        }
                      />
                      {
                        <FlatList
                          data={this.state.multiData}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                flex: 1,
                                marginBottom: 10,
                                marginTop: 10,
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
                                elevation: 3,
                              }}
                            >
                              <View style={{ marginHorizontal: 10 }}>
                                <Text
                                  style={{
                                    fontFamily: Fonts.bold,
                                    fontSize: 16,
                                    color: Colors.primary,
                                  }}
                                >
                                  installed seals No. {index + 1}
                                </Text>
                                <LabelTextInput
                                  required={true}
                                  label="SO No."
                                  placeholder="Enter So No."
                                  returnKeyType="next"
                                  value={multiData[index].soNo}
                                  onChangeText={(value) => {
                                    let { multiData } = this.state;
                                    multiData[index].soNo = value;
                                    this.setState({ multiData });
                                  }}
                                />
                                <LabelTextInput
                                  required={true}
                                  label="Interseal Serial Number"
                                  placeholder="Enter Interseal Serial No."
                                  returnKeyType="next"
                                  value={multiData[index].intersealNo}
                                  onChangeText={(value) => {
                                    let { multiData } = this.state;
                                    multiData[index].intersealNo = value;
                                    this.setState({ multiData });
                                  }}
                                />
                                <LabelTextInput
                                  required={false}
                                  label="Location"
                                  placeholder="Enter Location"
                                  returnKeyType="next"
                                  value={multiData[index].location}
                                  onChangeText={(value) => {
                                    let { multiData } = this.state;
                                    multiData[index].location = value;
                                    this.setState({ multiData });
                                  }}
                                />
                                <LabelTextInput
                                  required={false}
                                  label="Plant"
                                  placeholder="Enter Plant"
                                  returnKeyType="next"
                                  value={multiData[index].plant}
                                  onChangeText={(value) => {
                                    let { multiData } = this.state;
                                    multiData[index].plant = value;
                                    this.setState({ multiData });
                                  }}
                                />
                                <LabelTextInput
                                  required={false}
                                  label="Additional Remark"
                                  placeholder="Enter Remarks"
                                  returnKeyType="next"
                                  value={multiData[index].remarks}
                                  onChangeText={(value) => {
                                    let { multiData } = this.state;
                                    multiData[index].remarks = value;
                                    this.setState({ multiData });
                                  }}
                                />
                              </View>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      }
                      <LabelTextInput
                        label="Person Name"
                        placeholder="Enter Person Name"
                        returnKeyType="next"
                        value={this.state.personName}
                        onChangeText={(personName) =>
                          this.setState({ personName })
                        }
                      />
                      <LabelTextInput
                        label="WhatsApp Mobile No"
                        placeholder="Enter WhatsApp Mobile No"
                        returnKeyType="next"
                        max={10}
                        keyboardType="number-pad"
                        value={this.state.mobileNo}
                        onChangeText={(mobileNo) => this.setState({ mobileNo })}
                      />
                      <LabelTextInput
                        label="Email"
                        placeholder="Enter Email"
                        returnKeyType="next"
                        keyboardType="email"
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                      />
                      <LabelTextInput
                        label="Plant Address"
                        placeholder="Enter Plant Address"
                        returnKeyType="next"
                        value={this.state.plantAddress}
                        multiline={true}
                        onChangeText={(plantAddress) =>
                          this.setState({ plantAddress })
                        }
                      />
                      <LabelTextInput
                        required={false}
                        label="Location"
                        placeholder="Enter Location"
                        returnKeyType="next"
                        value={this.state.location}
                        onChangeText={(location) => this.setState({ location })}
                      />
                    </View>
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
                            // paddingBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              margin: 5,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.primary,
                              paddingLeft: 5,
                            }}
                          >
                            Client and Equipment Details
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 10 }}>
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>Equipment</Text>

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
                                  this.state.equp
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.equp
                                    ? this.state.equp
                                    : "Select Equipment"
                                }
                                onChangeText={(value, id) => {
                                  this.setState({ equp: value, equpId: id });
                                }}
                                data={equipmentData}
                              />
                            </View>
                          </View>
                        </View>
                        {/* <LabelTextInput
                          required={true}
                          label={"Capacity"}
                          placeholder="Enter Capacity"
                          returnKeyType="next"
                          value={this.state.capacity}
                          onChangeText={(capacity) =>
                            this.setState({ capacity })
                          }
                        /> */}
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>Make</Text>

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
                                  this.state.make
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.make
                                    ? this.state.make
                                    : "Select Make"
                                }
                                onChangeText={(value) => {
                                  this.setState(
                                    { make: value == "Other" ? "2" : "1" },
                                    () =>
                                      this.setState(
                                        {
                                          makeVisible:
                                            this.state.make == "2"
                                              ? true
                                              : false,
                                        },
                                        () =>
                                          console.log(
                                            "ssssss",
                                            this.state.makeVisible
                                          )
                                      )
                                  );
                                }}
                                data={data}
                              />
                            </View>
                          </View>
                        </View>
                        {this.state.makeVisible ? (
                          <LabelTextInput
                            required={true}
                            label="Make"
                            placeholder="Enter Make"
                            returnKeyType="next"
                            value={this.state.makeInput}
                            onChangeText={(makeInput) =>
                              this.setState({ makeInput })
                            }
                          />
                        ) : null}
                        <LabelTextInput
                          required={true}
                          label="Year of make"
                          placeholder="Enter Year"
                          returnKeyType="next"
                          keyboardType="number-pad"
                          value={this.state.yearMake}
                          onChangeText={(yearMake) =>
                            this.setState({ yearMake })
                          }
                        />
                      </View>
                    </View>

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
                            // paddingBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              margin: 5,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.primary,
                              paddingLeft: 5,
                              // paddingVertical: 8,
                            }}
                          >
                            Seal Details
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 10 }}>
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>Seal Modal</Text>
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
                                  this.state.seal
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.seal
                                    ? this.state.seal
                                    : "Select Seal"
                                }
                                onChangeText={(value) => {
                                  this.setState({ seal: value });
                                }}
                                data={sealData}
                              />
                            </View>
                          </View>
                        </View>
                        <View style={styles.textInputView}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.labela}>
                              Shaft Diameter(mm)
                            </Text>

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
                                  this.state.daimeter
                                    ? Colors.black
                                    : Colors.dark_gray
                                }
                                value={
                                  this.state.daimeter
                                    ? this.state.daimeter
                                    : "Select Shaft Diameter"
                                }
                                onChangeText={(value) => {
                                  this.setState({ daimeter: value });
                                }}
                                data={shaftData}
                              />
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
                        paddingBottom: 10,
                        borderTopLeftRadius: 5,
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
                            // paddingBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              margin: 5,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.primary,
                              paddingLeft: 5,
                              // paddingVertical: 8,
                            }}
                          >
                            Process Details
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 10 }}>
                        <LabelTextInput
                          required={true}
                          label="Reaction Type"
                          placeholder="Enter Reaction Type"
                          returnKeyType="next"
                          value={this.state.reacton}
                          onChangeText={(reacton) => this.setState({ reacton })}
                        />
                      </View>
                    </View>

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
                            // paddingBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              margin: 5,
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.primary,
                              paddingLeft: 5,
                              // paddingVertical: 8,
                            }}
                          >
                            Operating parameters
                          </Text>
                        </View>
                      </View>
                      <View style={{ marginHorizontal: 10 }}>
                        <LabelTextInput
                          required={true}
                          label="Batch Time(hours)"
                          placeholder="Enter Batch Time"
                          returnKeyType="next"
                          keyboardType="number-pad"
                          value={this.state.batchTime}
                          onChangeText={(batchTime) =>
                            this.setState({ batchTime })
                          }
                        />

                        <LabelTextInput
                          required={false}
                          label="Process Min(C°)"
                          placeholder="Enter Process Min"
                          returnKeyType="next"
                          keyboardType="number-pad"
                          value={this.state.procTempMin}
                          onChangeText={(procTempMin) =>
                            this.setState({ procTempMin })
                          }
                        />
                        <LabelTextInput
                          required={false}
                          label="Process Max(C°)"
                          placeholder="Enter Process Max"
                          returnKeyType="next"
                          keyboardType="number-pad"
                          value={this.state.procTempMax}
                          onChangeText={(procTempMax) =>
                            this.setState({ procTempMax })
                          }
                        />
                        <LabelTextInput
                          required={true}
                          label="Pressure/vacuum"
                          placeholder="Enter Pressure/vacuim"
                          returnKeyType="next"
                          value={this.state.pressure}
                          onChangeText={(pressure) =>
                            this.setState({ pressure })
                          }
                        />

                        <LabelTextInput
                          required={false}
                          label="Rpm Min"
                          placeholder="Enter Rpm Min"
                          returnKeyType="next"
                          value={this.state.rpmMin}
                          onChangeText={(rpmMin) => this.setState({ rpmMin })}
                        />
                        <LabelTextInput
                          required={false}
                          label="Rpm Max"
                          placeholder="Enter Rpm Max"
                          returnKeyType="next"
                          value={this.state.rpmMax}
                          onChangeText={(rpmMax) => this.setState({ rpmMax })}
                        />
                        <LabelTextInput
                          required={true}
                          label="Motor Current(Amps)"
                          placeholder="Enter value after taking water trial"
                          returnKeyType="next"
                          value={this.state.motor}
                          onChangeText={(motor) => this.setState({ motor })}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.regular,
                            fontSize: 12,
                            top: 2,
                          }}
                        >
                          Enter value after taking water trial
                        </Text>
                      </View>
                    </View>
                  </>
                ) : null}
                <View style={{ width: "100%", marginBottom: 20 }}>
                  <LabelTextInput
                    required={false}
                    multiline={true}
                    label="Remarks"
                    placeholder="Enter Remarks"
                    returnKeyType="next"
                    value={this.state.remarks}
                    onChangeText={(remarks) => {
                      this.setState({ remarks });
                    }}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.labela}>Customer Feedback</Text>
                    <Text style={styles.required}>*</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      flexDirection: "column",
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: Colors.light_gray,
                      shadowOffset: { width: 0, height: 5 },
                      shadowColor: Colors.medium_gray,
                      shadowOpacity: 0.8,
                      elevation: 2,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ feedback: "Yes" });
                        }}
                        style={styles.radioOuter}
                      >
                        {this.state.feedback == "Yes" ? (
                          <View style={styles.inner} />
                        ) : null}
                      </TouchableOpacity>
                      <Text style={styles.radioLabel}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ feedback: "No" });
                        }}
                        style={styles.radioOuter}
                      >
                        {this.state.feedback == "No" ? (
                          <View style={styles.inner} />
                        ) : null}
                      </TouchableOpacity>
                      <Text style={styles.radioLabel}>No</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ feedback: "NA" });
                        }}
                        style={styles.radioOuter}
                      >
                        {this.state.feedback == "NA" ? (
                          <View style={styles.inner} />
                        ) : null}
                      </TouchableOpacity>
                      <Text style={styles.radioLabel}>NA</Text>
                    </View>
                  </View>
                </View>
                {this.state.feedback == "Yes" ? (
                  <>
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
                              Feedback Document
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              this.setModalVisible3(true, 3);
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
                    {docList.length > 0 ? (
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
                            data={docList}
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
                                    {item.type == "image/jpeg" &&
                                    "image/png" ? (
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
                                      onPress={() => this.isRemuve3(index)}
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
                  </>
                ) : null}
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
                          Capture Report
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(true, 1);
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
                                  onPress={() => this.isRemuve(index)}
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
                          this.setModalVisible2(true, 2);
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
                                  onPress={() => this.isRemuve2(index)}
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

                <CustomButton
                  iconName={require("../../images/right.png")}
                  name="End Work"
                  onPress={() => {
                    NetInfo.fetch().then((state) => {
                      if (state.isConnected) {
                        this.state.submit
                          ? this.saveSign(ImageFlatlist, TakeImage, docList)
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

                <Modal
                  transparent={true}
                  animationType={"fade"}
                  visible={this.state.modalVisible}
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
                      this.setModalVisible(!this.state.modalVisible);
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

                <Modal
                  transparent={true}
                  animationType={"fade"}
                  visible={this.state.modalVisible3}
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
                      this.setModalVisible3(!this.state.modalVisible3);
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
                      <TouchableWithoutFeedback onPress={() => this.upload(3)}>
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }

  takePicture = async () => {
    this.setState({ cambtn: false });
    if (this.camera) {
      const options = { quality: 0.5 };
      const data = await this.camera.takePictureAsync(options);
      console.log("data", data);

      var imgPath = data.uri;
      var nameImage = imgPath.split(".");

      var object = {
        uri: data.uri,
        name: nameImage[1],
        type: "image/" + nameImage[2],
      };
      if (this.state.typess == 1) {
        ImageFlatlist.push(object);
      } else if (this.state.typess == 2) {
        TakeImage.push(object);
      } else if (this.state.typess == 3) {
        docList.push(object);
      }

      this.setState({
        modalVisible: false,
        modalVisible2: false,
        modalVisible3: false,
        cambtn: true,
      });
      this.SetCameraModalVisible(!this.state.CameraModalVisible);
    }
  };
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
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
  ModalInsideView: {
    flexDirection: "row",

    backgroundColor: "#fff",
    height: 140,
    width: "85%",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#fff",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  radioOuter: {
    justifyContent: "center",
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  inner: {
    height: 11,
    width: 11,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignSelf: "center",
  },
  radioLabel: {
    alignSelf: "center",
    fontSize: 14,
    fontFamily: Fonts.medium,
    paddingHorizontal: 15,
  },
});
const data = [
  {
    id: "1",
    value: "GMM Pfaudler",
  },
  {
    id: "2",
    value: "Other",
  },
];
const sealData = [
  {
    value: "ACE5000",
  },
  {
    value: "DRY9000",
  },
];
const intertialData = [
  {
    value: "Yes",
  },
  {
    value: "No",
  },
];
const equipmentData = [
  {
    id: 1,
    value: "AE GLR",
  },
  {
    id: 2,
    value: "BE GLR",
  },
  {
    id: 3,
    value: "CE GLR",
  },
  {
    id: 4,
    value: "Mixion Agitators",
  },
  {
    id: 5,
    value: "Filters & Drayers",
  },
  {
    id: 6,
    value: "Spare",
  },
];
const shaftData = [
  {
    value: "40",
  },
  {
    value: "50",
  },
  {
    value: "60",
  },
  {
    value: "80",
  },
  {
    value: "100",
  },
  {
    value: "125",
  },
  {
    value: "140",
  },
  {
    value: "160",
  },
];
