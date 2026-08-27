// Your password has been successfully requested to reset. check your registred email address.




import React, {Component} from 'react';
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
  KeyboardAvoidingView
} from 'react-native';
import Colors from '../common/Colors';
import BackHeader from '../components/BackHeader';
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

let data1 = [

  {value: 'Ahmedabad'},
  {value: 'Surat'},
  {value: 'Rajkot'},
];
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
     
      Username:'',
    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }

  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };



  ChangePassword = () => {
    if(this.state.Username == ""){
      Toast.show(
        'Please enter your Username',
        Toast.SHORT,
        Toast.BOTTOM,
      );
       } else {
      this.setState({loading: true});
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
          var Request = {
            security: 1,
            token: token,
            username: this.state.Username,
            
          };
          console.log(API.reset_password);
          console.log(JSON.stringify(Request));
           NetInfo.fetch().then(state => {
           if (state.isConnected) {
              timeout(
                  30000,
                fetch(API.reset_password, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Request),
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log('reset_password:::  ', res);
                    if (res.status == 'success') {
                        
                          Toast.show(
                            res.message,
                            Toast.SHORT,
                            Toast.BOTTOM,
                          );
                     
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({ routeName: "Login" })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                      
                     
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
                        Toast.show(res.message, Toast.SHORT, Toast.BOTTOM);
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
                      Toast.BOTTOM,
                    );
                  }),
              ).catch(e => {
                console.log(e);
                this.setState({loading: false});
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  Toast.BOTTOM,
                );
              });
            } else {
              this.setState({loading: false});
              Toast.show(
                'Please Check your internet connection',
                Toast.SHORT,
                Toast.BOTTOM,
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
        <BackHeader
                  backIcon={require('../images/Left_arrow.png')}
                  pageTitle="Reset Password"
                  back={() => {
                    this.props.navigation.goBack();
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
                  label="Username"
                  placeholder="Enter Username"
                  returnKeyType="next"
                  required={true}
                  
                  editable={true}
                  onChangeText={Username => this.setState({Username})}
                />

<TouchableOpacity onPress={()=>{
  this.props.navigation.navigate('Login')
}}>
<Text style={{
   marginTop: 15,
   color: Colors.primary,
   fontSize: 14,
   textAlign:'right',
   fontFamily: Fonts.medium,
}}>
Login?
</Text>
</TouchableOpacity>

<View style={{alignSelf:'center'}}> 


<CustomButton
                 iconName={require('../images/right.png')}
                  name="Reset Password"
                  onPress={() => {
                    this.ChangePassword()
                  }}
                />

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
});


