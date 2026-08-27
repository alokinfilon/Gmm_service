import React, { Component } from 'react';

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
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { Dropdown } from 'react-native-material-dropdown';
import Toast from 'react-native-simple-toast';
import {StackActions, NavigationActions} from 'react-navigation';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import timeout from '../common/Timeout';
import Colors from '../common/Colors';
import RadioButton from '../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import API from '../common/API';
import HexagonGray from '../components/HexagonPrimary';
import Header from '../components/Header';
import Fonts from '../common/Fonts';
import BackHeader from '../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import HorizontalButton from '../components/HorizontalButton';
import LabelTextInput from '../components/LabelTextInput';
import Loader from '../../src/common/Loader';
const Data = [
  {id:'1',name:'Upload File'},
  {id:'2',name:'Select File Existing File'}
]
var TempData=[]
export default class DrawingRequestEdit extends Component {
  constructor(props) {
    TempData=[]
    super(props);
    this.state = {
      isLoading: true,
      dataMass: false,
      docName: 'Choose file',
      dataSource: {},
      docbase64: '',
      file:'',
      Type:'',
      SelectFile:'',
      Typedata:[],
      modalVisible: false,
      radioItems: [
        {
          label: 'Date',
          selected: false,
        },

        {
          label: 'Capacity',
          selected: false,
        },

        {
          label: 'Material',
          selected: false,
        },
        {
          label: 'O.D',
          selected: false,
        },
      ],
      selectedItem: '',
      sort_direction: 'DESC',
      name: '',
      description: ''
    };
  }





  componentDidMount() {
   
    console.log(this.props.navigation.state.params.item);
    this.DrawingRequestView()
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({ selectedItem: item.label });
      }
    });
  }

  componentWillUnmount(){
    AsyncStorage.setItem('removeDigi', "0");
  }


  DrawingRequestView = () => {
    this.setState({ loading: true });
    TempData=[];
    AsyncStorage.getItem('id').then(id => {
      AsyncStorage.getItem('token').then(token => {
        AsyncStorage.getItem('branch_id').then(branch_id => {
          var Request = {
            token: token,
            id: id,
            branch_id: branch_id,
           
            drawing_id: this.props.navigation.state.params.item.id,
            getlist : '1'
          };
          console.log(API.drawing_data_view);
          console.log('Request', JSON.stringify(Request));
          NetInfo.fetch().then(state => {
            if (state.isConnected) {
              timeout(
                15000,
                fetch(API.drawing_data_view, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Request),
                })
                  .then(res => {
                    if (res.status == 200) {
                      console.log(res);
                      this.setState({ loading: false, loading1: false });
                      res.json().then(res => {
                        console.log('drawing_data_view Edit Assigned:::  ', res);
                        if (res.status == 'success') {
                          for(var i=0;i<res.dropdown.length;i++){
                          var obj = {
                             id:res.dropdown[i].id,
                              so_no:res.dropdown[i].so_no+' - '+res.dropdown[i].name
                          }
                          TempData.push(obj)
                          this.setState({ Typedata:TempData})
                        }
                     
                        
                          this.setState(
                            {
                              loading: false,
                              loading1: false,
                              dataSource: res.data,
                             
                            },()=>{
                              console.log('res.dropdown',this.state.Typedata);
                            }

                          );
                        } else if (res.status == 'failed') {
                         
                          this.setState({ loading: false, loading1: false });
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
                          this.setState({
                            loading: false,
                            loading1: false,
                            message: res.message,
                          });
                          setTimeout(() => {
                            Toast.show(res.message, Toast.SHORT, );
                          }, 50);
                        }
                      });
                    } else {
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
                        this.props.navigation.goBack();
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
                this.setState({ loading: false, loading1: false });
                Toast.show(
                  'Please Check your internet connection',
                  Toast.SHORT,
                  
                );
              });
            } else {
              this.setState({ loading: false, loading1: false });
              Toast.show(
                'Please Check your internet connection',
                Toast.SHORT,
                
              );
              this.props.navigation.goBack();
            }

          });
        });
      });
    });
  };


  DrawingRequestUpdate = () => {
    // console.log('this.state.docbase64', this.state.docbase64);
    if (this.state.Type == '') {
      Toast.show('Select Type', Toast.SHORT, );
    }

   else if (this.state.file == '' && this.state.Type == '1') {
      Toast.show('Please Upload File', Toast.SHORT, );
    }
   else if (this.state.SelectFile == '' && this.state.Type == '2') {
      Toast.show('Select File', Toast.SHORT, );
    }
     else {
      this.setState({ loading: true, submit2: true });

      AsyncStorage.getItem('id').then(id => {
        AsyncStorage.getItem('token').then(token => {
          AsyncStorage.getItem('branch_id').then(branch_id => {
            // var Request = {
            //   token: token,
            //   id: id,
            //   branch_id:branch_id,
            //   Drawing_id: this.props.navigation.state.params.item.id,
            //   file:RNFetchBlob.wrap(this.state.docbase64),
            //   name:this.state.namem,
            //   description:this.state.description
            // };

            let formdata = new FormData()

            formdata.append("token", token)
            formdata.append("id", id)
            formdata.append("branch_id", branch_id)
            formdata.append("drawing_id", this.props.navigation.state.params.item)
            // formdata.append("file", RNFetchBlob.wrap(this.state.docbase64))
            formdata.append("types",this.state.Type)
            formdata.append("file1",this.state.file)
            formdata.append("exist",this.state.SelectFile)
            // formData.append('image', $('input[type=file]')[0].files[0]); 

            // formdata.append("name",this.state.name)
            // formdata.append("description",this.state.description)

            console.log('form',formdata);
            console.log('Request',JSON.stringify(formdata));
            console.log('Api',API.drawing_data_upload);
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                timeout(
                  15000,
                  fetch(API.drawing_data_upload, {
                    method: 'POST',
                    headers: {
                      //        'application':'x-www-form-urlencoded'
                      'Content-Type': 'multipart/form-data'
                    },
                    body: formdata
                  })
                    .then(res => {
                      if (res.status == 200) {
                        console.log(res);
                        this.setState({ loading: false, loading1: false });
                        res.json().then(res => {
                          console.log(
                            'rdrawing_data_upload:::  ',
                            res,
                          );

                          if (res.status == 'success') {

                            setTimeout(() => {
                              Toast.show(
                                res.message,
                                Toast.SHORT,
                                
                              );
                            }, 50);
                            this.props.navigation.goBack();
                            this.setState({ loading: false, loading1: false, submit2: false });
                          } else if (res.status == 'failed') {
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
                            this.setState({ loading: false, loading1: false, submit2: false });
                          } else {
                            this.setState({
                              loading: false,
                              loading1: false,
                              submit2: false,
                              message: res.message,
                            });
                            setTimeout(() => {
                              Toast.show(
                                res.message,
                                Toast.SHORT,
                                
                              );
                            }, 50);
                          }
                        });
                      } else {
                        AsyncStorage.removeItem('id');
                        AsyncStorage.removeItem('username');
                        AsyncStorage.removeItem('password');

                      
                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({ routeName: "Login" })
                          ]
                        });
                        this.props.navigation.dispatch(resetAction);
                        this.setState({ loading: false, loading1: false, submit2: false });
                       
                      }
                    })
                    .catch(e => {
                      this.setState({ loading: false, loading1: false, submit2: false });
                      console.log(e);
                      Toast.show(
                        'Something went wrong...',
                        Toast.SHORT,
                        
                      );
                    }),
                ).catch(e => {
                  console.log(e);
                  this.setState({ loading: false, loading1: false, submit2: false });
                  Toast.show(
                    'Please Check your internet connection',
                    Toast.SHORT,
                    
                  );
                });
              } else {
                this.setState({ loading: false, loading1: false, submit2: false });
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



  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({ radioItems: this.state.radioItems }, () => {
      this.setState({ selectedItem: this.state.radioItems[index].label });
    });
  }

  async upload() {
    AsyncStorage.setItem('removeDigi', "1");
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],

      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);

      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);

    
      this.setState({file:res},()=> {
        console.log('res  res',res);
      })
      let path =
        Platform.OS === 'ios'
          ? decodeURI(res.uri.replace('file://', ''))
          : decodeURI(res.uri);
      var tp = mime.lookup(path);
      console.log(tp);

      RNFetchBlob.fs.readFile(path, 'base64').then(encoded => {

        // console.log('encoded', encoded);
        this.setState({ docbase64: encoded });
        setTimeout(() => {
          AsyncStorage.setItem('removeDigi', "0")                 
      }, 500);
        this.setState({ docName: res.name, type: tp }), () => {
          // console.log('encoded', encoded);

        };
        // Android
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        setTimeout(() => {
          Toast.show('Canceled by user..!', Toast.SHORT, );
        }, 50);
      } else {
        //For Unknown Error
        setTimeout(() => {
          Toast.show(JSON.stringify(err), Toast.SHORT, );
        }, 50);
        this.refs.toastWithStyle.show(JSON.stringify(err), 1500);

        throw err;
      }
    }

    //   DocumentPicker.show({
    //       filetype: [DocumentPickerUtil.images(),
    //                  DocumentPickerUtil.pdf()],
    //     },(error,res) => {
    //       if(res){

    //         console.log(res);
    //         let path = (Platform.OS === 'ios')
    //          ? decodeURI(res.uri.replace('file://', ''))
    //          : decodeURI(res.uri)
    // var tp = mime.lookup(path);
    //      RNFetchBlob.fs.readFile(path, 'base64')
    //     .then((encoded) => {
    //         this.setState({docbase64: encoded})
    //         this.setState({docName: res.fileName, typea: tp});
    //         // Android

    //     })

    //       } else {
    //         //this.refs.toastWithStyle.show("Something went wrong..Please try again..", 1500);
    //       }

    //     });
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'column' }}
        onPress={() => {
          if (this.state.sort_direction == 'ASC') {
            this.setState({
              sort_direction: 'DESC',
            });
          } else {
            this.setState({
              sort_direction: 'ASC',
            });
          }
        }}>
        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == 'DESC'
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
              this.state.sort_direction == 'DESC'
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
              onChangeText={search => this.setState({ search })}
              underlineColorAndroid="transparent"
            />

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

  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };

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

  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../images/Left_arrow.png')}
          pageTitle="Drawing Request"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
          <Loader loading={this.state.loading}/>
        <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white}}>
        
          <ScrollView style={{ paddingHorizontal:10, paddingVertical: 10,}}>


            <View
              style={{
                flex: 1,
                marginBottom: 10,
                flexDirection: 'column',
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderTopLeftRadius: 5,
               
                borderBottomLeftRadius: 5,
                borderColor: Colors.light_gray,
                shadowOffset: { width: 0, height: 5 },
                shadowColor: Colors.medium_gray,
                shadowOpacity: 0.8,
                elevation: 3,
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
                      paddingVertical: 8,
                    }}>
                    SO No.  {this.state.dataSource.so_no}
                  </Text>



                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text
                      style={styles.label}>
                      Call No.
                      </Text>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      <Text style={styles.value}>
                        {this.state.dataSource.call_no}
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
                            {this.state.dataSource.name ? this.state.dataSource.name:'-'}
                            </Text>
                          </View>
                        </View>

                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text
                      style={styles.label}>
                     Requested By
                      </Text>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      <Text style={styles.value}>
                        {this.state.dataSource.requestor}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text
                      style={styles.label}>
                      Date/Time
                      </Text>
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      <Text style={styles.value}>
                      <Text style={styles.value}>{moment(this.state.dataSource.l_date).format("DD/MM/YYYY hh:mm a")}</Text>
                        {}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginBottom: 10,
                flexDirection: 'column',
                backgroundColor: Colors.white,
                borderWidth: 1,
                paddingBottom: 10,
                borderTopLeftRadius: 5,
                paddingHorizontal:10,
                // borderLeftWidth: 6,
                // borderLeftColor: Colors.medium_gray,
                borderBottomLeftRadius: 5,
                borderColor: Colors.light_gray,
                shadowOffset: { width: 0, height: 5 },
                shadowColor: Colors.medium_gray,
                shadowOpacity: 0.8,
                elevation: 3,
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

              <View style={styles.textInputView}>
                      
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.labela}>Select Type</Text>
    
                        <Text style={styles.required}>*</Text>
                      </View>
    
                      <View
                        style={{
                          paddingHorizontal: 10,
                          height: 42,
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          backgroundColor: Colors.white,
                          borderWidth: 1,
                          width: '90%',
                          borderRadius: 4,
    
                          borderColor: Colors.medium_gray,
                        }}>
                        <View>
                          <Dropdown
                            containerStyle={{
                              width: width * 0.8,
    
                              alignSelf: 'flex-start',
                              paddingBottom: 15,
                            }}
                            fontSize={15}
                            inputContainerStyle={{borderBottomColor:'white'}}
                            itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                            itemColor={Colors.black}
                            fontFamily={Fonts.regular}
                            selectedItemColor={Colors.black}
                            valueExtractor={({id}) => id}
                            labelExtractor={({name}) => name}
                            textColor={this.state.Type ? Colors.black : Colors.dark_gray}
                            value={this.state.Type ? this.state.WorkStatus : 'Select Type'}
                            onChangeText={value => {
                              console.log(value);
                              
                              this.setState({ Type: value });
                            }}
                            data={Data}
                          />
                        </View>
                      </View>
                  </View>  
    

                     
                
                   {this.state.Type == '1' ?
                  <View>

                    <Text style={styles.labela}>Upload File <Text style={styles.required}>*</Text></Text>

                    <TouchableOpacity
                      style={{
                        width: '90%',
                        borderRadius: 4,
                        borderColor: Colors.medium_gray,
                        borderWidth: 1,
                        marginHorizontal: 0,
                      }}
                      onPress={() => this.upload()}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            color: Colors.primary,
                            fontSize: 16,
                            fontFamily: Fonts.medium,
                            flex: 1,
                            padding: 10,
                          }}>
                          {this.state.docName}
                        </Text>
                      </View>
                    </TouchableOpacity>


                  </View>
                  :null}

                {this.state.Type == '2' ?
                  <View style={styles.textInputView}>
                      
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.labela}>Select File</Text>

                    <Text style={styles.required}>*</Text>
                  </View>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      height: 42,
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      width: '90%',
                      borderRadius: 4,

                      borderColor: Colors.medium_gray,
                    }}>
                    <View>
                      <Dropdown
                        containerStyle={{
                          width: width * 0.8,

                          alignSelf: 'flex-start',
                          paddingBottom: 15,
                        }}
                        fontSize={15}
                        inputContainerStyle={{borderBottomColor:'white'}}
                        itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                        itemColor={Colors.black}
                        fontFamily={Fonts.regular}
                        selectedItemColor={Colors.black}
                        valueExtractor={({id}) => id}
                        labelExtractor={({so_no}) => so_no}
                        textColor={this.state.SelectFile ? Colors.black : Colors.dark_gray}
                        value={this.state.SelectFile ? this.state.WorkStatus : 'Select File'}
                        onChangeText={value => {
                          this.setState({ SelectFile: value });
                        }}
                        data={this.state.Typedata}
                      />
                    </View>
                  </View>
              </View>  
                  :null}
               
                </View>
             
              </View>
            </View>

            <HorizontalButton
              fImage={require('../../src/images/tick.png')}
              sImage={require('../../src/images/X-icon.png')}
              fcolor={this.state.submit ? Colors.dark_gray : Colors.primary}
              scolor={Colors.red}
              fLabel={this.state.editPage ? "Submit" : "Update"}
              sLabel="Cancel"
              fButton={() => { this.state.submit ? null : this.DrawingRequestUpdate() }}
              sButton={() => {
                this.props.navigation.goBack();
              }}
            />


          </ScrollView>
          </KeyboardAvoidingView>
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
   
   
    backgroundColor: '#f1f1f1',
  },
  btn: {
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
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
  required: {
    marginTop: 15,
    color: 'red',
    fontSize: 14,
    paddingLeft: 3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
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
  rowItem: { flex: 1, flexDirection: 'row', paddingVertical: 2 },
  labela: {
    marginTop: 15,
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  }, textInputView: {
    flexDirection: 'column',
  },
});
