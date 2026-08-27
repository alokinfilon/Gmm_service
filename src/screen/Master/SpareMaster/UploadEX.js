import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Toast from 'react-native-simple-toast';


import Colors from '../../../common/Colors';
import RadioButton from '../../../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';

import Fonts from '../../../common/Fonts';
import BackHeader from '../../../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import {DocumentPicker} from 'react-native-document-picker';
import HorizontalButton from '../../../components/HorizontalButton';

export default class DrawingRequestEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataMass: false,
      docName: 'Choose file',
      dataSource: [{call_id: '98989', company_name: 'GMM', date: '4/09/2019'}],
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
    };
  }

  componentDidMount() {
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({selectedItem: item.label});
      }
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({radioItems: this.state.radioItems}, () => {
      this.setState({selectedItem: this.state.radioItems[index].label});
    });
  }

  async upload() {
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

      console.log(res);
      let path =
        Platform.OS === 'ios'
          ? decodeURI(res.uri.replace('file://', ''))
          : decodeURI(res.uri);
      var tp = mime.lookup(path);
      console.log(tp);

      RNFetchBlob.fs.readFile(path, 'base64').then(encoded => {
        this.setState({docbase64: encoded});
        this.setState({docName: res.name, type: tp});
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

   
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'column'}}
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
          source={require('../../../images/up.png')}
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
              underlineColorAndroid="transparent"
            />

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
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../../../images/Left_arrow.png')}
          pageTitle="Upload Excel"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <View style={styles.container}>
          <ScrollView>
           <View
              style={{
                flex: 1,
                marginBottom: 10,
                flexDirection: 'column',
                backgroundColor: Colors.white,
                borderWidth: 1,
                paddingBottom: 10,
                borderTopLeftRadius: 5,
                // borderLeftWidth: 6,
                // borderLeftColor: Colors.medium_gray,
                borderBottomLeftRadius: 5,
                borderColor: Colors.light_gray,
                shadowOffset: {width: 0, height: 5},
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
                    Upload Excel File
                  </Text>

                  <Text style={styles.labela}> Upload Excel <Text style={{color: Colors.red, fontSize:18, textAlign:'center'}}>* </Text> </Text>
                  <TouchableOpacity
                      style={{
                      
                        borderRadius: 4,
                       borderColor: Colors.primary,
                       borderWidth:1,
                        marginHorizontal: 10,
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
{/* 
 <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={{height:20,width:20,resizeMode:'stretch',paddingLeft:10}}
          /> */}

                    </Text>
                  
                     
                  
                  </View>
                  </TouchableOpacity>
                </View>
              </View>
             
            </View>
            <HorizontalButton
                  fImage={require('../../../images/tick.png')}
                  sImage={require('../../../images/X-icon.png')}
                  fcolor={Colors.primary}
                  scolor={Colors.red}
                  fLabel="Submit"
                  sLabel="Cancel"
                  fButton={() => {
                    this.props.navigation.goBack();
                  }}
                  sButton={() => {
                    this.props.navigation.goBack();
                  }}
                />
          </ScrollView>
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
    paddingVertical: 10,
    //  margin: 10,
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
  rowItem: {flex: 1, flexDirection: 'row', paddingVertical: 2},
  labela: {
    fontSize: 14,
    paddingBottom: 5,
    paddingLeft: 10,
    color: Colors.black,
  },
});
