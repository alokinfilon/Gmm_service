

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Text,Image,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import Colors from '../common/Colors';
import Header from '../components/Header';
import Fonts from '../common/Fonts';
import LabelTextInput from '../components/LabelTextInput';
import CustomButton from '../components/CustomButton';

import {StackActions, NavigationActions} from 'react-navigation';

import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

var Lower = false,
  Capital = false,
  Number = false,
  Minimum = false, ButtonVisible = false;
export default class DishEndInspection extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: [],
    
      date: new Date(),
      date1: new Date(),
      stickyHeaderHeight: 60,
      anim: new Animated.Value(0),
      scrollY: new Animated.Value(0),
      opacityValue: new Animated.Value(1),
      enableScrollViewScroll: true,
      editPage:false,
      old_password:'',
      password:'',
      c_password:'',
    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }

  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };
  componentDidMount(){

  }


  ChangePassword = () => {
    console.log(this.state.password.length,this.state.password.length>=4)
    if(this.state.old_password == ""){
      Toast.show(
        'Please enter your old passcode',
        Toast.SHORT,
        
      );
      
    }
    else if(this.state.password == ""){
      Toast.show(
        'Please enter your new passcode',
        Toast.SHORT,
        
      );
    }
   
    else if(this.state.password != this.state.c_password){
      Toast.show(
        'Passcode do not match',
        Toast.SHORT,
        
      );
    } else {
      this.setState({loading: true});
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
          var Request = {
            security: 1,
            id: id,
            token: token,
            pin: this.state.password,
         
          };
          console.log(API.update_pin);
          console.log(JSON.stringify(Request));
           NetInfo.fetch().then(state => {
           if (state.isConnected) {
              timeout(
                15000,
                fetch(API.update_pin, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Request),
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log(' update_pin:::  ', res);
                    if (res.status == 'success') {
                         
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Home" })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                          AsyncStorage.setItem('removeDigi', "1")
                     
                      this.setState({loading: false});
                    } else if (res.status == 'failed') {

                      this.setState({loading: false});
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
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT, );
                      }, 50);
                      this.setState({loading: false});
                    }
                  })
                  .catch(e => {
                    this.setState({loading: false});
                    console.log(e);
                    Toast.show(
                      'Something went wrong...',
                      Toast.SHORT,
                      
                    );
                  }),
              ).catch(e => {
                console.log(e);
                this.setState({loading: false});
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({loading: false});
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
    

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
        <Loader loading={this.state.loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white, }}>
        <View style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          backIcon={require('../images/menu.png')}
          pageTitle="Change Passcode"
          back={() => {
            this._handleDrawer();
          }}

        />
          <ScrollView
            scrollEventThrottle={16}
            contentContainerStyle={{paddingTop: 0}}>
            <View style={styles.container}>
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                }}>

           <LabelTextInput
                  label="Old Passcode"
                  placeholder="Old Passcode"
                  returnKeyType="next"
                  required={true}
                  max={4}
                  keyboardType={'number-pad'}
                  secureTextEntry={true}
                  editable={true}
                  onChangeText={old_password => this.setState({old_password})}
                />
                

                <LabelTextInput
                  label="New Passcode"
                  placeholder="New Passcode"
                  returnKeyType="next"
                  required={true}
                  max={4}
                  keyboardType={'number-pad'}
                  secureTextEntry={true}
                  editable={true}
                  onChangeText={password => {
                    this.setState({ password})
                  }}
                />

<LabelTextInput
                  label="Confirm Passcode"
                  placeholder="Enter Confirm Passcode"
                  returnKeyType="next"
                  required={true}
                  max={4}
                  keyboardType={'number-pad'}
                  secureTextEntry={true}
                  editable={true}
                  onChangeText={c_password => this.setState({c_password})}
                />

<View style={{alignSelf:'center'}}> 

<TouchableOpacity
  activeOpacity={  this.state.password.length >=4 ? 0.4 : 1}
  style={styles.btn} onPress={() => {
    this.state.password.length >=4 ?
      this.ChangePassword() : null
  }}>
  <View style={{
    backgroundColor:   this.state.password.length >=4 ? undefined : "rgba(255, 255, 255, 0.6)", width: width * 0.8,
                      height: width * 0.12,
                      alignItems: 'center',
                      //  borderWidth:1,
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}>

                      <ImageBackground
                        resizeMode="contain"
                        style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                        source={require('../images/fill.png')}>
                        <Image style={{ height: 30, width: 30, tintColor: Colors.primary }} source={require('../images/tick.png')} />
                      </ImageBackground>
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: Colors.white,
                            fontFamily: Fonts.medium,
                          }}>

                          Update
                      </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

{/* <CustomButton
                iconName={require('../images/tick.png')}
                  name="Update"
                  onPress={() => {
                    ButtonVisible ?
                    this.ChangePassword() : null
                  }}
                /> */}

</View>



              </View>
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
    flex: 1,
    backgroundColor: Colors.white,
  },
  primaryContainer: {
    margin: 10,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#f1f1f1',
    shadowOffset: {height: 0, width: 0},
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
    transform: [{rotate: '-0deg'}],
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
 btn: {

    flexDirection: 'row',
    width: width * 0.8,
    height: width * 0.12,
    alignItems: 'center',
    //  borderWidth:1,
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginVertical : 30,
  },
});