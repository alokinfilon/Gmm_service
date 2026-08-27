import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, SafeAreaView, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Pending from './Call/Pending';
import Assigned from './Call/Assigned';
import Completed from './Call/Completed';
import Header from '../components/Header'
import Colors from '../common/Colors';
import { TabView, TabBar, SceneMap, NavigationState } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import AppState from 'react-native-app-state';
import Loader from '../common/Loader';
import Fonts from "../common/Fonts";
import AsyncStorage from '@react-native-community/async-storage';
export default class CallManagement extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };

  state = {
    index: 0,
    loading: false,
    permission:'',
    routes: this.props.navigation.state.params.isAaray,
  };

   componentDidMount(){
    AsyncStorage.getItem('permission').then(permission => {
      this.setState({ permission: JSON.parse(permission) }, () => {
       
        console.log('permission', this.state.routes);
      
        
      });
    })
   }

  _handleIndexChange = index =>{
    console.log(index)
    this.setState({
      index,
    });
  }


  _renderItem = ({ navigationState, position }) => ({ route, index }) => {
    const inputRange = navigationState.routes.map((x, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
        
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>

          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >

          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  _renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
         
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}
          >
            {this._renderItem(props)({ route, index })}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  _renderScene = ({ route }) => {

    switch (route.key) {
      case 'pending':
        return <Pending navigation={this.props.navigation} />;
      case 'assigned':
        return <Assigned navigation={this.props.navigation} />;
      case 'completed':
        return <Completed navigation={this.props.navigation} />;
      default:
        return null;
    }
  };



  render() {
    console.log(this.props.navigation);
    
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <Header
          backIcon={require('../images/menu.png')}
          pageTitle="Call Management"
          back={() => {
            this._handleDrawer();
          }}
         
        />
<Loader loading={this.state.loading} />
        <View style={styles.container}>
      
          <TabView
            style={this.props.style}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            tabBarPosition="top"
            onIndexChange={this._handleIndexChange}
          />
        </View>
      </SafeAreaView>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, .2)',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom:0,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    
  },
  active: {
    
    color: Colors.primary,
    fontFamily: Fonts.bold,
    fontSize:14
  },
  inactive: {
    color: Colors.dark_gray,
    fontFamily: Fonts.medium
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 12,
    paddingVertical:14,
    textAlign:'center'
  },
});