import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text, Modal,
  SafeAreaView,
  Dimensions, KeyboardAvoidingView,
  Keyboard, Image,
  ScrollView, ImageBackground,
  StatusBar, AppState,
  TouchableWithoutFeedback
} from 'react-native';
import HexagonGray from '../components/HexagonGray';
import HexagonPrimary from '../components/HexagonPrimary';
import OTPTextView from '../components/OTPTextView';

import API from '../common/API';
import timeout from '../common/Timeout';

import Toast from 'react-native-simple-toast';

import * as NetInfo from '@react-native-community/netinfo';
import { StackActions, NavigationActions } from 'react-navigation';

import Icon from "react-native-vector-icons/FontAwesome";
import Today from './CallWorks/Today';
import Future from './CallWorks/Future';
import Completed from './CallWorks/Completed';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header'
import Colors from '../common/Colors';
import { TabView } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import Loader from '../common/Loader';
import Fonts from '../common/Fonts';
import OneSignal from 'react-native-onesignal'
var notification = '';
var isopenResult = '';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const brandColor = '#3386C7';
class EmployeeRegister extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      loading: false,
      id: '',
      loading: false,
      code: '',
      modalVisible: false,
      appState: AppState.currentState,
      SnakBar: false,
      passcodeVisible: true,
      Load: true,
      SnakBarText: '',
      join_callData: {},
      routes: [
        { key: 'today', title: 'TODAY' },
        { key: 'future', title: 'FUTURE' },
        { key: 'completed', title: 'COMPLETED' },
      ],
    };
    // this.ForSnakBar()
    OneSignal.setLogLevel(6, 0);
    let requiresConsent = false;
    OneSignal.setRequiresUserPrivacyConsent(requiresConsent);
    OneSignal.init("048ccf8c-ebab-4c12-b920-4fe59ee727de", { kOSSettingsKeyAutoPrompt: true });
    OneSignal.configure();
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.setSubscription(true);

  }


  // onAppStateChange = (appState, prevAppState) => {
  //   console.log(this.constructor.name, 'onAppStateChange()', prevAppState, '=>', appState); 
  //    this.props.navigation.navigate('AppStatus')

  //   //   actions: [
  //   //     NavigationActions.navigate({ routeName: "AppStatus" })
  //   //   ]
  //   // });
  //   // this.props.navigation.dispatch(resetAction);
  // };
  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };



  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.setItem('removeDigi', "0")
    }, 800);

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('removeDigi').then(removeDigi => {
        if (id && removeDigi == '0') {
          console.log('one', removeDigi);
          this.setModalVisible(true);
          this.setState({ passcodeVisible: true, Load: false })

        } else {
          console.log('two', removeDigi);
          this.setState({ passcodeVisible: false, Load: false })


        }
      });
    });
    AsyncStorage.getItem('join_call').then(join_call => {
      if (join_call) {
        this.setState({ join_callData: JSON.parse(join_call), }, () => {

          if (this.state.join_callData.SnakBarText) {

            this.setState({
              SnakBar: this.state.join_callData.SnakBar,
              SnakBarText: this.state.join_callData.SnakBarText,
            }, () => {
              setTimeout(() => {
                this.setState({ SnakBar: false, join_callData: [] }, () => {
                  AsyncStorage.removeItem('join_call');
                })
              }, 20000);
            })

          } else {
            console.log('return false;');

            return false;
          }
        })
      } else {
        return false;
      }


    })

    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2)

    this.onReceived = this.onReceived.bind(this);
    this.onOpened = this.onOpened.bind(this);
    this.onIds = this.onIds.bind(this);
    OneSignal.addEventListener('opened', this.onNotificationOpened);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    AppState.addEventListener('change', this._handleAppStateChange);

  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onNotificationOpened);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
    console.log('----------------------2-------------------------');
    AppState.removeEventListener('change', this._handleAppStateChange);
  }


  _handleIndexChange = index => {
    console.log(index)

    this.setState({
      index,
    });
  }

  onNotificationOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    let debugMsg = 'OPENED: \n' + JSON.stringify(openResult.notification, null, 2);
    this.setState({ debugText: debugMsg }, () => {
      console.log("Debug text successfully changed!");
    });
  }

  onOpened(openResult) {

    AsyncStorage.getItem('type_id').then(type_id => {
      console.log('openResult', openResult.notification.payload.body);


      notification = openResult.notification.payload.additionalData
      isopenResult = openResult
      AsyncStorage.setItem('removeDigi', "1")
      console.log('notification', notification);
      if (openResult) {


        if (notification.c_id) {


          if (notification.c_type == 'callassign') {
            this.props.navigation.navigate('EmpPending', { item: notification.c_id });
          }
          else if (notification.c_type == 'callswip') {
            this.props.navigation.navigate('EmpPending', { item: notification.c_id });
          }
          else if (notification.c_type == 'drawing') {
            console.log('one', type_id);

            if (type_id == 2) {
              this.props.navigation.navigate('ViewDrawingMasterMain',
                { item: notification.c_id, name: 'Master' })
              console.log('two');
            }
            else if (type_id == 3) {
              this.props.navigation.navigate('ViewDrawingMasterMain',
                { item: notification.c_id })
              console.log('three');
            }

          }
          else if (notification.c_type == 'join_call') {
            this.setState({ SnakBarText: isopenResult.notification.payload.body, SnakBar: true }, () => {
              setTimeout(() => {
                this.setState({ SnakBar: false, join_callData: [] }, () => {
                  AsyncStorage.removeItem('join_call');
                })
              }, 20000);
            })

            this.props.navigation.navigate('Home')

          }
          else if (notification.c_type == 'call_workstart work') {
            this.props.navigation.navigate('EmpPending',
              { item: notification.c_id, sub_status: 1 });
          }
          else if (notification.c_type == 'spare') {
            this.props.navigation.navigate('SpareRecommended');
          }
          else {
            this.props.navigation.navigate('Home')
          }

        } else {
          console.log('else call');
          this.props.navigation.navigate('Home')

        }
      } else {
        console.log('nutthing');
        this.props.navigation.navigate('Home')
      }
    })

  }

  onReceived(notification) {
    console.log('%c Oh my ! ', 'background: #222; color: #bada55', notification);
  }
  onIds(device) {
    AsyncStorage.setItem("token", JSON.stringify(device.userId))
  }


  _handleAppStateChange = nextAppState => {
    if (nextAppState == 'active') {
      OneSignal.addEventListener('opened', this.onOpened);
    }
    console.log('App has come to the foreground!', nextAppState);

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('removeDigi').then(removeDigi => {
        if (id && removeDigi == '0') {
          this.setModalVisible(true);

        }
      });
    });

    this.setState({ appState: nextAppState });
  };


  Digit_Password = () => {
    Keyboard.dismiss();
    if (this.state.code.length < 0) {
      Toast.show('Please enter your passcode', Toast.SHORT,);
    } else {
      this.setState({ loading: true });
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          AsyncStorage.getItem('id').then(id => {
            AsyncStorage.getItem('password').then(password => {
              var Request = {
                token: token,
                branch_id: branch_id,
                id: id,
                password: this.state.code,
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
                            this.setState({ loading: false, code: '' });

                            if (res.status == 'success') {
                              this.setModalVisible(false);

                              this.setState({ loading: false, passcodeVisible: false, Load: false });
                            } else if (res.status == 'failed') {
                              this.setState({ loading: false });

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
                              this.setState({ code: '' });
                              this.setState({ loading: false });
                            }
                          });
                        } else {
                          AsyncStorage.removeItem('id');
                          AsyncStorage.removeItem('username');
                          AsyncStorage.removeItem('password');
                          this.setState({ loading: false, loading1: false });
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT,);
                          }, 50);
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Login" })]
                          });
                          this.props.navigation.dispatch(resetAction);
                          this.setState({ loading: false, loading1: false });
                        }
                      })
                      .catch(e => {

                        NetInfo.fetch().then(state => {
                          if (!state.isConnected) {
                            Toast.show(
                              'Please Check your internet connection',
                              Toast.SHORT,

                            );
                            this.props.navigation.goBack();
                          } else {
                            this.setState({ loading: false });
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
                    this.setState({ loading: false });
                    Toast.show(
                      'Please Check your internet connection',
                      Toast.SHORT,

                    );
                  });
                } else {
                  this.setState({ loading: false });
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

  Logout = () => {
    const { navigation } = this.props;
    this.setState({ loading: true });
    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        var Request = {
          id: id,
          token: token,

        };
        console.log(API.logout);
        console.log(JSON.stringify(Request));
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            timeout(
              15000,
              fetch(API.logout, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(Request),
              })
                .then(res => res.json())
                .then(res => {
                  console.log('logout RESPONCE:::  ', res);
                  if (res.status == 'success') {
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

                    navigation.closeDrawer();


                  } else {
                    if (res.message) {
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT,);
                      }, 300);
                    }
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

                    navigation.closeDrawer();
                    this.setState({ loading: false });
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
                      this.setState({ loading: false });
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
              this.setState({ loading: false });
              Toast.show(
                'Please Check your internet connection',
                Toast.SHORT,

              );
            });
          } else {
            this.setState({ loading: false });
            Toast.show(
              'Please Check your internet connection',
              Toast.SHORT,

            );
          }
        });
      });
    });



  };

  onAppStateChange = (appState, prevAppState) => {
    this.setModalVisible(true);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }



  _renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {this._renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  _renderItem = ({ navigationState, position }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>

          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >

          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  _renderScene = ({ route }) => {

    switch (route.key) {
      case 'today':
        return <Today navigation={this.props.navigation} />;
      case 'future':
        return <Future navigation={this.props.navigation} />;
      case 'completed':
        return <Completed navigation={this.props.navigation} />;
      default:
        return null;
    }
  };



  render() {
    console.log(this.props.navigation);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        {this.state.passcodeVisible ?

          <View style={styles.MainContainer}>

            <StatusBar
              hidden={false}
              barStyle="dark-content"
              backgroundColor={Colors.primary}
            />
            <Loader loading={this.state.Load} />
            {/* <View
    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        top: -40,
        right: -45,
        position: 'absolute',
        opacity: 0.5,
      }}>
      <HexagonPrimary />
    </View>

    <View
      style={{
        bottom: -40,
        left: -45,
        position: 'absolute',
        opacity: 0.5,
      }}>
      <HexagonGray />
    </View>
    <Image
      style={{}}
      resizeMode="contain"
      source={require('../images/logo.png')}
      style={{width: width * 0.8, height: width * 0.5}}
    />
  </View>
 */}


          </View>
          :
          <View style={{ flex: 1 }}>

            <StatusBar
              hidden={false}
              barStyle="dark-content"
              backgroundColor={Colors.primary}
            />

            <Header
              backIcon={require('../images/menu.png')}
              pageTitle="Calls (Work)"
              back={() => {
                this._handleDrawer();
              }}
              iconName={require('../images/notification.png')}
              press={() => this.props.navigation.navigate('Notifications')}
            />
            <Loader loading={this.state.loading} />
            <View style={styles.container}>

              <TabView
                style={this.props.style}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderTabBar}
                tabBarPosition="top"
                onIndexChange={this._handleIndexChange}
              />
            </View>
            {this.state.SnakBar ?
              <View style={{ position: 'absolute', bottom: 0, width: '100%', paddingVertical: 8, backgroundColor: Colors.primary, borderWidth: 1, borderColor: 'white' }}>

                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>

                  {/* <View style={{flexDirection:'row',width:'80%',height:'80%'}}> */}
                  {/* <Text style={{ fontFamily: Fonts.bold, color: 'white', fontSize: 18, marginLeft: 5 }}>{this.state.SnakeBarUser}</Text>
          <Text style={{ fontFamily: Fonts.bold, color: 'white', marginLeft: 5, textAlign: 'left' }}>is currently working on this call, which means you cannot make changes...</Text>
*/}
                  <Text style={{
                    fontFamily: Fonts.bold,
                    color: 'white', marginLeft: 5, width: '88%',
                    textAlign: 'left'
                  }}>
                    {this.state.SnakBarText}
                  </Text>



                </View>

                <TouchableOpacity
                  activeOpacity={0}
                  onPress={() => {
                    this.setState({ SnakBar: false, join_callData: [] }, () => {
                      AsyncStorage.removeItem('join_call');
                    })
                  }}
                  style={{
                    height: 40, width: 40,
                    justifyContent: 'center', elevation: 0,
                    backgroundColor: Colors.primary,
                    borderTopLeftRadius: 20, borderTopRightRadius: 10,
                    position: 'absolute', top: -20, right: 0,
                    alignItems: 'center'
                  }}>
                  <Icon name="times" color="white" size={28} />
                </TouchableOpacity>
              </View>
              : null}

          </View>



        }

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
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
                      style={{ flex: 1 }}
                      behavior="height"
                      enabled
                      keyboardVerticalOffset={0}>
                      <ScrollView
                        contentContainerStyle={{ flex: 1 }}
                        keyboardDismissMode="interactive">
                        <View style={{ flex: 0.4, flexDirection: 'column' }}>
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
                            <View style={{ flexDirection: 'row' }}>
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
                          autoFocus={false}
                          code={this.state.code}
                          onSubmitEditing={() => this.Digit_Password()}
                          handleTextChange={code => this.setState({ code })}
                        />

                        {/* <View
                            style={{
                              position: 'absolute',
                              alignItems: 'center',
                              bottom: 20,
                              flexDirection:'row',
                              width:'100%',
                              justifyContent:'space-between',
                              padding: 0,
                            }}>
                            <CustomButton
                              iconName={require('../images/right.png')}
                              name="Verify"
                              onPress={() => {
                               
                              }}
                            /> </View> */}

                        <TouchableOpacity style={{
                          position: 'absolute',
                          alignItems: 'center',
                          bottom: 80,
                          paddingVertical: 4,
                          flexDirection: 'row',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.primary,

                        }}
                          onPress={() => {
                            NetInfo.fetch().then(state => {
                              if (state.isConnected) {
                                this.Digit_Password();
                              } else {
                                Toast.show(
                                  'Please Check your internet connection',
                                  Toast.SHORT,

                                );
                              }
                            })
                          }}>


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
                                marginHorizontal: 10,
                                color: Colors.white,
                                fontFamily: Fonts.bold,
                              }}>

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
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: width * 0.12,
                  alignItems: 'center',
                  //  borderWidth:1,
                  justifyContent: 'center',

                  backgroundColor: Colors.red,
                  marginVertical: 0,
                }}
                  onPress={() => {
                    NetInfo.fetch().then(state => {
                      if (state.isConnected) {
                        this.Logout();
                      } else {
                        Toast.show(
                          'Please Check your internet connection',
                          Toast.SHORT,

                        );
                      }
                    })
                  }}>


                  {/* <ImageBackground
                resizeMode="contain"
                style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                source={require('../images/fill.png')}> */}
                  <Image style={{ height: 30, width: 30, tintColor: Colors.white }} source={require('../images/logout.png')} />
                  {/* </ImageBackground> */}
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        marginHorizontal: 10,
                        color: Colors.white,
                        fontFamily: Fonts.bold,
                      }}>

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
}

export default EmployeeRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .2)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,

  },
  active: {

    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize: 14
  },
  inactive: {
    color: Colors.dark_gray,
    // fontFamily: Fonts.medium,
    fontFamily: Fonts.regular
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 12,
    paddingVertical: 14,
    textAlign: 'center'
  },
  text: {
    marginLeft: 5,
    color: Colors.colorPrimary,
    fontSize: 17,
    fontFamily: Fonts.medium,
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  circle: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    backgroundColor: Colors.colorAccent,
    position: 'absolute',
    zIndex: -1,
  },
  logo: { width: width * 0.8, height: width * 0.12 },

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
  hexagon: {
    width: 100,
    height: 70,
    opacity: 0.8,
    transform: [{ rotate: '-90deg' }],
  },
  hexagonInner: {
    width: 100,
    height: 70,
    backgroundColor: Colors.primary,
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: Colors.primary,
  },
  hexagonBefore: {
    position: 'absolute',
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderBottomWidth: 25,
    borderBottomColor: Colors.primary,
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

