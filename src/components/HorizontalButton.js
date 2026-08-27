import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';

export default class HorizontalButton extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  static defaultProps = {
    fcolor: Colors.primary,
    scolor: Colors.primary
  };

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row',  marginVertical: 20,}}>
        <TouchableOpacity onPress={this.props.fButton} style={[styles.btn, {backgroundColor: this.props.fcolor, marginRight:5}]}>
          <ImageBackground
            resizeMode="cover"
            style={{flex:0.3, height: 30, width: 30, marginHorizontal: 5}}
            source={require('../images/fill.png')}>
            <View
              style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{height: 18, width: 18, tintColor: this.props.fcolor}}
                source={this.props.fImage}
              />
            </View>
          </ImageBackground>
          <Text
            style={{
              flex:1,
              fontSize: 16,
              color: Colors.white,
              fontFamily: Fonts.regular,
            }}>
            {this.props.fLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.sButton} style={[styles.btn, {backgroundColor: this.props.scolor, marginLeft:5}]}>
          <ImageBackground
            resizeMode="cover"
            style={{ flex:0.3, height: 30, width: 30, marginHorizontal: 5}}
            source={require('../images/fill.png')}>
            <View
              style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{height: 15, width: 15, tintColor: this.props.scolor}}
                source={this.props.sImage}
              />
            </View>
          </ImageBackground>

          <Text
            style={{
              flex:1,
              
              fontSize: 16,
              color: Colors.white,
              fontFamily: Fonts.regular,
            }}>
            {this.props.sLabel}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    flex: 1,
    paddingVertical: 6,
   
   
    flexDirection: 'row',
    alignItems: 'center',
    //  borderWidth:1,
    justifyContent: 'center',
    borderRadius: 4,

    marginVertical: 10,
  },
});
