// import React, {Component} from 'react';

// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   AsyncStorage,
//   FlatList,
//   ActivityIndicator,
//   Platform,
//   Image,
//   TextInput,
//   Modal,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from 'react-native';
// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

// import Colors from '../../common/Colors';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import HexagonGray from '../../components/HexagonPrimary';
// import SICon from 'react-native-vector-icons/AntDesign';
// import Fonts from '../../common/Fonts';
// import RadioButton from '../../components/RadioButton';

// export default class Rejected extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: true,
//       dataMass: false,
//       modalVisible: false,
//       dataSource: [
//         {
//           call_id: '98989',
//           company_name: 'GMM',
//           date: '4/09/2019',
//         },
//         {
//           call_id: '69696',
//           company_name: 'GMM',
//           date: '6/9/2019',
//         },
//         {
//           call_id: '4565',
//           company_name: 'GMM',
//           date: '8/09/2019',
//         },
//       ],
//       radioItems: [
//         {
//           label: 'Date',
//           selected: false,
//         },

//         {
//           label: 'Capacity',
//           selected: false,
//         },

//         {
//           label: 'Material',
//           selected: false,
//         },
//         {
//           label: 'O.D',
//           selected: false,
//         },
//       ],
//       selectedItem: '',
//       sort_direction: 'DESC',
//     };
//   }

//   componentDidMount() {
//     this.state.radioItems.map(item => {
//       if (item.selected == true) {
//         this.setState({selectedItem: item.label});
//       }
//     });
//   }

//   FlatListItemSeparator = () => {
//     return (
//       <View
//         style={{
//           height: 0,
//           width: '100%',
//           backgroundColor: Colors.white,
//         }}
//       />
//     );
//   };

//   setModalVisible(visible) {
//     this.setState({modalVisible: visible});
//   }

//   changeActiveRadioButton(index) {
//     this.state.radioItems.map(item => {
//       item.selected = false;
//     });

//     this.state.radioItems[index].selected = true;

//     this.setState({radioItems: this.state.radioItems}, () => {
//       this.setState({selectedItem: this.state.radioItems[index].label});
//     });
//   }

//   sortByDirection = () => {
//     return (
//       <TouchableOpacity
//         style={{flexDirection: 'column'}}
//         onPress={() => {
//           if (this.state.sort_direction == 'ASC') {
//             this.setState({
//               sort_direction: 'DESC',
//             });
//           } else {
//             this.setState({
//               sort_direction: 'ASC',
//             });
//           }
//         }}>
//         <Image
//           style={{
//             height: 10,
//             width: 10,
//             tintColor:
//               this.state.sort_direction == 'DESC'
//                 ? Colors.dark_gray
//                 : Colors.primary,
//             right: 10,
//           }}
//           source={require('../../images/up.png')}
//         />

//         <Image
//           style={{
//             height: 10,
//             width: 10,
//             tintColor:
//               this.state.sort_direction == 'DESC'
//                 ? Colors.primary
//                 : Colors.dark_gray,
//             right: 10,
//           }}
//           source={require('../../images/down.png')}
//         />
//       </TouchableOpacity>
//     );
//   };

//   renderHeader = () => {
//     return (
//       <View
//         style={{
//           flexDirection: 'row',
//           height: Platform.OS == 'ios' ? 60 : 60,
//           paddingTop: Platform.OS == 'ios' ? 0 : 0,
//           backgroundColor: '#F6F6F6',
//           justifyContent: 'space-between',
//         }}>
//         <View
//           style={{
//             alignSelf: 'center',
//             backgroundColor: Colors.white,
//             width: '100%',
//             flex: 1,
//             marginHorizontal: 15,
//             marginVertical: 10,
//             borderRadius: 5,
//           }}>
//           <View
//             style={{
//               flex: 1,
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'space-around',
//             }}>
//             <Icon
//               name="search"
//               size={20}
//               color={Colors.primary}
//               style={{
//                 height: 25,
//                 width: 35,
//                 paddingLeft: 10,
//                 alignSelf: 'center',
//               }}
//             />
//             <TextInput
//               ref="searchText"
//               style={styles.textInput}
//               placeholder="Search"
//               returnKeyType="search"
//               onChangeText={search => this.setState({search})}
//               underlineColorAndroid="transparent"
//             />

//             <TouchableOpacity
//               onPress={() => {
//                 this.setModalVisible(true);
//               }}
//               style={{alignSelf: 'center', right: 2}}>
//               <Icon
//                 name="filter"
//                 size={20}
//                 color={Colors.primary}
//                 style={{
//                   marginTop: 2,
//                   height: 25,
//                   width: 35,
//                 }}
//               />
//             </TouchableOpacity>

//             {this.sortByDirection()}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   render() {
//     const {navigate} = this.props.navigation;

//     return (
//       <View style={styles.container}>
//  <FlatList
//           showsVerticalScrollIndicator={false}
//           data={this.state.dataSource}
//           ListHeaderComponent={this.renderHeader()}
//           ItemSeparatorComponent={this.FlatListItemSeparator}
//           renderItem={({item, index}) => (
//             <View
//               style={{
//                 flex: 1,
//                 marginBottom:10,
//                 flexDirection: "column",
//                 backgroundColor: Colors.white,
             
//               }}
//             >
           
//               <View
//                 style={{
//                   flex: 1,
//                   flexDirection: "row",
//                   width: width * 0.95,
//                   overflow: "hidden"
//                 }}>
//                 <View
//                   style={{
//                     flex: 1,
//                     flexDirection: "column",
//                     paddingBottom: 8
//                   }}>
//                     <Text
//                       style={{
//                         margin: 5,
//                         fontSize: 16,
//                         fontFamily: Fonts.medium,
//                         color: Colors.primary,
//                         paddingLeft: 5,
//                         paddingVertical: 8
//                       }}>
//                       Sr No . 4
//                     </Text>
                   
//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                      User
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                         <Text style={styles.value}>
//                         Mehul Jogani - Admin
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                     Leave Date
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                       <Text style={styles.value}>
//                      12/12/2019
//                         </Text>
//                       </View>
//                     </View>


//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                     Leave Reason
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                       <Text style={styles.value}>
//                       Suresh Krishnan
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                       Applied Time
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                       <Text style={styles.value}>
//                       21/12/2019 10:10 pm
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                      Admin User
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                       <Text style={styles.value}>
//                     Chirag-Manager
//                         </Text>
//                       </View>
//                     </View>


//                     <View style={styles.rowItem}>
//                       <Text
//                        style={styles.label}>
//                       Admin Time
//                       </Text>
//                       <View style={{flex: 1, flexDirection: "column"}}>
//                       <Text style={styles.value}>
//                       21/12/2019 10:10 pm
//                         </Text>
//                       </View>
//                     </View>



//                     <View style={{marginHorizontal: 10, paddingTop: 60}}/>

//                 </View>


// <TouchableOpacity 
//                 onPress={()=> {
//                   this.props.navigation.navigate('EditRejected')
//                 }}
//                   style={styles.RightAbsoluteButton}>
//                   <View
//                     style={styles.absoluteView}>
//                     <Image
//                          style={styles.whiteImage}
//                       source={require('../../images/edit.png')}
//                     />
//                   </View>
//                 </TouchableOpacity>



          
//               </View>
               
//             </View>
//           )}
//           keyExtractor={(item, index) => index.toString()}
//         />

//         <Modal
//           ref={'updateModal'}
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//           visible={this.state.modalVisible}
//           position="bottom"
//           animationType={'fade'}
//           backdrop={true}
//           coverScreen={true}
//           backdropPressToClose={true}
//           backdropOpacity={0.5}
//           transparent={true}
//           swipeToClose={true}
//           onRequestClose={() => {
//             this.setState({modalVisible: false});
//           }}>
//           <TouchableOpacity
//             activeOpacity={1}
//             style={{flex: 1}}
//             onPressOut={() => {
//               this.setState({modalVisible: false});
//             }}>
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: 'flex-end',
//                 justifyContent: 'flex-end',
//                 backgroundColor: 'rgba(0,0,0,0.5)',
//               }}>
//               <TouchableWithoutFeedback>
//                 <View
//                   style={{
//                     width: '100%',
//                     minHeight: '35%',
//                     maxHeight: '50%',
//                     backgroundColor: Colors.white,
//                     borderWidth: 1,
//                     borderTopLeftRadius: 10,
//                     borderTopRightRadius: 10,
//                     borderColor: Colors.dark_gray,
//                   }}>
//                   <View style={{}}>
//                     <View
//                       style={{
//                         justifyContent: 'center',
//                         flexDirection: 'row',
//                         paddingVertical:10,
//                       borderBottomColor: Colors.light_gray,
//                       borderBottomWidth:1
                       
                      
//                       }}>
//                       <Text
//                         style={{
//                           fontSize: 18,
                          
//                           color: Colors.black,
//                           fontFamily: Fonts.regular,
//                         }}>
//                         SORT BY
//                       </Text>

                     
//                     </View>
//                     <ScrollView>
//                       <TouchableOpacity style={{}}>
//                         {this.state.radioItems.map((item, key) => (
//                           <RadioButton
//                             key={key}
//                             button={item}
//                             onClick={this.changeActiveRadioButton.bind(
//                               this,
//                               key,
//                             )}
//                           />
//                         ))}
//                       </TouchableOpacity>
//                     </ScrollView>
//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       </View>
//     );
//   }
// }




// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     //  margin: 10,
//     backgroundColor: '#f1f1f1',
//   },
//   btn: {
//     width: 300,
//     borderRadius: 25,
//     backgroundColor: '#fff',
//     marginVertical: 10,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   radioButton: {
//     marginTop: 6,
//     marginLeft: 25,
//     flexDirection: 'row',
//   },
//   selectedText: {
//     fontSize: 18,
//     color: 'white',
//   },

//   ModalContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   netAlert: {
//     overflow: 'hidden',
//     borderRadius: 10,
//     shadowRadius: 10,
//     width: width * 0.8,
//     minHeight: height * 0.3,
//     borderColor: '#f1f1f1',
//     borderWidth: 1,
//     backgroundColor: Colors.white,
//   },
//   netAlertContent: {
//     flex: 1,
//     padding: 20,
//     //  marginTop:20,
//   },
//   netAlertTitle: {
//     fontSize: 20,
//     paddingTop: 20,
//     color: Colors.black,
//     textAlign: 'center',
//     fontFamily: Fonts.bold,
//   },
//   netAlertDesc: {
//     fontSize: 16,
//     paddingTop: 10,
//     alignSelf: 'center',
//     width: width * 0.8,
//     color: Colors.dark_gray,
//     fontFamily: Fonts.light,
//     paddingVertical: 5,
//     textAlign: 'center',
//   },
//   textInput: {
//     marginTop: 2,
//     paddingVertical: Platform.OS == 'ios' ? 6 : 6,
//     fontSize: 16,
//     flex: 1,
//     fontFamily: Fonts.medium,
//     paddingHorizontal: 5,
//   },
//   label: {
//     padding: 2,
//     fontFamily: Fonts.regular,
//     fontSize: 14,
//     color: Colors.dark_gray,
//     width: width * 0.3,
//     paddingLeft: 15,
//   },
//   value: {
//     padding: 2,
//     fontSize: 14,
//     fontFamily: Fonts.regular,
//     color: Colors.primary,
//   },
//   RightAbsoluteButton: {
//     overflow: 'hidden',
//     width: 120,
//     height: 60,
//     position: 'absolute',
//     bottom: -3,
//     alignSelf: 'center',
//     right: -45,
//     borderTopLeftRadius: 120,
//     borderBottomRightRadius: 120,
//     backgroundColor: Colors.primary,
//   },

//   LeftAbsoluteButton: {
//     overflow: 'visible',
//     width: 120,
//     height: 60,
//     position: 'absolute',
//     bottom: -3,
//     alignSelf: 'center',
//     left: -45,
//     borderBottomLeftRadius: 120,
//     borderTopRightRadius: 120,
//     backgroundColor: '#f1f1f1',  },
//   absoluteView: {
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingRight: 30,
//     backgroundColor: 'transparent',
//   },
//   whiteImage: {
//     tintColor: Colors.white,
//     alignSelf: 'center',
//     height: 30,
//     width: 30,
//   },
//   rowItem: {flex: 1, flexDirection: 'row', paddingVertical: 2},
//   primaryImage: {
//     tintColor: Colors.primary,
//     alignSelf: 'center',
//     height: 30,
//     width: 30,
//   },
// });





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
var pendingArray = [];
import Colors from '../../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import HexagonGray from '../../components/HexagonPrimary';
import SICon from 'react-native-vector-icons/AntDesign';
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

export default class Rejected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      modalVisible: false,
      pendingData:[],
      
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
      radioItems: [],
      selectedItem: '',
      sort_direction: 'desc',
      order_field:'id',
      page:0,
      search:''
    };
  }




  Rejected = () => {
    if(pendingArray.includes(this.state.page)){
     
    } else {

      if(pendingArray.length < 1){
        this.setState({ loading: true });
      } else {
        this.setState({ loading1: true });
      }
    pendingArray.push(this.state.page)
     
    
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
      console.log(API.leave_list_rejected);
      console.log(JSON.stringify(Request));
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          timeout(
            15000,
            fetch(API.leave_list_rejected, {
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
                console.log("m_pending :::  ", res);
                if (res.status == "success") {

                  this.setState({loading:false,loading1: false, pendingData: this.state.pendingData.concat(res.data) , radioItems: res.sort_by,  page: parseInt(this.state.page) + parseInt(pagelimit)})   
               
               } else if (res.status == "failed") {

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
    pendingArray = [];
    this.Rejected();
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

      pendingArray = [];
      this.setState({order_field: this.state.radioItems[index].value, modalVisible: false, page:0, pendingData:[]}, ()=> {
        setTimeout(()=> {
          this.Rejected();
        }, 500)
        
      });
  
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'column'}}
        onPress={() => {
          if (this.state.sort_direction == 'asc') {
            pendingArray=[];
            this.setState({
              sort_direction: 'desc', page:0, pendingData:[],
            }, ()=> {
              this.Rejected()
            });
          } else {
            pendingArray=[];
            this.setState({
              sort_direction: 'asc', page:0, pendingData:[],
            }, ()=> {
              this.Rejected()
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
              value={this.state.search}
              returnKeyType="search"
              onChangeText={search => this.setState({search})}
              onSubmitEditing={()=> {
               
                this.setState({ page:0, pendingData:[]}, ()=> {
                  pendingArray=[];
                  this.Rejected()
                });
               }}
              underlineColorAndroid="transparent"
            />

            {this.state.search.length < 1 ? null :
            <TouchableOpacity
              onPress={() => {
                pendingArray=[];
                this.refs.searchText.clear()
            this.setState({
               page:0, pendingData:[], search:''
            }, ()=> {
              this.Rejected()
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
    this.Rejected()
 };


 pullDown = () => {
  pendingArray = [];
  this.setState({ page:0, pendingData:[]}, ()=> {
    setTimeout(()=> {
      this.Rejected();
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
        {this.state.page == 0 && this.state.pendingData.length < 1 && this.state.loading == false && this.state.loading1 == false ? 
          <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{flex:1, }} refreshControl={this._refreshControl()}>
{this.renderHeader()}
<View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
<Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>{this.state.message}</Text>
</View>
</ScrollView>
:
 <FlatList
 keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          data={this.state.pendingData}
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
                marginBottom:10,
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
                    paddingBottom: 8
                  }}>
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 5
                      }}>
                      Leave No. {item.id}
                    </Text>
                   <View style={{height:1, width:'100%', backgroundColor: Colors.light_gray, marginBottom: 5,}} />
                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                     User
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                        <Text style={styles.value}>
                       {item.apply_name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                    Leave Date
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                        {moment(item.leave_date).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                    </View>


                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                    Leave Reason
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.reason}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text
                       style={styles.label}>
                      Applied Time
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {moment(item.l_date).format('DD/MM/YYYY hh:mm a')}
                        </Text>
                      </View>
                    </View>

           
                     <View style={styles.rowItem}>
                       <Text
                       style={styles.label}>
                     Admin User
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                    {item.approve_name}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                       <Text
                       style={styles.label}>
                     Admin Remarks
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {item.admin_reason}
                        </Text>
                      </View>
                    </View>


                    <View style={[styles.rowItem, {paddingRight:90}]}>
                      <Text
                       style={styles.label}>
                      Admin Time
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                      <Text style={styles.value}>
                      {moment(item.u_date).format("DD/MM/YYYY hh:mm a")}
                        </Text>
                      </View>
                    </View>


                    {/* <View style={{marginHorizontal: 10, paddingTop: 20}}/> */}

                </View>

               

{/* <TouchableOpacity 
                onPress={()=> {
                  this.props.navigation.navigate('EditRejected')
                }}
                  style={styles.RightAbsoluteButton}>
                  <View
                    style={styles.absoluteView}>
                    <Image
                         style={styles.whiteImage}
                      source={require('../../images/edit.png')}
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
    height: 30,
    width: 30,
  },
  rowItem: {flex: 1, flexDirection: 'row', paddingVertical: 2},
  primaryImage: {
    tintColor: Colors.primary,
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
});
