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
  TextInput,
  RefreshControl,
} from "react-native";
var width = Dimensions.get("window").width;
import Colors from "../common/Colors";
const height = Dimensions.get('window').height;
import {check,request, PERMISSIONS,openSettings, RESULTS} from 'react-native-permissions';
import HexagonGray from '../components/HexagonPrimary';
import Header from "../components/Header";
import Fonts from "../common/Fonts";
import BackHeader from "../components/BackHeader";
import CustomButton from "../components/CustomButton";

import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Geolocation from '@react-native-community/geolocation';
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class SendSMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: { status: "", message: "" },
      dataSource: [],
      selectCompany: '',
      submit: true

    };
  }

  componentDidMount() {
    
  }

  GetLatLon() {

    console.log('proccided');
    this.setState({ loading: true, submit: false });

    Geolocation.getCurrentPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });

      console.log('longitude', position.coords.longitude);
      console.log('latitude', position.coords.latitude);
      var lat = position.coords.latitude;
      var long = position.coords.longitude;

      this.SendSMSApi(lat, long);
    },
      (error) => {
        this.setState({ loading: false, submit: true });
        setTimeout(() => {


          if (error.message == "No location provider available.") {

            if (Platform.OS == "android") {
              AsyncStorage.setItem('removeDigi', "1");
              RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                  console.log(data);
                  this.GetLatLon()
                  this.setState({ loading: false, submit: false },()=>{

                    setTimeout(() => {
                      AsyncStorage.setItem('removeDigi', "0")                 
                  }, 500);
                  });


                }).catch(err => {
                  console.log(err);

                });
            } else {
              this.setState({ loading: false, submit: true });
              Toast.show("Please Turn on Your Location", Toast.SHORT, );
            }

          }
          else if(error.message == "User denied access to location services."){
            this.setState({ loading: false, submit: true }); 
            Toast.show("Please Allow access to location services.", Toast.SHORT, );
            setTimeout(() => {
                openSettings().catch(() => console.warn('cannot open settings'));
            }, 2000);
          
        }
          else {
            this.setState({ loading: false, submit: true });
            Toast.show(error.message, Toast.SHORT, );
          }
        }, 50)
        console.log(error)
      },
      { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
    );
  }


  SendSMSApi = (lat, lon) => {
    AsyncStorage.getItem("id").then(id => {
      AsyncStorage.getItem("token").then(token => {
        AsyncStorage.getItem("branch_id").then(branch_id => {
          var Request = {
             token:token,
            id: id,
            branch_id: branch_id,
            call_id: this.state.selectCompany,
            lat: lat,
            lon: lon
          };
          console.log(API.call_sms_selection);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.call_sms_selection, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => {
                    console.log('res',res);
                    if (res.status == 200) {
                      console.log(res);
                      this.setState({ loading: false, submit: true });
                      res.json().then(res => {
                        console.log("call_sms_selection :::  ", res);
                        if (res.status == "success") {
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );

                          }, 50)
                          this.setState({ loading: false, submit: true });

                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Home" })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                          AsyncStorage.setItem('removeDigi', "1")
                        } else if (res.status == "failed") {

                          AsyncStorage.removeItem('id');
                          AsyncStorage.removeItem('username');
                          AsyncStorage.removeItem('password');
                          this.setState({ loading: false, submit: true });
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );

                          }, 50)
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Login" })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else {
                          this.setState({ loading: false, message: res.message, submit: true })
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );

                          }, 50)
                        }
                      })
                    }
                    else {
                      AsyncStorage.removeItem('id');
                      AsyncStorage.removeItem('username');
                      AsyncStorage.removeItem('password');
                      this.setState({ loading: false, loading1: false, submit: true });

                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: "Login" })
                        ]
                      });
                      this.props.navigation.dispatch(resetAction);



                    }
                  })
                  .catch(e => {
                    this.setState({ loading: false, submit: true });
                    console.log(e);
                    Toast.show(
                      "Something went wrong...",
                      Toast.SHORT,
                      
                    );
                  })
              ).catch(e => {
                console.log(e);
                this.setState({ loading: false, submit: true });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false, submit: true });
              Toast.show(
                "Please Check your internet connection",
                Toast.SHORT,
                
              );
            }
          });
        });
      });
    });

  }



  componentWillUnmount() {
    AsyncStorage.setItem('removeDigi', "0");
  }



  SMSList = () => {

this.setState({ loading: true})



    AsyncStorage.getItem("id").then(id => {
      AsyncStorage.getItem("token").then(token => {
        AsyncStorage.getItem("branch_id").then(branch_id => {
          var Request = {
            token: token,
            id: id,
            branch_id: branch_id,
          };
          console.log('APi', API.call_sms_list);
          console.log('Request', JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.call_sms_list, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => {
                    if (res.status == 200) {
                      console.log(res);
                      this.setState({ loading: false, });
                      res.json().then(res => {
                        console.log("call_sms_list :::  ", res);
                        if (res.status == "success") {

                          this.setState({ loading: false, dataSource: res.data, data: res })

                        } else if (res.status == "failed") {

                          AsyncStorage.removeItem('id');
                          AsyncStorage.removeItem('username');
                          AsyncStorage.removeItem('password');
                          this.setState({ loading: false, });
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );

                          }, 50)
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Login" })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                        } else {

                          this.setState({ loading: false, message: res.message, data: res })

                        }
                      })
                    }
                    else {
                      AsyncStorage.removeItem('id');
                      AsyncStorage.removeItem('username');
                      AsyncStorage.removeItem('password');
                      this.setState({ loading: false, loading1: false, });

                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: "Login" })
                        ]
                      });
                      this.props.navigation.dispatch(resetAction);



                    }
                  })
                  .catch(e => {
                    NetInfo.fetch().then(state => {
                      if (!state.isConnected) {
                        Toast.show(
                          'Please Check your internet connection',
                          Toast.SHORT,
                          
                        );
                        this.props.navigation.navigate('Home')
                      }else{
                        this.setState({loading: false, loading1: false});
                        console.log(e);
                        Toast.show(
                          'Something went wrong...',
                          Toast.SHORT,
                          
                        );
                       
                      }
                    })
                  
                  }),
              ).catch(e => {
                console.log(e);
                this.setState({ loading: false, });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false, });
              Toast.show(
                "Please Check your internet connection",
                Toast.SHORT,
                
              );
              this.props.navigation.navigate('Home')
            }
          });
        });
      });
    });


  }


  pullDown = () => {


    this.SMSList();

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


  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };


  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
       
       <NavigationEvents onWillFocus={payload => {
           
              this.pullDown()

            }}/>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        {/* <Loader loading={this.state.loading} /> */}
        <Header
          backIcon={require('../images/menu.png')}
          pageTitle="Send SMS"
          back={() => {
            this._handleDrawer();
          }}
        />

        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} refreshControl={this._refreshControl()}>

            {this.state.data.status == "false" ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: height * .9 }}>
                <Text style={{ fontFamily: Fonts.medium, color: Colors.regular, fontSize: 16 }}>{this.state.data.message}</Text>
              </View>
              :
              <View style={{ flex: 1 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.dataSource}

                  renderItem={({ item }) => (
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 10,
                        flexDirection: "column",
                        backgroundColor: Colors.white,

                        borderTopLeftRadius: 5,
                        borderLeftWidth: 6,
                        borderLeftColor: this.state.selectCompany == item.id ? Colors.primary : Colors.medium_gray,
                        borderBottomLeftRadius: 5,

                        shadowOffset: { width: 0, height: 5 },
                        shadowColor: Colors.medium_gray,
                        shadowOpacity: 0.8,
                      }}
                    >

                      <TouchableOpacity onPress={() => { this.setState({ selectCompany: item.id }) }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            width: width * 0.95,


                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "column",
                              paddingBottom: 8
                            }}>
                            <Text
                              style={{
                                margin: 5,
                                fontSize: 14,
                                fontFamily: Fonts.bold,
                                color: Colors.primary,
                                paddingLeft: 5,
                                paddingVertical: 8
                              }}>
                              Call No. {item.call_no}
                            </Text>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  padding: 2,
                                  fontSize: 14,
                                  color: Colors.dark_gray,
                                  width: width * 0.3,
                                  paddingLeft: 15,
                                  fontFamily: Fonts.bold
                                }}>
                                Company
                      </Text>
                              <View style={{ flex: 1, flexDirection: "column" }}>
                                <Text
                                  style={{
                                    padding: 2,
                                    fontSize: 15,
                                    fontFamily: Fonts.bold,
                                    color: Colors.primary
                                  }}>
                                  {item.name}
                                </Text>
                              </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  padding: 2,
                                  fontSize: 14,
                                  color: Colors.dark_gray,
                                  width: width * 0.3,
                                  paddingLeft: 15,
                                  fontFamily: Fonts.regular
                                }}>
                                Caller name
                      </Text>
                              <View style={{ flex: 1, flexDirection: "column" }}>
                                <Text
                                  style={{
                                    padding: 2,
                                    fontSize: 14,
                                    color: Colors.primary,
                                    fontFamily: Fonts.regular
                                  }}>
                                  {item.caller_name}
                                </Text>
                              </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  padding: 2,
                                  fontSize: 14,
                                  color: Colors.dark_gray,
                                  width: width * 0.3,
                                  paddingLeft: 15,
                                  fontFamily: Fonts.regular
                                }}>
                                Phone
                      </Text>
                              <View style={{ flex: 1, flexDirection: "column" }}>
                                <Text
                                  style={{
                                    padding: 2,
                                    fontSize: 14,
                                    color: Colors.primary,
                                    fontFamily: Fonts.regular
                                  }}>
                                  {item.phone ? item.phone : '-'}
                                </Text>
                              </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  padding: 2,
                                  fontSize: 14,
                                  color: Colors.dark_gray,
                                  width: width * 0.3,
                                  paddingLeft: 15,
                                  fontFamily: Fonts.regular
                                }}>
                                Email
                      </Text>
                              <View style={{ flex: 1, flexDirection: "column" }}>
                                <Text
                                  style={{
                                    padding: 2,
                                    fontSize: 14,
                                    color: Colors.primary,
                                    fontFamily: Fonts.regular
                                  }}>
                              {item.email ? item.email : '-'}
                                </Text>
                              </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  padding: 2,
                                  fontSize: 14,
                                  color: Colors.dark_gray,
                                  width: width * 0.3,
                                  paddingLeft: 15,
                                  fontFamily: Fonts.regular
                                }}>
                                Reported Problem
                      </Text>
                              <View style={{ flex: 1, flexDirection: "column" }}>
                                <Text
                                  style={{
                                    padding: 2,
                                    fontSize: 14,
                                    color: Colors.primary,
                                    fontFamily: Fonts.regular
                                  }}>
                                  {item.reported_problem}
                                </Text>
                              </View>
                            </View>


                          </View>

                          {this.state.selectCompany == item.id ?
                            <View style={{ position: 'absolute', right: 4, top: 2 }}>
                              <ImageBackground
                                resizeMode="contain"
                                style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center', }}
                                source={require('../images/primaryfill.png')}>
                                <Image style={{ height: 20, width: 20, tintColor: Colors.white }} source={require('../images/tick.png')} />
                              </ImageBackground>

                            </View>
                            : null}
                        </View>

                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />

              </View>
            }



          </ScrollView>

          {this.state.selectCompany == "" ?
            <TouchableOpacity style={{
              flexDirection: 'row',
              width: width,
              height: width * 0.12,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.medium_gray,
            }} >
              <ImageBackground
                resizeMode="contain"
                style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                source={require('../images/fill.png')}>
                <Image style={{ height: 30, width: 30, tintColor: Colors.medium_gray }} source={require('../images/right.png')} />
              </ImageBackground>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.white,
                    fontFamily: Fonts.bold,
                  }}>

                  Send SMS
         </Text>
              </View>
            </TouchableOpacity>
            :


            <TouchableOpacity style={{
              flexDirection: 'row',
              width: width,
              height: width * 0.12,
              alignItems: 'center',
              bottom: 0,
              position: 'absolute',
              justifyContent: 'center',

              backgroundColor: Colors.primary,
              marginVertical: 0,
            }}

              onPress={() =>{
                NetInfo.fetch().then(state => {
                  if (state.isConnected) {
                    {this.state.submit ? this.GetLatLon() : null}
                  }else{
                   Toast.show(
                     'Please Check your internet connection',
                     Toast.SHORT,
                     
                   );
                 }
                 })
              }
              } 
                
            >


              <ImageBackground
                resizeMode="contain"
                style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                source={require('../images/fill.png')}>
                <Image style={{ height: 30, width: 30, tintColor: Colors.primary }} source={require('../images/right.png')} />
              </ImageBackground>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: Colors.white,
                    fontFamily: Fonts.bold,
                  }}>

                  Send SMS
  </Text>
              </View>
            </TouchableOpacity>




          }
        </View>



      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: 10,

    backgroundColor: "#f1f1f1"
  },
  btn: {

    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    width: width,
    alignItems: "center",
    justifyContent: 'center'
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  netAlert: {
    overflow: 'hidden',
    borderRadius: 10,
    shadowRadius: 10,
    width: width * 0.8,
    minHeight: height * 0.3,
    borderColor: '#f1f1f1',
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
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  netAlertDesc: {
    fontSize: 16,
    paddingTop: 10,
    alignSelf: 'center',
    width: width * 0.8,
    color: Colors.dark_gray,
    fontFamily: Fonts.light,
    paddingVertical: 5,
    textAlign: 'center',
  },
  textInput: {
    marginTop: 2,
    paddingVertical: Platform.OS == 'ios' ? 6 : 6,
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.medium,
    paddingHorizontal: 5,
  },
});
