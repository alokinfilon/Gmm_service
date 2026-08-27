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


import Colors from '../common/Colors';
import RadioButton from '../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';

import HexagonGray from '../components/HexagonPrimary';
import Header from '../components/Header';
import Fonts from '../common/Fonts';
import BackHeader from '../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import HorizontalButton from '../components/HorizontalButton';
import CustomButton from '../components/CustomButton';

export default class DrawingMasterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataMass: false,
      docName: 'Choose file',
      dataSource: [{call_id: '98989', company_name: 'GMM', date: '4/09/2019'}],


    };
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
          backIcon={require('../images/Left_arrow.png')}
          pageTitle="Drawing Master"
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
                    Drg No. 1
                  </Text>

                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Requested Date/Time</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>23/12/2019 10:22 AM</Text>
                    </View>
                  </View>

                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Requested User</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>Mehul - Engineer</Text>
                    </View>
                  </View>


                  <View style={[styles.rowItem, {paddingTop:10}]}>
                    <Text style={styles.label}>Drg Name</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text
                        style={{
                          padding: 2,
                          fontSize: 15,
                          fontFamily: Fonts.bold,
                          color: Colors.primary,
                        }}>
                        DRG Machine
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Description</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>FSD T1 DS1365 DSGFS1975</Text>
                    </View>
                  </View>

                  <View style={[styles.rowItem, {paddingTop:10}]}>
                    <Text style={styles.label}>Call No.</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>CHR00010</Text>
                    </View>
                  </View>

                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Uploaded User</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>Shreyas Kheni</Text>
                    </View>
                  </View>


                  <View style={styles.rowItem}>
                    <Text style={styles.label}>Uploaded Date/Time</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={styles.value}>21/12/2019 10:16 AM</Text>
                    </View>
                  </View>


                </View>
              </View>
            </View>
<View  style={{alignSelf: 'center',}}>
<CustomButton iconName={require('../images/eye.png')} name="View Drawing" onPress={()=> this.props.navigation.navigate('ViewPdf')} />
</View>       
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
