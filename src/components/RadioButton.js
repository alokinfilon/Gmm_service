import React, {Component} from 'react';

import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Colors from '../common/Colors';
import SICon from 'react-native-vector-icons/AntDesign';
import Fonts from '../common/Fonts';


export default class RadioButton extends Component {
    constructor() {
      super();
    }
    render() {
      return (
        <TouchableOpacity
          onPress={this.props.onClick}
          activeOpacity={0.8}
          style={styles.radioButton}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            {this.props.selected == this.props.button.value? (
              // () => this.Disinspectiondata(),
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 6,
                  fontSize: 18,
                  width: '90%',
                  alignSelf: 'center',
                  fontFamily: Fonts.bold,
                  color: Colors.primary,
                }}>
                {this.props.button.name}
              </Text>
            ) : (
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 6,
                  fontSize: 18,
                  width: '90%',
                  alignSelf: 'center',
                  fontFamily: Fonts.regular,
                  color: Colors.dark_gray,
                }}>
                {this.props.button.name}
              </Text>
            )}
  
            <View>
              {this.props.selected ==  this.props.button.value? (
                <View>
                  <SICon
                    name="check"
                    size={20}
                    style={{
                      color: Colors.primary,
                      marginTop: 6,
                      alignSelf: 'flex-end',
                      right: 11,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
  const styles = StyleSheet.create({

    radioButton: {
      marginTop: 6,
      marginLeft: 10,
      flexDirection: 'row',
    },
    selectedText: {
      fontSize: 16,
      color: 'white',
    },

  });
  