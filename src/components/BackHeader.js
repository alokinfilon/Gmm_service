import React, {Component} from 'react';
import {
  Platform,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationActions} from 'react-navigation';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class BackHeader extends Component {
  render() {
    return (
      <View style={{flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            height: Platform.OS == 'ios' ? 60 : 60,
            paddingTop: Platform.OS == 'ios' ? 0 : 0,
            backgroundColor: Colors.white,
            borderBottomWidth:1,
            borderBottomColor: Colors.light_gray
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity style={{flex: 0.25}} onPress={this.props.back}>
              <View
                style={{
                  height: 40,
                  width: 40,
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Icon
                name={
                  Platform.OS === "ios"
                    ? this.props.backIcon
                    : this.props.backIcon
                }
                size={30}
                color={Colors.white}
              /> */}
                <Image
                  resizeMode="cover"
                  style={{height: 40, width: 40}}
                  source={this.props.backIcon}
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,

                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: Colors.primary,
                  fontFamily: Fonts.bold,
                  fontSize: 18,
                }}
                numberOfLines={2}>
                {this.props.pageTitle}
              </Text>
            </View>

            <TouchableOpacity style={{flex: 0.25}} onPress={this.props.press}>
              {this.props.press ? (
                <View style={{marginRight: 10, alignItems: 'flex-end'}}>
                  <ImageBackground
                    source={require('../images/primaryfill.png')}
                    style={{height: 40, width: 40}}>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <Icon
                name={
                  Platform.OS === "ios"
                    ? this.props.backIcon
                    : this.props.backIcon
                }
                size={30}
                color={Colors.white}
              /> */}
                      <Image
                        resizeMode="contain"
                        style={{height: 18, width: 18, tintColor: Colors.white}}
                        source={this.props.iconName}
                      />
                    </View>
                  </ImageBackground>
                </View>
              ) : null}
            </TouchableOpacity>

            {/* <View style={{ flex: 0.25 }}>
            <TouchableOpacity
              style={{
                height: 60,
                width: 60,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={this.props.press}
            >
              <Icon
                name={
                  Platform.OS === "ios"
                    ? this.props.iconName
                    : this.props.iconName
                }
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View> */}
          </View>
        </View>
        <View
          style={{
            height: 0.2,
            width: width,
            backgroundColor: Colors.primary,
          }}
        />
      </View>
    );
  }
}
