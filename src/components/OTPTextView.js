// import React, { PureComponent } from 'react';
// import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
// import PropTypes from 'prop-types';
// import Fonts from '../common/Fonts';
// import  Colors  from '../common/Colors';

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   textInput: {
//     height: 50,
//     width: 50,
//     borderBottomWidth: 4,
//     margin: 5,
//     textAlign: 'center',
//     fontSize: 22,
//     fontFamily: Fonts.bold,
//     fontFamily: Fonts.medium,
//     color: '#000000'
//   },
// });

// class OTPTextView extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       focusedInput: 0,
//       otpText: [],
//     };
//     this.inputs = [];
//   }

//   componentDidMount() {
//     const { defaultValue, cellTextLength } = this.props;
//     this.otpText = defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g'));
//   }

//   onTextChange = (text, i) => {
//     const { cellTextLength, inputCount, handleTextChange } = this.props;
//     this.setState((prevState) => {
//       let { otpText } = prevState;
//       otpText[i] = text;
//       return {
//         otpText,
//       }
//     }, () => {
//       handleTextChange(this.state.otpText.join(""));
//       if (text.length === cellTextLength && i !== inputCount - 1) {
//         this.inputs[i+1].focus();

//       }
//     });
//   }

//   onInputFocus = (i) => {
//     this.setState({ focusedInput: i });
//   }

//   onKeyPress = (e, i) => {
//     const { otpText = [] } = this.state;
//     //Since otpText[i] is undefined, The clear operation is not functional
//     if (e.nativeEvent.key === 'Backspace' && i !== 0 && !otpText[i]) {
//       this.inputs[i-1].focus();
//     }
//   }

//   render() {
//     const {
//       inputCount,
//       offTintColor,
//       tintColor,
//       defaultValue,
//       cellTextLength,
//       containerStyle,
//       textInputStyle,
//       ...textInputProps
//     } = this.props;

//     const TextInputs = [];

//     for (let i = 0; i < inputCount; i += 1) {
//       let defaultChars = [];
//       if (defaultValue) {
//         defaultChars = defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g'));
//       }
//       const inputStyle = [
//         styles.textInput,

//         textInputStyle,
//         { borderColor: offTintColor }
//       ];
//       if (this.state.focusedInput === i) {
//         inputStyle.push({ borderColor: tintColor });
//       }

//       TextInputs.push(
//         <TextInput
//           // autoFocus={true}
//           ref={(e) => { this.inputs[i] = e; }}
//           key={i}
//           onSubmitEditing={this.props.onSubmitEditing}
//           returnKeyType="done"

//           secureTextEntry={true}
//           defaultValue={defaultValue ? defaultChars[i] : ''}
//           style={inputStyle}
//           maxLength={this.props.cellTextLength}
//           onFocus={() => this.onInputFocus(i)}
//           onChangeText={(text) => this.onTextChange(text, i)}
//           multiline={false}
//           onKeyPress={e => this.onKeyPress(e, i)}
//           {...textInputProps}
//         />
//       );
//     }
//     return (
//       <View style={[styles.container, containerStyle]}>
//         {TextInputs}
//       </View>
//     );
//   }
// }

// OTPTextView.propTypes = {
//   defaultValue: PropTypes.string,
//   inputCount: PropTypes.number,
//   containerStyle: PropTypes.object,
//   textInputStyle: PropTypes.object,
//   cellTextLength: PropTypes.number,
//   tintColor: PropTypes.string,
//   offTintColor: PropTypes.string,
//   handleTextChange: PropTypes.func,
//   inputType: PropTypes.string,
// }

// OTPTextView.defaultProps = {
//   defaultValue: '',
//   inputCount: 4,
//   tintColor: Colors.primary,
//   offTintColor: '#DCDCDC',
//   cellTextLength: 1,
//   containerStyle: {},
//   textInputStyle: {},
//   handleTextChange: () => {},
// }

// export default OTPTextView;

// import React, { PureComponent } from 'react';
// import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
// import PropTypes from 'prop-types';
// import Fonts from '../common/Fonts';
// import  Colors  from '../common/Colors';

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   textInput: {
//     height: 50,
//     width: 50,
//     borderBottomWidth: 4,
//     margin: 5,
//     textAlign: 'center',
//     fontSize: 22,
//     fontFamily: Fonts.bold,
//     fontFamily: Fonts.medium,
//     color: '#000000'
//   },
// });

// class OTPTextView extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       focusedInput: 0,

//       otpText: [],
//     };
//     this.inputs = [];
//   }

//   componentDidMount() {
//     const { defaultValue, cellTextLength } = this.props;
//     this.otpText = defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g'));
//   }

//   onTextChange = (text, i) => {
//     const { cellTextLength, inputCount, handleTextChange } = this.props;
//     this.setState((prevState) => {
//       let { otpText } = prevState;
//       otpText[i] = text;
//       return {
//         otpText,
//       }
//     }, () => {
//       handleTextChange(this.state.otpText.join(""));
//       if (text.length === cellTextLength && i !== inputCount - 1) {
//         this.inputs[i+1].focus();
//       } 
//      console.log(this.state.otpText);

//       if(this.state.otpText.length ==  this.props.inputCount){
//         setTimeout(()=> {
//           this.setState({ otpText: [],}, ()=> {
//             this.inputs[0].clear();
//             this.inputs[1].clear();
//             this.inputs[2].clear();
//             this.inputs[3].clear();
//             this.inputs[0].focus();
//           })

//         }, 500)
//       }
//     });
//   }

//   onInputFocus = (i) => {
//     this.setState({ focusedInput: i });
//   }

//   onKeyPress = (e, i) => {
//     const { otpText = [] } = this.state;
//     //Since otpText[i] is undefined, The clear operation is not functional
//     if (e.nativeEvent.key === 'Backspace' && i !== 0 && !otpText[i]) {
//       this.inputs[i-1].focus();
//     }
//   }

//   render() {
//     const {
//       inputCount,
//       offTintColor,
//       tintColor,
//       defaultValue,
//       cellTextLength,
//       containerStyle,
//       textInputStyle,
//       ...textInputProps
//     } = this.props;

//     const TextInputs = [];

//     for (let i = 1; i < inputCount; i += 1) {
//       let defaultChars = [];
//       if (defaultValue) {
//         defaultChars = defaultValue.match(new RegExp('.{1,' + cellTextLength + '}', 'g'));
//       }
//       const inputStyle = [
//         styles.textInput,
//         textInputStyle,
//         { borderColor: offTintColor }
//       ];
//       if (this.state.focusedInput === i) {
//         inputStyle.push({ borderColor: tintColor });
//       }

//       TextInputs.push(
//         <TextInput
//           ref={(e) => { this.inputs[i] = e; }}
//           key={i}
//           onSubmitEditing={this.props.onSubmitEditing}
//           returnKeyType="done"
//           secureTextEntry={true}
//           defaultValue={defaultValue ? defaultChars[i] : ''}
//           style={inputStyle}
//           maxLength={this.props.cellTextLength}
//           onFocus={() => this.onInputFocus(i)}
//           onChangeText={(text) => this.onTextChange(text, i)}
//           multiline={false}
//           onKeyPress={e => this.onKeyPress(e, i)}
//           {...textInputProps}
//         />
//       );
//     }
//     return (
//       <View style={[styles.container, containerStyle]}>
//          <TextInput

//           ref={(e) => { this.inputs[0] = e; }}
//           key={0}
//           autoFocus={true}
//           onSubmitEditing={this.props.onSubmitEditing}
//           returnKeyType="done"
//           secureTextEntry={true}
//           defaultValue={defaultValue ? defaultChars[0] : ''}
//           style={[
//             styles.textInput,
//             textInputStyle,
//             { borderColor: this.state.focusedInput == 0 ? tintColor : offTintColor }
//           ]}
//           maxLength={this.props.cellTextLength}
//           onFocus={() => this.onInputFocus(0)}
//           onChangeText={(text) => this.onTextChange(text, 0)}
//           multiline={false}
//           onKeyPress={e => this.onKeyPress(e, 0)}
//           {...textInputProps}
//         />
//         {TextInputs}
//       </View>
//     );
//   }
// }

// OTPTextView.propTypes = {
//   defaultValue: PropTypes.string,
//   inputCount: PropTypes.number,
//   containerStyle: PropTypes.object,
//   textInputStyle: PropTypes.object,
//   cellTextLength: PropTypes.number,
//   tintColor: PropTypes.string,
//   offTintColor: PropTypes.string,
//   handleTextChange: PropTypes.func,
//   inputType: PropTypes.string,
// }

// OTPTextView.defaultProps = {
//   defaultValue: '',
//   inputCount: 4,
//   tintColor: Colors.primary,
//   offTintColor: '#DCDCDC',
//   cellTextLength: 1,
//   containerStyle: {},
//   textInputStyle: {},
//   handleTextChange: () => {},
// }

// export default OTPTextView;



import React, { Component } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Fonts from '../common/Fonts';
import Colors from '../common/Colors';

export default class OTPTextView extends Component {
  render() {
    return (
      <OTPInputView
        code={this.props.code}
        autoFocusOnLoad={this.props.autoFocus}
        pinCount={4}
        onCodeFilled={() => this.props.onSubmitEditing()}
        onCodeChanged={text => this.props.handleTextChange(text)}
        codeInputHighlightStyle={{ borderBottomColor: Colors.primary }}
        codeInputFieldStyle={{
          height: 50,
          width: 50,
          borderWidth: 0,
          borderBottomWidth: 4,
          margin: 5,
          textAlign: 'center',
          fontSize: 22,
          fontFamily: Fonts.bold,
          fontFamily: Fonts.medium,
          color: '#000000'
        }}
      />
    )
  }
}
