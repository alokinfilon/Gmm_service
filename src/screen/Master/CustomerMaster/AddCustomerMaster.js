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

import moment from 'moment';
import { StackActions, NavigationActions } from 'react-navigation';
import API from '../../../common/API';
import timeout from '../../../common/Timeout';
import Loader from '../../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class AddCustomerMaster extends Component {
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
      bocode: '',
      name: '',
      email: '',
      phone1: '',
      phone2: '',
      phone3: '',
      pincode: '',
      state: '',
      city: '',
      country: '',
      address: '',
      CustomerDataEdit: {}
    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {
    this.EditCustomerMaster()
    if (this.props.navigation.state.params.screen == 'view') {
      this.setState({ editPage: true });
    } else {
      this.setState({ editPage: false });
    }
    console.log('this.props.navigation.state.params.screen', this.props.navigation.state.params.item.id);

  }

  EditCustomerMaster = () => {

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          var Request = {
            id: id,
            token:token,
            branch_id: branch_id,
            customer_id: this.props.navigation.state.params.item.id,
          };
          console.log(API.customer_data_view);
          console.log('Request', JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.customer_data_view, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Request),
                })
                  .then(res => {
                    if (res.status == 200) {
                      console.log(res);
                      this.setState({ loading: false, loading1: false });
                      res.json().then(res => {
                        console.log(
                          'customer_data_view:::  ',
                          res,
                        );
                        if (res.status == 'success') {
                          this.setState({
                            loading: false, loading1: false, submit2: false, CustomerDataEdit: res.data, bo_code:res.data.company_code, 
                            name: res.data.name, email: res.data.email, phone1: res.data.phone1, phone2: res.data.phone2,phone3: res.data.phone3, 
                            pincode: res.data.pincode, state: res.data.state, city: res.data.city, country: res.data.country, address: res.data.address
                          });
                        } else if (res.status == 'failed') {
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
                          this.setState({ loading: false, loading1: false, submit2: false });
                        } else {
                          this.setState({
                            loading: false,
                            loading1: false,
                            submit2: false,
                            message: res.message,
                          });
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
                this.setState({ loading: false, loading1: false, submit2: false });
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false, loading1: false, submit2: false });
              Toast.show(
                'Please Check your internet connection',
                Toast.SHORT,
                
              );
              this.props.navigation.goBack();
            }
          });
        });
      });
    });

  };


  
  UpdateCustomerMaster = () => {
   

    let isvalidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    if (this.state.name == '') {
      Toast.show('Please enter Name.', Toast.SHORT, );
    } else if (this.state.email == '') {
      Toast.show('Please Enter Email', Toast.SHORT, );
    } else if (isvalidation.test(this.state.email) === false) {
      Toast.show('Please Enter valid email', Toast.SHORT, );
    } else if (this.state.phone1== '') {
      Toast.show('Please Enter phone 1', Toast.SHORT, );
    } else if (this.state.address == '') {
      Toast.show('Please Enter Address', Toast.SHORT, );
    } else if (this.state.pincode == '') {
      Toast.show('Please Enter Pincode', Toast.SHORT, );
    }else if (this.state.state == '') {
      Toast.show('Please Enter State', Toast.SHORT, );
    } else if (this.state.city == '') {
      Toast.show('Please Enter City', Toast.SHORT, );
    } else if (this.state.country == '') {
      Toast.show('Please Enter Country', Toast.SHORT, );
    }  else {
      this.setState({ submit: true, loading: true });

      var Request = {}
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
           
                Request = {
                  token: token,
                  id: id,
                  customer_id: this.props.navigation.state.params.item.id,
                  name: this.state.name,
                  email: this.state.email,
                  phone1: this.state.phone1,
                  phone2: this.state.phone2,
                  phone3: this.state.phone3,
                  pincode:this.state.pincode,
                  state:this.state.state,
                  city:this.state.city,
                  country:this.state.country,
                  address: this.state.address,
                };
           
            console.log(API.customer_data_update);
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.customer_data_update, {
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
                          console.log("customer_data_update", res);
                          console.log('res.successs', res.success);

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
          style={{ flex: 1, backgroundColor: Colors.white }}>
          <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <Loader loading={this.state.loading}/>
            {this.state.editPage == false ? (
              <BackHeader
                backIcon={require('../../../images/Left_arrow.png')}
                pageTitle="Edit Customer Master"
                back={() => {
                  this.props.navigation.goBack();
                }} />

              ) : (
                <BackHeader
                  backIcon={require('../../../images/Left_arrow.png')}
                  pageTitle="Edit Customer Master"
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
                          label="PB Code"
                          placeholder="Enter Bo Code"
                          returnKeyType="next"
                          required={false}
                          editable={false}
                          value={this.state.bo_code}
                          onChangeText={bo_code => this.setState({ bo_code })}
                        />
                        <LabelTextInput
                          label="Name"
                          placeholder="Enter Name"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          value={this.state.name}
                          onChangeText={name => this.setState({ name })}
                        />

                        <LabelTextInput
                          label="Email"
                          keyboardType="email-address"
                          placeholder="Enter Email"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          value={this.state.email}
                          onChangeText={email => this.setState({ email })}
                        />

                        <LabelTextInput
                          label="Phone 1"
                          placeholder="Enter Phone 1"
                          returnKeyType="next"
                          keyboardType="numeric"
                          required={true}
                          editable={true}
                          value={this.state.phone1}
                          onChangeText={phone1 => this.setState({ phone1 })}
                        />

                        <LabelTextInput
                         keyboardType="numeric"
                          label="Phone 2"
                          placeholder="Enter Phone 2"
                          returnKeyType="next"
                          required={false}
                          editable={true}
                          value={this.state.phone2}
                          onChangeText={phone2 => this.setState({ phone2 })}
                        />

                        <LabelTextInput
                         keyboardType="numeric"
                          label="Phone 3"
                          placeholder="Enter Phone 3"
                          returnKeyType="next"
                          required={false}
                          editable={true}
                          value={this.state.phone3}
                          onChangeText={phone3 => this.setState({ phone3 })}
                        />


                      <LabelTextInput
                          label="Address"
                          placeholder="Enter Address"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          multiline={true}
                          value={this.state.address}
                          onChangeText={address => this.setState({ address })}
                        />


                        <LabelTextInput
                          label="Pincode"
                          placeholder="Enter Pincode"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          keyboardType="numeric"
                          value={this.state.pincode}
                          onChangeText={pincode => this.setState({ pincode })}
                        />


                        <LabelTextInput
                          label="State"
                          placeholder="Enter State"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          value={this.state.state}
                          onChangeText={state => this.setState({ state })}
                        />


                        <LabelTextInput
                          label="City"
                          placeholder="Enter City"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          value={this.state.city}
                          onChangeText={city => this.setState({ city })}
                        />


                        <LabelTextInput
                          label="Country"
                          placeholder="Enter Country"
                          returnKeyType="next"
                          required={true}
                          editable={true}
                          value={this.state.country}
                          onChangeText={country => this.setState({ country })}
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
                  fLabel="Update"
                  sLabel="Cancel"
                  fButton={() => {
                   this.UpdateCustomerMaster()
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
