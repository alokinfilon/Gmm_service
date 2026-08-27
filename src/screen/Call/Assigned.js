

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
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var AssignedArray = [];
import Colors from '../../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '../../common/Fonts';
import RadioButton from '../../components/RadioButton';
import API from '../../common/API';
import timeout from '../../common/Timeout';
import Loader from '../../common/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from "@react-native-community/netinfo";
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {StackActions, NavigationActions} from 'react-navigation';

export default class Assigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      modalVisible: false,
      AssignedData:[],
      radioItems: [],
      selectedItem: '',
      sort_direction: 'desc',
      order_field:'id',
      page:0,
      search:''
    };
  }




  Assigned = () => {
    if(AssignedArray.includes(this.state.page)){
     
    } else {
      if(AssignedArray.length < 1){
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
       token:token,
       id:id,
       branch_id: branch_id,
       order_field: this.state.order_field,
       order_type: this.state.sort_direction,
       search: this.state.search,
       start: this.state.page,
       limit: pagelimit
      
      };
      console.log(API.m_call_assigned);
      console.log(JSON.stringify(Request));
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(
            15000,
            fetch(API.m_call_assigned, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify(Request)
            })
              .then(res => {
                if(res.status == 200){
                  console.log(res);
                  this.setState({loading:false, loading1: false,});
                 res.json() .then(res => {
                console.log("m_assigned :::  ", res);
                if (res.status == "success") {

                  this.setState({loading:false,loading1: false, AssignedData: this.state.AssignedData.concat(res.data) , radioItems: res.sort_by,  page: parseInt(this.state.page) + parseInt(pagelimit)})   
               
               } else if (res.status == "failed") {

                 AsyncStorage.removeItem('id');
                 AsyncStorage.removeItem('username');
                 AsyncStorage.removeItem('password');
                  this.setState({loading: false, loading1: false, });
                
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: "Login" })
                    ]
                  });
                  this.props.navigation.dispatch(resetAction);
                } else {
                  this.setState({ loading:false, loading1: false, message: res.message, radioItems: res.sort_by, })   
                  // setTimeout(()=> {
                  //   Toast.show(res.message, Toast.SHORT, );

                  // }, 50)
                }
              })
            }
            else{
           
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
               this.setState({loading: false, loading1: false, });
               setTimeout(()=> {
                 Toast.show(res.message, Toast.SHORT, );

               }, 50)
              
            }
          })
              .catch(e => {
                this.setState({ loading: false, loading1: false, });
                console.log(e);
                Toast.show(
                  "Something went wrong...",
                  Toast.SHORT,
                  
                );
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
        }
      });
    });
  });
  });
});
    }
  }

  componentDidMount() {
    AssignedArray = [];
    this.Assigned();
    this.state.radioItems.map(item => {
      if (item.value == this.state.order_field) {
        this.setState({order_field: item.value});
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
    this.setState({modalVisible: visible});
  }

  changeActiveRadioButton(index) {

      AssignedArray = [];
      this.setState({order_field: this.state.radioItems[index].value, modalVisible: false, page:0, AssignedData:[]}, ()=> {
        setTimeout(()=> {
          this.Assigned();
        }, 500)
        
      });
  
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'column'}}
        onPress={() => {
          if (this.state.sort_direction == 'asc') {
            AssignedArray=[];
            this.setState({
              sort_direction: 'desc', page:0, AssignedData:[],
            }, ()=> {
              this.Assigned()
            });
          } else {
            AssignedArray=[];
            this.setState({
              sort_direction: 'asc', page:0, AssignedData:[],
            }, ()=> {
              this.Assigned()
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
          source={require('../../images/up.png')}
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
          source={require('../../images/down.png')}
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
              onChangeText={search => this.setState({search})}
              value={this.state.search}
              onSubmitEditing={()=> {
               
                this.setState({ page:0, AssignedData:[]}, ()=> {
                  AssignedArray=[];
                  this.Assigned()
                });
               }}
              underlineColorAndroid="transparent"
            />

            {this.state.search.length < 1 ? null :
            <TouchableOpacity
              onPress={() => {
                AssignedArray=[];
                this.refs.searchText.clear()
            this.setState({
               page:0, AssignedData:[], search:''
            }, ()=> {
              this.Assigned()
            });
              }}
              style={{alignSelf: 'center', right: 2}}>
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
              style={{alignSelf: 'center', right: 2}}>
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


       
  renderFooter = () => {
    return (
     
      <View style={{ padding: 30 }}>
        {this.state.loading1 ?
     <ActivityIndicator
     size="large" color={Colors.primary}  
        />
        : null }
      </View> 
    );
  };

  handleLoadMore = () => {
    this.Assigned()
 };


 pullDown = () => {
  AssignedArray = [];
  this.setState({ page:0, AssignedData:[]}, ()=> {
    setTimeout(()=> {
      this.Assigned();
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


  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>
        {/* <Loader loading={this.state.loading} /> */}
        {this.state.page == 0 && this.state.AssignedData.length < 1 && this.state.loading == false && this.state.loading1 == false ? 
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
          // ListEmptyComponent={
          //   <View style={{flex:1, alignItems: 'center', justifyContent:'center', height: height*.7}}>
          //   <Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>{this.state.message}</Text>
          //  </View>
          // }
          onEndReachedThreshold={0.01}
         
          renderItem={({item, index}) => (
            <View
              style={{
                flex: 1,
                marginBottom:5,
                flexDirection: "column",
                backgroundColor: Colors.white,
                // borderWidth: 1,
                // borderTopLeftRadius: 5,
                // borderLeftWidth: 6,
                // borderLeftColor: Colors.medium_gray,
                // borderBottomLeftRadius: 5,
                // borderColor: Colors.light_gray,
                // shadowOffset: {width: 0, height: 5},
                // shadowColor: Colors.medium_gray,
                // shadowOpacity: 0.8,
                // elevation:3
              }}
            >
           
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: width * 0.95,
                  overflow: "hidden"
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    paddingBottom: 5
                  }}>
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 3
                      }}>
                      Call No. {item.call_no}
                    </Text>
                   
                
                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Company
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.name}
                        </Text>
                      </View>
                    </View>
{/* 
                    <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                        Call Type
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                          {item.call_type == "1" ? "Online" : "Offline"}
                        </Text>
                      </View>
                    </View> */}
                    {/* <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Caller Name
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.caller_name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        Reported Problem
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.reported_problem}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                        Group
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.group2}
                        </Text>
                      </View>
                    </View>


                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                        User
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.uname}
                        </Text>
                      </View>
                    </View> */}



                    <View style={{marginHorizontal: 10, paddingTop: 40}}/>

                </View>

                {/* <View style={{zIndex: 1, bottom: -20,right:-20, position: 'absolute', }}>
                 <ImageBackground source={require('../images/primaryfill.png')} style={{height:90, opacity:0.2, width:90, alignItems:'center', justifyContent:'center',  tintColor: Colors.primary}} >
                    <Image style={{height:30, width:30, tintColor: Colors.white, alignSelf: 'center', }} source={require('../images/edit.png')}/>
                 </ImageBackground>
          
          </View>
          
          */}

<TouchableOpacity
               style={styles.RightAbsoluteButton}
                  onPress={()=> {
                    // 
                    NetInfo.fetch().then(state => {
                     if (state.isConnected) {
                      this.props.navigation.navigate('ViewAssigned',{item:item});
                     }else{
                      Toast.show(
                        'Please Check your internet connection',
                        Toast.SHORT,
                        
                      );
                    }
                    })
                  }}>
                  
                  <View style={styles.absoluteView}>
                    <Image
                      style={styles.whiteImage}
                      source={require('../../images/eye.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                 
                  style={styles.LeftAbsoluteButton}
                        onPress={()=> {
                  // 
                  NetInfo.fetch().then(state => {
                   if (state.isConnected) {
                    this.props.navigation.navigate('EditAssigned', {
                      item: item,
                    });
                   }else{
                    Toast.show(
                      'Please Check your internet connection',
                      Toast.SHORT,
                      
                    );
                  }
                  })
                }}>
                  <View style={[styles.absoluteView, {paddingLeft: 60}]}>
                    <Image
                      style={styles.primaryImage}
                      source={require('../../images/edit.png')}
                    />
                  </View>
                </TouchableOpacity>


                {/* <TouchableOpacity 
                onPress={()=> {
                  this.props.navigation.navigate('DrawingMasterView')
                }}
                  style={styles.LeftAbsoluteButton}>
                  <View
                    style={[styles.absoluteView, {paddingLeft:60}]}>
                    <Image
                      style={styles.primaryImage}
                      source={require('../../images/eye.png')}
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
            this.setState({modalVisible: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPressOut={() => {
              this.setState({modalVisible: false});
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
                    minHeight: '40%',
                    maxHeight: '70%',
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
                        paddingVertical:10,
                      borderBottomColor: Colors.light_gray,
                      borderBottomWidth:1
                       
                      
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
    width: 80,
    height: 40,
    position: 'absolute',
    bottom: -3,
    alignSelf: 'center',
    left: -30,
    borderBottomLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: '#f1f1f1',  },
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
    marginLeft:5,
    height: 25,
    width: 25,
  },
  rowItem: {flex: 1, flexDirection: 'row'},
  primaryImage: {
    tintColor: Colors.primary,
    alignSelf: 'center',
    marginRight:15,
    height: 20,
    width: 20,
  },
});
