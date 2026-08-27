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

export default class LabelTextInput extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    this.state = {
      loading: false,
      inputBorderColor: Colors.medium_gray
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
    multiline: false

  };


  render() {
   
    return (
      <View style={styles.textInputView}>
          <View style={{flexDirection:"row"}}>
        <Text style={styles.label}>{this.props.label}</Text>
        {this.props.required ? 
        <Text style={styles.required}>*</Text>: null }
        </View>
        <TextInput
          
          style={[styles.textInput, {
            textAlignVertical: this.props.multiline ? "top" : "center",
            borderColor: this.state.inputBorderColor,
            minHeight: this.props.multiline ? 100 : null,
          }]}
          
          onFocus={() => this.setState({ inputBorderColor: Colors.primary })}
          onBlur={() =>
            this.setState({ inputBorderColor: Colors.medium_gray })
          }
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          ref={this.inputRef}
          value={this.props.value}
          multiline={this.props.multiline}
          editable={this.props.editable}
          maxLength={this.props.max}
          keyboardType={this.props.keyboardType}
          
          onSubmitEditing={this.props.onSubmitEditing}
          returnKeyType={this.props.returnKeyType}
          onChangeText={this.props.onChangeText}
          underlineColorAndroid={this.props.underlineColorAndroid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputView: {
    
   
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
    padding: 15,
    paddingVertical: Platform.OS == "ios" ? 12 : 6,
    paddingHorizontal: 10,
    fontSize: 16,
    
    fontFamily: Fonts.regular,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 4,
   
  },
});
