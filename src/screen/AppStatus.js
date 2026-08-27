// // /https://github.com/react-navigation/react-navigation/issues/840

// //https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html#docsNav
import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Dimensions,
  YellowBox,
  Modal,
  Keyboard,
  ScrollView,
  AppState,
} from 'react-native';

const width = Dimensions.get('window').width;
// import AppState from 'react-native-app-state';

import HexagonGray from './src/components/HexagonGray';
import HexagonPrimary from './src/components/HexagonPrimary';
import {StackActions, NavigationActions ,addNavigationHelpers} from 'react-navigation';
import Loader from './src/common/Loader';
import Toast from 'react-native-simple-toast';
import Fonts from './src/common/Fonts';
import Colors from './src/common/Colors';
import CustomButton from './src/components/CustomButton';
import API from './src/common/API';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import timeout from './src/common/Timeout';
import OTPTextView from './src/components/OTPTextView';

var height = Dimensions.get('screen').height;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      loading: false,
      code: '1234',
      modalVisible: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('removeDigi').then(removeDigi => {
        if (id && removeDigi == '0') {
           this.setModalVisible(true);
        }
      });
    });

    this.setState({appState: nextAppState});
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  Digit_Password = () => {
    Keyboard.dismiss();
    if (this.state.code.length < 0) {
      Toast.show('Please enter your passcode', Toast.SHORT, );
    } else {
      this.setState({loading: true});

      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          AsyncStorage.getItem('id').then(id => {
            AsyncStorage.getItem('password').then(password => {
              var Request = {
                token: token+'/',
                branch_id: branch_id,
                id: id,
                password:this.state.code ,
              };
              // this.state.code 4
              console.log('Request', JSON.stringify(Request));
             
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.check_digit_password, {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(Request),
                    })
                    
                      .then(res => {
                        console.log(res);

                        if (res.status == 200) {
                          res.json().then(res => {
                            console.log('Digit_Password', res);
                            this.setState({loading: false, code: '1234'});

                            if (res.status == 'success') {
                              // const resetAction = StackActions.reset({
                              //   index: 0,
                              //   actions: [
                              //     NavigationActions.navigate({
                              //       routeName: 'Home',
                              //     }),
                              //   ],
                              // });
                              // this.props.navigation.dispatch(resetAction);

                              this.setModalVisible(false);
                              this.setState({loading: false});
                            } else if (res.status == 'failed') {
                              this.setState({loading: false});
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
                     
                            this.setModalVisible(false);
                           
                            } else {
                              setTimeout(() => {
                                Toast.show(
                                  res.message,
                                  Toast.SHORT,
                                  
                                );
                              }, 100);
                              this.setState({code: ''});
                              this.setState({loading: false});
                            }
                          });
                        } else {
                          AsyncStorage.removeItem('id');
                          AsyncStorage.removeItem('username');
                          AsyncStorage.removeItem('password');
                          this.setState({loading: false, loading1: false});
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );
                          }, 50);
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({routeName: 'Login'}),
                            ],
                          });
                          this.props.navigation.dispatch(resetAction);
                          this.setState({loading: false, loading1: false});
                        }
                      })
                      .catch(e => {
                        this.setState({loading: false});
                        console.log(e);
                        Toast.show(
                          'Something went wrong...',
                          Toast.SHORT,
                          
                        );
                      }),
                  ).catch(e => {
                    console.log(e);
                    this.setState({loading: false});
                    Toast.show(
                      'Please Check your internet connection',
                      Toast.SHORT,
                      
                    );
                  });
                } else {
                  this.setState({loading: false});
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                }
              });
            });
          });
        });
      });
    }
  };

  onAppStateChange = (appState, prevAppState) => {
    this.setModalVisible(true);
  };

	render() {

    return (
      <View style={{flex: 1}}>
        <AppNavigator navigation={this.props.navigation} />

        <View>
          {/* <AppState onChange={this.onAppStateChange}/> */}
          <Modal
            ref={'updateModal'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
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
            }}>
            <View style={styles.ModalContainer}>
              <View style={styles.netAlert}>
                <View style={styles.netAlertContent}>
                  <Loader loading={this.state.loading} />

                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        zIndex: 999,
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <KeyboardAvoidingView
                        style={{flex: 1}}
                        behavior="height"
                        enabled
                        keyboardVerticalOffset={0}>
                        <ScrollView
                          contentContainerStyle={{flex: 1}}
                          keyboardDismissMode="interactive">
                          <View style={{flex: 0.4, flexDirection: 'column'}}>
                            <View
                              style={{
                                flexDirection: 'column',
                                width: width * 0.8,

                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingTop: 80,
                                paddingVertical: 20,
                              }}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: Fonts.bold,
                                  color: Colors.dark_gray,
                                  // transform: [{ scale: scaleText }]
                                }}>
                                Enter your passcode here
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  paddingTop: 5,
                                  textAlign: 'left',
                                  fontFamily: Fonts.medium,
                                  color: Colors.medium_gray,
                                  // transform: [{ scale: scaleText }]
                                }}>
                                Your pin contains atleast 4 digits.
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    paddingTop: 5,
                                    paddingLeft: 5,

                                    fontFamily: Fonts.medium,
                                    color: Colors.medium_gray,
                                  }}></Text>
                              </View>
                            </View>
                          </View>

                          <OTPTextView
                            // autoFocus={true}
                            containerStyle={styles.textInputContainer}
                            onSubmitEditing={() => {
                              this.Digit_Password();
                            }}
                            handleTextChange={text => {
                              if (text.length == 4) {
                                console.log(text);

                                this.setState({code: text}, () => {
                                  this.Digit_Password();
                                });
                              } else {
                                this.setState({code: text});
                              }
                            }}
                            inputCount={4}
                            keyboardType="numeric"
                          />
                          <View
                            style={{
                              position: 'absolute',
                              alignItems: 'center',
                              bottom: 20,
                              justifyContent: 'center',
                              padding: 5,
                            }}>
                            <CustomButton
                              iconName={require('./src/images/right.png')}
                              name="Verify"
                              onPress={() => {
                                this.Digit_Password();
                              }}
                            />
                          </View>
                        </ScrollView>
                      </KeyboardAvoidingView>
                    </View>

                    <View
                      style={{
                        zIndex: 1,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        position: 'absolute',
                        zIndex: 99,
                      }}></View>
                    <View
                      style={{
                        zIndex: 1,
                        top: -50,
                        right: -50,
                        position: 'absolute',
                        opacity: 0.5,
                      }}>
                      <HexagonPrimary />
                    </View>

                    <View
                      style={{
                        zIndex: 1,
                        bottom: -50,
                        left: -50,
                        position: 'absolute',
                        opacity: 0.5,
                      }}>
                      <HexagonGray />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netAlert: {
    overflow: 'hidden',
    borderRadius: 10,
    shadowRadius: 10,
    width: width,
    height: height,
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
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 60,

    paddingVertical: Platform.OS == 'ios' ? 12 : 8,
    borderRadius: 5,
    width: width * 0.4,

    // position:'absolute',
    alignSelf: 'center',
    // bottom:100,

    backgroundColor: Colors.colorPrimary,
  },

  textInput: {
    width: '100%',
    fontSize: 40,
    letterSpacing: 50,

    alignSelf: 'center',
    textAlign: 'center',
    color: brandColor,
  },
});



// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   ScrollView,
//   Text,
//   View,
//   Image,
//   StatusBar,
//   TextInput,
//   TouchableOpacity,
//   BackHandler,
//   Keyboard,
// } from 'react-native';
// import HexagonGray from '../components/HexagonGray';
// import HexagonPrimary from '../components/HexagonPrimary';
// import {StackActions, NavigationActions} from 'react-navigation';
// import Loader from '../common/Loader';
// import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import Fonts from '../common/Fonts';
// import Colors from '../common/Colors';
// import CustomButton from '../components/CustomButton';
// import API from '../common/API';
// import AsyncStorage from '@react-native-community/async-storage';
// import * as NetInfo from '@react-native-community/netinfo';
// import timeout from '../common/Timeout';
// import OTPTextView from '../components/OTPTextView';

// var width = Dimensions.get('screen').width;
// var height = Dimensions.get('screen').height;

// const brandColor = '#3386C7';
// const MAX_LENGTH_CODE = 4;
// var Abc = 1;
// var temp = 1;
// export default class AppStatus extends Component {
//   static navigationOptions = ({navigation}) => ({
//     header: null,
//   });
//   constructor(props) {
//     temp = 2;
//     super(props);
//     this.state = {
//       loading: false,
//       mobile: '',
//       password: '',
//       otp: '',
//       code: '',
//       ID: '',
//       refresh: false,
//     };
//   }

//   _onChangeText = val => {
//     if (val.length === MAX_LENGTH_CODE) {
//       console.log('truue');

//       this.setState({code: val}, () => {
//         this.Digit_Password();
//       });
//     } else {
//       console.log('else');
//     }
//   };

//   componentWillMount() {
//     console.log('componentWillMount');

//     BackHandler.addEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   componentWillUnmount() {
//     console.log('componentWillUnmount');

//     BackHandler.removeEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   handleBackButtonClick() {
//     Abc++;
//     console.log('handleBackButtonClick');
//     if (Abc == 3) {
//       console.log('true');
//       BackHandler.exitApp();
//     } else {
//       Toast.show(
//         'Please Enter 4 Digit Security code',
//         Toast.SHORT,
//         
//       );
//     }
//     console.log('Abc', Abc);

//     return true;
//   }

//   _getSubmitAction = () => {
//     // this.state.enterCode  ?this._getCode():  this._verifyCode() ;
//     console.log('is call');
//   };

//   Digit_Password = () => {
//     Keyboard.dismiss();
//     console.log('Digit_Password');
//     console.log(this.state.code);
//     if (this.state.code.length < 4) {
//       Toast.show('Please enter your passcode', Toast.SHORT, );
//     } else {
//       this.setState({loading: true});

//       AsyncStorage.getItem('token').then(token => {
//         AsyncStorage.getItem('branch_id').then(branch_id => {
//           AsyncStorage.getItem('id').then(id => {
//             AsyncStorage.getItem('password').then(password => {
//               var Request = {
//                 token: token,
//                 branch_id: branch_id,
//                 id: id,
//                 password: this.state.code,
//               };

//               console.log('Request', JSON.stringify(Request));
//               console.log('errrr');

//               NetInfo.fetch().then(state => {
//                 if (state.isConnected) {
//                   timeout(
//                     15000,
//                     fetch(API.check_digit_password, {
//                       method: 'POST',
//                       headers: {
//                         Accept: 'application/json',
//                         'Content-Type': 'application/json',
//                       },
//                       body: JSON.stringify(Request),
//                     })
//                       .then(res => {
//                         if (res.status == 200) {
//                           res.json().then(res => {
//                             console.log('Digit_Password', res.status);
//                             this.setState({loading: false});

//                             if (res.status == 'success') {
//                               // const resetAction = StackActions.reset({
//                               //   index: 0,
//                               //   actions: [
//                               //     NavigationActions.navigate({
//                               //       routeName: 'Home',
//                               //     }),
//                               //   ],
//                               // });
//                               // this.props.navigation.dispatch(resetAction);
//                               this.props.navigation.goBack();
//                               this.setState({loading: false});
//                             } else if (res.status == 'failed') {
//                               this.setState({loading: false});

//                               console.log('failed');
//                               AsyncStorage.removeItem('id');
//                               AsyncStorage.removeItem('username');
//                               AsyncStorage.removeItem('password');
//                               this.setState({loading: false});
//                               setTimeout(() => {
//                                 Toast.show(
//                                   res.message,
//                                   Toast.SHORT,
//                                   
//                                 );
//                               }, 50);
//                               const resetAction = StackActions.reset({
//                                 index: 0,
//                                 actions: [
//                                   NavigationActions.navigate({
//                                     routeName: 'Login',
//                                   }),
//                                 ],
//                               });
//                               this.props.navigation.dispatch(resetAction);
//                             } else {
//                               setTimeout(() => {
//                                 Toast.show(
//                                   res.message,
//                                   Toast.SHORT,
//                                   
//                                 );
//                               }, 100);

//                               this.setState({loading: false});
//                             }
//                           });
//                         } else {
//                           AsyncStorage.removeItem('id');
//                           AsyncStorage.removeItem('username');
//                           AsyncStorage.removeItem('password');
//                           this.setState({loading: false, loading1: false});
//                           setTimeout(() => {
//                             Toast.show(res.message, Toast.SHORT, );
//                           }, 50);
//                           const resetAction = StackActions.reset({
//                             index: 0,
//                             actions: [
//                               NavigationActions.navigate({routeName: 'Login'}),
//                             ],
//                           });
//                           this.props.navigation.dispatch(resetAction);
//                           this.setState({loading: false, loading1: false});
//                         }
//                       })
//                       .catch(e => {
//                         this.setState({loading: false});
//                         console.log(e);
//                         Toast.show(
//                           'Something went wrong...',
//                           Toast.SHORT,
//                           
//                         );
//                       }),
//                   ).catch(e => {
//                     console.log(e);
//                     this.setState({loading: false});
//                     Toast.show(
//                       'Please Check your internet connection',
//                       Toast.SHORT,
//                       
//                     );
//                   });
//                 } else {
//                   this.setState({loading: false});
//                   Toast.show(
//                     'Please Check your internet connection',
//                     Toast.SHORT,
//                     
//                   );
//                 }
//               });
//             });
//           });
//         });
//       });
//     }
//   };

//   render() {
//     let textStyle =
//       temp == 1
//         ? {
//             height: 50,
//             textAlign: 'center',
//             fontSize: 40,
//             fontFamily: Fonts.bold,
//             fontFamily: 'Courier',
//           }
//         : {};
//     return (
//       <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
//         <StatusBar hidden={false} />
//         <Loader loading={this.state.loading} />
//         <View style={styles.container}>
//           <KeyboardAvoidingView style={{flex: 1}}>
//             <View
//               style={{
//                 flex: 1,
//                 zIndex: 999,
//                 position: 'relative',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <ScrollView
//                 keyboardShouldPersistTaps="always"
//                 contentContainerStyle={{flex: 1}}>
//                 <View style={{flex: 0.4, flexDirection: 'column'}}>
//                   <View
//                     style={{
//                       flexDirection: 'column',
//                       width: width * 0.8,

//                       alignItems: 'flex-start',
//                       justifyContent: 'center',
//                       paddingTop: 80,
//                       paddingVertical: 20,
//                     }}>
//                     <Text
//                       style={{
//                         fontSize: 20,
//                         fontFamily: Fonts.bold,
//                         color: Colors.dark_gray,
//                         // transform: [{ scale: scaleText }]
//                       }}>
//                       Enter your passcode
//                     </Text>
//                     <Text
//                       style={{
//                         fontSize: 16,
//                         paddingTop: 5,
//                         textAlign: 'left',
//                         fontFamily: Fonts.medium,
//                         color: Colors.medium_gray,
//                         // transform: [{ scale: scaleText }]
//                       }}>
//                       Your pin contains atleast 4 digits.
//                     </Text>
//                     <View style={{flexDirection: 'row'}}>
//                       <Text
//                         style={{
//                           fontSize: 16,
//                           paddingTop: 5,
//                           paddingLeft: 5,

//                           fontFamily: Fonts.medium,
//                           color: Colors.medium_gray,
//                         }}></Text>
//                     </View>
//                   </View>
//                 </View>

//                 <OTPTextView
//                   containerStyle={styles.textInputContainer}
//                   onSubmitEditing={() => {
//                     this.Digit_Password();
//                   }}
//                   handleTextChange={text => {
//                     if (text.length == 4) {
//                       console.log(text);

//                       this.setState({code: text}, () => {
//                         this.Digit_Password();
//                       });
//                     } else {
//                       this.setState({code: text});
//                     }
//                   }}
//                   inputCount={4}
//                   keyboardType="numeric"
//                 />
//                 {/* 
//                 <View style={{width: '100%'}}>
//                   <TextInput
//                     ref={'textInput'}
//                     underlineColorAndroid={'transparent'}
//                     autoCapitalize={'none'}
//                     autoCorrect={false}
//                     onChangeText={this._onChangeText}
//                     // placeholder={'____'}
//                     keyboardType="numeric"
//                     style={[styles.textInput, textStyle]}
//                     autoFocus={true}
//                     secureTextEntry={true}
//                     placeholderTextColor={brandColor}
//                     selectionColor={brandColor}
//                     maxLength={4}
//                     onSubmitEditing={this._getSubmitAction}
//                   />
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '90%',
//                       alignSelf: 'center',
//                     }}>
//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 12}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 12}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 15}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 15}}
//                       source={require('../images/minus.png')}
//                     />
//                   </View>
//                 </View> */}

//                 <View
//                   style={{
//                     position: 'absolute',
//                     alignItems: 'center',
//                     bottom: 20,
//                     justifyContent: 'center',
//                     padding: 5,
//                   }}>
//                   <CustomButton
//                     iconName={require('../images/right.png')}
//                     name="Verify"
//                     onPress={() => {
//                       this.Digit_Password();
//                     }}
//                   />
//                 </View>
//               </ScrollView>
//             </View>

//             <View
//               style={{
//                 zIndex: 1,
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',
//                 zIndex: 99,
//               }}></View>
//             <View
//               style={{
//                 zIndex: 1,
//                 top: -50,
//                 right: -50,
//                 position: 'absolute',
//                 opacity: 0.5,
//               }}>
//               <HexagonPrimary />
//             </View>

//             <View
//               style={{
//                 zIndex: 1,
//                 bottom: -50,
//                 left: -50,
//                 position: 'absolute',
//                 opacity: 0.5,
//               }}>
//               <HexagonGray />
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },

//   txt: {
//     color: Colors.colorPrimary,
//     fontSize: 15,
//     fontFamily: Fonts.Regular,
//   },
//   text: {
//     marginLeft: 5,
//     color: Colors.colorPrimary,
//     fontSize: 17,
//     fontFamily: Fonts.medium,
//   },
//   btn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 60,

//     paddingVertical: Platform.OS == 'ios' ? 12 : 8,
//     borderRadius: 5,
//     width: width * 0.4,

//     // position:'absolute',
//     alignSelf: 'center',
//     // bottom:100,

//     backgroundColor: Colors.colorPrimary,
//   },

//   textInput: {
//     width: '100%',
//     fontSize: 40,
//     letterSpacing: 50,

//     alignSelf: 'center',
//     textAlign: 'center',
//     color: brandColor,
//   },
// });



// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   ScrollView,
//   Text,
//   View,
//   Image,
//   StatusBar,
//   TextInput,
//   TouchableOpacity,
//   BackHandler,
// } from 'react-native';
// import HexagonGray from '../components/HexagonGray';
// import HexagonPrimary from '../components/HexagonPrimary';
// import {StackActions, NavigationActions} from 'react-navigation';
// import Loader from '../common/Loader';
// import Toast from 'react-native-simple-toast';
// import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import Fonts from '../common/Fonts';
// import Colors from '../common/Colors';
// import CustomButton from '../components/CustomButton';
// import API from '../common/API';
// import AsyncStorage from '@react-native-community/async-storage';
// import * as NetInfo from '@react-native-community/netinfo';
// import timeout from '../common/Timeout';

// var width = Dimensions.get('screen').width;
// var height = Dimensions.get('screen').height;

// const brandColor = '#3386C7';
// const MAX_LENGTH_CODE = 4;
// var Abc = 1;
// var temp = 1;
// export default class OTP extends Component {
//   static navigationOptions = ({navigation}) => ({
//     header: null,
//   });
//   constructor(props) {
//     temp = 2;
//     super(props);
//     this.state = {
//       loading: false,
//       mobile: '',
//       password: '',
//       otp: '',
//       code: '',
//       ID: '',
//       refresh: false,
//     };
//   }

//   _onChangeText = val => {
//     if (val.length === MAX_LENGTH_CODE) {
//       console.log('truue');

//       this.setState({code: val}, () => {
//       this.Digit_Password();
        
//       });
//     } else {
//       console.log('else');
//     }
//   };

//   componentWillMount() {
//     console.log('componentWillMount');

//     BackHandler.addEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   componentWillUnmount() {
//     console.log('componentWillUnmount');

//     BackHandler.removeEventListener(
//       'hardwareBackPress',
//       this.handleBackButtonClick,
//     );
//   }

//   handleBackButtonClick() {
//     Abc++;
//     console.log('handleBackButtonClick');
//     if (Abc == 3) {
//       console.log('true');
//       BackHandler.exitApp();
//     } else {
//       Toast.show(
//         'Please Enter 4 Digit Security code',
//         Toast.SHORT,
//         
//       );
//     }
//     console.log('Abc', Abc);

//     return true;
//   }

//   _getSubmitAction = () => {
//     // this.state.enterCode  ?this._getCode():  this._verifyCode() ;
//     console.log('is call');
//   };

//   Digit_Password = () => {
//     console.log('Digit_Password');
//     console.log(this.state.code);

//     this.setState({loading: false});

//     AsyncStorage.getItem('token').then(token => {
//       AsyncStorage.getItem('branch_id').then(branch_id => {
//         AsyncStorage.getItem('id').then(id => {
//           AsyncStorage.getItem('password').then(password => {
//             var Request = {
//               token: token,
//               branch_id: branch_id,
//               id: id,
//               password: this.state.code,
//             };

//             console.log('Request',Request);
//             console.log('errrr');

//             NetInfo.fetch().then(state => {
//               if (state.isConnected) {
//                 timeout(
//                   15000,
//                   fetch(API.check_digit_password, {
//                     method: 'POST',
//                     headers: {
//                       Accept: 'application/json',
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(Request),
//                   })
//                     .then(res => {
//                       if (res.status == 200) {
//                         res.json().then(res => {
//                           console.log('Digit_Password', res.status);

//                           if (res.status == 'success') {



//                             this.props.navigation.goBack();

//                             console.log('123 s');
                            
//                             Toast.show(res.status, Toast.SHORT, );
                          
//                           } else if (res.status == 'failed') {
//                             console.log('failed');
//                             AsyncStorage.removeItem('id');
//                             AsyncStorage.removeItem('username');
//                             AsyncStorage.removeItem('password');
//                             this.setState({loading: false});
//                             setTimeout(() => {
//                               Toast.show(
//                                 res.message,
//                                 Toast.SHORT,
//                                 
//                               );
//                             }, 50);
//                             const resetAction = StackActions.reset({
//                               index: 0,
//                               actions: [
//                                 NavigationActions.navigate({
//                                   routeName: 'Login',
//                                 }),
//                               ],
//                             });
//                             this.props.navigation.dispatch(resetAction);
//                           } else {
                      
//                             Toast.show(res.message, Toast.SHORT, );
//                             this.setState({loading: false});
//                           }
//                         });
//                       }
//                     })
//                     .catch(e => {
//                       this.setState({loading: false});
//                       console.log(e);
//                       Toast.show(
//                         'Something went wrong...',
//                         Toast.SHORT,
//                         
//                       );
//                     }),
//                 ).catch(e => {
//                   console.log(e);
//                   this.setState({loading: false});
//                   Toast.show(
//                     'Please Check your internet connection',
//                     Toast.SHORT,
//                     
//                   );
//                 });
//               } else {
//                 this.setState({loading: false});
//                 Toast.show(
//                   'Please Check your internet connection',
//                   Toast.SHORT,
//                   
//                 );
//               }
//             });
//           });
//         });
//       });
//     });
//   };

//   render() {
//     let textStyle =
//       temp == 1
//         ? {
//             height: 50,
//             textAlign: 'center',
//             fontSize: 40,
//             fontFamily: Fonts.bold,
//             fontFamily: 'Courier',
//           }
//         : {};
//     return (
//       <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
//         <StatusBar hidden={false} />
//         <View style={styles.container}>
//           <KeyboardAvoidingView style={{flex: 1}}>
//             <View
//               style={{
//                 flex: 1,
//                 zIndex: 999,
//                 position: 'relative',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <ScrollView
//                 keyboardShouldPersistTaps="always"
//                 contentContainerStyle={{flex: 1}}>
//                 <View style={{flex: 0.4, flexDirection: 'column'}}>
//                   <View
//                     style={{
//                       flexDirection: 'column',
//                       width: width * 0.8,
//                       alignItems: 'flex-start',
//                       justifyContent: 'center',
//                       paddingTop: 20,
//                       paddingVertical: 20,
//                     }}>
//                     <Text
//                       style={{
//                         fontSize: 20,
//                         fontFamily: Fonts.bold,
//                         color: Colors.dark_gray,
//                         // transform: [{ scale: scaleText }]
//                       }}>
//                       Enter Security Code
//                     </Text>
//                     <Text
//                       style={{
//                         fontSize: 16,
//                         paddingTop: 5,
//                         textAlign: 'left',
//                         fontFamily: Fonts.medium,
//                         color: Colors.medium_gray,
//                         // transform: [{ scale: scaleText }]
//                       }}>
//                       Security Code has been
//                     </Text>
//                     <View style={{flexDirection: 'row'}}>
//                       <Text
//                         style={{
//                           fontSize: 16,
//                           paddingTop: 5,
//                           paddingLeft: 5,

//                           fontFamily: Fonts.medium,
//                           color: Colors.medium_gray,
//                         }}></Text>
//                     </View>
//                   </View>
//                 </View>

//                 <View style={{width: '100%'}}>
//                   <TextInput
//                     ref={'textInput'}
//                     underlineColorAndroid={'transparent'}
//                     autoCapitalize={'none'}
//                     autoCorrect={false}
//                     onChangeText={this._onChangeText}
//                     // placeholder={'____'}
//                     keyboardType="numeric"
//                     style={[styles.textInput, textStyle]}
//                     autoFocus={true}
//                     secureTextEntry={true}
//                     placeholderTextColor={brandColor}
//                     selectionColor={brandColor}
//                     maxLength={4}
//                     onSubmitEditing={this._getSubmitAction}
//                   />
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '90%',
//                       alignSelf: 'center',
//                     }}>
//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 12}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 12}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 15}}
//                       source={require('../images/minus.png')}
//                     />

//                     <Image
//                       style={{height: 20, width: 37, marginHorizontal: 15}}
//                       source={require('../images/minus.png')}
//                     />
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     position:'absolute',
//                     alignItems: 'center',
//                     bottom:20,
//                     justifyContent: 'center',
//                     padding: 5,
//                   }}>
//                   <CustomButton
//                     iconName={require('../images/right.png')}
//                     name="Verify"
//                     onPress={() => {
//                       this.Digit_Password();
//                     }}
//                   />
//                 </View>
//               </ScrollView>
//             </View>

//             <View
//               style={{
//                 zIndex: 1,
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 position: 'absolute',
//                 zIndex: 99,
//               }}></View>
//             <View
//               style={{
//                 zIndex: 1,
//                 top: -50,
//                 right: -50,
//                 position: 'absolute',
//                 opacity: 0.5,
//               }}>
//               <HexagonPrimary />
//             </View>

//             <View
//               style={{
//                 zIndex: 1,
//                 bottom: -50,
//                 left: -50,
//                 position: 'absolute',
//                 opacity: 0.5,
//               }}>
//               <HexagonGray />
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },

//   txt: {
//     color: Colors.colorPrimary,
//     fontSize: 15,
//     fontFamily: Fonts.Regular,
//   },
//   text: {
//     marginLeft: 5,
//     color: Colors.colorPrimary,
//     fontSize: 17,
//     fontFamily: Fonts.medium,
//   },
//   btn: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 60,

//     paddingVertical: Platform.OS == 'ios' ? 12 : 8,
//     borderRadius: 5,
//     width: width * 0.4,

//     // position:'absolute',
//     alignSelf: 'center',
//     // bottom:100,

//     backgroundColor: Colors.colorPrimary,
//   },

//   textInput: {
//     width: '100%',
//     fontSize: 40,
//     letterSpacing: 50,

//     textDecorationLine: 'underline',
//     alignSelf: 'center',
//     textAlign: 'center',
//     color: brandColor,
//   },
// });
