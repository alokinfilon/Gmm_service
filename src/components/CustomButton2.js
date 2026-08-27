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
                        style={{height: 32, width:32, marginRight:6 , 
                          alignItems: 'center', justifyContent: 'center',}}
                        source={require('../images/fill.png')}>
                        <Image
                        resizeMode="center"
                        style={{height:22, width:22,paddingHorizontal:8 ,tintColor: Colors.primary}} source={this.props.iconName}/>
                        </ImageBackground>
        <View>
          <Text
            style={{
              fontSize: 16,
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
    width:  '45%',
    height: width * 0.11,
    alignItems: 'center',
    //  borderWidth:1,
  
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginVertical: 30,
  },
});
