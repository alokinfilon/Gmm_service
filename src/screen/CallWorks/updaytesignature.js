import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  View,
  TouchableHighlight,
  SafeAreaView,
  Image,
} from 'react-native';
import { check, request, PERMISSIONS, openSettings, RESULTS } from 'react-native-permissions';
import Colors from '../../common/Colors';
import SignatureCapture from 'react-native-signature-capture';
import BackHeader from '../../components/BackHeader';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { StackActions, NavigationActions } from 'react-navigation';
import API from '../../common/API';
import timeout from '../../common/Timeout';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import Fonts from '../../common/Fonts';
import HorizontalButton from '../../components/HorizontalButton';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
var Signature = ''
var isSaveSing = false, src3 = [];
export default class UpdateSignature extends React.Component {
  constructor(props) {
    Signature = ''
    super(props);
    this.state = {
      lock: true,
      base64Icon: null,
      loading: false,
      AA: '',
      refress: false,
      isSaveSing: false,
      src1: [],
      src2: [],
      src3: [],
      src4: [],
      src5: [],

      offile: [],

      submit: true

    };
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  componentDidMount() {

    AsyncStorage.getItem("one").then(one => {
      AsyncStorage.getItem("two").then(two => {
        AsyncStorage.getItem("three").then(three => {
          AsyncStorage.getItem("four").then(four => {
            AsyncStorage.getItem("five").then(five => {
            AsyncStorage.getItem("TakeImage").then(TakeImage => {
            AsyncStorage.getItem("TakeImage2").then(TakeImage2 => {
              //  src3.push(JSON.parse(three))
              this.setState({
                src1: JSON.parse(one),
                src2: JSON.parse(two),
                src3: JSON.parse(three),
                src4: JSON.parse(four),
                src5: JSON.parse(five)
              }, () => {

                this.state.src4 = this.state.src4.concat(JSON.parse(TakeImage))
                this.state.src5 = this.state.src5.concat(JSON.parse(TakeImage2))

                setTimeout(() => {
                  console.log('this.state.src4', this.state.src4);
                  console.log('this.state.src5', this.state.src5);
                }, 500);
              })
            })
          })
        })
      })
    })
    })
  })

  }

  componentWillUnmount() {
    AsyncStorage.setItem('removeDigi', "0");
  }
  _onSaveEvent(result) {
    console.log('result', result.encoded);
    // AsyncStorage.setItem('UpdateSignature',result.encoded);
    Signature = result.encoded
  }

  saveSign = () => {

    this.setState({ loading: true, submit: false })

    Geolocation.getCurrentPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });

      // console.log('longitude', position.coords.longitude);
      // console.log('latitude', position.coords.latitude);
      var lat = position.coords.latitude;
      var long = position.coords.longitude;

      if (isSaveSing) {

        this.refs['sign'].saveImage()

        this.onlineproceed(lat, long)


      }
      else {
        this.setState({ loading: false, submit: true })
        Toast.show(
          'Please Write Your Signature',
          Toast.SHORT,

        );
      }

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
                  // this.saveSign()
                  this.setState({ loading: false, submit: false }, () => {
                    setTimeout(() => {
                      AsyncStorage.setItem('removeDigi', "0")
                    }, 500);
                  })
                }).catch(err => {
                  this.setState({ loading: false, submit: true });
                  console.log(err);

                });
            } else {
              Toast.show("Please Turn on Your Location", Toast.SHORT,);
              this.setState({ loading: false, submit: true })
            }

          }
          else if (error.message == "User denied access to location services.") {
            this.setState({ loading: false, submit: true })
            Toast.show("Please Allow access to location services.", Toast.SHORT,);
            setTimeout(() => {
              openSettings().catch(() => console.warn('cannot open settings'));
            }, 2000);

          }
          else {
            this.setState({ loading: false, submit: true })
            Toast.show(error.message, Toast.SHORT,);
          }
        }, 50)
        console.log(error)
      },
      { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
    );
  }

  Test = () => {
    console.log(this.state.src4);

    AsyncStorage.getItem('encode').then(encode => {
      console.log('if call');
      AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
            // AsyncStorage.getItem("UpdateSignature").then(UpdateSignature => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              signature: Signature,
              // lat: lat,
              // long: long,
              first: this.state.src1,
              second: this.state.src2,
              third: this.state.src3
            }

            var data = new FormData();
            this.state.src4.map((file, index) => {
              data.append(`image${index}`, file);
            });
            this.state.src5.map((file, index) => {
              data.append(`feedbackdocument${index}`, file);
            });
            data.append('jsondata', JSON.stringify(Request));

            console.log(data);
            console.log('https://ws.infilon.net/rahul-api2.php');
            console.log('Request', JSON.stringify(data));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch('https://ws.infilon.net/rahul-api2.php', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                    body: data,
                  })
                    .then(res => {
                      if (res.status == 200) {
                        console.log(res);
                        this.setState({ loading: false, loading1: false, submit: true });
                        res.json().then(res => {
                          console.log('https://ws.infilon.net/rahul-api2.php', res);

                          if (res.status == 'success') {


                            // AsyncStorage.removeItem('UpdateSignature');
                            AsyncStorage.removeItem('calltype');
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: 'Home',
                                }),
                              ],
                            });
                            this.props.navigation.dispatch(resetAction);
                            AsyncStorage.setItem('removeDigi', "1")


                          } else if (res.status == 'failed') {

                            this.setState({ loading: false, loading1: false, submit: true });
                            AsyncStorage.removeItem('id');
                            AsyncStorage.removeItem('username');
                            AsyncStorage.removeItem('name');
                            AsyncStorage.removeItem('email');
                            AsyncStorage.removeItem('branch_id');
                            AsyncStorage.removeItem('type_id');
                            AsyncStorage.removeItem('digit_password');
                            AsyncStorage.removeItem('password');
                            AsyncStorage.removeItem('customer_master');
                            AsyncStorage.removeItem('join_call');
                            AsyncStorage.setItem('removeDigi', "0")
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({ routeName: 'Login' }),
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
                            setTimeout(() => {
                              Toast.show(res.message, Toast.SHORT,);
                            }, 50);
                          }
                        });
                      } else {
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
                      this.setState({ loading: false, loading1: false, submit: true });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,

                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({ loading: false, loading1: false, submit: true });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,

                  );
                });
              } else {
                this.setState({ loading: false, loading1: false, submit: true });
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,

                );
              }
            });
          })
        })
      })
    })
  }

  onlineproceed(lat, long) {
    this.setState({ loading: true, submit: false })
    setTimeout(() => {

      AsyncStorage.getItem('encode').then(encode => {
        console.log('if call');
        AsyncStorage.getItem("id").then(id => {
          AsyncStorage.getItem("token").then(token => {
            AsyncStorage.getItem("branch_id").then(branch_id => {
              // AsyncStorage.getItem("UpdateSignature").then(UpdateSignature => {
              var Request = {
                token: token,
                id: id,
                branch_id: branch_id,
                signature: Signature,
                lat: lat,
                long: long,
                first: this.state.src1,
                second: this.state.src2,
                third: this.state.src3
              }

              var data = new FormData();
              this.state.src4.map((file, index) => {
                data.append(`report${index}`, file);
              });
              this.state.src5.map((file1, index) => {
                data.append(`feedbackdocument${index}`, file1);
              });
              data.append('jsondata', JSON.stringify(Request));

              console.log(data);
              console.log(API.e_call_complete);
              console.log('Request', JSON.stringify(data));
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    60000,
                    fetch(API.e_call_complete, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      },
                      body: data,
                    })
                      .then(res => {
                        if (res.status == 200) {
                          console.log(res);
                          this.setState({ loading: false, loading1: false, submit: true });
                          res.json().then(res => {
                            console.log('e_call_complete:::  ', res);

                            if (res.status == 'success') {

                              AsyncStorage.removeItem('one');
                              AsyncStorage.removeItem('two');
                              AsyncStorage.removeItem('three');
                              AsyncStorage.removeItem('four');
                              AsyncStorage.removeItem('five');
                              AsyncStorage.removeItem('DateArray');
                              AsyncStorage.removeItem('Local');
                              AsyncStorage.removeItem('ischeckData');
                              AsyncStorage.removeItem('iscryLock');
                              AsyncStorage.removeItem('isradioItems');
                              AsyncStorage.removeItem('isGlassDataDetail');
                              AsyncStorage.removeItem('isGlassData');
                              AsyncStorage.removeItem('TakeImage')

                              // AsyncStorage.removeItem('UpdateSignature');
                              AsyncStorage.removeItem('calltype');
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({
                                    routeName: 'Home',
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                              AsyncStorage.setItem('removeDigi', "1")


                            } else if (res.status == 'failed') {

                              this.setState({ loading: false, loading1: false, submit: true });
                              AsyncStorage.removeItem('id');
                              AsyncStorage.removeItem('username');
                              AsyncStorage.removeItem('name');
                              AsyncStorage.removeItem('email');
                              AsyncStorage.removeItem('branch_id');
                              AsyncStorage.removeItem('type_id');
                              AsyncStorage.removeItem('digit_password');
                              AsyncStorage.removeItem('password');
                              AsyncStorage.removeItem('customer_master');
                              AsyncStorage.removeItem('join_call');
                              AsyncStorage.setItem('removeDigi', "0")
                              AsyncStorage.removeItem('one');
                              AsyncStorage.removeItem('two');
                              AsyncStorage.removeItem('three');
                              AsyncStorage.removeItem('four');
                              AsyncStorage.removeItem('five');
                              AsyncStorage.removeItem('DateArray');
                              AsyncStorage.removeItem('Local');
                              AsyncStorage.removeItem('ischeckData');
                              AsyncStorage.removeItem('iscryLock');
                              AsyncStorage.removeItem('isradioItems');
                              AsyncStorage.removeItem('isGlassDataDetail');
                              AsyncStorage.removeItem('isGlassData');
                              AsyncStorage.removeItem('TakeImage')
                              const resetAction = StackActions.reset({
                                index: 0,
                                actions: [
                                  NavigationActions.navigate({ routeName: 'Login' }),
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
                                  Toast.show(res.message, Toast.SHORT,);
                                }, 50);

                                AsyncStorage.removeItem('one');
                                AsyncStorage.removeItem('two');
                                AsyncStorage.removeItem('three');
                                AsyncStorage.removeItem('four');
                                AsyncStorage.removeItem('five');
                                AsyncStorage.removeItem('DateArray');
                                AsyncStorage.removeItem('Local');
                                AsyncStorage.removeItem('ischeckData');
                                AsyncStorage.removeItem('iscryLock');
                                AsyncStorage.removeItem('isradioItems');
                                AsyncStorage.removeItem('isGlassDataDetail');
                                AsyncStorage.removeItem('isGlassData');
                                AsyncStorage.removeItem('TakeImage')

                                // AsyncStorage.removeItem('UpdateSignature');
                                AsyncStorage.removeItem('calltype');
                                const resetAction = StackActions.reset({
                                  index: 0,
                                  actions: [
                                    NavigationActions.navigate({
                                      routeName: 'Home',
                                    }),
                                  ],
                                });
                                this.props.navigation.dispatch(resetAction);
                                AsyncStorage.setItem('removeDigi', "1")
                              }

                            }
                          });
                        } else {
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

                        NetInfo.fetch().then(state => {
                          if (!state.isConnected) {
                            Toast.show(
                              'Please Check your internet connection',
                              Toast.SHORT,

                            );

                          } else {
                            this.setState({ loading: false, loading1: false, submit: true });
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
                    this.setState({ loading: false, loading1: false, submit: true });
                    Toast.show(
                      'Please Check your internet connection',
                      Toast.SHORT,

                    );
                  });
                } else {
                  this.setState({ loading: false, loading1: false, submit: true });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,

                  );
                }
              });

            })
          })
        })
      })
    }, 3000);
  }




  resetSign() {
    isSaveSing = false
    this.refs['sign'].resetImage();
  }


  _onDragEvent() {
    isSaveSing = true
  }

  isReset = () => {
    isSaveSing = false
    // AsyncStorage.removeItem('UpdateSignature');
    Signature = ''

  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <BackHeader
          backIcon={require('../../images/Left_arrow.png')}
          pageTitle={'Customer Signature'}
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <Loader loading={this.state.loading} />
        {/* {this.state.base64Icon == null ? ( */}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 0.9 }}>
            <SignatureCapture
              style={[styles.signature]}
              ref="sign"
              onSaveEvent={this._onSaveEvent}
              onDragEvent={this._onDragEvent}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              viewMode={'portrait'}
            />
          </View>

          <View
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              borderTopColor: Colors.dark_gray,
              backgroundColor: Colors.white,
            }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>

              <HorizontalButton
                fImage={require('../../images/tick.png')}
                sImage={require('../../images/refresh.png')}
                fcolor={Colors.primary}
                scolor={Colors.red}
                fLabel={"End Work"}
                sLabel="Reset"
                fButton={() => {
                  NetInfo.fetch().then(state => {
                    if (state.isConnected) {
                      this.state.submit ? this.saveSign() : null
                    } else {
                      Toast.show(
                        'Please Check your internet connection',
                        Toast.SHORT,

                      );
                    }
                  })

                  // this.state.submit ? this.Test() : null
                  console.log(this.state.submit ? 'true' : 'null');

                }}

                sButton={() => {
                  this.resetSign();
                }}
              />
            </View>
          </View>
          {/* <View style={{
              flex: 0.1,
              borderTopWidth: 0,
              borderTopColor: Colors.dark_gray,
              backgroundColor: Colors.white,
            }}> */}
          {/* <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  this.saveSign();
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 16,
                    color: Colors.white,
                  }}>
                  End Work
                  </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn2}
                onPress={() => {
                  this.resetSign();
                }}>
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 16,
                    color: Colors.white,
                  }}>
                  Reset
                  </Text>
              </TouchableOpacity>
          </View> */}
        </View>
        <View style={{
          height: 60,
          width: 80,
          position: "absolute",
          bottom: 90, right: 25,
        }}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '80%',
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 32,
              alignSelf: 'center',

              backgroundColor: Colors.primary, elevation: 4
            }}
            onPress={() => {
              this.props.navigation.navigate('TakeVideo')
            }}
          >
            <Image style={{ height: 38, width: 38, tintColor: 'white' }}
              source={require('../../images/At.png')}></Image>

          </TouchableOpacity>
          {/* <View style={{elevation:3,backgroundColor:'white',marginTop:2}}>
          <Text style={{fontSize:12,fontFamily:Fonts.medium,padding:0.5,marginLeft:4,alignItems:'center'}}>Attachment</Text> 
          </View> */}
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    margin: 1,
  },
  btn2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 10,
    margin: 1,
  },
});
