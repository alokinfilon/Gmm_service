import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Fonts from '../common/Fonts';
import Colors from '../common/Colors';

var width = Dimensions.get('screen').width;
var height = Dimensions.get('screen').height;

import CodeInput from 'react-native-confirmation-code-input';
export default class OTP extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mobile: '',
      password: '',
      otp: '',
      code: '',
      ID: '',
      refresh: false,
    };
  }

  _onFulfill(code) {
    // TODO: call API to check code here
    // If code does not match, clear input with: this.refs.codeInputRef1.clear()
    if (code == 'Q234E') {
      Alert.alert('Confirmation Code', 'Successful!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      Alert.alert('Confirmation Code', 'Code not match!', [{text: 'OK'}], {
        cancelable: false,
      });

      this.refs.codeInputRef1.clear();
    }
  }

  _onFinishCheckingCode1(isValid) {
    console.log(isValid);
    if (!isValid) {
      Alert.alert('Confirmation Code', 'Code not match!', [{text: 'OK'}], {
        cancelable: false,
      });
    } else {
      Alert.alert('Confirmation Code', 'Successful!', [{text: 'OK'}], {
        cancelable: false,
      });
    }
  }

  _onFinishCheckingCode2(isValid, code) {
    console.log(isValid);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <StatusBar hidden={false} />
        <View style={styles.container}>
          <KeyboardAvoidingView style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                zIndex: 999,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{flex: 1}}>
                <View style={{flex: 0.4, flexDirection: 'column'}}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: width * 0.8,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingTop: 20,
                      paddingVertical: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: Fonts.bold,
                        color: Colors.dark_gray,
                        // transform: [{ scale: scaleText }]
                      }}>
                      Enter Security Code
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        paddingTop: 5,
                        textAlign: 'left',
                        fontFamily: Fonts.medium,
                        color: Colors.medium_gray,
                        // transform: [{ scale: scaleText }]
                      }}>
                      Security Code has been
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingTop: 5,
                          paddingLeft: 5,

                          fontFamily: Fonts.medium,
                          color: Colors.medium_gray,
                        }}></Text>
                    </View>
                  </View>
                </View>

                <View style={styles.box}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    {/* <Text style={styles.text}>OTP</Text> */}
                    <View style={{paddingTop: 10}}>
                      <CodeInput
                        ref="codeInputRef2"
                        keyboardType="numeric"
                        codeLength={4}
                        activeColor="black"
                        inactiveColor="grey"
                        autoFocus={false}
                        ignoreCase={true}
                        inputPosition="center"
                        size={width * 0.2}
                        onFulfill={(isValid, code) => {
                          this.setState({code: isValid});
                        }}
                        containerStyle={{marginTop: 10}}
                        codeInputStyle={{
                          borderWidth: 1.5,
                          fontSize: 30,
                          borderRadius: 10,
                          borderColor: Colors.medium_gray,
                          color: Colors.colorPrimary,
                          fontWeight: '800',
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 60,
                      marginLeft: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={[styles.btn, {marginRight: width * 0.02}]}>
                      <Text style={styles.btntxt}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.OTP()}
                      style={[
                        styles.btn,
                        {
                          marginRight: width * 0.02,
                          backgroundColor: Colors.medium_gray,
                        },
                      ]}>
                      <Text
                        style={[styles.btntxt, {color: Colors.colorPrimary}]}>
                        Verify
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                zIndex: 1,
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                zIndex: 99,
              }}></View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  txtinputstyle: {
    marginTop: 2,
    paddingVertical: 10,
    width: width * 0.8,
    fontSize: 16,
    alignSelf: 'center',
    borderBottomColor: Colors.colorPrimary,
    borderBottomWidth: 1,
    // borderWidth:1.1,
    paddingTop: 5,
    // borderColor:Color.colorPrimary,
  },
  title: {
    fontSize: 18,
    color: Colors.colorSecondary,
    fontFamily: Fonts.bold,
    textDecorationLine: 'underline',
  },
  box: {
    flex: 1,
  },
  txt: {
    color: Colors.colorPrimary,
    fontSize: 15,
    fontFamily: Fonts.Regular,
  },
  text: {
    marginLeft: 5,
    color: Colors.colorPrimary,
    fontSize: 17,
    fontFamily: Fonts.medium,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 60,

    paddingVertical: Platform.OS == 'ios' ? 12 : 8,
    borderRadius: 5,
    width: width * 0.4,

    // position:'absolute',
    alignSelf: 'center',
    // bottom:100,

    backgroundColor: Colors.colorPrimary,
  },
  btntxt: {
    fontFamily: Fonts.BoldItalic,
    color: Colors.white,
    fontSize: 20,
  },
});
