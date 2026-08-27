import React, {Component} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  BackHandler,
  ScrollView,
  NetInfo,
  SafeAreaView
} from "react-native";
import Color from "../common/Colors";
import Fonts from "../common/Fonts";

var width = Dimensions.get("window").width;

export default class Maintenance extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {


  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={{flex:1, backgroundColor:Color.colorPrimary, }}>

      <View style={styles.container}>
     
        <View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
          <View
            style={{flex: 1, alignItems: "center", justifyContent: "center"}}
          >

<Image
              resizeMode="contain"
              source={require('../images/logo.png')}
              style={{width: width * 0.8, height: width * 0.5}}
            />
          </View>
          <View style={{flex: 1, alignItems: "center", marginHorizontal: 20}}>
            <Text
              style={{fontSize: 20, fontFamily: Fonts.bold, color: Color.colorPrimary}}
            >
              Application
            </Text>

            <Text
              style={{fontSize: 20, fontFamily: Fonts.bold, color: Color.colorPrimary}}
            >
              Under Maintenance
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                fontFamily: Fonts.regular,
                color: Color.dark_gray,
                paddingVertical: 30
              }}
            >
              {this.props.navigation.state.params.txt}
            </Text>
          </View>
        </View>
      
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,

    backgroundColor: Color.white
  },
});
