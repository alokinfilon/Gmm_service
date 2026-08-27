import React from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  View,
  TouchableHighlight,
  SafeAreaView,
  Image,
} from 'react-native';
import Colors from '../common/Colors';
import SignatureCapture from 'react-native-signature-capture';
import BackHeader from '../components/BackHeader';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import Loader from '../common/Loader';
import Header from '../components/Header';
import HorizontalButton from '../components/HorizontalButton';
import Fonts from '../common/Fonts';
var isSaveSing = false
// var base64Icon = "";
// data:image/png;base64
export default class Engineersignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lock: true,
      base64Icon: null,
      AA:'',
      refress: false,
      loading:false
    };
  }

  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  componentDidMount() {
    AsyncStorage.getItem('signature').then(signature => {
      console.log(signature);
      if (signature == '') {
        console.log('if call');
  
      } else {

        this.setState({base64Icon:signature,refress:!this.state.refress }),() => {
      
          console.log(signature);
  
        };
       
      }
     
    });
 
  
  }

  saveSign = () => {
    if (isSaveSing) {

      this.refs['sign'].saveImage();
      this.setState({loading:true})
      setTimeout(() => {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      AsyncStorage.setItem('removeDigi', "1")

  }, 2000);
}
      else {
       this.setState({loading:false})
        Toast.show(
          'Please Write Your Signature',
          Toast.SHORT,
          
        );
      }
    
  }

  resetSign() {
    isSaveSing = false
    this.refs['sign'].resetImage();
  
  }

  _onSaveEvent(result) {
   
    console.log('result', result.encoded);
     AsyncStorage.setItem('signature',result.encoded);
  }

  _onDragEvent() {
    isSaveSing = true
    console.log('draw');
  }
  isReset= ()=>{
    isSaveSing = false   
    AsyncStorage.removeItem('signature');
    this.setState({base64Icon:null})
    // console.log('data:image/png;base64,'+this.state.base64Icon);
    
  }

  _handleDrawer = () => {
    this.props.navigation.openDrawer();
  };
  
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
      
          <Header
          backIcon={require('../images/menu.png')}
          pageTitle={'Engineer Signature'}
          back={() => {
            this._handleDrawer();
          }}
         
        />
           <Loader loading={this.state.loading}/>
        {this.state.base64Icon == null ? (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 0.9}}>
              <SignatureCapture
                style={[styles.signature]}
                ref="sign"
                onSaveEvent={this._onSaveEvent}
                onDragEvent={this._onDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                viewMode={'portrait'}
              />
            </View>

            <View
              style={{
                position:'absolute',bottom:0,left:0,right:0,
                borderTopColor: Colors.dark_gray,
                backgroundColor: Colors.white,
              }}>
              <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                {/* <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    this.saveSign();
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: Colors.white,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn2}
                  onPress={() => {
                    this.resetSign();
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: Colors.white,
                    }}>
                    Reset
                  </Text>
                </TouchableOpacity> */}
                  <HorizontalButton
                fImage={require('../images/tick.png')}
                sImage={require('../images/refresh.png')}
                fcolor={ Colors.primary}
                scolor={Colors.red}
                fLabel={"Save"}
                sLabel="Reset"
                fButton={() => {   this.saveSign() }}
                sButton={() => {
                  this.resetSign()
                }}
              />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'white',
            }}>
            <View style={{flex: 0.9}}>
              <Image
                source={{
                  uri:'data:image/png;base64,'+this.state.base64Icon,
                }}
                style={{height: '100%', width: '100%'}}
              />
            </View>

           
            <View
              style={{
                position:'absolute',bottom:0,left:0,right:0,
                borderTopColor: Colors.dark_gray,
                backgroundColor: Colors.white,
              }}>
              <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                {/* <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                    backgroundColor: Colors.medium_gray,
                    borderTopLeftRadius: 10,
                    margin: 1,
                  }}
                  onPress={() => {}}>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: Colors.white,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn2}
                  onPress={() => {
                    this.isReset();
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.medium,
                      fontSize: 16,
                      color: Colors.white,
                    }}>
                    Reset
                  </Text>
                </TouchableOpacity> */}
                 <HorizontalButton
                fImage={require('../images/tick.png')}
                sImage={require('../images/refresh.png')}
                fcolor={ Colors.medium_gray}
                scolor={Colors.red}
                fLabel={"Save"}
                sLabel="Reset"
                fButton={() => {  }}
                sButton={() => {
                  this.isReset();
                }}
              />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    margin: 1,
  },
  btn2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 10,
    margin: 1,
  },
});
