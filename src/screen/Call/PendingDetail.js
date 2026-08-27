import React, {Component} from 'react';

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
  KeyboardAvoidingView,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {Dropdown} from 'react-native-material-dropdown';
import {StackActions, NavigationActions} from 'react-navigation';

import Colors from '../../common/Colors';
import RadioButton from '../../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';

import HexagonGray from '../../components/HexagonPrimary';
import Header from '../../components/Header';
import Fonts from '../../common/Fonts';
import BackHeader from '../../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import HorizontalButton from '../../components/HorizontalButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LabelTextInput from '../../components/LabelTextInput';
import UserModal from '../../common/UserModal';

import API from '../../common/API';
import timeout from '../../common/Timeout';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import CustomButton from '../../components/CustomButton';

var data1 = [];
var textInputs = [];
var userID = [];
var ismodallist = [];
var index1 = 1;
var startdate1 = moment(new Date(), 'YYYY/MM/DD').add(0, 'days').format();
var todayDate1 = moment(startdate1).format('DD');
var todayMonth1 = moment(startdate1).format('MM');
var todayYear1 = moment(startdate1).format('YYYY');

export default class PendingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refresh: false,
      submit:false,
      primaryUser: 'Select Service Engineer',
      primaryUserID: '',
      primaryUser3: 'Select Call Type',
      primaryUserID3: '',
      sono: '',
      remarks: '',
      visible: false,
      visible1: false,
      visible3:false,
      isDateTimePickerVisible: false,
      date: new Date(),
      max: new Date(todayYear1, todayMonth1 - 1, todayDate1),
      textInputs: [],
      userID: [],
      dataSource: {},
      userlist:[],
      calltype:[],
      isusermodal: [
        {
          name: 'No User',
          type_id: '',
          user_code: '',
          id: '0',
        },
      ],
    };
  }

  componentDidMount() {
    this.state.textInputs.push({id: '', name: 'Select Service Engineer'});
    this.state.userID.push('');

    this.setState({refresh: !this.state.refresh});

    this.PendingDetail();
  }

  PendingDetail = () => {
    this.setState({loading: true});

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          AsyncStorage.getItem('pagelimit').then(pagelimit => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: this.props.navigation.state.params.item.id,
            };
            console.log(API.call_get_details);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              console.log('state.isConnected',state.isConnected);
              
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.call_get_details, {
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
                        this.setState({loading: false, loading1: false});
                        res.json().then(res => {
                          console.log('call_get_details :::  ', res);
                          if (res.status == 'success') {
                            this.setState({
                              loading: false,
                              loading1: false,
                              dataSource: res.data,
                              userlist: res.users,
                              calltype:res.calltypes
                              // call_date: res.data.call_date,
                              // caller_name: res.data.caller_name,
                              // call_origin: res.data.call_origin,
                              // bo_code: res.data.bo_code,
                              // cmp_name: res.data.cmp_name,
                              // installation_address: res.data.installation_address,
                              // group2: res.data.group2,
                              // reported_problem: res.data.reported_problem,
                              // entry_date: res.data.entry_date
                            },() => {
                              // this.setState({refresh: !this.state.refresh});
                                                          ismodallist = this.state.isusermodal.concat(
                                                            this.state.userlist,
                                                          );
                            
                                                        })
                            
                          } else if (res.status == 'failed') {
                          
                            this.setState({loading: false, loading1: false});
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
                         this.setState({loading: false, loading1: false, });
                         setTimeout(()=> {
                           Toast.show(res.message, Toast.SHORT, );
       
                         }, 50)
                         const resetAction = StackActions.reset({
                           index: 0,
                           actions: [
                             NavigationActions.navigate({ routeName: "Login" })
                           ]
                         });
                         this.props.navigation.dispatch(resetAction);
                         
                        this.setState({loading: false, loading1: false});
                        setTimeout(() => {
                          Toast.show(res.message, Toast.SHORT, );
                        }, 50);
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
                    //  this.props.navigation.navigate('Home')
                ).catch(e => {
                  console.log(e);
                  
                  this.setState({loading: false, loading1: false});
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({loading: false, loading1: false});
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
    });
  };

  Assign = () => {
      if(this.state.primaryUserID == ""){
      Toast.show("Please select primary user", Toast.SHORT, );
    } else if(this.state.primaryUserID3 == "") {
      Toast.show("Please select call type", Toast.SHORT, );
    }else{
    this.setState({submit:true,loading: true});

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          AsyncStorage.getItem('pagelimit').then(pagelimit => {
            var Request = {
              token: token,
              id: id,
              branch_id: branch_id,
              call_id: this.props.navigation.state.params.item.id,
              call_date: moment(this.state.date).format('YYYY-MM-DD'),
              // so_no: this.state.sono,
              call_primary_user: this.state.primaryUserID,
              call_more_user: this.state.userID,
              remark_for_user: this.state.remarks,
              call_group:this.state.primaryUserID3
            };
            console.log(API.m_call_pending_assign);
            console.log(JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              console.log(state.isConnected);
              
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.m_call_pending_assign, {
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
                    
                        res.json().then(res => {
                          console.log('call_get_details :::  ', res);
                          if (res.status == 'success') {
                            this.setState({
                              loading: false,
                              loading1: false
                              ,submit:false
                              // call_date: res.data.call_date,
                              // caller_name: res.data.caller_name,
                              // call_origin: res.data.call_origin,
                              // bo_code: res.data.bo_code,
                              // cmp_name: res.data.cmp_name,
                              // installation_address: res.data.installation_address,
                              // group2: res.data.group2,
                              // reported_problem: res.data.reported_problem,
                              // entry_date: res.data.entry_date
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
                                NavigationActions.navigate({routeName: 'Home'}),
                              ],
                            });
                            this.props.navigation.dispatch(resetAction);
                            this.setState({loading: false, loading1: false,submit:false});
                          } else if (res.status == 'failed') {
                           
                            this.setState({loading: false, loading1: false,submit:false});
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
                              message: res.message,submit:false
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
                         this.setState({loading: false, loading1: false,submit:false});
                         setTimeout(()=> {
                           Toast.show(res.message, Toast.SHORT, );
       
                         }, 50)
                         const resetAction = StackActions.reset({
                           index: 0,
                           actions: [
                             NavigationActions.navigate({ routeName: "Login" })
                           ]
                         });
                         this.props.navigation.dispatch(resetAction);
                        this.setState({loading: false, loading1: false});
                        setTimeout(() => {
                          Toast.show(res.message, Toast.SHORT, );
                        }, 50);
                      }
                    })
                    .catch(e => {
                      this.setState({loading: false, loading1: false,submit:false});
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({loading: false, loading1: false,submit:false});
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({loading: false, loading1: false,submit:false});
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );

                // 
              }
            });
          });
        });
      });
    });
    
  }
  
  };

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    this.setState({
      date: date,
    });
    this._hideDateTimePicker();
  };

  _checkTitle() {
    const {date} = this.state;

    if (date > moment()) {
      return moment(date).format('DD/MM/YYYY');
    }
    return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
  }

  Users = () => {
    return this.state.textInputs.map((data, index) => {
      return (
        <View style={styles.textInputView} refresh={this.state}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.labela}>Service Engineer</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                height: 42,
                width: width * 0.55,
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: Colors.medium_gray,
              }}
              onPress={() => this.onShow(index)}>
              <Text style={{fontSize: 15, color: Colors.black, fontFamily: Fonts.regular}}>
                {data.name}
              </Text>

              {/* <Dropdown
                    containerStyle={{
                      width: width*.5,
                     
                      alignSelf: 'flex-start',
                      paddingBottom: 15,
                    }}
                    fontSize={15}
                    
                    selectedItemColor={Colors.dark_gray}
                    value={data}
                    ref={c => (this.myDropdown = c)}
                    onChangeText={(value,indexa,data)=>{
                      if(this.state.primaryUser == ''){
                        
                        Toast.show('Plese select primary user...', Toast.SHORT, );
                        this.setState({refresh: !this.state.refresh})
                        console.log(this.state.textInputs);
                      } else {
                        this.setState({index1:index}, ()=> {
                          this.state.textInputs[this.state.index1] = value;
                          
                          console.log(this.state.textInputs);
                          
                      })
                      }
                    }}
                    data={data1}
                  /> */}
            </TouchableOpacity>

            {index == 0 ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  width: width * 0.25,
                  marginHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                }}
                onPress={() => {
                  this.state.textInputs.push({
                    id: '',
                    name: 'Select Service Engineer',
                  });
                  this.state.userID.push('');
                  this.setState({refresh: !this.state.refresh});
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    color: Colors.white,
                  }}>
                  ADD
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.red,
                  width: width * 0.25,
                  marginHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                }}
                onPress={() => {
                  this.delete(index);
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.medium,
                    color: Colors.white,
                  }}>
                  DELETE
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <UserModal
            visible={this.state.visible}
            onSelect={this.onSelect}
            onCancel={this.onCancel}
            options={ismodallist}
            navigation={this.state.navigation}
          />
        </View>
      );
    });
  };

  onShow = index => {
    this.setState({visible: true, index: index});
  };

  onSelect = (id, name) => {
    console.log(id, name);
    if (this.state.primaryUserID == '') {
      Toast.show('Please select primary user...', Toast.SHORT, );
      this.setState({refresh: !this.state.refresh});
      console.log(this.state.textInputs);
    } else if (id == this.state.primaryUserID) {
      Toast.show(
        'This is a primary user. Please select another user...',
        Toast.SHORT,
        
      );
    } else {
      if (this.state.userID.includes(id)) {
        Toast.show(
          'This user is already selected...',
          Toast.SHORT,
          
        );
      } else {
        this.setState({
          visible: false
        });
        this.state.textInputs[this.state.index].name = name;
        this.state.textInputs[this.state.index].id = id;
        this.state.userID[this.state.index] = id;
      }
    }
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onShow1 = () => {
    this.setState({visible1: true});
  };
  onShow3 = () => {
    this.setState({visible3: true});
  };

  onSelect1 = (id, name) => {
    console.log(id, name);

    this.setState({
      primaryUser: name,
      primaryUserID: id,
      visible1: false,
    });
  };
  onSelect3 = (id, name) => {
    console.log(id, name);

    this.setState({
      primaryUser3: name,
      primaryUserID3: id,
      visible3: false,
    });
  };

  onCancel1 = () => {
    this.setState({
      visible1: false,
    });
  };
  onCancel3 = () => {
    this.setState({
      visible3: false,
    });
  };

  onChangeText(value, id, data) {
    console.log(value, id, data);
  }

  delete = index => {
    console.log(index);

    this.state.textInputs.splice(parseInt(index), 1);
    this.state.userID.splice(parseInt(index), 1);

    this.setState({refresh: !this.state.refresh});

    console.log(this.state.textInputs, this.state.userID);
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../../images/Left_arrow.png')}
          pageTitle="Call Details"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <Loader loading={this.state.loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white}}>
          <ScrollView
            style={{flex: 1, backgroundColor: '#f1f1f1'}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.container} refresh={this.state.refresh}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: 'column',
                  backgroundColor: Colors.white,
                  borderWidth: 1,
                  borderTopLeftRadius: 5,
                  // borderLeftWidth: 6,
                  // borderLeftColor: Colors.medium_gray,
                  borderBottomLeftRadius: 5,
                  borderColor: Colors.light_gray,
                  shadowOffset: {width: 0, height: 5},
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
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}>
                      Call No. {this.state.dataSource.call_no}
                    </Text>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>
                       Status.</Text>
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.value}>{this.state.dataSource.status == 1 ? 'Running' :'Pending' }</Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>SO No.</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_no ? this.state.dataSource.so_no :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Sales Order Line No.</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.so_line_no ? this.state.dataSource.so_line_no :'-'}
                        </Text>
                      </View>
                    </View>


                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Date</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>
                          {this.state.dataSource.call_date ? moment(this.state.dataSource.call_date).format(
                            'DD/MM/YYYY',
                          ):'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Caller Name</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.caller_name ? this.state.dataSource.caller_name :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Origin</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.call_origin ? this.state.dataSource.call_origin :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 15}]}>
                      <Text style={styles.label}>BP Code</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.bo_code ? this.state.dataSource.bo_code :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Company</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.cmp_name ? this.state.dataSource.cmp_name :'-'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Address</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.installation_address
                            ? this.state.dataSource.installation_address
                            : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Email</Text>
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.email
                            ? this.state.dataSource.email
                            : '-'}

                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Phone</Text>
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.phone
                            ? this.state.dataSource.phone
                            : '-'}

                        </Text>
                      </View>
                    </View>



                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Group</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.group2 ? this.state.dataSource.group2 :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Type</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.a_calltype ? this.state.dataSource.a_calltype :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Description</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.description
                            ? this.state.dataSource.description
                            : '-'}
                        </Text>
                      </View>
                    </View>


                    <View style={[styles.rowItem, {paddingTop: 15}]}>
                      <Text style={styles.label}>Reported Problem</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.reported_problem ? this.state.dataSource.reported_problem:'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          { this.state.dataSource.entry_date ?moment(this.state.dataSource.entry_date).format(
                            'DD/MM/YYYY hh:mm a',
                          ):'-'}
                        </Text>
                      </View>
                    </View>  

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Branch Name</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                        {this.state.dataSource.branch_name ? this.state.dataSource.branch_name :'-'}
                        </Text>
                      </View>
                    </View>  

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Transferred</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                        {this.state.dataSource.transferred ? this.state.dataSource.transferred :'-'}
                        </Text>
                      </View>
                    </View>  

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Old Branch Name</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                        {this.state.dataSource.old_branch_name ? this.state.dataSource.old_branch_name :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Capacity</Text>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text style={styles.value}>
                          {this.state.dataSource.capacity
                            ? this.state.dataSource.capacity
                            : "-"}
                        </Text>
                      </View>
                    </View>

                  </View>
                </View>
              </View>



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
                  shadowOffset: {width: 0, height: 5},
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
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8,
                      }}>
                      Assign Call
                    </Text>

                    <View style={{paddingHorizontal: width * 0.05}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.labela}>Call Date</Text>

                        <Text style={styles.required}>*</Text>
                      </View>

                      <TouchableOpacity
                        style={{
                          padding: 15,
                          paddingVertical: 10,
                          paddingHorizontal: 10,

                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          backgroundColor: Colors.white,
                          borderWidth: 1,

                          borderRadius: 4,
                          paddingTop: 10,
                          borderColor: Colors.medium_gray,
                        }}
                        onPress={() => {
                          this._showDateTimePicker();
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Fonts.regular,
                            color: Colors.black,
                          }}>
                          {moment(this.state.date).format('DD/MM/YYYY')}
                        </Text>
                      </TouchableOpacity>

                      {/* <LabelTextInput
                        label="SO No."
                        
                        placeholder="Enter SO No."
                        returnKeyType="next"
                        onChangeText={sono => this.setState({sono})}
                      /> */}

                      <View style={styles.textInputView}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labela}>Service Engineer</Text>

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
                            this.onShow1();
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

                            <Text style={{fontSize: 15, color: Colors.black, fontFamily: Fonts.regular}}>
                              {this.state.primaryUser}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.textInputView}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labela}>Call Type</Text>

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
                            this.onShow3();
                          }}>
                          <View>

                            <Text style={{fontSize: 15, color: Colors.black, fontFamily: Fonts.regular}}>
                              {this.state.primaryUser3}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={{flex: 1}} refresh={new Date()}>
                        {this.Users()}
                      </View>

                      <LabelTextInput
                        label="Remarks for User"
                        multiline={true}
                        required={false}
                        
                        placeholder="Enter Remarks for User"
                        returnKeyType="next"
                        onChangeText={remarks => this.setState({remarks})}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <HorizontalButton
                fImage={require('../../images/tick.png')}
                sImage={require('../../images/refresh.png')}
                fcolor={this.state.submit ? Colors.dark_gray : Colors.primary}
                scolor={Colors.yellow}
                fLabel="Submit"
                sLabel="Branch Transfer"
                fButton={() => { this.state.submit ? null : this.Assign() }}
                sButton={() => { this.props.navigation.navigate("BranchTransfer", {call_id: this.state.dataSource.id,branch_name:this.state.dataSource.branch_name});  }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="date"
          minimumDate={this.state.max}

          //  datePickerModeAndroid = 'spinner'
        />

        <UserModal
          visible={this.state.visible1}
          onSelect={this.onSelect1}
          onCancel={this.onCancel1}
          options={this.state.userlist}
          navigation={this.state.navigation}
        />
         <UserModal
          visible={this.state.visible3}
          onSelect={this.onSelect3}
          onCancel={this.onCancel3}
          options={this.state.calltype}
          navigation={this.state.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    //  margin: 10,
    backgroundColor: '#f1f1f1',
  },
  btn: {
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
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
  absoluteView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 30,
    backgroundColor: 'transparent',
  },
  whiteImage: {
    tintColor: Colors.white,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  rowItem: {flex: 1, flexDirection: 'row', paddingVertical: 2},
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
  textInputView: {
    flexDirection: 'column',
  },
});


