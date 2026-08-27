import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import HorizontalButton from '../../../components/HorizontalButton';
import Colors from '../../../common/Colors';
import BackHeader from '../../../components/BackHeader';
import Fonts from '../../../common/Fonts';
import LabelTextInput from '../../../components/LabelTextInput';
import API from '../../../common/API';
import timeout from '../../../common/Timeout';
import Loader from '../../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const MAX_LENGTH_CODE = 4;
export default class AddUserMaster extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      date: new Date(),
      date1: new Date(),
      stickyHeaderHeight: 60,
      anim: new Animated.Value(0),
      scrollY: new Animated.Value(0),
      opacityValue: new Animated.Value(1),
      enableScrollViewScroll: true,
      editPage: false,
      required: false,
      name: '',
      email: '',
      password: '',
      digit_password: '',
      user_code: '',
      emp_no: '',
      phone1: '',
      phone2: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      username: ''

    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {
      // console.log(this.state.editPage ? 'id' : this.props.navigation.state.params.item.id);
    if (this.props.navigation.state.params.screen == 'add') {
      this.setState({ editPage: true });

    } else {
      this.UserMaster();
      this.setState({ editPage: false });
    }

  }



  UserMaster = () => {



    AsyncStorage.getItem("id").then(id => {
      AsyncStorage.getItem("token").then(token => {
        AsyncStorage.getItem("branch_id").then(branch_id => {
          AsyncStorage.getItem("pagelimit").then(pagelimit => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              user_id: this.props.navigation.state.params.item.id,
            };
            console.log(API.user_data_view);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.user_data_view, {
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
                          console.log("user_data_view :::  ", res);
                          if (res.status == "success") {

                            this.setState({
                              loading: false, loading1: false,
                              name: res.data.name,
                              email: res.data.email,
                              username: res.data.username,
                              digit_password: res.data.digit_password,
                              password: res.data.password,
                              user_code: res.data.user_code,
                              emp_no: res.data.emp_no,
                              phone1: res.data.phone1,
                              phone2: res.data.phone2,
                              address: res.data.address,
                              pincode: res.data.pincode,
                              city: res.data.city,
                              state: res.data.state,
                              country: res.data.country,
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
                          this.props.navigation.goBack();
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
                this.props.navigation.goBack();
              }
            });
          });
        });
      });
    });

  }


  UpdateUserMaster = () => {
    console.log(this.state.editPage ? 'add' : 'edit');

    console.log(this.state.editPage ? 'id' : this.props.navigation.state.params.item.id);

    let isvalidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.user_code == '') {
      Toast.show('Please enter User Code.', Toast.SHORT, );
    } 
    
    else if (this.state.emp_no == '') {
      Toast.show('Please Enter Employee.', Toast.SHORT, );
    }
    
    else if (this.state.name == '') {
      Toast.show('Please enter Name.', Toast.SHORT, );
    }
    else if (this.state.username == '') {
      Toast.show('Please enter Username.', Toast.SHORT, );
    }
    else if (this.state.password == '') {
      Toast.show('Please Enter Password', Toast.SHORT, );
    } 
    else if (this.state.digit_password == '') {
      Toast.show('Please Enter 4 Digit Password', Toast.SHORT, );
    }
    else if (this.state.digit_password.length != MAX_LENGTH_CODE) {
      Toast.show('Enter 4 Digit Password', Toast.SHORT, );
    }
    else if (this.state.phone1 == '') {
      Toast.show('Please Enter Phone1', Toast.SHORT, );
    } 
    else if (this.state.email == '') {
      Toast.show('Please Enter Email', Toast.SHORT, );
    }
      
    else if (isvalidation.test(this.state.email) === false) {
      Toast.show('Please Enter valid email', Toast.SHORT, );
    }
    
    else if (this.state.pincode == '') {
      Toast.show('Please Enter Pincode', Toast.SHORT, );
    } 
    // else if (this.state.phone == '') {
    //   Toast.show('Please Enter phone', Toast.SHORT, );
    // } 
    else if (this.state.state == '') {
      Toast.show('Please Enter State', Toast.SHORT, );
    } 
    
    else if (this.state.city == '') {
      Toast.show('Please Enter City', Toast.SHORT, );
    }
    
    else if (this.state.country == '') {
      Toast.show('Please Enter Country', Toast.SHORT, );

    }
    
    else if (this.state.address == '') {
      Toast.show('Please Enter Address', Toast.SHORT, );
    }
    else {
      this.setState({ submit: true, loading: true });
      AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {

            {
              this.state.editPage ?


                Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,

                  name: this.state.name,
                  email: this.state.email,
                  digit_password: this.state.digit_password,
                  password: this.state.password,
                  user_code: this.state.user_code,
                  emp_no: this.state.emp_no,
                  phone1: this.state.phone1,
                  phone2: this.state.phone2,
                  address: this.state.address,
                  pincode: this.state.pincode,
                  city: this.state.city,
                  state: this.state.state,
                  country: this.state.country,
                  username: this.state.username
                } :
                Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,
                  user_id: this.props.navigation.state.params.item.id,
                  name: this.state.name,
                  email: this.state.email,
                  digit_password: this.state.digit_password,
                  password: this.state.password,
                  user_code: this.state.user_code,
                  emp_no: this.state.emp_no,
                  phone1: this.state.phone1,
                  phone2: this.state.phone2,
                  address: this.state.address,
                  pincode: this.state.pincode,
                  city: this.state.city,
                  state: this.state.state,
                  country: this.state.country,
                  username: this.state.username
                }
            };


            console.log(this.state.editPage ? API.user_data_save : API.user_data_update);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(this.state.editPage ? API.user_data_save : API.user_data_update, {
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
                          console.log(this.state.editPage ? 'API.user_data_save' : 'API.user_data_update', res);
                          if (res.status == "success") {
                            Toast.show(res.message, Toast.SHORT, );
                            this.setState({
                              loading: false, loading1: false
                            })
                            this.props.navigation.goBack();
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
                      this.setState({ loading: false, loading1: false, });
                      console.log(e);
                      Toast.show(
                        "Something went wrong...",
                        Toast.SHORT,
                        
                      );
                    })
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
              }
            });
          });
        });
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{ flex: 1, backgroundColor: Colors.white, }}>

          <View style={{ flex: 1, backgroundColor: Colors.white }}>

            {this.state.editPage == false ? (
              <BackHeader
                backIcon={require('../../../images/Left_arrow.png')}
                pageTitle="Edit User Master"
                back={() => {
                  this.props.navigation.goBack();
                }} />

            ) : (
                <BackHeader
                  backIcon={require('../../../images/Left_arrow.png')}
                  pageTitle="Add User Master"
                  back={() => {
                    this.props.navigation.goBack();
                  }}
                />
              )}

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

                        <LabelTextInput
                          label="User Code"
                          // keyboardType="numeric"
                          placeholder="User Code"
                          returnKeyType="next"
                          value={this.state.user_code}
                          required={true}
                          editable={true}
                          onChangeText={user_code => this.setState({ user_code })}
                        />
                        <LabelTextInput
                          label="Employee number"
                          keyboardType="numeric"
                          placeholder="Employee number"
                          returnKeyType="next"
                          value={this.state.emp_no}
                          required={true}
                          editable={true}
                          onChangeText={emp_no => this.setState({ emp_no })}
                        />
                        <LabelTextInput
                          label="Name"
                          value={this.state.name}
                          placeholder="Enter Name"
                          keyboardType="default"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={name => this.setState({ name })}
                        />

                        <LabelTextInput
                          label="Username"
                          value={this.state.username}
                          keyboardType="default"
                          placeholder="Enter Username"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={username => this.setState({ username })}
                        />

                        <LabelTextInput
                          label="Password"
                          value={this.state.password}
                          placeholder="Enter Password"
                          secureEntry={true}
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={password => this.setState({ password })}
                        />

                        <LabelTextInput
                          label="4 Digit Password (Lock Screen)"
                          placeholder="Enter 4 Digit Password (Lock Screen)"
                          returnKeyType="next"
                          secureTextEntry={true}
                          maxLength={4}
                          keyboardType="numeric"
                          secureEntry={true}
                          value={this.state.digit_password}
                          required={true}
                          editable={true}
                          onChangeText={digit_password => this.setState({ digit_password })}
                        />


                        <LabelTextInput
                          label="Phone 1"
                          value={this.state.phone1}
                          placeholder="Enter Phone 1"
                          returnKeyType="next"
                          keyboardType="numeric"
                          required={true}
                          editable={true}
                          onChangeText={phone1 => this.setState({ phone1 })}
                        />


                        <LabelTextInput
                          label="Phone 2"
                          value={this.state.phone2}
                          placeholder="Enter Phone 2"
                          returnKeyType="next"
                          keyboardType="numeric"
                          required={false}
                          editable={true}
                          onChangeText={phone2 => this.setState({ phone2 })}
                        />



                        <LabelTextInput
                          keyboardType="email-address"
                          label="Email"
                          value={this.state.email}
                          placeholder="Enter Email"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={email => this.setState({ email })}
                        />



                        <LabelTextInput

                          label="Pincode"
                          keyboardType="numeric"
                          value={this.state.pincode}
                          placeholder="Enter Pincode"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={pincode => this.setState({ pincode })}
                        />



                        <LabelTextInput
                          keyboardType="default"
                          label="State"
                          value={this.state.state}
                          placeholder="Enter State"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={state => this.setState({ state })}
                        />



                        <LabelTextInput
                          keyboardType="default"
                          label="City"
                          value={this.state.city}
                          placeholder="Enter City"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={city => this.setState({ city })}
                        />


                        <LabelTextInput
                          keyboardType="default"
                          label="Country"
                          value={this.state.country}
                          placeholder="Enter Country"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          onChangeText={country => this.setState({ country })}
                        />


                        <LabelTextInput
                          keyboardType="default"
                          label="Address"
                          value={this.state.address}
                          placeholder="Enter Address"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          multiline={true}
                          onChangeText={address => this.setState({ address })}
                        />
                      </View>
                    </View>





                  </View>
                </View>


                <HorizontalButton
                  fImage={require('../../../images/tick.png')}
                  sImage={require('../../../images/X-icon.png')}
                  fcolor={Colors.primary}
                  scolor={Colors.red}
                  fLabel={this.state.editPage ? "Submit" : "Update"}
                  sLabel="Cancel"
                  fButton={() => {
                    this.UpdateUserMaster()

                  }}
                  sButton={() => {
                    this.props.navigation.goBack();
                  }}
                />
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    //  margin: 10,
  },
  primaryContainer: {
    margin: 10,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#f1f1f1',
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    zIndex: 1,
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    margin: 5,
    justifyContent: 'center',
  },
  rowViewContainer: {
    fontSize: 15,
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 10,
    fontFamily: Fonts.medium,
    color: Colors.dark_gray,
  },
  rowViewLabel: {
    fontSize: 16,
    width: width * 0.5,
    paddingLeft: 5,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  rowDot: {
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  rowViewHead: {
    fontSize: 18,
    paddingVertical: 5,
    paddingTop: 5,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    paddingHorizontal: 5,
    flex: 1,
    paddingRight: 80,
    paddingLeft: 10,
    textAlign: 'left',
  },
  whiteImage: {
    tintColor: Colors.white,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  primaryImage: {
    tintColor: Colors.primary,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  absoluteView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 30,
    backgroundColor: 'transparent',
  },
  statusLabel: {
    transform: [{ rotate: '-0deg' }],
    overflow: 'visible',
    width: 120,
    minHeight: 40,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    right: -30,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.white,
  },
  RightAbsoluteButton: {
    overflow: 'hidden',
    width: 120,
    height: 60,
    position: 'absolute',
    bottom: -3,
    alignSelf: 'center',
    right: -45,
    borderTopLeftRadius: 120,
    borderBottomRightRadius: 120,
    backgroundColor: Colors.primary,
  },
  LeftAbsoluteButton: {
    overflow: 'visible',
    width: 120,
    height: 60,
    position: 'absolute',
    bottom: -3,
    alignSelf: 'center',
    left: -45,
    borderBottomLeftRadius: 120,
    borderTopRightRadius: 120,
    backgroundColor: Colors.white,
  },
  statusLabelText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  textInput: {
    marginTop: 2,
    paddingVertical: Platform.OS == 'ios' ? 12 : 6,
    fontSize: 16,

    width: '85%',

    fontFamily: Fonts.medium,
    paddingHorizontal: 5,
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
  },
  label: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
});
