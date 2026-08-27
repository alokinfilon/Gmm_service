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
import Toast from 'react-native-simple-toast';
import {Dropdown} from 'react-native-material-dropdown';
import moment from 'moment';
import {StackActions, NavigationActions} from 'react-navigation';
import API from '../../common/API';
import timeout from '../../common/Timeout';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import Colors from '../../common/Colors';
import RadioButton from '../../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../components/CustomButton';
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
var userMap = [];
var ismodallist=[];
var startdate1 = moment(new Date(), 'YYYY/MM/DD').add(0, 'days').format();
var todayDate1 = moment(startdate1).format('DD');
var todayMonth1 = moment(startdate1).format('MM');
var todayYear1 = moment(startdate1).format('YYYY');
export default class EditAssigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refresh: false,
      dataMass: false,
      docName: 'Choose file',
      dataSource: {},
      userlist: [],
     
      visible: false,
      visible1: false,
      modalVisible: false,
      isDateTimePickerVisible: false,
      date: new Date(),
      max: new Date(todayYear1, todayMonth1 - 1, todayDate1),
      textInputs: [],
      userID: [],
      mobailno: '',
      email: '',
      primaryUser: 'Select Service Engineer',
      sono: '',
      primaryUserID: '',
      remarks:'',
      radioItems: [
        {
          label: 'Date',
          selected: false,
        },

        {
          label: 'Capacity',
          selected: false,
        },

        {
          label: 'Material',
          selected: false,
        },
        {
          label: 'O.D',
          selected: false,
        },
      ],
      selectedItem: '',
      noUser: [],
      submit2:false,
      submit: false,
      sort_direction: 'DESC',
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
    userMap = [];
    this.setState({textInputs: [], userID: [], userlist: []});
    this.EditAssigned();

    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({selectedItem: item.label});
      }
    });
  }

  EditAssigned = () => {
    this.setState({loading: true});

    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          var Request = {
            token: token,
            id: id,
            branch_id:branch_id,
            call_id: this.props.navigation.state.params.item.id,
          };
          console.log(API.call_get_details);
          console.log('Request', JSON.stringify(Request));
          NetInfo.fetch().then(state => {
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
                        console.log('call_get_details Edit Assigned:::  ', res);

                        if (res.status == 'success') {
                          this.setState(
                            {
                              loading: false,
                              loading1: false,
                              dataSource: res.data,
                              userlist: res.users,
                              sono:res.data.so_no,
                              remarks:res.data.remark_for_user,
                              date:res.data.call_date
                            },
                            () => {
                              userMap = [];

                            

                              ismodallist = this.state.isusermodal.concat(
                                this.state.userlist,
                              );
                              var isArray = [];
                              var issecondery = this.state.dataSource .call_more_user;
                              var isPrimary = this.state.dataSource.call_primary_user;
                              

                              if(issecondery == ""){
                                  
                                this.state.textInputs.push({ id:'',name:""});
                                // this.state.userID.push(this.state.userlist[i].id);

                                // this.state.textInputs.push('Select Service Engineer');
                                this.setState({refresh: !this.state.refresh});
                                    }
                                else {
                            
                                  
                                }

                              isArray=issecondery.split(",")

                            
                              console.log('primery', isPrimary);
                              // console.log('call_more_user',issecondery);

                              this.setState({ primaryUserID: isPrimary });

                              for (var i = 0;  i < this.state.userlist.length;i++) {

                                if (isPrimary == this.state.userlist[i].id) {
                                  this.setState({  primaryUser: this.state.userlist[i].name,  });
                                  this.setState({ refresh: !this.state.refresh });
                                }
                              
                              
                               for (var j = 0;  j <isArray.length; j++  ) {
                                  if (isArray[j] == this.state.userlist[i].id ) {
                                 
                                    this.state.textInputs.push({ id:'',name: this.state.userlist[i].name});
                                    this.state.userID.push(this.state.userlist[i].id);
                                    userMap.push(this.state.userlist[i].name);
                                    console.log('user name list ',this.state.userlist[i].name);
                                    this.setState({refresh: !this.state.refresh});
                                  }
                                }
                              }
                            },
                          );
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
                            Toast.show(res.message, Toast.SHORT, );
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
  };

  UpdateAssign = () => {
   if (this.state.primaryUserID == '') {
      Toast.show('Please select primary user', Toast.SHORT, );
    }else if (this.state.remarks == '') {
      Toast.show('Please Enter Remarks', Toast.SHORT, );
    }  
    else {
      this.setState({submit: true, loading: true});

      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
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
            };
            console.log(API.m_call_pending_assign_swipe);
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.m_call_pending_assign_swipe, {
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
                            });
                            const resetAction = StackActions.reset({
                              index: 0,
                              actions: [
                                NavigationActions.navigate({routeName: 'Home'}),
                              ],
                            });
                            this.props.navigation.dispatch(resetAction);
                            AsyncStorage.setItem('removeDigi', "1")
                          } else if (res.status == 'failed') {
                          
                            this.setState({loading: false, loading1: false,submit: false,});
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
                              message: res.message,submit: false,
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
                            NavigationActions.navigate({routeName: 'Login'}),
                          ],
                        });
                        this.props.navigation.dispatch(resetAction);
                        console.log('%c HELLO 2', res);
                        this.setState({loading: false, loading1: false,submit: false,});
                      }
                    })
                    .catch(e => {
                      this.setState({loading: false, loading1: false,submit: false,});
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({loading: false, loading1: false,submit: false,});
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({loading: false, loading1: false,submit: false,});
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
  };

  Confirmation = () => {
    let isvalidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.mobailno == '') {
      Toast.show('Please Enter Mobaile No', Toast.SHORT, );
    } else if (isvalidation.test(this.state.email) === false) {
      Toast.show('Please Enter valid email', Toast.SHORT, );
    } else {
      this.setState({loading: true,submit2:true});

      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
            AsyncStorage.getItem('token').then(token => {
            var Request = {
              id: id,
              token:token,
              branch_id: branch_id,
              call_id: this.props.navigation.state.params.item.id,
              mobile: this.state.mobailno,
              email: this.state.email,
            };
            console.log(API.resend_confirmation);
            console.log('Request', JSON.stringify(Request));
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.resend_confirmation, {
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
                          console.log(
                            'resend_confirmation Edit Assigned:::  ',
                            res,
                          );

                          if (res.status == 'success') {
                           
                            setTimeout(() => {
                              Toast.show(
                                res.message,
                                Toast.SHORT,
                                
                              );
                            }, 50);
                           this.props.navigation.goBack();

                            this.props.navigation.dispatch(resetAction);
                            this.setState({loading: false, loading1: false,submit2:false });
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
                            this.setState({loading: false, loading1: false, submit2: false});
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
                         this.setState({loading: false, loading1: false, submit2: false });
                        setTimeout(() => {
                          Toast.show(res.message, Toast.SHORT, );
                        }, 50);
                      }
                    })
                    .catch(e => {
                      this.setState({loading: false, loading1: false, submit2: false });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({loading: false, loading1: false, submit2: false });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({loading: false, loading1: false, submit2: false });
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({radioItems: this.state.radioItems}, () => {
      this.setState({selectedItem: this.state.radioItems[index].label});
    });
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
          visible: false,
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

  onSelect1 = (id, name) => {
    console.log('--id--', id,'--name--',name);

    this.setState({
      primaryUser: name,
      primaryUserID: id,
      visible1: false,
    },()=>{
      console.log('PrimaryUser',this.state.primaryUser);
    });
  };
  onCancel1 = () => {
    this.setState({
      visible1: false,
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
    let isSeconduser = this.state.dataSource.call_more_user
      ? {
          marginTop: 10,
        }
      : {};
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../../images/Left_arrow.png')}
          pageTitle="Assigned Calls"
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
                      <Text style={styles.label}>So No.</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                            {this.state.dataSource.so_no ? this.state.dataSource.so_no :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Call Date</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>
                          {this.state.dataSource.call_date ? moment(this.state.dataSource.call_date).format("DD/MM/YYYY") :'-'}
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
                          {this.state.dataSource.call_origin ?this.state.dataSource.call_origin :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
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

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Problem</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.reported_problem ? this.state.dataSource.reported_problem :'-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Reported Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                           {this.state.dataSource.entry_date ? moment(this.state.dataSource.entry_date).format(
                            'DD/MM/YYYY hh:mm a',
                          ) : '-'}
                        </Text>
                      </View>
                    </View>

                

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Service Engineer</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.primaryUser
                            ? this.state.primaryUser
                            : ' -'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, isSeconduser]}>
                      <Text style={styles.label}>Service Engineer</Text>

                      <View style={{flex: 1, flexDirection: 'column'}}>
                        {userMap ? (
                          <View>
                            {userMap.map(data => {
                              return <Text style={styles.value}> {data}</Text>;
                            })}
                          </View>
                        ) : (
                          <Text style={styles.value}> -</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Assigned By</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>{this.state.dataSource.assignname} {this.state.dataSource.assigntype == "2" ? "- Manager" : "- Engineer"}</Text>
                      </View>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Assigned Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.assign_date ? moment(this.state.dataSource.assign_date).format(
                            'DD/MM/YYYY hh:mm a',
                          ) : '-'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Remarks</Text>
                      <Text style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                          {this.state.dataSource.remark_for_user
                            ? this.state.dataSource.remark_for_user
                            : ' -'}
                        </Text>
                      </Text>
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
                      Edit/Swipe Call
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
                          {/* {moment(this.state.date).format('DD/MM/YYYY')} */}
                          {moment(this.state.date).format("DD/MM/YYYY")}
                        </Text>
                      </TouchableOpacity>

                      {/* <LabelTextInput
                        label="SO No."
                        value={this.state.sono}
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
                            <Text style={{fontSize: 15, color: Colors.black, fontFamily: Fonts.regular}}>
                              {this.state.primaryUser}
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
                        required={true}
                        placeholder="Enter Remarks for User"
                        returnKeyType="next"
                        onChangeText={remarks => this.setState({remarks})}
                        value={this.state.remarks}
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
                fLabel="Update"
                sLabel="Cancel"
                fButton={() => { this.state.submit ? null : this.UpdateAssign() }}
                sButton={() => {
                  this.props.navigation.goBack();
                }}
              />

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
                      Re-send Confirmation
                    </Text>


<Text style={{textAlign:'left',fontSize:16,fontFamily:Fonts.regular,paddingHorizontal:20}}>
*Confirmation will be sent by default to the registered mobile number & email of the customer. Use the below fields for sending communication to additional people.
</Text>


                    <View style={{paddingHorizontal: width * 0.05}}>
                      <LabelTextInput
                         keyboardType="numeric"
                        label="Mobile No."
                        
                        placeholder="Enter Mobile No."
                        returnKeyType="next"
                        onChangeText={mobailno => this.setState({mobailno})}
                        value={this.state.mobailno}
                      />

                      <LabelTextInput
                        label="Email"
                        keyboardType="email-address"
                        
                        placeholder="Enter Email"
                        returnKeyType="next"
                        onChangeText={email => this.setState({email})}
                        value={this.state.email}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <CustomButton
                iconName={require('../../images/double_tick.png')}
                name="Send Confirmation"
               
                onPress={() => {
                  this.state.submit2 ? null : this.Confirmation() 
                }}
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
