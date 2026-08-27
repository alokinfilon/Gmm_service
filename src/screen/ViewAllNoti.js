import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../common/Colors';
import Header from '../components/Header';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import BackHeader from '../components/BackHeader';
import Fonts from '../common/Fonts';
import { FlatList } from 'react-native-gesture-handler';

import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {StackActions, NavigationActions,NavigationEvents} from 'react-navigation';
import moment from 'moment';

var newarray = []

export default class ViewAllNoti extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
  this.state = {
    loading:false,
    notiArray:[],
    modalVisible: false,
    itemPressed:'',
    viewnotification:"",
    search:'',
    start:0,
    modalVisible1: false,
    page:0,
    list:[]
  };
  }

 Deletnoti = () => {
     
        this.setState({ loading: true, modalVisible1: false });
        
        AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("permission").then(permission => {
            AsyncStorage.getItem("branch_id").then(branch_id => {
          var Request = {
           token:token,
           id:id,
           branch_id:branch_id,
           notification_id:this.state.itemPressed
          };
          console.log(API.notification_delete);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.notification_delete, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => {
                    console.log(res);
                    if(res.status == 200){
                     res.json() .then(res => {
                    console.log("notification_delete :::  ", res);
                    if (res.status == "success") {
                        this.setState({loading:false, page:0, notiArray:[]}, ()=> {
                          newarray = [];
                          this.Viewallnoti()
                        });
                     
                   
                   } else if (res.status == "failed") {

                     AsyncStorage.removeItem('id');
                     AsyncStorage.removeItem('username');
                     AsyncStorage.removeItem('password');
                      this.setState({loading: false });
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
                    } else {
                      setTimeout(()=> {
                        Toast.show(res.message, Toast.SHORT, );
   
                      }, 50)
                    }
                  })
                }
                else{
                  AsyncStorage.removeItem('id');
                  AsyncStorage.removeItem('username');
                  AsyncStorage.removeItem('password');
                   this.setState({loading: false });
                 
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
                    this.setState({ loading: false });
                    console.log(e);
                    Toast.show(
                      "Something went wrong...",
                      Toast.SHORT,
                      
                    );
                  })
              ).catch(e => {
                console.log(e);
                this.setState({ loading: false });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false });
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

      Viewallnoti = ( ) => {
          if(newarray.includes(this.state.page)){
          console.log("includes"); 
          }
          else{
        newarray.push(this.state.page)


        const { notiArray } = this.state;
     
        this.setState({ loading: true });
        
        AsyncStorage.getItem("id").then(id => {
        AsyncStorage.getItem("token").then(token => {
          AsyncStorage.getItem("pagelimit").then(pagelimit => {
            AsyncStorage.getItem("branch_id").then(branch_id => {    
          var Request = {
           token:token,
           id:id,
           order_field:"id",
           order_type:'desc',
           branch_id:branch_id,
           search:this.state.search,
           start:this.state.page,
           limit:pagelimit
          };
          console.log(API.notification_view_all);
          console.log(JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.notification_view_all, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(Request)
                })
                  .then(res => {
                    console.log(res);
                    if(res.status == 200){
                     res.json() .then(res => {
                    console.log("notification_view_all:::  ", res);
                    if (res.status == "success") {
                      if(res.data.length < 1){
                        this.setState({
                          loading:false,
                        
                          // dataSource:res.data,
                          page:  0 ,
                      });
                      } else {
                        this.setState({
                          loading:false,
                         notiArray: notiArray.concat(res.data),
                          // dataSource:res.data,
                          page:  parseInt(this.state.page) + parseInt(pagelimit) ,
                      });
                      }
                      
      
                     

                      //  this.setState({loading:false , notiArray:res.data})
                   
                   } else if (res.status == "failed") {

                     AsyncStorage.removeItem('id');
                     AsyncStorage.removeItem('username');
                     AsyncStorage.removeItem('password');
                      this.setState({loading: false });
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
                    } else {
                      setTimeout(()=> {
                        Toast.show(res.message, Toast.SHORT, );
   
                      }, 50)
                      this.setState({loading:false})
                    }
                  })
                }
                else{
                  AsyncStorage.removeItem('id');
                  AsyncStorage.removeItem('username');
                  AsyncStorage.removeItem('password');
                   this.setState({loading: false });
                  
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
                    this.setState({ loading: false });
                    console.log(e);
                    Toast.show(
                      "Something went wrong...",
                      Toast.SHORT,
                      
                    );
                  })
              ).catch(e => {
                console.log(e);
                this.setState({ loading: false });
                Toast.show(
                  "Please Check your internet connection",
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false });
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

      Selected(value) {
        console.log(value);
        this.setState({
            itemPressed:value.id,
             
        });
     console.log(this.state.itemPressed)

        this.Deletnoti();

     }

     
      handleLoadMore = () => {
        this.Viewallnoti()
     };
     
     renderFooter = () => {
        return (
         
          <View style={{ padding: 30 }}>
            {this.state.loading ?
         <ActivityIndicator
         size="large" color={Colors.primary}  
            />
            : null }
          </View> 
        );
      };
      pullDown = () => {
     
        this.setState({ page: 0, notiArray: [] }, () => {
          newarray= [];
            this.Viewallnoti();
        
    
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
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
         <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../images/Left_arrow.png')}
          pageTitle=" View All Notification"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <NavigationEvents onWillFocus={payload => {
           newarray= [];
           this.Viewallnoti()
            }}/>
        <View style={styles.container}>

        <View
          style={{
            flexDirection: 'row',
            height: Platform.OS == 'ios' ? 60 : 60,
            paddingTop: Platform.OS == 'ios' ? 0 : 0,
            backgroundColor:"#F6F6F6",
            justifyContent:'space-between',
            
        }}>

<View style={{  alignSelf: "center",   backgroundColor: Colors.white,
       
         flex:1,
        marginHorizontal:15,
         marginVertical: 10,
         borderRadius: 5}}>
           <View style={{flex:1 , flexDirection:'row',  alignItems: 'center', justifyContent:'space-between'}}>

      <Icon
         name="search"
         size={20}
         color={Colors.primary}
         style={{
           height: 25,
           width: 35,
           paddingLeft: 10,
           alignSelf: "center"
         }}
       />
       <TextInput
        ref="searchText"
         style={styles.textInput}
         placeholder="Search"
         returnKeyType="search"
         onChangeText={search => this.setState({search})}
         onSubmitEditing={()=> {
          this.setState({ page:0, notiArray:[]}, ()=> {
            newarray = [];
            this.Viewallnoti()
          });
         }}
         underlineColorAndroid="transparent"
       />
      
       </View>
            </View>
        </View>

        
           {newarray.length <= 1 && this.state.notiArray.length < 1 ? 
 <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
 <Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>No notification found...!</Text>
</View>
:
<View>


          <FlatList

                onEndReached={() => this.handleLoadMore()}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={0.01}
                data={this.state.notiArray}
                refreshControl={this._refreshControl()}
              renderItem={({item}) => (
                <TouchableOpacity 
                activeOpacity={0.6}
                style={ styles.primaryContainer}
                onPress={() => {
                  this.setState({itemPressed: item.id}, () => {
                    this.setState({
                      cheack: 0,
                      modalVisible1: !this.state.modalVisible1,
                    });
                  });
                }}>
                  {item.status == 1 ? 
                <TouchableOpacity 
                                onPress={()=> {
                                  this.setState({itemPressed: item.id}, ()=> {
                                    this.setState({modalVisible1: !this.state.modalVisible1})
                                  })
                                 
                                }}
                                  style={styles.RightAbsoluteButton}>
                                  <View
                                    style={styles.absoluteView}>
                                    <Image
                                style={{height:17,width:17 , alignSelf:'flex-end' , margin:2}}
                                source={require("../images/remove.png")}
                                />   
                                  </View>
                                </TouchableOpacity>
                                : null }
                              {/* <TouchableOpacity
                                 onPress={() => this.Deletnoti()}>
                                <Image
                                style={{height:17,width:17 , alignSelf:'flex-end' , margin:2}}
                                source={require("../images/remove.png")}
                                />   
                               </TouchableOpacity>    */}
                
                                  <Text style={{color:Colors.dark_gray , textAlign:'left', width:'100%' ,   paddingRight:40,  fontSize:16 , fontFamily:Fonts.regular }}>
                                    {item.msg}
                                  </Text>
                
                                  <View style={{flexDirection:'row' , marginTop:5, alignSelf:'flex-end'}}>
                                  
                                  <Text style={{color:Colors.cool_gray ,  fontSize:14 , fontFamily:Fonts.light, textAlign:'right' }}>
                                     {moment(item.l_date).format("DD/MM/YYYY hh:mm a")}
                                  </Text>
                                  </View>
                                  
                              </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
         
          />
           {/* <View style={{marginHorizontal: 10, paddingTop: 60}}>

</View> */}

          {/* <Text style={{fontFamily: Fonts.medium, color: Colors.dark_gray, }}>No notification found...!</Text> */}
  </View>
  }
   
        </View>

        <Modal
          ref={'updateModal'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          visible={this.state.modalVisible1}
          position="bottom"
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={true}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={true}
          onRequestClose={() => {
           this.setState({modalVisible: false})
          }}>
            <TouchableOpacity activeOpacity={1} style={{flex:1}} onPressOut={()=> {this.setState({modalVisible1: false})}}>
          <View style={styles.ModalContainer}>
            <TouchableWithoutFeedback>
            <View style={styles.netAlert}>
              <View style={styles.netAlertContent}>
              <Text style={styles.netAlertDesc}>
                  Are you sure?
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 10,
                  }}>
                  <Image
                    resizeMode="cover"
                    source={require('../images/X-icon.png')}
                    style={{width: 50, height: 50}}
                  />
                </View>
               
                
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 20,
                  marginHorizontal: 30,

                 
                }}>
                <TouchableOpacity
                  style={{padding: 10, minWidth: width*.2, backgroundColor: Colors.red, marginRight:5, alignItems: 'center',}}
                  onPress={() => this.setState({modalVisible1: false})}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 18,
                      fontFamily: Fonts.bold,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={{padding: 10, minWidth: width*.2, backgroundColor: Colors.primary,marginLeft:5, alignItems: 'center',}}
                  onPress={() => {this.Deletnoti(); this.setState({modalVisible1: false})}}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 18,
                      fontFamily: Fonts.bold,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  textInput: {
    marginTop: 2,
    paddingVertical: Platform.OS == 'ios' ? 6 : 6,
    fontSize: 16,
    
    width:'85%',
    
    fontFamily: Fonts.medium,
    paddingHorizontal: 5
  },
  primaryContainer: {
    marginTop:10,

    marginHorizontal:10,
    padding:10,
    backgroundColor: Colors.white,
   
    borderRadius: 5,
    borderBottomColor: Colors.light_gray,
    borderBottomWidth:1,
    overflow:'hidden',
    zIndex: 1,
    paddingBottom:5
    // flexDirection: 'row',
   
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

    padding: 14,
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.colorPrimary,
  },
  active: {
    color: Colors.colorPrimary,
    fontFamily: Fonts.bold,
  },
  inactive: {
    color: Colors.dark_gray,
    fontFamily: Fonts.medium,
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 1.5,
    backgroundColor: 'transparent',
  },
  scrollView: {},
  containerStyles: {},
  RightAbsoluteButton: {
    overflow: 'hidden',
    width: 80,
    height: 40,
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    right: -25,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: '#f1f1f1',
  },
  absoluteView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 38,
    backgroundColor: 'transparent',
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  netAlert: {
    overflow: 'hidden',
    borderRadius: 10,
    shadowRadius: 10,
    width: width*.8,
    minHeight: height*.3,
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
});
