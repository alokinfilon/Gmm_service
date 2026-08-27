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
  AppState,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Toast from 'react-native-simple-toast';
import {Dropdown} from 'react-native-material-dropdown';
import moment from 'moment';
import Colors from '../../../common/Colors';
import Fonts from '../../../common/Fonts';
import BackHeader from '../../../components/BackHeader';
import DateTimePicker from 'react-native-modal-datetime-picker';
import API from '../../../common/API';
import timeout from '../../../common/Timeout';
import Loader from '../../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
export default class PendingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      appVisible:false,
      isLoading: true,
      refresh: false,
      dataMass: false,
      docName: 'Choose file',
      dataSource: {},
      modalVisible: false,
      isDateTimePickerVisible: false,
      date: new Date(),
      textInputs: [],
     
    };
   
  }



 
  componentDidMount() {
   
    
    this.DrawingView()
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  
  componentWillUnmount() {
    AsyncStorage.setItem('removeDigi', "0");
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  
  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active' && this.state.appVisible) {
      setTimeout(() => {
        AsyncStorage.setItem('removeDigi', "0");
      }, 500);
     
      console.log('App has come to the foreground!');
    }
  };

  DrawingView = () => {


        this.setState({ loading: true });
     


      AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
            AsyncStorage.getItem("pagelimit").then(pagelimit => {
              var Request = {
                token: token,
                id: id,
                branch_id: branch_id,
                drawing_id: this.props.navigation.state.params.item.id
                
              };
              console.log(API.drawing_data_view);
              console.log('res',Request);
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.drawing_data_view, {
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
                            console.log("drawing_data_master :::  ", res);
                            if (res.status == "success") {

                              this.setState({ loading: false, loading1: false, dataSource: res.data, radioItems: res.sort_by, page: parseInt(this.state.page) + parseInt(pagelimit) })

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
                              this.setState({ loading: false, loading1: false, message: res.message, radioItems: res.sort_by, })
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
          backIcon={require('../../../images/Left_arrow.png')}
          pageTitle={this.props.navigation.state.params.name == 'Master' ? "Drawing Master" : "Drawing Request"}
          back={() => {
            this.props.navigation.state.params.name == 'Master' ?
            this.props.navigation.state.params.Navigate == 'Home'?
            this.props.navigation.navigate('Home')
            :
            this.props.navigation.goBack()
            :
            this.props.navigation.navigate('DrawingRequestEngineer')
            this.props.navigation.state.params.Navigate == 'Home'?AsyncStorage.setItem('removeDigi', "1"):null
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
                      So No. {this.state.dataSource.so_no}
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Drg Type</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.name?this.state.dataSource.name:'-'}</Text>
                      </View>
                    </View>


                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Requested By</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 15,
                            fontFamily: Fonts.bold,
                            color: Colors.primary,
                          }}>
                          {this.state.dataSource.requestor}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Requested Date/Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.l_date ?moment(this.state.dataSource.l_date).format("DD/MM/YYYY hh:mm a"):''}</Text>
                      </View>
                    </View>

                 
                    {/* <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Description</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.description}</Text>
                      </View>
                    </View> */}

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Call No.</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.call_no}</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Uploaded By</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.approval}</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Uploaded Date/Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>{this.state.dataSource.u_date ?moment(this.state.dataSource.u_date).format("DD/MM/YYYY hh:mm a"):''}</Text>
                      </View>
                    </View>

               
                  </View>
                </View>
              </View>

              {/* <HorizontalButton
                fImage={require('../../../images/tick.png')}
                sImage={require('../../../images/X-icon.png')}
                fcolor={Colors.primary}
                scolor={Colors.red}
                fLabel="Update"
                sLabel="Cancel"
                fButton={() => {
                  this.props.navigation.goBack();
                }}
                sButton={() => {
                  this.props.navigation.goBack();
                }}
              /> */}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.btn} onPress={()=> {
           AsyncStorage.setItem('removeDigi', "1"),
           this.setState({appVisible:true})
           Linking.openURL(this.state.dataSource.attach)
          }}>
          <ImageBackground
                        resizeMode="contain"
                        style={{height: 40, width:40, marginRight:10 , alignItems: 'center', justifyContent: 'center',}}
                        source={require('../../../images/fill.png')}>
                        <Image style={{height:25, width:25, tintColor: Colors.primary}} source={require('../../../images/eye.png')}/>
                        </ImageBackground>
        <View
          
          >
          <Text
            style={{
              fontSize: 18,
              color: Colors.white,
              fontFamily: Fonts.medium,
            }}>
           
           View Drawing
          </Text>
        </View>
      </TouchableOpacity>

                    
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="date"
          //  datePickerModeAndroid = 'spinner'
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
  value2: {
    padding: 2,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.white,
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
