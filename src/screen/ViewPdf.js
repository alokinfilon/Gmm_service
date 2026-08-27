import React from 'react';
import { StyleSheet, Dimensions, View, SafeAreaView, TouchableOpacity,Text } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../common/Colors";
import { StackActions, NavigationActions } from "react-navigation";
import Toast from 'react-native-simple-toast';

import Fonts from '../common/Fonts';
import Pdf from 'react-native-pdf';
import BackHeader from '../components/BackHeader';
import API from '../common/API';
import timeout from '../common/Timeout';
import Loader from '../common/Loader';
export default class ViewPdf extends React.Component {


    render() {
        const source = { uri: this.props.navigation.state.params.pdf, cache: false };

      
        

        return (
            <SafeAreaView style={styles.safeareaview}>
                   <BackHeader
          backIcon={require('../images/Left_arrow.png')}
          pageTitle="View Pdf"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
                <View style={{flex:1, backgroundColor: Colors.white}}>
                <View
                        style={{
                            height: 50,
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: Colors.colorPrimary
                        }}>
                        <View style={{ width: '35%' }}>
                            <TouchableOpacity style={{ width: 50}} onPress={() => this.props.navigation.goBack()}>
                                <Icon name="angle-left" size={40} style={{ color: 'white', padding: 6, paddingLeft: 6,marginLeft:6 }} ></Icon>
                            </TouchableOpacity>
                        </View>
                        <Text style={{
                            color: Colors.white,
                            fontFamily: Fonts.medium,
                            fontSize: 18
                        }}>Pdf Viewer</Text>
                    </View>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                        Toast.show(
                            "File not loaded. Please try after sometime",
                            Toast.SHORT,
                            
                        );
                    }}
                    style={styles.pdf} />
                    </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeareaview: {
        flex: 1,
       
        backgroundColor: Colors.colorPrimary
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    }
});
