import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';

export default class CustomButton extends Component {
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
   
    

  };


  render() {
   
    return (
        <TouchableOpacity style={styles.btn} onPress={this.props.onPress}>
          <ImageBackground
                        resizeMode="contain"
                        style={{height: 40, width:40, marginRight:10 , alignItems: 'center', justifyContent: 'center',}}
                        source={require('../images/fill.png')}>
                        <Image style={{height:30, width:30, tintColor: Colors.primary}} source={this.props.iconName}/>
                        </ImageBackground>
        <View>
          <Text
            style={{
              fontSize: 18,
              color: Colors.white,
              fontFamily: Fonts.medium,
            }}>
           
           {this.props.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
   
    flexDirection:'row',
    width: width * 0.8,
    height: width * 0.12,
    alignItems: 'center',
    //  borderWidth:1,
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginVertical: 30,
  },
});
