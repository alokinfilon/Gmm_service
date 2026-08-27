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
  RefreshControl
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { StackActions, NavigationActions, NavigationEvents } from "react-navigation";
import Header from '../../src/components/Header';
import Colors from '../../src/common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import HexagonGray from '../../src/components/HexagonPrimary';
import SICon from 'react-native-vector-icons/AntDesign';
import Fonts from '../../src/common/Fonts';
import RadioButton from '../../src/components/RadioButton';
import API from '../../src/common/API';
import timeout from '../../src/common/Timeout';
import Loader from '../../src/common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
var AssignedArray = [];

export default class DrawingRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      modalVisible: false,
      AssignedData: [],
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

    };
  }



  // componentWillUnmount() {
  //   this.willFocus.remove();
  //   console.log('%c componentWillUnmount', "color:red");

  // }

  componentDidMount() {
    // this.willFocus = this.props.navigation.addListener(
    //   'willFocus',
    //   payload => {
    //     console.log("%c componentDidMount", "color:green", payload);
    //   }
    // );
    console.log('Workking');
    AssignedArray = [];
    // this.DrawingRequest();
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({ selectedItem: item.label });
      }
    });
  }


  DrawingRequest = () => {


    if (AssignedArray.includes(this.state.page)) {

    } else {
      if (AssignedArray.length < 1) {
        this.setState({ loading: true });
      } else {
        this.setState({ loading1: true });
      }
      AssignedArray.push(this.state.page)

      // {"id": 1, "branch_id": 1, "order_field": "id", "order_type": "desc", "search": "", "start": 0, "limit": 10}
      // 
      AsyncStorage.getItem('type_id').then(type_id=>{
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
                limit: pagelimit,
               

              };
              console.log(' type_id:type',type_id);
              console.log(API.drawing_data_request);
              console.log(JSON.stringify(Request));
              NetInfo.fetch().then(state => {
                if (state.isConnected) {
                  timeout(
                    15000,
                    fetch(API.drawing_data_request, {
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
                            console.log("drawing_data_request :::  ", res);
                            if (res.status == "success") {

                              this.setState({ loading: false, loading1: false, AssignedData: this.state.AssignedData.concat(res.data), radioItems: res.sort_by, page: parseInt(this.state.page) + parseInt(pagelimit) })

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
                  this.props.navigation.navigate('Home')
                }
              });
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
    this.setState({ order_field: this.state.radioItems[index].value, modalVisible: false, page: 0, AssignedData: [] }, () => {
      setTimeout(() => {
        this.DrawingRequest();
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
              sort_direction: 'desc', page: 0, AssignedData: [],
            }, () => {
              this.DrawingRequest();
            });
          } else {
            AssignedArray = [];
            this.setState({
              sort_direction: 'asc', page: 0, AssignedData: [],
            }, () => {
              this.DrawingRequest();
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
          source={require('../../src/images/up.png')}
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
          source={require('../../src/images/down.png')}
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
              onSubmitEditing={() => {

                this.setState({ page: 0, AssignedData: [] }, () => {
                  AssignedArray = [];
                  this.DrawingRequest();
                });
              }}
              underlineColorAndroid="transparent"
            />

            {this.state.search.length < 1 ? null :
              <TouchableOpacity
                onPress={() => {
                  AssignedArray = [];
                  this.refs.searchText.clear()
                  this.setState({
                    page: 0, AssignedData: [], search: ''
                  }, () => {
                    this.DrawingRequest();
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
    this.DrawingRequest();
  };


  pullDown = () => {
    AssignedArray = [];
    this.setState({ page: 0, AssignedData: [] }, () => {
      setTimeout(() => {
        this.DrawingRequest();
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
            pageTitle="Drawing Request"
            back={() => {
              this._handleDrawer();
            }}

          />
            <NavigationEvents onWillFocus={payload => {
              console.log("unmount");
              this.pullDown();

            }}/>
            {/* <Loader loading={this.state.loading}/> */}
          {this.state.page == 0 && this.state.AssignedData.length < 1 && this.state.loading == false ?
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flex:1, }} refreshControl={this._refreshControl()}>
{this.renderHeader()}
<View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
<Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>{this.state.message}</Text>
</View>
</ScrollView>
            :
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.AssignedData}
              keyboardShouldPersistTaps="handled"
              refreshControl={this._refreshControl()}
              ListHeaderComponent={this.renderHeader()}
              onEndReached={() => this.handleLoadMore()}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.01}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
               
                   onPress={()=> {
                  // 
                  NetInfo.fetch().then(state => {
                   if (!state.isConnected) {
                    this.props.navigation.navigate('DrawingRequestEdit', { item: item.id })
                   }else{
                    Toast.show(
                      'Please Check your internet connection',
                      Toast.SHORT,
                      
                    );
                  }
                  })
                }}>

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
                    SO No.  {item.so_no}
                  </Text>



                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <Text
                            style={styles.label}>
                            Call No.
                      </Text>
                          <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={styles.value}>
                              {item.call_no}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <Text
                            style={styles.label}>
                           Drg Type.
                      </Text>
                          <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={styles.value}>
                              {item.name}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <Text
                            style={styles.label}>
                            Requested By
                      </Text>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <Text style={styles.value}>
                              {item.requestor}
                            </Text>
                            {item.req_type == 1 ?
                            <Text style={styles.value}>
                             -  Admin
                            </Text>:null}
                            {item.req_type == 2 ?
                            <Text style={styles.value}>
                              - Manager
                            </Text>:null}
                            {item.req_type == 3 ?
                            <Text style={styles.value}>
                             - Engineer
                            </Text>:null}
                          </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <Text
                            style={styles.label}>
                            Date/Time
                      </Text>
                          <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={styles.value}>
                              {moment(item.l_date).format('DD/MM/YYYY hh:mm a')}
                            </Text>
                          </View>
                        </View>

                        {/* <View style={{ marginHorizontal: 10, paddingTop: 20 }} /> */}
                      </View>




                      <TouchableOpacity
                      style={styles.RightAbsoluteButton}
                        onPress={()=> {
                          // 
                          NetInfo.fetch().then(state => {
                           if (state.isConnected) {
                            this.props.navigation.navigate('DrawingRequestEdit', { screen: 'edit', item: item })
                           }else{
                            Toast.show(
                              'Please Check your internet connection',
                              Toast.SHORT,
                              
                            );
                          }
                          })
                        }}>
                       
                        <View
                          style={styles.absoluteView}>
                          <Image
                            style={styles.whiteImage}
                            source={require('../images/eye.png')}
                          />
                        </View>
                      </TouchableOpacity>



                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          }

          <TouchableOpacity style={styles.btn}
           onPress={()=> {
            // 
            NetInfo.fetch().then(state => {
             if (state.isConnected) {
              this.props.navigation.navigate('DrawingMasterMain')
             }else{
              Toast.show(
                'Please Check your internet connection',
                Toast.SHORT,
                
              );
            }
            })
          }}>
       
            <ImageBackground
              resizeMode="contain"
              style={{ height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
              source={require('../images/fill.png')}>
              <Image style={{ height: 25, width: 25, tintColor: Colors.primary }} source={require('../images/eye.png')} />
            </ImageBackground>
            <View

            >
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.white,
                  fontFamily: Fonts.medium,
                }}>

                View Drawing Master
          </Text>
            </View>
          </TouchableOpacity>
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
                            button={item}
                            selected={this.state.order_field}
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
    alignSelf: 'center',
    height: 25,
    width: 25,marginLeft:4
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
