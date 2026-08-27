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
  KeyboardAvoidingView,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Toast from 'react-native-simple-toast';
import {Dropdown} from 'react-native-material-dropdown';
import moment from 'moment';

import Colors from '../../common/Colors';
import RadioButton from '../../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';

import HexagonGray from '../../components/HexagonPrimary';
import Header from '../../components/Header';
import Fonts from '../../common/Fonts';
import BackHeader from '../../components/BackHeader';
import HorizontalButton from '../../components/HorizontalButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LabelTextInput from '../../components/LabelTextInput';


let data1 = [{value: 'Approved'}, {value: 'Rejected'}];
export default class PendingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refresh: false,
      dataMass: false,
      docName: 'Choose file',
      dataSource: [{call_id: '98989', company_name: 'GMM', date: '4/09/2019'}],
      modalVisible: false,
      isDateTimePickerVisible: false,
      date: new Date(),
      textInputs: [],
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
      submit:false
    };
  }

  componentDidMount() {
 
  }

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    this.setState({
      date: date,
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

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({radioItems: this.state.radioItems}, () => {
      this.setState({selectedItem: this.state.radioItems[index].label});
    });
  }


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
          backIcon={require('../../images/Left_arrow.png')}
          pageTitle="Leave Details"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1, backgroundColor: Colors.white}}>
          <ScrollView
            style={{flex: 1, backgroundColor: '#f1f1f1'}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.container} refresh={this.state.refresh}>
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                  flexDirection: 'column',
                  backgroundColor: Colors.white,
                  borderWidth: 1,
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
                      Leave Details
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Sr NO.</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>LV001</Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>User</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 15,
                            fontFamily: Fonts.bold,
                            color: Colors.primary,
                          }}>
                          Chirag - Engineer
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Leave Date</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>22/10/19</Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Applied Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>
                        10/12/2019 10:12 pm
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Status</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>	Pending</Text>
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
                      Old Leave Details
                    </Text>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Sr No</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>LVO17</Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Leave Date</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>22/10/19</Text>
                      </View>
                    </View>

                    <View style={styles.rowItem}>
                      <Text style={styles.label}>Leave Reason</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>Marriage Function</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Applied Time</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>24/12/2019 10:15 AM</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Status</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>Approved</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Admin User</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>Chirag-Manager</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Admin Remark</Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>Okey..</Text>
                      </View>
                    </View>

                    <View style={[styles.rowItem, {paddingTop: 10}]}>
                      <Text style={styles.label}>Admin Time </Text>
                      <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={styles.value}>08/12/2019 10:15 AM</Text>
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
                      Edit Leave
                    </Text>

                    <View style={{paddingHorizontal: width * 0.05}}>
                      <View style={styles.textInputView}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.labela}>Status</Text>

                          <Text style={styles.required}>*</Text>
                        </View>

                        <View
                          style={{
                            paddingHorizontal: 10,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Colors.white,
                            borderWidth: 1,

                            borderRadius: 4,

                            borderColor: Colors.medium_gray,
                          }}
                          onPress={() => {
                            // this._showDateTimePicker()
                          }}>
                          <View>
                            <Dropdown
                              containerStyle={{
                                width: width * 0.8,

                                alignSelf: 'flex-start',
                                paddingBottom: 15,
                              }}
                              inputContainerStyle={{borderBottomColor:'white'}}
                              itemTextStyle={{ fontFamily: Fonts.regular, color: Colors.primary }}
                              itemColor={Colors.black}
                              fontFamily={Fonts.regular}
                              selectedItemColor={Colors.black}
                              fontSize={15}
                              // selectedItemColor={Colors.dark_gray}
                              value="Select Status"
                              onChangeText={this.onChangeText}
                              data={data1}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={{flex: 1}} refresh={new Date()}>
                      
                      </View>

                      <LabelTextInput
                        label="Remarks for User"
                        multiline={true}
                        editable={this.state.editPage}
                        placeholder="Enter Remarks for User"
                        returnKeyType="next"
                        onChangeText={sono => this.setState({sono})}
                      />
                    </View>
                  </View>
                </View>
              </View>
             
              
               
              <HorizontalButton
                fImage={require('../../images/tick.png')}
                sImage={require('../../images/X-icon.png')}
                fcolor={this.state.submit ? Colors.dark_gray : Colors.primary}
                scolor={Colors.red}
                fLabel="Update"
                sLabel="Cancel"
                fButton={() => { this.state.submit ? null :  this.props.navigation.goBack(); }}
               
                sButton={() => {
                  this.props.navigation.goBack();
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
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
    padding: 10,
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
  textInputView: {
    flexDirection: 'column',
  },
});
