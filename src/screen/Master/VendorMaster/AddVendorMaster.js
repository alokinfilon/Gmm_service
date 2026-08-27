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
  KeyboardAvoidingView
} from 'react-native';
import HorizontalButton from '../../../components/HorizontalButton';
import Colors from '../../../common/Colors';
import BackHeader from '../../../components/BackHeader';
import Fonts from '../../../common/Fonts';
import LabelTextInput from '../../../components/LabelTextInput';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../../common/API';
import timeout from '../../../common/Timeout';
import Loader from '../../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { StackActions, NavigationActions } from 'react-navigation';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

let data1 = [

  { value: 'Ahmedabad' },
  { value: 'Surat' },
  { value: 'Rajkot' },
];
export default class AddVendorMaster extends Component {
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
      submit: false,
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      loading: false

    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {
    if (this.props.navigation.state.params.screen == 'view') {
      this.setState({ editPage: true });
    } else {
      this.setState({ editPage: false }, () => {
        console.log(this.state.editPage);
      });
    }

   
    
  }


  VendorMaster = () => {



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
                              phone2: res.data.phone,
                              address: res.data.address,
                              pincode: res.data.pincode,
                            
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
    });

  }


  AddVendorMaster = () => {
    console.log(this.state.editPage ? 'add' : 'edit');
    console.log(this.state.editPage ? 'id' : this.props.navigation.state.params.item.id);

    let isvalidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (this.state.name == '') {
      Toast.show('Please enter Name.', Toast.SHORT, );
    } else if (this.state.email == '') {
      Toast.show('Please Enter Email', Toast.SHORT, );
    } else if (this.state.phone == '') {
      Toast.show('Please Enter phone', Toast.SHORT, );
    } else if (this.state.address == '') {
      Toast.show('Please Enter Address', Toast.SHORT, );
    } else if (this.state.pincode == '') {
      Toast.show('Please Enter Pincode', Toast.SHORT, );
    } else if (isvalidation.test(this.state.email) === false) {
      Toast.show('Please Enter valid email', Toast.SHORT, );
    } else {
      this.setState({ submit: true, loading: true });

      var Request = {}
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
            {
              this.state.editPage ?
                Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,
                  name: this.state.name,
                  email: this.state.email,
                  phone: this.state.phone,
                  address: this.state.address,
                  pincode: this.state.pincode,
                }
                :
                Request = {
                  token: token,
                  id: id,
                  edit_id: this.props.navigation.state.params.item.id,
                  branch_id: branch_id,
                  name: this.state.name,
                  email: this.state.email,
                  phone: this.state.phone,
                  address: this.state.address,
                  pincode: this.state.pincode,
                };
            };
            // var Request = {
            //   token: token,
            //   id: this.state.editPage ? id : this.props.navigation.state.params.item.id,
            //   branch_id: branch_id,
            //   name:this.state.name,
            //   email:this.state.email,
            //   phone:this.state.phone,
            //   address:this.state.address,
            //   pincode:this.state.pincode,


            // };
            console.log(this.state.editPage ? API.vendor_add : API.vendor_edit);
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(this.state.editPage ? API.vendor_add : API.vendor_edit, {
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
                          console.log(this.state.editPage ? "API.vendor_add" : " API.vendor_edit", res);
                          console.log('success', res.success);

                          if (res.status == 'success') {
                            this.setState({
                              loading: false,
                              loading1: false,
                            });
                            this.props.navigation.goBack();
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


  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white, }}>
    
        <View style={{ flex: 1, backgroundColor: Colors.white }}>

          {this.state.editPage == false ? (
            <BackHeader
              backIcon={require('../../../images/Left_arrow.png')}
              pageTitle="Edit Vendor Master"
              back={() => {
                this.props.navigation.goBack();
              }} />

          ) : (
              <BackHeader
                backIcon={require('../../../images/Left_arrow.png')}
                pageTitle="Add Vendor Master"
                back={() => {
                  this.props.navigation.goBack();
                }}
              />
            )}
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



                      {/* <View style={{flexDirection: 'row'}}>
                  <Text style={styles.label}>Branch</Text>
                 
                    <Text style={styles.required}>*</Text>
                 
                </View>

                <View
                  style={{
                  
                    height: 42,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: Colors.white,
                    borderWidth: 1,

                    borderRadius: 4,

                    borderColor: Colors.medium_gray,
                  }}
                  onPress={() => {
                    // this._showDateTimePicker()
                  }}>
                  <View style={{paddingLeft: 0}}>
                    <View>
                  
                      <Dropdown
                        containerStyle={{
                          width: width * 0.85,
                          paddingLeft: 5,
                          paddingBottom: 15,
                        }}
                        fontSize={15}
                        selectedItemColor={Colors.dark_gray}
                        value="Select Branch"
                        onChangeText={this.onChangeText}
                        data={data1}
                      />
               
                    </View>
                  </View>
              </View>   */}


                      <LabelTextInput
                        label="Name"
                        placeholder="Enter Name"
                        returnKeyType="next"
                        required={true}
                        editable={true}
                        onChangeText={name => this.setState({ name })}
                      />



                      <LabelTextInput
                        label="Email"
                        keyboardType="email-address"
                        placeholder="Enter Email"
                        returnKeyType="next"
                        required={true}
                        editable={true}
                        onChangeText={email => this.setState({ email })}
                      />


                      <LabelTextInput
                        label="Phone"
                        placeholder="Enter Phone"
                        returnKeyType="next"
                        keyboardType="numeric"
                        required={true}
                        editable={true}
                        onChangeText={phone => this.setState({ phone })}
                      />


                      <LabelTextInput
                        label="Address"
                        placeholder="Enter Address"
                        returnKeyType="next"
                        required={true}
                        editable={true}
                        multiline={true}
                        onChangeText={address => this.setState({ address })}
                      />


                      <LabelTextInput
                        label="Pincode"
                        placeholder="Enter Pincode"
                        returnKeyType="next"
                        keyboardType="numeric"
                        required={true}
                        editable={true}
                        onChangeText={pincode => this.setState({ pincode })}
                      />
                    </View>
                  </View>
                </View>
              </View>
              
              <HorizontalButton
                fImage={require('../../../images/tick.png')}
                sImage={require('../../../images/X-icon.png')}
                fcolor={this.state.submit ? Colors.dark_gray : Colors.primary}
                scolor={Colors.red}
                fLabel={this.state.editPage ? "Submit" : "Update"}
                sLabel="Cancel"
                fButton={() => { this.state.submit ? null : this.AddVendorMaster() }}
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

  label: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
  required: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
    paddingLeft: 3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
});
