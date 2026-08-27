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
  TouchableOpacity,
  KeyboardAvoidingView,
  
} from 'react-native';
import HorizontalButton from '../../components/HorizontalButton';
import Colors from '../../common/Colors';
import BackHeader from '../../components/BackHeader';
import Fonts from '../../common/Fonts';
import LabelTextInput from '../../components/LabelTextInput';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../../common/API';
import timeout from '../../common/Timeout';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { StackActions, NavigationActions } from 'react-navigation';
import UserModal from '../../common/UserModal';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class BranchTransfer extends Component {
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
      selected_branch_id: '',
      branch:'Select Branch',
      remark_for_user:'',
      loading: false,
      visible: false,
      calllist:[]

    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {
 this.List()
    
  }


  onShow = () => {
    this.setState({visible: true});
  };

  onSelect = (id, name) => {
   

    this.setState({
      branch: name,
      selected_branch_id: id,
      visible: false,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  List = () => {



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
            console.log(API.call_get_branch);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.call_get_branch, {
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
                          console.log("call_get_branch :::  ", res);
                          if (res.status == "success") {
                            var Temp =[]
                            for (let i = 0; i < res.data.length; i++) {
                             if( this.props.navigation.state.params.branch_name != res.data[i].name){
                         
                            var object ={
                              id: res.data[i].id,
                               name: res.data[i].name
                            }
                            Temp.push(object)
                           }
                          }
                        
                          this.setState({
                            loading: false, loading1: false,
                             calllist:Temp
                          
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

                        this.setState({ loading: false, loading1: false, });
                        setTimeout(() => {
                          Toast.show(res.message, Toast.SHORT, );

                        }, 50)

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


  Transfer = () => {




    if (this.state.selected_branch_id == '') {
      Toast.show('Please select call.', Toast.SHORT, );
    } else if (this.state.remark_for_user == '') {
      Toast.show('Please Enter remarks for user', Toast.SHORT, );
    } else {
      this.setState({ submit: true, loading: true });

      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
          
               
              var  Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,
                  call_id: this.props.navigation.state.params.call_id,
                  selected_branch_id:this.state.selected_branch_id,
                  remark_for_user: this.state.remark_for_user
                };
           
       

          
            console.log(API.transfer_call);
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.transfer_call, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Request),
                  })
                    .then(res => {
                      console.log('json', res);

                      if (res.status == 200) {
                        console.log(res);
                        this.setState({ loading: false, loading1: false, submit: false });
                        res.json().then(res => {
                        
                          console.log('transfer_call', res);

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
                        console.log('%c HELLO 2', res);
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

          

              <BackHeader
              backIcon={require('../../images/Left_arrow.png')}
              pageTitle="Branch Transfer"
                back={() => {
                  this.props.navigation.goBack();
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


                     
                    <View style={styles.textInputView}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labela}>Branch</Text>

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
                            this.onShow();
                          }}>
                          <View>
                            {/* <Dropdown
                        containerStyle={{
                          width: width*.8,
                         
                          alignSelf: 'flex-start',
                          paddingBottom: 15,
                        }}
                        fontSize={15}
                        selectedItemColor={Colors.dark_gray}
                        value="Select User(Primary)"
                        onChangeText={(value)=> {
                          this.setState({primaryUser: value})
                        }}
                        data={data1}
                      />
                */}

                            <Text style={{fontSize: 15, color: Colors.black}}>
                              {this.state.branch}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <LabelTextInput
                        label="Remarks"
                        placeholder="Enter Remarks for User"
                        returnKeyType="next"
                        required={true}
                        editable={true}
                        multiline={true}
                        onChangeText={remark_for_user => this.setState({ remark_for_user })}
                      />


                    
                    </View>
                  </View>
                </View>
              </View>
              
              <HorizontalButton
                fImage={require('../../images/tick.png')}
                sImage={require('../../images/X-icon.png')}
                fcolor={this.state.submit ? Colors.dark_gray : Colors.primary}
                scolor={Colors.red}
                fLabel={"Submit"}
                sLabel="Cancel"
                fButton={() => {  this.Transfer() }}
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
          onSelect={this.onSelect}
          onCancel={this.onCancel}
          options={this.state.calllist}
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
