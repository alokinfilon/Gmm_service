import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Colors from '../common/Colors';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class HexagonGray extends Component {
  render() {
    return (
      // <View style={styles.hexagon}>
      //   <View style={styles.hexagonInner} />
      //   <View style={styles.hexagonBefore} />
      //   <View style={styles.hexagonAfter} />
      // </View>
      <View>
        <Image source={require('../images/primaryfill.png')} style={{height:180, width:180, tintColor: Colors.medium_gray}} />
      </View>
    );
  }
}     
const styles = StyleSheet.create({
  hexagon: {
    width: 100,
    height: 70,
    opacity: 0.5,
    transform: [{rotate: '-90deg'}],
  },
  hexagonInner: {
    width: 100,
    height: 70,
    backgroundColor: Colors.medium_gray,
  },
  hexagonAfter: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderTopWidth: 25,
    borderTopColor: Colors.medium_gray,
  },
  hexagonBefore: {
    position: 'absolute',
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderBottomWidth: 25,
    borderBottomColor: Colors.medium_gray,
  },
});
