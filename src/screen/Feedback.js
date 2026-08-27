import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,SafeAreaView,Dimensions,StatusBar,Image,TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import {LabelTextInput} from '../components/LabelTextInput';
import Colors from '../common/Colors';
import Fonts from '../common/Fonts';
var width = Dimensions.get('window').width;
export default class Home extends Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
          <Header
            backIcon={require('../images/menu.png')}  
            pageTitle="Feedback"
            back={() => {
              this.props.navigation.openDrawer()
            }}
            // iconName={require('../images/bell.png')}  
            // press={() => 
            //   this.props.navigation.navigate('Notification')
            // }   
        />
         <StatusBar hidden={false}/>
    
        <ScrollView>
   
        <View style={{ flex: 1, backgroundColor:Colors.whites,paddingHorizontal:20 }}>
        
          <Image
                  style={{}}
                  resizeMode="contain"
                  source={require('../images/splash.png')}
                  style={{ width: width * 0.6, height: width * 0.5,alignSelf:'center'}}
                />
            <View style={{paddingVertical:10}}></View>

                      <LabelTextInput 
                        label="Title:" 
                        placeholder="Enter Vehicle Number" />
                   
                      <LabelTextInput 
                        multiline={true}
                        label="Massage: " 
                        placeholder="Enter Phone Number" />
            

            <View style={{paddingVertical:20}}></View>
         

                      <TouchableOpacity 
                          onPress ={ () => this.props.navigation.goBack()} 
                          activeOpacity={0.8} 
                          style={{borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                           height: 45, marginHorizontal:15 , backgroundColor: Colors.primary, elevation: 2, marginTop: 20, }}>
                      <Text style={{ fontFamily:Fonts.bold,fontSize:16 ,color:Colors.white}}>Submit</Text>
                  </TouchableOpacity>
        
                  </View>
        </ScrollView>
       </SafeAreaView>
    )
  };
}
const styles = StyleSheet.create({
  Box:{  
          flexDirection: 'row',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 11,
          },
           margin:10,
          shadowOpacity: 0.55,
          shadowRadius: 14.78,
           alignSelf:'center',
          elevation: 22,backgroundColor:'white',
          height:200,
          width:330,

        },
        Font:{
          fontFamily:Fonts.bold,
          left:10,
          bottom:20,position:'absolute'
        },
        FontRight:{
          fontFamily:Fonts.medium,color:Colors.dark_gray,
           left:88,
          bottom:20,position:'absolute'
        },
  
      })