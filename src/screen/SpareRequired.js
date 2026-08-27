import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import HorizontalButton from '../components/HorizontalButton';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation';
import Header from '../components/Header';
import UserModal from '../common/UserModal';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var SpareList = [];
var SpareID = [];


export default class SpareRequired extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],

      date: new Date(),
      date1: new Date(),
      stickyHeaderHeight: 60,
      anim: new Animated.Value(0),
      scrollY: new Animated.Value(0),
      opacityValue: new Animated.Value(1),
      enableScrollViewScroll: true,
      editPage: false,
      submit: false,
      name: '',
      description: '',
      loading: false,
      callno: 'Select call no.',
      callid: '',
      spare: 'Select Spare',
      calllist: [],
      sparelist: []

    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {


  }

  onShowSpare = () => {
    this.setState({ visible1: true });
  };

  onSelectSpare = (id, name) => {
    console.log(id, name);
    if (SpareID.includes(id)) {
      Toast.show("Spare already selected", Toast.SHORT, );
    } else {
      SpareID.push(id);
      SpareList.push(name);
    }

    this.setState({


      visible1: false,
    });

  };

  removeSpare = (item, key) => {
    var index = SpareList.indexOf(item);
    if (index > -1) {
      SpareList.splice(index, 1);
      SpareID.splice(index, 1);
    }
    console.log(SpareList);
    this.setState({ refresh: !this.state.refresh })
  }

  onCancelSpare = () => {
    this.setState({
      visible1: false,
    });
  };


  onShowCall = () => {
    this.setState({ visible: true });
  };

  onSelectCall = (id, name) => {
    console.log(id, name);

    this.setState({
      callno: name,
      callid: id,
      visible: false,
    });
  };

  onCancelCall = () => {
    this.setState({
      visible: false,
    });
  };

  List = () => {
    this.setState({ loading: true });
    AsyncStorage.getItem("id").then(id => {
      AsyncStorage.getItem("token").then(token => {
        AsyncStorage.getItem("branch_id").then(branch_id => {
          AsyncStorage.getItem("pagelimit").then(pagelimit => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              // user_id: this.props.navigation.state.params.item.id,
            };
            console.log(API.spare_required);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.spare_required, {
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
                        this.setState({ loading: false, loading1: false, });
                        res.json().then(res => {
                          console.log("spare_required :::  ", res);
                          if (res.status == "success") {

                            this.setState({
                              loading: false, loading1: false,
                              calllist: res.call,
                              sparelist: res.spare

                            })

                          } else if (res.status == "failed") {

                            AsyncStorage.removeItem('id');
                            AsyncStorage.removeItem('username');
                            AsyncStorage.removeItem('password');
                            this.setState({ loading: false, loading1: false, });
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
                            this.setState({ loading: false, loading1: false, message: res.message, })
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
                        } else {
                          this.setState({ loading: false, loading1: false });
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
                  this.setState({ loading: false, loading1: false, });
                  Toast.show(
                    "Please Check your internet connection",
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({ loading: false, loading1: false, });
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
    });
  }

  SpareSend = () => {

    if (this.state.callid == '') {
      Toast.show('Please select call.', Toast.SHORT, );
    } else if (SpareID.length < 1) {
      Toast.show('Please select spares', Toast.SHORT, );

    } else {
      this.setState({ submit: true, loading: true });

      var Request = {}
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {

            Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: this.state.callid,
              spares: SpareID.toString()
            }



            console.log(API.spare_required_send);

            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.spare_required_send, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Request),
                  })
                    .then(res => {
                      console.log('json', JSON.res);

                      if (res.status == 200) {
                        console.log(res);
                        this.setState({ loading: false, loading1: false, submit: false });
                        res.json().then(res => {

                          console.log('spare_required_send', res);

                          if (res.status == 'success') {
                            this.setState({
                              loading: false,
                              loading1: false,
                            });
                            setTimeout(() => {
                              Toast.show(
                                res.message,
                                Toast.SHORT,
                                
                              );
                            }, 50);
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({
                                  routeName: 'Home',
                                }),
                              ],
                            });
                            AsyncStorage.setItem('removeDigi', "1")
                            this.props.navigation.dispatch(resetAction);
                          } else if (res.status == 'failed') {

                            this.setState({ loading: false, loading1: false, submit: false });
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
                              message: res.message,
                            });
                            console.log('%c HELLO', res);

                            setTimeout(() => {
                              Toast.show(
                                res.message,
                                Toast.SHORT,
                                
                              );
                            }, 50);
                          }
                        });
                      } else {
                        AsyncStorage.removeItem('id');
                        AsyncStorage.removeItem('username');
                        AsyncStorage.removeItem('password');

                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({ routeName: 'Login' }),
                          ],
                        });
                        this.props.navigation.dispatch(resetAction);

                        this.setState({ loading: false, loading1: false, submit: false });
                      }
                    })
                    .catch(e => {
                      this.setState({ loading: false, loading1: false, submit: false });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({ loading: false, loading1: false, submit: false });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({ loading: false, loading1: false, submit: false });
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );
              }
            });
          });
        });
      });
    }



  }

  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
         <StatusBar
  hidden={false}
  barStyle="dark-content"
  backgroundColor={Colors.primary}
/>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{ flex: 1, backgroundColor: Colors.white, }}>

          <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <NavigationEvents onWillFocus={payload => {
              console.log("unmount");
              this.List();

            }} />
            <Header
              backIcon={require('../images/menu.png')}
              pageTitle="Spare Required"
              back={() => {
                this._handleDrawer();
              }}
            />
            
            <Loader loading={this.state.loading} /> 
            <ScrollView
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingTop: 0 }}>
              <View style={styles.container}>
                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: 'column',
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
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      width: width * 0.95,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        paddingBottom: 8,
                      }}>
                      <View style={{ paddingHorizontal: width * 0.05 }}>
                        <View style={{ flexDirection: 'column', }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labela}>Call No.</Text>
                            <Text style={styles.required}>*</Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              height: 42,
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              backgroundColor: Colors.white,
                              borderWidth: 1,
                              borderRadius: 4,
                              borderColor: Colors.medium_gray,
                            }}
                            onPress={() => {
                              this.onShowCall();
                            }}>
                            <View>
                              <Text style={{ fontSize: 15, color: Colors.black, fontFamily: Fonts.regular }}>
                                {this.state.callno}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.labela}>Spare</Text>
                            <Text style={styles.required}>*</Text>
                          </View>
                          {SpareList.map((item, key) => (
                            <View style={{ flexDirection: 'row', padding: 5, borderWidth: 1, borderColor: Colors.light_gray, backgroundColor: Colors.white }} key={key} >
                              <TouchableOpacity style={{ padding: 5, }} onPress={() => this.removeSpare(item, key)}>
                                <Icon name="times" size={20} color={Colors.medium_gray} style={{ paddingRight: 5, }} />
                              </TouchableOpacity>
                              <Text style={{ flex: 1, padding: 5, fontSize: 16, color: Colors.colorPrimary, fontFamily: Fonts.regular }} > {item} </Text>
                            </View>
                          ))
                          }
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: 10,
                              height: 42,
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              backgroundColor: Colors.white,
                              borderWidth: 1,

                              borderRadius: 4,

                              borderColor: Colors.medium_gray,
                            }}
                            onPress={() => {
                              this.onShowSpare();
                            }}>
                            <View>
                              <Text style={{ fontSize: 15, color: Colors.black, fontFamily: Fonts.regular }}>
                                {this.state.spare}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <HorizontalButton
                  fImage={require('../images/tick.png')}
                  sImage={require('../images/X-icon.png')}
                  fcolor={Colors.primary}
                  scolor={Colors.red}
                  fLabel={"Submit"}
                  sLabel="Cancel"
                  fButton={() => { this.SpareSend() }}
                  sButton={() => {
                    this.props.navigation.goBack();
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <UserModal
          visible={this.state.visible}
          onSelect={this.onSelectCall}
          onCancel={this.onCancelCall}
          options={this.state.calllist}
          navigation={this.state.navigation}
        />
        <UserModal
          visible={this.state.visible1}
          onSelect={this.onSelectSpare}
          onCancel={this.onCancelSpare}
          options={this.state.sparelist}
          navigation={this.state.navigation}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  radioButton: {
    marginTop: 13,
    marginLeft: 25,
    flexDirection: 'row',
  },
  selectedText: {
    fontSize: 18,
    color: 'white',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
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
    color: 'red',
    fontSize: 14,
    paddingLeft: 3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
});
