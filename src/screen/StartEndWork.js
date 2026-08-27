import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  ImageBackground,
  Platform,
  Image,
  AppState,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  Linking,
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import Header from '../components/Header';
import Colors from '../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import HexagonGray from '../components/HexagonPrimary';
import SICon from 'react-native-vector-icons/AntDesign';
import Fonts from '../common/Fonts';
import RadioButton from '../components/RadioButton';
import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
var AssignedArray = [];
import DateTimePicker from 'react-native-modal-datetime-picker';
import { withNavigationFocus } from 'react-navigation';
export default class StartEndWork extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      appState: AppState.currentState,
      appVisible:false,
      loading: false,
      loading1: false,
      modalVisible: false,
      StartEndWork: [],
      dataSource: [
        {
          call_id: '98989',
          company_name: 'GMM',
          date: '4/09/2019',
        },
        {
          call_id: '69696',
          company_name: 'GMM',
          date: '6/9/2019',
        },
        {
          call_id: '4565',
          company_name: 'GMM',
          date: '8/09/2019',
        },
      ],
      message: '',
      radioItems: [],
      selectedItem: '',
      sort_direction: 'desc',
      order_field: 'id',
      page: 0,
      search: '',
      isDateTimePickerVisible3: false,
      date3: new Date(),

    };
  }

  componentDidMount() {
  
    AppState.addEventListener('change', this._handleAppStateChange);
    AssignedArray = [];
  
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({ selectedItem: item.label });
      }
    });
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
     
      console.log('eground!');
    }
  };

  StartEndWork = () => {

    if (AssignedArray.includes(this.state.page)) {

    } else {
      if (AssignedArray.length < 1) {
        this.setState({ loading: true });
      } else {
        this.setState({ loading1: true });
      }
      AssignedArray.push(this.state.page)


      AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
            AsyncStorage.getItem("pagelimit").then(pagelimit => {
              var Request = {
                token: token,
                id: id,
                branch_id: branch_id,
                date: moment(this.state.date3).format("YYYY-MM-DD")

              };
              console.log(API.start_end_work_data);
              console.log(JSON.stringify(Request));
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.start_end_work_data, {
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
                            console.log("start_end_work_data :::  ", res);
                            if (res.status == "success") {

                              this.setState({ loading: false, loading1: false, StartEndWork: res.data, radioItems: res.sort_by, page: parseInt(this.state.page) + parseInt(pagelimit) })

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
                                           this.props.navigation.navigate(Home)
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
                  this.props.navigation.navigate(Home)
                }
              });
            });
          });
        });
      });
    }
  }


  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: '100%',
          backgroundColor: Colors.white,
        }}
      />
    );
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  changeActiveRadioButton(index) {

    AssignedArray = [];
    this.setState({ order_field: this.state.radioItems[index].value, modalVisible: false, page: 0, StartEndWork: [] }, () => {
      setTimeout(() => {
        this.StartEndWork();
      }, 500)

    });

  }


  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'column' }}
        onPress={() => {
          if (this.state.sort_direction == 'asc') {
            AssignedArray = [];
            this.setState({
              sort_direction: 'desc', page: 0, StartEndWork: [],
            }, () => {
              this.StartEndWork()
            });
          } else {
            AssignedArray = [];
            this.setState({
              sort_direction: 'asc', page: 0, StartEndWork: [],
            }, () => {
              this.StartEndWork()
            });
          }
        }}>
        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == 'desc'
                ? Colors.dark_gray
                : Colors.primary,
            right: 10,
          }}
          source={require('../images/up.png')}
        />

        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == 'desc'
                ? Colors.primary
                : Colors.dark_gray,
            right: 10,
          }}
          source={require('../images/down.png')}
        />
      </TouchableOpacity>
    );
  };

  renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: Platform.OS == 'ios' ? 60 : 60,
          width: width * 0.95,
          paddingTop: Platform.OS == 'ios' ? 0 : 0,
          backgroundColor: '#F6F6F6',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: Colors.white,
            width: '100%',
            flex: 1,
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              name="calendar"
              size={20}
              color={Colors.primary}
              style={{
                height: 25,
                width: 35,
                paddingLeft: 10,
                alignSelf: 'center',
              }}
            />
            {/* <TextInput
              ref="searchText"
              style={styles.textInput}
              placeholder="Search"
              returnKeyType="search"
              onChangeText={search => this.setState({ search })}
              onSubmitEditing={() => {

                this.setState({ page: 0, StartEndWork: [] }, () => {
                  AssignedArray = [];
                  this.StartEndWork()
                });
              }}
              underlineColorAndroid="transparent"
            /> */}
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => {
                this._showDateTimePicker3();
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.regular,
                  color: Colors.black,
                  paddingBottom:5,
                }}>
                {moment(this.state.date3).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>

            {/* {this.state.search.length < 1 ? null :
              <TouchableOpacity
                onPress={() => {
                  AssignedArray = [];
                  this.refs.searchText.clear()
                  this.setState({
                    page: 0, StartEndWork: [], search: ''
                  }, () => {
                    this.StartEndWork()
                  });
                }}
                style={{ alignSelf: 'center', right: 2 }}>
                <Icon
                  name="times"
                  size={20}
                  color={Colors.medium_gray}
                  style={{
                    marginTop: 2,
                    height: 25,
                    width: 35,
                  }}
                />
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={{ alignSelf: 'center', right: 2 }}>
              <Icon
                name="filter"
                size={20}
                color={Colors.primary}
                style={{
                  marginTop: 2,
                  height: 25,
                  width: 35,
                }}
              />
            </TouchableOpacity>

            {this.sortByDirection()} */}
          </View>
        </View>
      </View>
    );
  };
  handleLoadMore = () => {
    this.StartEndWork()
  };


  _showDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: true });




  _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });






  _handleDatePicked3 = date => {


    this.setState({ page: 0, StartEndWork: [] }, () => {
      AssignedArray = [];
      this.StartEndWork()
    })

    this.setState({
      date3: date,
    });
    this._hideDateTimePicker3();
  };
  _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });



  pullDown = () => {
    AssignedArray = [];
    this.setState({ page: 0, StartEndWork: [],date3: new Date() }, () => {
      setTimeout(() => {
        this.StartEndWork();
      }, 500)

    });
  };


  _refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.loading}
        onRefresh={() => this.pullDown()}
        tintColor={Colors.primary}
      />
    );
  }

  
  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <View style={styles.container}>
        
          <Header
            backIcon={require('../images/menu.png')}
            pageTitle="Start/End Work"
            back={() => {
              this._handleDrawer();
            }}

          />
          {/* <Loader loading={this.state.loading} /> */}
          <NavigationEvents onWillFocus={payload => {
            console.log("unmount");
            this.pullDown();

          }} />
            {/* <Image
            style={{ height:150,width:150}}
            source={{uri:'https://tile.openstreetmap.org/16/45979/28459.png'}}
          /> */}
          
          {this.state.page == 0 && this.state.StartEndWork.length < 1 && this.state.loading == false ?

<ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flex:1, }} refreshControl={this._refreshControl()}>
{this.renderHeader()}
<View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
<Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>{this.state.message}</Text>
</View>
</ScrollView>
            :
          
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.StartEndWork}
              keyboardShouldPersistTaps="handled"
              refreshControl={this._refreshControl()}
              ListHeaderComponent={this.renderHeader()}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.01}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 10,
                    flexDirection: 'column',
                    backgroundColor: Colors.white,
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
                          paddingVertical: 1,
                        }}>
                        Call No  {item.call_no}
                      </Text>


                      <View style={styles.rowItem}>
                        <Text style={styles.label}>User</Text>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                          <Text style={styles.value}>{item.apply_name}</Text>
                        </View>
                      </View>


                      {/* <View style={styles.rowItem}>
                        <Text style={styles.label}>Call No</Text>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                          <Text style={styles.value}>{item.call_no}</Text>
                        </View>
                      </View> */}

                      <View style={styles.rowItem}>
                        <Text style={styles.label}>Start Work Time</Text>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                          <Text style={styles.value}>{item.start_time ? moment(item.start_time).format("DD/MM/YYYY hh:mm a"): "-"} </Text>
                        </View>
                      </View>


                      <View style={styles.rowItem}>
                        <Text style={styles.label}>End Work Time	</Text>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                        
                          <Text style={styles.value}>{item.end_time ? moment(item.end_time).format("DD/MM/YYYY hh:mm a"): "-"} </Text>
                        </View>
                      </View>


                      <View style={styles.rowItem}>
                        <Text style={styles.label}>Total Time</Text>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.value}>{item.spare_date ? moment(item.spare_date).format("DD/MM/YYYY hh:mm a"): "-"} </Text>
                         
                        </View>
                      </View>



                      <View style={styles.rowItem}>
                        <Text style={styles.label}>Location</Text>
                        <View style={{ width:'46%' }}>
                         <TouchableOpacity style={{flexDirection: 'row' ,justifyContent:'space-around',marginTop:8}}
                          onPress={()=> {
                            AsyncStorage.setItem('removeDigi', "1"),
                            this.setState({appVisible:true})
                            Linking.openURL(item.lat_link)
                          }}>
                     
                          {item.lat_img ?  
                          <Image
                            style={{ height:60,width:60}}
                            source={{uri:item.lat_img}}
                          />
                          :null}
                          {item.lon_img ?   
                             <Image
                            style={{ height:60,width:60}}
                            source={{uri:item.lon_img}}
                          />
                        :null}
                        </TouchableOpacity>
                        </View>
                      </View>

                    </View>





                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          }
          <Modal
            ref={'updateModal'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            visible={this.state.modalVisible}
            position="bottom"
            animationType={'fade'}
            backdrop={true}
            coverScreen={true}
            backdropPressToClose={true}
            backdropOpacity={0.5}
            transparent={true}
            swipeToClose={true}
            onRequestClose={() => {
              this.setState({ modalVisible: false });
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 1 }}
              onPressOut={() => {
                this.setState({ modalVisible: false });
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      width: '100%',
                      minHeight: '35%',
                      maxHeight: '50%',
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      borderColor: Colors.dark_gray,
                    }}>
                    <View style={{}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          flexDirection: 'row',
                          paddingVertical: 10,
                          borderBottomColor: Colors.light_gray,
                          borderBottomWidth: 1,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,

                            color: Colors.black,
                            fontFamily: Fonts.regular,
                          }}>
                          SORT BY
                          </Text>
                      </View>
                      <ScrollView>


                      </ScrollView>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* <TouchableOpacity style={styles.btn} onPress={()=> {this.props.navigation.navigate('UploadEX')}}>
          <ImageBackground
                        resizeMode="contain"
                        style={{height: 40, width:40, marginRight:10 , alignItems: 'center', justifyContent: 'center',}}
                        source={require('../images/fill.png')}>
                        <Image style={{height:25, width:25, tintColor: Colors.primary}} source={require('../images/upload.png')}/>
                        </ImageBackground>
        <View
          
          >
          <Text
            style={{
              fontSize: 18,
              color: Colors.white,
              fontFamily: Fonts.medium,
            }}>
           
          Upload Excel
          </Text>
        </View>
      </TouchableOpacity> */}

        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible3}
          onConfirm={this._handleDatePicked3}
          onCancel={this._hideDateTimePicker3}
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
    //  margin: 10,
    backgroundColor: '#f1f1f1',
  },
  btn: {
    width: 300,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  radioButton: {
    marginTop: 6,
    marginLeft: 25,
    flexDirection: 'row',
  },
  selectedText: {
    fontSize: 18,
    color: 'white',
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
    width: width * 0.8/2,
    paddingLeft: 15,
  },
  value: {
    padding: 2,
    fontSize: 14,
   textAlign:'left',
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  RightAbsoluteButton: {
    overflow: 'hidden',
    width: 80,
    height: 40,
    position: 'absolute',
    bottom: -3,
    alignSelf: 'center',
    right: -30,
    borderTopLeftRadius: 80,
    borderBottomRightRadius: 80,
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
    backgroundColor: '#f1f1f1',
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
    marginLeft:4,
    alignSelf: 'center',
    height: 25,
    width: 25,
  },
  rowItem: { flex: 1, flexDirection: 'row', paddingVertical: 2 },
  primaryImage: {
    tintColor: Colors.primary,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  btn: {

    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    width: width,
    alignItems: "center",
    justifyContent: 'center'
  },
});
