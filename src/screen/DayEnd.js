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
  TouchableOpacity,
  StatusBar,ImageBackground,
  BackHandler
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

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
      submit: false,
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
      Time:"",
    };

    this.AnimatedHeaderValue = new Animated.Value(0);
  }
  componentWillUnmount() {
    AsyncStorage.setItem('removeDigi', "0");
  }
 

 
 

  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
            <StatusBar
  hidden={false}
  barStyle="dark-content"
  backgroundColor={Colors.primary}
/>
        <BackHeader
          backIcon={require('../images/Left_arrow.png')}
          pageTitle="Day End"
          back ={
            ()=>{
            console.log('clicked');
            return BackHandler.exitApp();
            }}
        //   back={() => {
        //     const resetAction = StackActions.reset({
        //         index: 0,
        //         actions: [
        //           NavigationActions.navigate({
        //             routeName: 'Home',
        //           }),
        //         ],
        //       });
        //       this.props.navigation.dispatch(resetAction);
        //   }}
        />


        <View style={{flex:1}}>
                <View style={{justifyContent:'center' , alignItems:'center', marginTop:'70%'}}>
                    <Text style={{fontSize:20 , color:Colors.black , fontFamily:Fonts.bold }}>Your day has been ended</Text>
                </View>


                <TouchableOpacity 
                activeOpacity={10}
                style={{height:50 , justifyContent:'center' , alignItems:'center',
                width:'100%' ,
            bottom:0 , position:'absolute'}}>
                    <Text style={{fontSize:19 , fontFamily:Fonts.regular , color:Colors.primary}}> Contact to admin for remove end day </Text>
                </TouchableOpacity>


      </View>
          
      
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
