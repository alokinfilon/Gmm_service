import React, { Component } from "react";

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
var width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import Toast from "react-native-simple-toast";
import { Dropdown } from "react-native-material-dropdown";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import Colors from "../../common/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/CustomButton";
import HexagonGray from "../../components/HexagonPrimary";
import Header from "../../components/Header";
import Fonts from "../../common/Fonts";
import BackHeader from "../../components/BackHeader";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from "react-native-permissions";
import DateTimePicker from "react-native-modal-datetime-picker";
import LabelTextInput from "../../components/LabelTextInput";
import ImagePicker from "react-native-image-crop-picker";
import { RNCamera } from "react-native-camera";
import ImageResizer from "react-native-image-resizer";
import RNFetchBlob from "rn-fetch-blob";
var isImageFLat = [];
var LocalStore = [];
var docList = [];

export default class CompleteWorkDetail_Next extends Component {
  constructor(props) {
    isImageFLat = [];
    LocalStore = [];
    docList = [];
    super(props);
    this.state = {
      isLoading: true,
      refresh: false,
      dataMass: false,
      docName: "Choose file",
      dataSource: [
        { call_id: "98989", company_name: "GMM", date: "4/09/2019" },
      ],
      modalVisible: false,
      modalVisible2: false,
      isDateTimePickerVisible: false,
      date: new Date(),
      description: "",
      servicechemicals: "",
      operatingpressure: "",
      vacume: "",
      pressureinjacket: "",
      heating: "",
      Temperaturemax: "",
      Temperaturemin: "",
      ph: "",
      batchtime: "",
      mu: "",
      cambtn: true,
      isRecording: false,
      CameraModalVisible: false,
      mime: "",

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
      procTempMin: "",
      procTempMax: "",
      pressure: "",
      rpmMin: "",
      rpmMax: "",
      motor: "",
      intertial: "Yes",
      label: "Capacity(kl)",

      sealNo: 0,
      multiData: [],
      remarks: "",
      typess: 0,
      feedback: "",
    };
  }

  clear = () => {
    this.setState({
      make: "",
      equp: "",
      capacity: "",
      yearMake: "",
      makeInput: "",
      makeVisible: false,
      seal: "",
      daimeter: "",
      reacton: "",
      batchTime: "",
      procTempMin: "",
      procTempMax: "",
      pressure: "",
      rpmMin: "",
      rpmMax: "",
      personName: "",
      mobileNo: "",
      email: "",
      plantAddress: "",
      location: "",
    });
  };

  componentDidMount() {
    AsyncStorage.getItem("three").then((three) => {
      this.setState({ refresh: !this.state.refresh });
      LocalStore.push(JSON.parse(three));
      {
        three
          ? this.setState({
              description: LocalStore[0].d,
              servicechemicals: LocalStore[0].s,
              operatingpressure: LocalStore[0].o,
              vacume: LocalStore[0].vv,
              pressureinjacket: LocalStore[0].p,
              heating: LocalStore[0].h,
              Temperaturemax: LocalStore[0].tmax,
              Temperaturemin: LocalStore[0].tmin,
              ph: LocalStore[0].ph,
              batchtime: LocalStore[0].b,
              mu: LocalStore[0].mu,
            })
          : null;
      }
      this.setState({ refresh: !this.state.refresh });
    });
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

  setModalVisible(visible, st) {
    this.setState({ modalVisible: visible, modal: true, typess: st });
  }

  SetCameraModalVisible(visible) {
    this.setState({ CameraModalVisible: visible, modalVisible: false });
  }
  setModalVisible2(visible, st) {
    this.setState({ modalVisible2: visible, modal: false, typess: st });
  }

  componentDidUnmount() {
    AsyncStorage.setItem("removeDigi", "0");
  }

  pickMultiple() {
    AsyncStorage.setItem("removeDigi", "1");
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      maxFiles: 10,
      compressImageQuality: 0.5,
      mediaType: "",
      mime: "",
    })
      .then((images) => {
        this.setState({ mime: images[0].mime });
        for (let i = 0; i < images.length; i++) {
          var object = {
            uri: images[i].path,
            name: images[i].path,
            type: images[i].mime,
            visible: true,
          };
          if (this.state.typess == 1) {
            isImageFLat.push(object);
          } else if (this.state.typess == 2) {
            docList.push(object);
          }
        }
        setTimeout(() => {
          AsyncStorage.setItem("removeDigi", "0");
        }, 500);
        this.setState({
          modalVisible: false,
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
          // openSettings().catch(() => console.warn('cannot open settings'));
        }, 2000);
      });
  }

  Next = () => {
    if (this.state.description == "") {
      Toast.show("Please enter description", Toast.SHORT);
    } else if (this.state.servicechemicals == "") {
      Toast.show("Please enter Service Chemicals", Toast.SHORT);
    } else if (this.state.operatingpressure == "") {
      Toast.show("Please enter Operating Pressure", Toast.SHORT);
    } else if (this.state.vacume == "") {
      Toast.show("Please enter Vacume", Toast.SHORT);
    } else if (this.state.pressureinjacket == "") {
      Toast.show("Please enter pressure in jacket", Toast.SHORT);
    } else if (this.state.heating == "") {
      Toast.show("Please enter Heating", Toast.SHORT);
    } else if (this.state.Temperaturemax == "") {
      Toast.show("Please enter Temperature Maximum", Toast.SHORT);
    } else if (this.state.Temperaturemin == "") {
      Toast.show("Please enter Temperature Minimum", Toast.SHORT);
    } else if (this.state.ph == "") {
      Toast.show("Please enter PH", Toast.SHORT);
    } else if (this.state.batchtime == "") {
      Toast.show("Please enter Batch Time", Toast.SHORT);
    } else if (this.state.mu == "") {
      Toast.show("Please enter Material Used", Toast.SHORT);
    } else if (!this.state.feedback) {
      Toast.show("Please select customer feedback.");
    } else if (this.state.intertial) {
      if (!this.state.personName) {
        Toast.show("Please enter person name.");
        return;
      } else if (!this.state.mobileNo) {
        Toast.show("Please enter whatsapp no.");
        return;
      } else if (!this.state.email) {
        Toast.show("Please enter email.");
        return;
      } else if (this.state.mobileNo.length < 10) {
        Toast.show("Please enter valid whatsapp no.");
        return;
      } else if (!this.state.plantAddress) {
        Toast.show("Please enter plant address.");
        return;
      } else if (!this.state.equp) {
        Toast.show("Please enter equpment.");
        return;
      } 
      // else if (!this.state.capacity) {
      //   Toast.show("Please enter capacity.");
      //   return;
      // } 
      else if (!this.state.make) {
        Toast.show("Please select make.");
        return;
      } else if (this.state.makeVisible && !this.state.makeInput) {
        Toast.show("Please enter other make.");
        return;
      } else if (!this.state.yearMake) {
        Toast.show("Please enter year make.");
        return;
      } else if (!this.state.seal) {
        Toast.show("Please select seal modal.");
        return;
      } else if (!this.state.daimeter) {
        Toast.show("Please enter shaft daimeter.");
        return;
      } else if (!this.state.reacton) {
        Toast.show("Please enter reaction type.");
        return;
      } else if (!this.state.batchTime) {
        Toast.show("Please enter batch time.");
        return;
      } else if (!this.state.pressure) {
        Toast.show("Please enter pressure/vacuum.");
        return;
      } else if (!this.state.motor) {
        Toast.show("Please enter motor current.");
        return;
      } else if (!this.state.feedback) {
        Toast.show("Please select customer feedback.");
        return;
      } else {
        var test = {
          d: this.state.description,
          s: this.state.servicechemicals,
          o: this.state.operatingpressure,
          vv: this.state.vacume,
          p: this.state.pressureinjacket,
          h: this.state.heating,
          tmax: this.state.Temperaturemax,
          tmin: this.state.Temperaturemin,
          ph: this.state.ph,
          b: this.state.batchtime,
          mu: this.state.mu,
          image: "",

          person_name: this.state.personName,
          mobile_no: this.state.mobileNo,
          plant_address: this.state.plantAddress,
          email: this.state.email,
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
          sealNo: this.state.sealNo,
          multiData: this.state.multiData,
          remarks: this.state.remarks,
          feedback: this.state.feedback,
        };
        AsyncStorage.setItem("three", JSON.stringify(test));
        AsyncStorage.setItem("four", JSON.stringify(isImageFLat));
        AsyncStorage.setItem("five", JSON.stringify(docList));
        this.props.navigation.navigate("Updatesingnatures");
      }
    } else {
      var test = {
        d: this.state.description,
        s: this.state.servicechemicals,
        o: this.state.operatingpressure,
        vv: this.state.vacume,
        p: this.state.pressureinjacket,
        h: this.state.heating,
        tmax: this.state.Temperaturemax,
        tmin: this.state.Temperaturemin,
        ph: this.state.ph,
        b: this.state.batchtime,
        mu: this.state.mu,
        image: "",

        person_name: this.state.personName,
        mobile_no: this.state.mobileNo,
        plant_address: this.state.plantAddress,
        email: this.state.email,
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
        sealNo: this.state.sealNo,
        multiData: this.state.multiData,
        remarks: this.state.remarks,
        feedback: this.state.feedback,
      };
      AsyncStorage.setItem("three", JSON.stringify(test));
      AsyncStorage.setItem("four", JSON.stringify(isImageFLat));
      AsyncStorage.setItem("five", JSON.stringify(docList));
      this.props.navigation.navigate("Updatesingnatures");
    }
  };
  isRemuve = (index) => {
    isImageFLat.splice(index, 1);
    this.setState({ refresh: !this.state.refresh });
  };
  isRemuve2 = (index) => {
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
        var video1 = result.uri;
        var name11 = video1.split(".");
        var object = {
          uri: result.uri,
          name: result.uri,
          type: "video/" + name11[1],
          visible: true,
        };
        // })
        this.SetCameraModalVisible(!this.state.CameraModalVisible);
        this.setState({
          modalVisible: false,
          cambtn: true,
          modalVisible2: false,
        });
        if (this.state.typess == 1) {
          isImageFLat.push(object);
        } else if (this.state.typess == 2) {
          docList.push(object);
        }
        AsyncStorage.setItem("TakeImage", JSON.stringify(isImageFLat));
        AsyncStorage.setItem("TakeImage2", JSON.stringify(docList));

        setTimeout(() => {
          console.log("isImageFLat", isImageFLat);
        }, 500);
      } catch (err) {
        console.warn("VIDEO RECORD FAIL", err.message, err);

        Toast.show(err.message.toString(), Toast.LONG);
        this.setState({
          modalVisible: false,
          cambtn: true,
          modalVisible2: false,
        });
      }
      // give time for the camera to recover
      setTimeout(() => {
        this.setState({ recording: false });
      }, 500);
    }
  };

  stopRecord = () => {
    if (this.camera) {
      this.setState({ isRecording: false });
      this.camera.stopRecording();
      this.setState({
        modalVisible: false,
        loading: false,
        modalVisible2: false,
      });
      // this.SetCameraModalVisible(!this.state.CameraModalVisible);
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
                pageTitle="Service Report"
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

                      {/* <Text style={styles.flipText}> stop </Text> */}
                    </ImageBackground>

                    {/* <VideoRecorder ref={(ref) => { this.videoRecorder = ref; }} /> */}
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
                          fontSize: 16,
                          backgroundColor: Colors.light_gray,
                          fontFamily: Fonts.medium,
                          color: Colors.primary,
                          paddingLeft: 15,
                          padding: 10,
                        }}
                      >
                        Others
                      </Text>
                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <LabelTextInput
                          label="Description"
                          editable={this.state.editPage}
                          placeholder="Enter Description"
                          returnKeyType="next"
                          multiline={true}
                          value={this.state.description}
                          onChangeText={(description) =>
                            this.setState({ description })
                          }
                        />
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
                    elevation: 2,
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
                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <LabelTextInput
                          label="Service Chemicals"
                          editable={this.state.editPage}
                          placeholder="Enter Service Chemicals"
                          returnKeyType="next"
                          multiline={true}
                          value={this.state.servicechemicals}
                          onChangeText={(servicechemicals) =>
                            this.setState({ servicechemicals })
                          }
                        />
                        <LabelTextInput
                          label="Operating Pressure."
                          editable={this.state.editPage}
                          placeholder="Enter Operating Pressure."
                          returnKeyType="next"
                          value={this.state.operatingpressure}
                          onChangeText={(operatingpressure) =>
                            this.setState({ operatingpressure })
                          }
                        />
                        <LabelTextInput
                          label="Vacuum."
                          editable={this.state.editPage}
                          placeholder="Enter Vacuum."
                          returnKeyType="next"
                          value={this.state.vacume}
                          onChangeText={(vacume) => this.setState({ vacume })}
                        />
                        <LabelTextInput
                          label="Pressure in Jacket."
                          editable={this.state.editPage}
                          placeholder="Enter Pressure in Jacket"
                          returnKeyType="next"
                          value={this.state.pressureinjacket}
                          onChangeText={(pressureinjacket) =>
                            this.setState({ pressureinjacket })
                          }
                        />

                        <LabelTextInput
                          label="Heating / Cooling Utilities."
                          editable={this.state.editPage}
                          placeholder="Enter Heating / Cooling Utilities"
                          returnKeyType="next"
                          value={this.state.heating}
                          onChangeText={(heating) => this.setState({ heating })}
                        />

                        <LabelTextInput
                          label="Temperature : Maximum"
                          editable={this.state.editPage}
                          placeholder="Enter Temperature Maximum"
                          returnKeyType="next"
                          value={this.state.Temperaturemax}
                          onChangeText={(Temperaturemax) =>
                            this.setState({ Temperaturemax })
                          }
                        />
                        <LabelTextInput
                          label="Temperature : Minimum"
                          editable={this.state.editPage}
                          placeholder="Enter Temperature Minimum"
                          returnKeyType="next"
                          value={this.state.Temperaturemin}
                          onChangeText={(Temperaturemin) =>
                            this.setState({ Temperaturemin })
                          }
                        />
                        <LabelTextInput
                          label="PH"
                          editable={this.state.editPage}
                          placeholder="Enter PH."
                          returnKeyType="next"
                          value={this.state.ph}
                          onChangeText={(ph) => this.setState({ ph })}
                        />
                        <LabelTextInput
                          label="Batch time : hrs"
                          editable={this.state.editPage}
                          placeholder="Enter Batch time"
                          returnKeyType="next"
                          value={this.state.batchtime}
                          onChangeText={(batchtime) =>
                            this.setState({ batchtime })
                          }
                        />
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
                    elevation: 2,
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
                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <LabelTextInput
                          label="Material used"
                          editable={this.state.editPage}
                          placeholder="Enter Material used"
                          returnKeyType="next"
                          value={this.state.mu}
                          onChangeText={(mu) => this.setState({ mu })}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.textInputView,
                    { marginHorizontal: 10, bottom: 10 },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.labela}>Is Interseal?</Text>

                    <Text style={styles.required}>*</Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 30,
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
                {this.state.intertial ? (
                  <>
                    <View
                      style={{
                        flex: 1,
                        padding: 15,
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
                        width: "100%",
                      }}
                    >
                      <LabelTextInput
                        label="How many seals are installed?"
                        placeholder="Enter seals installed"
                        returnKeyType="next"
                        keyboardType="number-pad"
                        max={2}
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
                          placeholder="Enter Motor Currunt"
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
                    label="Remarks"
                    placeholder="Enter Remarks"
                    returnKeyType="next"
                    multiline={true}
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
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontFamily: Fonts.medium,
                              color: Colors.primary,
                              paddingLeft: 15,
                              padding: 10,
                            }}
                          >
                            Feedback Document
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => this.setModalVisible2(true, 2)}
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
                ) : null}
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
                        <View style={{ paddingHorizontal: width * 0.05 }}>
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={docList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                              <View style={{ flex: 1 }}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    paddingLeft: 10,
                                    marginVertical: 10,
                                  }}
                                >
                                  {item.type == "video/mp4" ? (
                                    <Image
                                      style={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: Colors.light_gray,

                                        tintColor: Colors.primary,
                                        borderRadius: 10,
                                      }}
                                      source={require("../../images/vc.png")}
                                    />
                                  ) : (
                                    <Image
                                      style={{
                                        height: 90,
                                        width: 90,
                                        backgroundColor: Colors.light_gray,

                                        borderRadius: 10,
                                      }}
                                      source={{ uri: item.uri }}
                                    />
                                  )}
                                  {}
                                  <TouchableOpacity
                                    style={{
                                      height: 25,
                                      width: 25,
                                      marginLeft: -10,
                                      marginTop: -5,
                                    }}
                                    onPress={() => this.isRemuve2(index)}
                                  >
                                    <Image
                                      style={{ height: 18, width: 18 }}
                                      source={require("../../images/remove.png")}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          />
                        </View>
                      </View>
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
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Fonts.medium,
                            color: Colors.primary,
                            paddingLeft: 15,
                            padding: 10,
                          }}
                        >
                          Capture Image OR Select Image
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => this.setModalVisible(true, 1)}
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
                {isImageFLat.length > 0 ? (
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
                      elevation: 2,
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
                        <View style={{ paddingHorizontal: width * 0.05 }}>
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={isImageFLat}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                              <View style={{ flex: 1 }}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    paddingLeft: 10,
                                    marginVertical: 10,
                                    //alignItems: "center"
                                  }}
                                >
                                  {item.type == "video/mp4" ? (
                                    <Image
                                      style={{
                                        height: 80,
                                        width: 80,
                                        backgroundColor: Colors.light_gray,

                                        tintColor: Colors.primary,
                                        borderRadius: 10,
                                      }}
                                      source={require("../../images/vc.png")}
                                    />
                                  ) : (
                                    <Image
                                      style={{
                                        height: 90,
                                        width: 90,
                                        backgroundColor: Colors.light_gray,

                                        borderRadius: 10,
                                      }}
                                      source={{ uri: item.uri }}
                                    />
                                  )}
                                  {
                                    //  </TouchableOpacity>
                                  }
                                  <TouchableOpacity
                                    style={{
                                      height: 25,
                                      width: 25,
                                      marginLeft: -10,
                                      marginTop: -5,
                                    }}
                                    onPress={() => this.isRemuve(index)}
                                  >
                                    <Image
                                      style={{ height: 18, width: 18 }}
                                      source={require("../../images/remove.png")}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ) : null}
                <CustomButton
                  iconName={require("../../images/right.png")}
                  name="Next"
                  onPress={() => {
                    this.Next();
                  }}
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
                      <TouchableWithoutFeedback
                        onPress={this.pickMultiple.bind(this)}
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
                      <TouchableWithoutFeedback
                        onPress={this.pickMultiple.bind(this)}
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

          <View
            style={{
              height: 60,
              width: 80,
              position: "absolute",
              bottom: 90,
              right: 25,
            }}
          >
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
          </View>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode="date"
          />
        </SafeAreaView>
      </View>
    );
  }
  takePicture = async () => {
    this.setState({ cambtn: false });
    if (this.camera) {
      const options = { quality: 0.5 };
      const data = await this.camera.takePictureAsync(options);

      var imgPath = data.uri;
      var nameImage = imgPath.split(".");

      var object = {
        uri: data.uri,
        name: nameImage[1],
        type: "image/" + nameImage[2],
      };
      if (this.state.typess == 1) {
        isImageFLat.push(object);
      } else if (this.state.typess == 2) {
        docList.push(object);
      }
      console.log(isImageFLat);
      this.setState({
        modalVisible: false,
        cambtn: true,
        modalVisible2: false,
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
  value: {
    padding: 2,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.primary,
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
  glassText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  radioButton: {
    //  flexDirection: 'row',
    margin: 0,
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
