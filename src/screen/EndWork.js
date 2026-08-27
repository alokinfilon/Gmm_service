import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  Text,Image,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,ImageBackground
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { check, request, PERMISSIONS, openSettings, RESULTS } from 'react-native-permissions';
import HorizontalButton from '../components/HorizontalButton';
import Colors from '../common/Colors';
import BackHeader from '../components/BackHeader';
import Fonts from '../common/Fonts';
import LabelTextInput from '../components/LabelTextInput';
import { Dropdown } from 'react-native-material-dropdown';
import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { StackActions, NavigationActions } from 'react-navigation';
import Header from '../components/Header';
import UserModal from '../common/UserModal';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var SpareList= [];
var SpareID= [];

let data1 = [

  { value: 'Ahmedabad' },
  { value: 'Surat' },
  { value: 'Rajkot' },
];
var Time
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
      submit: true,
      name: '',
      description:'',
      loading: false,
      callno:'Select call no.',
      callid:'',
      spare:'Select Spare',
      calllist:[],
      sparelist:[],
      lat:'',
      long:'',
      Check:'',
      Time:moment(new Date()).format('DD/MM/YYYY'),
    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentDidMount() {
  // this.GetLatLon();
  this.Chack_day();
  

  // setTimeout(()=> {
  //   this.Chack_day();
  //     //  Toast.show('ppp', Toast.SHORT, );
  //   }, 10000)

    this.Start();
  }
 
  componentWillUnmount() {
    AsyncStorage.setItem('removeDigi', "0");
  }

  
Start = () =>{
  Time =   setInterval(() => {
    var H = new Date().getHours()
    var M = new Date().getMinutes()
    var SEC = new Date().getSeconds()
    this.setState({Time:moment(new Date()).format('DD/MM/YYYY')},()=>{
        console.log("time",this.state.Time);
           })
  }, 1000);
}
  // onPress={() => {this.props.navigation.navigate('DayEnd')}}
              //  onPress={() => {this.EndWork()}}
  GetLatLon() {
    console.log('proccided');
    this.setState({  submit: false });
    Geolocation.getCurrentPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({ lastPosition });

      // console.log('longitude', position.coords.longitude);
      // console.log('latitude', position.coords.latitude);

      this.setState({lat:position.coords.latitude , long:position.coords.longitude})

      var lat = position.coords.latitude;
      var long = position.coords.longitude;

      console.log('lat',  lat);
      console.log('long',  long);



      this.EndWork(lat ,long )

    },
      (error) => {
        this.setState({  submit: true });
        setTimeout(() => {
          if (error.message == "No location provider available.") {
            if (Platform.OS == "android") {
              AsyncStorage.setItem('removeDigi', "1");
              RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                .then(data => {
                  console.log(data);
                  this.GetLatLon()
                  this.setState({ loading: false, submit: false },()=>{
                    setTimeout(() => {
                      AsyncStorage.setItem('removeDigi', "0")                 
                  }, 500);
                  });
                }).catch(err => {
                  this.setState({ loading: false, submit: true })
                  console.log(err);
                });
            } else {
              this.setState({ loading: false, submit: true })
              Toast.show("Please Turn on Your Location", Toast.SHORT, );
            }
          }
          else if(error.message == "User denied access to location services."){
            this.setState({ loading: false, submit: true }) 
            Toast.show("Please Allow access to location services.", Toast.SHORT, );
            setTimeout(() => {
                openSettings().catch(() => console.warn('cannot open settings'));
            }, 2000);
          
        }
          else {
            this.setState({ loading: false, submit: true })
            Toast.show(error.message, Toast.SHORT, );
          }
        }, 50)
        console.log(error)
      },
      { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
    );
  }
 

  Chack_day = () => {
    console.log("lat,lon" , this.state.long , this.state.lat)
      this.setState({  loading: true });
      var Request = {}
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
                Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,
                }
         
        console.log(API.check_day);
        
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.check_day, {
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
                        this.setState({ loading: false, loading1: false});
                        res.json().then(res => {
                  
                          console.log('check_day', res);

                          if (res.status == 'success') {
                            this.setState({
                              loading: false,
                              loading1: false,
                              Check:res.status
                            });
                            // setTimeout(() => {
                            //     Toast.show(
                            //       res.message,
                            //       Toast.SHORT,
                            //       
                            //     );
                            //   }, 50);
                              console.log("ss",this.state.Check);
                            }                              

                            else if(res.status == 'false'){
                              this.setState({Check:res.status})
                              Toast.show(res.message, Toast.SHORT, );
                              console.log("ss",this.state.Check);
                            }

                            else if (res.status == 'failed') {
                         
                            this.setState({ loading: false, loading1: false});
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
                      
                        this.setState({ loading: false, loading1: false });
                      }
                    })
                    .catch(e => {
                      this.setState({ loading: false, loading1: false });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({ loading: false, loading1: false});
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({ loading: false, loading1: false });
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



  EndWork = (lat ,long ) => {
    console.log("lat,lon" , lat , long )
      this.setState({  loading: true });
      var Request = {}
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
                Request = {
                  token: token,
                  id: id,
                  branch_id: branch_id,
                  lat:lat,
                  lon:long,
                }
         
        console.log(API.end_day);
        
            console.log(JSON.stringify(Request));

            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.end_day, {
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
                  
                          console.log('end_day', res);

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
                                    routeName: 'DayEnd',
                                  }),
                                ],
                              });
                              this.props.navigation.dispatch(resetAction);
                            }
                              else if(res.status == 'false'){
                                this.setState({ loading: false, loading1: false, submit: true });
                                Toast.show(res.message, Toast.SHORT, );
                              }

                          else if (res.status == 'failed') {
                           
                            this.setState({ loading: false, loading1: false, submit: true });
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
                      
                        this.setState({ loading: false, loading1: false, submit: true });
                      }
                    })
                    .catch(e => {
                      this.setState({ loading: false, loading1: false, submit: true });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({ loading: false, loading1: false, submit: true });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({ loading: false, loading1: false, submit: true });
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

  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white, }}>
    <StatusBar
  hidden={false}
  barStyle="dark-content"
  backgroundColor={Colors.primary}
/>
        <View style={{ flex: 1, backgroundColor: Colors.white }}>

        <Header
            backIcon={require('../images/menu.png')}
            pageTitle="End Day"
            back={() => {
              this._handleDrawer();
            }}
            // iconName={require('../../../images/add.png')}
            // press={() =>
            //   this.props.navigation.navigate('AddSpareMaster', {screen: 'view'})
            // }
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



<View
                style={{
                  width: width,
                  alignItems: 'center',
                  // justifyContent: 'center',
                
                 
                }}>
                <Image
                  style={{}}
                  resizeMode="contain"
                  source={require('../images/logo.png')}
                  style={{ width: width * 0.7, height: width * 0.2 }}
                />
 
 <Text style={{ fontFamily: Fonts.medium, color: Colors.regular, fontSize: 18 ,textAlign:'left',
 marginRight:20,marginTop:20}}>Today Date : {this.state.Time}</Text>
 <Text style={{ fontFamily: Fonts.regular, color: Colors.medium_gray,
   fontSize: 16 ,textAlign:'left',marginRight:20,marginTop:6}}>Your Day is Started</Text>

  
  
              </View>

                    
                  
                  </View>
                </View>
              </View>

              {this.state.Check == 'success' ?  
              <TouchableOpacity style={{
              flexDirection: 'row',
              width: '100%',
              height: width * 0.12,
              alignItems: 'center',
              //  borderWidth:1,
              justifyContent: 'center',
              backgroundColor: Colors.primary,
              marginVertical: 0,
            }}
             onPress={() => {
            // onPress={() => {this.props.navigation.navigate('DayEnd')}}
            
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                this.state.submit ? this.GetLatLon() : null
               console.log( this.state.submit ? 'true' : 'null');
               
              }else{
               Toast.show(
                 'Please Check your internet connection',
                 Toast.SHORT,
                 
               );
             }
             })
           
          }}

              //  onPress={() => {this.EndWork()}}
            >


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
                    color: Colors.white,
                    fontFamily: Fonts.bold,
                  }}>

                End Day
      </Text>
              </View>
            </TouchableOpacity>
            : null }


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
