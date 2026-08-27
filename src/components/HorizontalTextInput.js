import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

import Colors from '../common/Colors';
import Fonts from '../common/Fonts';

export default class HorizontalTextInput extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    this.state = {
      loading: false,
      inputBorderColor: Colors.medium_gray,
      inputBorderColor1: Colors.medium_gray
    };
    
  }


  static defaultProps = {
    underlineColorAndroid: 'transparent',
    editable: true,
    fontSize: 16,
    labelFontSize: 12,
    tintColor: 'rgb(0, 145, 234)',
    textColor: 'rgba(0, 0, 0, .87)',
    baseColor: 'rgba(0, 0, 0, .38)',
    errorColor: 'rgb(213, 0, 0)',
    secureTextEntry: false,
    keyboardType:'default',
    required: true,

    underlineColorAndroid1: 'transparent',
    editable1: true,
    fontSize1: 16,
    labelFontSize1: 12,
    tintColor1: 'rgb(0, 145, 234)',
    textColor1: 'rgba(0, 0, 0, .87)',
    baseColor1: 'rgba(0, 0, 0, .38)',
    errorColor1: 'rgb(213, 0, 0)',
    secureTextEntry1: false,
    keyboardType1:'default',
    required1: true

  };


  render() {
   
    return (
      <View style={styles.textInputView}>            
          <View style={{flex:1,flexDirection:'column', marginRight:5,}}>
          <View style={{flex:1,flexDirection:"row"}}>
        <Text style={styles.label}>{this.props.label}</Text>
        {this.props.required ? 
        <Text style={styles.required}>*</Text>: null }
        </View>
        <TextInput
          style={[styles.textInput, {
             
            borderColor: this.state.inputBorderColor,
          }]}
          onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
          onBlur={() =>
            this.setState({ inputBorderColor: Colors.medium_gray })
          }
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          ref={this.inputRef}
          value={this.props.value}
          editable={this.props.editable}
          keyboardType={this.props.keyboardType}
          onSubmitEditing={this.props.onSubmitEditing}
          returnKeyType={this.props.returnKeyType}
          onChangeText={this.props.onChangeText}
          underlineColorAndroid={this.props.underlineColorAndroid}
        />
</View>
<View style={{flex:1, flexDirection:"column", marginLeft: 5,}}>
<View style={{flexDirection:"row", flex:1}}>
        <Text style={styles.label}>{this.props.label1}</Text>
        {this.props.required ? 
        <Text style={styles.required}>*</Text>: null }
        </View>
        <TextInput
          style={[styles.textInput, {
              
            borderColor: this.state.inputBorderColor1,
          }]}
          onFocus={() => this.setState({ inputBorderColor1: Colors.primary })}
          onBlur={() =>
            this.setState({ inputBorderColor1: Colors.medium_gray })
          }
          placeholder={this.props.placeholder1}
          secureTextEntry={this.props.secureTextEntry1}
          ref={this.inputRef1}
          value={this.props.value1}
          editable={this.props.editable1}
          keyboardType={this.props.keyboardType1}
          onSubmitEditing={this.props.onSubmitEditing1}
          returnKeyType={this.props.returnKeyType1}
          onChangeText={this.props.onChangeText1}
          underlineColorAndroid={this.props.underlineColorAndroid1}
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputView: {
    flexDirection:'row',
   
   
  },

  label: {
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
    paddingLeft:3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
  textInput: {
    padding: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: Fonts.regular,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    padding: 5,
    borderRadius: 4,
    paddingTop: 10,
  },
});
