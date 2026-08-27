

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
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Header from '../../../components/Header';
import Colors from '../../../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import HexagonGray from '../../../components/HexagonPrimary';
import SICon from 'react-native-vector-icons/AntDesign';
import Fonts from '../../../common/Fonts';
import RadioButton from '../../../components/RadioButton';
import API from '../../../common/API';
import timeout from '../../../common/Timeout';
import Loader from '../../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
var UserArray = [];
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
export default class UserMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      isLoading: true,
      dataMass: false,
      modalVisible: false,
      UserData: [],
      dataSource: [],
      message: '',
      radioItems: [],
      selectedItem: '',
      sort_direction: 'desc',
      order_field: 'id',
      page: 0,
      search: '',

    };
  }


 
  componentDidMount() {
 

    UserArray = [];
  this.UserMaster();
    this.state.radioItems.map(item => {
      if (item.value == this.state.order_field) {
        this.setState({ order_field: item.value });
      }
    });
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

    UserArray = [];
    this.setState({ order_field: this.state.radioItems[index].value, modalVisible: false, page: 0, UserData: [] }, () => {
      setTimeout(() => {
        this.UserMaster();
      }, 500)

    });
  }



  UserMaster = () => {

    if (UserArray.includes(this.state.page)) {

    } else {
      if (UserArray.length < 1) {
        this.setState({ loading: true });
      } else {
        this.setState({ loading1: true });
      }
      UserArray.push(this.state.page)


      AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("branch_id").then(branch_id => {
            AsyncStorage.getItem("pagelimit").then(pagelimit => {
              var Request = {
                token: token,
                id: id,
                branch_id: branch_id,
                order_field: this.state.order_field,
                order_type: this.state.sort_direction,
                search: this.state.search,
                start: this.state.page,
                limit: pagelimit
              };
              console.log(API.user_master_data);
              console.log(JSON.stringify(Request));
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.user_master_data, {
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

                              this.setState({ loading: false, loading1: false, UserData: this.state.UserData.concat(res.data), radioItems: res.sort_by, page: parseInt(this.state.page) + parseInt(pagelimit) })

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
                            this.props.navigation.navigate('Home')
                          }else{
                            this.setState({loading: false, loading1: false});
                            console.log(e);
                            Toast.show(
                              'Something went wrong...',
                              Toast.SHORT,
                              
                            );
                           
                          }
                        })
                      
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
                  this.props.navigation.navigate('Home')
                }
              });
            });
          });
        });
      });
    }
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'column' }}
        onPress={() => {

          if (this.state.sort_direction == 'asc') {
            UserArray = [];
            this.setState({
              sort_direction: 'desc', page: 0, UserData: [],
            }, () => {
              this.UserMaster()
            });
          } else {
            UserArray = [];
            this.setState({
              sort_direction: 'asc', page: 0, UserData: [],
            }, () => {
              this.UserMaster()
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
          source={require('../../../images/up.png')}
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
          source={require('../../../images/down.png')}
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
          paddingTop: Platform.OS == 'ios' ? 0 : 0,
          backgroundColor: '#F6F6F6',
          width: width * .95,
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
              justifyContent: 'space-around',
            }}>
            <Icon
              name="search"
              size={20}
              color={Colors.primary}
              style={{
                height: 25,
                width: 35,
                paddingLeft: 10,
                alignSelf: 'center',
              }}
            />
            <TextInput
              ref="searchText"
              style={styles.textInput}
              placeholder="Search"
              returnKeyType="search"
              value={this.state.search}
              onChangeText={search => this.setState({ search })}
              underlineColorAndroid="transparent"
              onSubmitEditing={() => {
                this.setState({ page: 0, UserData: [] }, () => {
                  UserArray = [];
                  this.UserMaster()
                });
              }}
            />
            {this.state.search.length < 1 ? null :
              <TouchableOpacity
                onPress={() => {
                  UserArray = [];
                  this.refs.searchText.clear()
                  this.setState({
                    page: 0, UserData: [], search: ''
                  }, () => {
                    this.UserMaster()
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

            {this.sortByDirection()}
          </View>
        </View>
      </View>
    );
  };


  handleLoadMore = () => {
    this.UserMaster()
  };


  pullDown = () => {
    UserArray = [];
    this.setState({ page: 0, UserData: [] }, () => {

      this.UserMaster();


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
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{ flex: 1, backgroundColor: Colors.white, }}>
          <View style={styles.container}>

            <Header
              backIcon={require('../../../images/menu.png')}
              pageTitle="User Master"
              back={() => {
                this._handleDrawer();
              }}
              iconName={require('../../../images/add.png')}
              press={() =>
                this.props.navigation.navigate('AddUserMaster', { screen: 'add' })
              }
            />
            <NavigationEvents onWillFocus={payload => {
              console.log("unmount");
              this.pullDown();

            }}/>

            {/* <Loader loading={this.state.loading} /> */}
            {this.state.page == 0 && this.state.UserData.length < 1 && this.state.loading == false && this.state.loading1 == false ?
              <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flex:1, }} refreshControl={this._refreshControl()}>
{this.renderHeader()}
<View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
<Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>{this.state.message}</Text>
</View>
</ScrollView>
              :
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.UserData}
                keyboardShouldPersistTaps="handled"
                refreshControl={this._refreshControl()}
                ListHeaderComponent={this.renderHeader()}
                onEndReached={() => this.handleLoadMore()}
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
                          User Code{item.user_code}
                        </Text>

                        <View style={styles.rowItem}>
                          <Text style={styles.label}>Employee No</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>	{item.emp_no}</Text>
                          </View>
                        </View>

                        {/* <View style={styles.rowItem}>
                          <Text style={styles.label}>Role</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.name}</Text>
                          </View>
                        </View> */}


                        <View style={styles.rowItem}>
                          <Text style={styles.label}>Branch Name</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.branch_name}</Text>
                          </View>
                        </View>


                        <View style={styles.rowItem}>
                          <Text style={styles.label}>Name</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.name}</Text>
                          </View>
                        </View>

                        <View style={styles.rowItem}>
                          <Text style={styles.label}>Username</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.username}</Text>
                          </View>
                        </View>

                        <View style={styles.rowItem}>
                          <Text style={styles.label}>Password</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.password}</Text>
                          </View>
                        </View>

                        <View style={styles.rowItem}>
                          <Text style={styles.label}>phone</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.phone1}</Text>
                          </View>
                        </View>


                        <View style={[styles.rowItem, { paddingRight: 90 }]}>
                          <Text style={styles.label}>Email</Text>
                          <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.value}>{item.email}</Text>
                          </View>
                        </View>


                        {/* <View style={{ marginHorizontal: 10, paddingTop: 20 }} /> */}
                      </View>




                      <TouchableOpacity
                       
                        onPress={()=> {
                          // 
                          NetInfo.fetch().then(state => {
                           if (state.isConnected) {
                            this.props.navigation.navigate('AddUserMaster', { screen: 'edit', item: item })
                           }else{
                            Toast.show(
                              'Please Check your internet connection',
                              Toast.SHORT,
                              
                            );
                          }
                          })
                        }}>
                        {/* style={styles.RightAbsoluteButton}> */}
                        <View
                          style={styles.absoluteView}>
                          <Image
                            style={styles.whiteImage}
                            source={require('../../../images/edit.png')}
                          />
                        </View>
                      </TouchableOpacity>



                      {/* <TouchableOpacity 
                                onPress={()=> {
                                  // this.props.navigation.navigate('AddUserMaster')
                                }}
                                  style={styles.LeftAbsoluteButton}>
                                  <View
                                    style={[styles.absoluteView, {paddingLeft:60}]}>
                                    <Image
                                      style={{ 
                                        tintColor:Colors.primary,
                                        alignSelf: 'center',
                                        height: 30,
                                        width: 30,}}
                                      source={require('../../../images/trash.png')}
                                    />
                                  </View>
                                </TouchableOpacity> */}





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

                          {this.state.radioItems.map((item, key) => (
                            <RadioButton
                              key={key}
                              selected={this.state.order_field}
                              button={item}
                              onClick={this.changeActiveRadioButton.bind(
                                this,
                                key,
                              )}
                            />
                          ))}

                        </ScrollView>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableOpacity>
            </Modal>


          </View>
        </KeyboardAvoidingView>
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
    width: width * 0.4,
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
    marginLeft:4,
    tintColor: Colors.white,
    alignSelf: 'center',
    height: 25,
    width: 25,
  },
  rowItem: { flex: 1, flexDirection: 'row', paddingVertical: 1 },
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
