import React, {Component} from "react";

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput
} from "react-native";
var width = Dimensions.get("window").width;
import Colors from "../common/Colors";
const height = Dimensions.get('window').height;
import RadioButton from '../components/RadioButton';
import Icon from 'react-native-vector-icons/FontAwesome';

import HexagonGray from '../components/HexagonPrimary';
import Header from "../components/Header";
import Fonts from "../common/Fonts";

export default class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataMass: false,
      dataSource: [
        {call_id: "98989", company_name: "GMM", date: "4/09/2019"},
        {call_id: "69696", company_name: "GMM", date: "6/9/2019"},
        // {call_id: "4565", company_name: "GMM", date: "8/09/2019"}
      ],
      modalVisible: false,
      radioItems: [
        {
          label: 'Date',
          selected: false,
        },

        {
          label: 'Capacity',
          selected: false,
        },

        {
          label: 'Material',
          selected: false,
        },
        {
          label: 'O.D',
          selected: false,
        },
      ],
      selectedItem: '',
      sort_direction: 'DESC',

    };
  }

  componentDidMount() {
    this.state.radioItems.map(item => {
      if (item.selected == true) {
        this.setState({selectedItem: item.label});
      }
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  changeActiveRadioButton(index) {
    this.state.radioItems.map(item => {
      item.selected = false;
    });

    this.state.radioItems[index].selected = true;

    this.setState({radioItems: this.state.radioItems}, () => {
      this.setState({selectedItem: this.state.radioItems[index].label});
    });
  }

  sortByDirection = () => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'column'}}
        onPress={() => {
          if (this.state.sort_direction == 'ASC') {
            this.setState({
              sort_direction: 'DESC',
            });
          } else {
            this.setState({
              sort_direction: 'ASC',
            });
          }
        }}>
        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == 'DESC'
                ? Colors.dark_gray
                : Colors.primary,
            right: 10,
          }}
          source={require('../images/up.png')}
        />

        <Image
          style={{
            height: 10,
            width: 10,
            tintColor:
              this.state.sort_direction == 'DESC'
                ? Colors.primary
                : Colors.dark_gray,
            right: 10,
          }}
          source={require('../images/down.png')}
        />
      </TouchableOpacity>
    );
  };

  renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: Platform.OS == 'ios' ? 60 : 60,
          paddingTop: Platform.OS == 'ios' ? 0 : 0,
          backgroundColor: '#F6F6F6',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: Colors.white,
            width: '100%',
            flex: 1,
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Icon
              name="search"
              size={20}
              color={Colors.primary}
              style={{
                height: 25,
                width: 35,
                paddingLeft: 10,
                alignSelf: 'center',
              }}
            />
            <TextInput
              ref="searchText"
              style={styles.textInput}
              placeholder="Search"
              returnKeyType="search"
              onChangeText={search => this.setState({search})}
              underlineColorAndroid="transparent"
            />

            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(true);
              }}
              style={{alignSelf: 'center', right: 2}}>
              <Icon
                name="filter"
                size={20}
                color={Colors.primary}
                style={{
                  marginTop: 2,
                  height: 25,
                  width: 35,
                }}
              />
            </TouchableOpacity>

            {this.sortByDirection()}
          </View>
        </View>
      </View>
    );
  };


  _handleDrawer = () => {

    this.props.navigation.openDrawer();
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "100%",
          backgroundColor: Colors.white
        }}
      />
    );
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <Header
          backIcon={require('../images/menu.png')}
          pageTitle="Reports"
          back={() => {
            this._handleDrawer();
          }}
         
        />
         <View style={styles.container}>
      
         <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
<Text style={{fontFamily: Fonts.medium, color: Colors.regular, fontSize:16 }}>Coming Soon</Text>
</View>

        {/* <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.dataSource}
          ListHeaderComponent={this.renderHeader()}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item}) => (
            <View
              style={{
                flex: 1,
                marginBottom:10,
                flexDirection: "column",
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderTopLeftRadius: 5,
                borderLeftWidth: 6,
                borderLeftColor: Colors.medium_gray,
                borderBottomLeftRadius: 5,
                borderColor: Colors.light_gray,
                shadowOffset: {width: 0, height: 5},
                shadowColor: Colors.medium_gray,
                shadowOpacity: 0.8,
              }}
            >
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Test1')}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: width * 0.95,
                  overflow: "hidden"
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    paddingBottom: 8
                  }}>
                    <Text
                      style={{
                        margin: 5,
                        fontSize: 14,
                        fontFamily: Fonts.bold,
                        color: Colors.primary,
                        paddingLeft: 5,
                        paddingVertical: 8
                      }}>
                      Sr. No. {item.call_id}
                    </Text>
                    <View style={{flex: 1, flexDirection: "row"}}>
                      <Text
                        style={{
                          padding: 2,
                          fontSize: 14,
                          color: Colors.dark_gray,
                          width: width * 0.3,
                          paddingLeft: 15
                        }}>
                        Company
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 15,
                            fontFamily: Fonts.bold,
                            color: Colors.primary
                          }}>
                          {item.company_name}
                        </Text>
                      </View>
                    </View>
                    <View style={{flex: 1, flexDirection: "row"}}>
                      <Text
                        style={{
                          padding: 2,
                          fontSize: 14,
                          color: Colors.dark_gray,
                          width: width * 0.3,
                          paddingLeft: 15
                        }}>
                        Date
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 14,
                            color: Colors.primary
                          }}>
                          {item.date}
                        </Text>
                      </View>
                    </View>

                    <View style={{flex: 1, flexDirection: "row"}}>
                      <Text
                        style={{
                          padding: 2,
                          fontSize: 14,
                          color: Colors.dark_gray,
                          width: width * 0.3,
                          paddingLeft: 15
                        }}>
                        Date
                      </Text>
                      <View style={{flex: 1, flexDirection: "column"}}>
                        <Text
                          style={{
                            padding: 2,
                            fontSize: 14,
                            color: Colors.primary
                          }}>
                          {item.date}
                        </Text>
                      </View>
                      
                    </View>

                </View>

                <View
            style={{zIndex: 1, bottom: -40,right:-80, position: 'absolute', opacity:0.5}}>
            <HexagonGray />
          
          </View>
      
              </View>
                </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      */}
   

      </View>

      <Modal
          ref={'updateModal'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          visible={this.state.modalVisible}
          position="bottom"
          animationType={'fade'}
          backdrop={true}
          coverScreen={true}
          backdropPressToClose={true}
          backdropOpacity={0.5}
          transparent={true}
          swipeToClose={true}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPressOut={() => {
              this.setState({modalVisible: false});
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: '100%',
                    minHeight: '35%',
                    maxHeight: '50%',
                    backgroundColor: Colors.white,
                    borderWidth: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderColor: Colors.dark_gray,
                  }}>
                  <View style={{}}>
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        paddingVertical:10,
                      borderBottomColor: Colors.light_gray,
                      borderBottomWidth:1
                       
                      
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          
                          color: Colors.black,
                          fontFamily: Fonts.regular,
                        }}>
                        SORT BY
                      </Text>

                     
                    </View>
                    <ScrollView>
                      <TouchableOpacity style={{}}>
                        {this.state.radioItems.map((item, key) => (
                          <RadioButton
                            key={key}
                            button={item}
                            onClick={this.changeActiveRadioButton.bind(
                              this,
                              key,
                            )}
                          />
                        ))}
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    //  margin: 10,
  
    backgroundColor: "#f1f1f1"
  },
  btn: {
   
   paddingVertical:5,
    backgroundColor: Colors.primary,
    flexDirection:'row',
   width: width,
    alignItems: "center",
    justifyContent:'center'
  },
  ModalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  netAlert: {
    overflow: 'hidden',
    borderRadius: 10,
    shadowRadius: 10,
    width: width * 0.8,
    minHeight: height * 0.3,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
  netAlertContent: {
    flex: 1,
    padding: 20,
    //  marginTop:20,
  },
  netAlertTitle: {
    fontSize: 20,
    paddingTop: 20,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  netAlertDesc: {
    fontSize: 16,
    paddingTop: 10,
    alignSelf: 'center',
    width: width * 0.8,
    color: Colors.dark_gray,
    fontFamily: Fonts.light,
    paddingVertical: 5,
    textAlign: 'center',
  },
  textInput: {
    marginTop: 2,
    paddingVertical: Platform.OS == 'ios' ? 6 : 6,
    fontSize: 16,
    flex: 1,
    fontFamily: Fonts.medium,
    paddingHorizontal: 5,
  },
});
