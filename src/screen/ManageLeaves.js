import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput, Platform, SafeAreaView, StatusBar, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Pending from './Leave/Pending';
import Approved from './Leave/Approved';
import Rejected from './Leave/Rejected';
import Header from '../components/Header'
import Colors from '../common/Colors';
import { TabView, TabBar, SceneMap, NavigationState } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import AppState from 'react-native-app-state';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import Fonts from '../common/Fonts';
import {StackActions, NavigationActions} from 'react-navigation';


 export default class ManageLeaves extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });


addLeave = () => {

    if(this.state.reason == ""){
      Toast.show(
        'Please enter your reason',
        Toast.SHORT,
        
      );
    } else {
      this.setModalVisible(false)

      this.setState({loading: true,submit:false});
      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
        AsyncStorage.getItem('token').then(token => {
          var Request = {
            security: 1,
            token: token,
            id: id,
            branch_id: branch_id,
            reason: this.state.reason,
            date: moment(this.state.date).format("YYYY-MM-DD")
           
          };
          console.log(API.apply_leave);
          console.log(JSON.stringify(Request));
           NetInfo.fetch().then(state => {
           if (state.isConnected) {
              timeout(
                15000,
                fetch(API.apply_leave, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Request),
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log('ManageLeaves RESPONCE:::  ', res);
                    if (res.status == 'success') {
                     
                      this.setState({
                        loading: false,submit:true,
                        refresh: !this.state.refresh,
                      });
                      setTimeout(() => {
                        Toast.show(res.message, Toast.SHORT, );
                      }, 50);

                      const resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({routeName: 'Home'}),
                        ],
                      });
                      AsyncStorage.setItem('removeDigi', "1")
                      this.props.navigation.dispatch(resetAction);

                    } else if (res.status == 'failed') {
                     
                      this.setState({loading: false,submit:true});
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
                      this.setState({loading: false,submit:true});
                    }
                  })
                  .catch(e => {
                    this.setState({loading: false,submit:true});
                    console.log(e);
                    Toast.show(
                      'Something went wrong...',
                      Toast.SHORT,
                      
                    );
                  }),
              ).catch(e => {
                console.log(e);
                this.setState({loading: false,submit:true});
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({loading: false,submit:true});
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



  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };

  state = {
    index: 0,
    reason:"",
    date: new Date(),
    refresh: false,
    modalVisible: false,
    isDateTimePickerVisible: false,
    submit:true,
    routes: [
      { key: 'pending', title: 'PENDING' },
      { key: 'rejected', title: 'REJECTED' },
      { key: 'approved', title: 'APPROVED' },
    ],
  };
  _handleIndexChange = index =>{
    console.log(index)
  
    this.setState({
      index,
    });
  }


  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    console.log(date);
    
    this.setState({
      date
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



  _renderItem = ({ navigationState, position }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
          
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>

          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >

          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  _renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {this._renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  _renderScene = ({ route }) => {

    switch (route.key) {
      case 'pending':
        return <Pending navigation={this.props.navigation} />;
      case 'approved':
        return <Approved navigation={this.props.navigation} />;
      case 'rejected':
        return <Rejected navigation={this.props.navigation} />;
      default:
        return null;
    }
  };



  render() {
    console.log(this.props.navigation);
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary}}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white, }}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <Header
          backIcon={require('../images/menu.png')}
          pageTitle="Manage Leaves"
          back={() => {
            this._handleDrawer();
          }}
          iconName={require('../images/add.png')}
          press={() => this.setModalVisible(true)}
        />

        <View style={styles.container} refresh={this.state.refresh}>
      
          <TabView
            style={this.props.style}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            tabBarPosition="top"
            onIndexChange={this._handleIndexChange}
          />
        </View>


        <Modal
            transparent={true}
            animationType={"fade"}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.6)",

              }}
              activeOpacity={1}
              onPressOut={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <View style={styles.ModalInsideView}>
                <TouchableWithoutFeedback >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",

                    }}
                  >
                  <View style={{width:'100%',alignSelf:'center', backgroundColor:Colors.primary, height:45, justifyContent:'center'}} >
                  <Text style={{textAlign:'center', fontSize:18, fontFamily: Fonts.medium, color:Colors.white}}> Request Leave </Text>
                  </View>
                  <View style={styles.textBoxView}>
                    <Text style={styles.textBoxText}> Date</Text>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <Text
                          style={styles.textInput}>
                          {moment(this.state.date).format('DD/MM/YYYY')}
                        </Text>
                    <TouchableOpacity style={{height:30, width:30}} onPress={this._showDateTimePicker}>
                      <Ionicons name="md-calendar" color={Colors.primary} size={30} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.textBoxView}>
                    <Text style={styles.textBoxText}>Reason</Text>
                    <TextInput style={styles.textInput} placeholder="Enter Reason" 
                     onChangeText={reason => this.setState({reason})} returnKeyType="done" onSubmitEditing={()=> this.addLeave()}/>
                  </View>

                  <View style={{ width:'80%', alignSelf: "center", marginVertical:15}}>
                    <TouchableOpacity style={this.state.submit ? styles.btn :styles.btn2} onPress={()=>{
                    
                    {this.state.submit ?     this.addLeave()  :null}
                 
                  
                     

                      }}>
                      <Text style={{fontFamily: Fonts.bold, fontSize:16, color: Colors.white}}> Submit </Text>
                    </TouchableOpacity>
                  </View>


                  <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            minimumDate={new Date()}
                          />
                </View>

                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>

          </Modal>
          </KeyboardAvoidingView>
      </SafeAreaView>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .2)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom:0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    
  },
  active: {
    
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize:14
  },
  inactive: {
    color: Colors.dark_gray,
    fontFamily: Fonts.medium
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 12,
    paddingVertical:14,
    textAlign:'center'
  },
  textBoxView: {
    width: '90%',
    borderWidth: 1,
    alignSelf:'center',
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginTop: 25
  },
  textBoxText: {
    top: -15,
    position: "absolute",
    backgroundColor: "white",
    left: 10,
    padding: 5,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.primary
  },
  textInput: {
    marginTop: 2,
    paddingVertical: 12,
    fontSize: 16,
    paddingHorizontal: 5,
    fontFamily: Fonts.medium
  },
  text: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 18,
    textAlign: "center",
  },
  ModalInsideView:{
    flexDirection:'row',
  overflow:'hidden',
   backgroundColor : "#fff",
   height: 280 ,
   width: '90%',
  borderRadius:10,
   borderColor: '#fff'

  },
  btn: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor:Colors.dark_gray,
    overflow:'hidden'
  },
  btn2: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: Colors.medium_gray,
    marginVertical: 5,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor:Colors.dark_gray,
    overflow:'hidden'
  },
});
