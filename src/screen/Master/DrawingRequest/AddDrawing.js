import React, {Component} from 'react';

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
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {Dropdown} from 'react-native-material-dropdown';
import Toast from 'react-native-simple-toast';
import {StackActions, NavigationActions} from 'react-navigation';
import UserModal from '../../../common/UserModal2';
import AsyncStorage from '@react-native-community/async-storage';
import * as NetInfo from '@react-native-community/netinfo';
import timeout from '../../../common/Timeout';
import Colors from '../../../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import API from '../../../common/API';
import Fonts from '../../../common/Fonts';
import BackHeader from '../../../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import Loader from '../../../common/Loader';
var TempData = []
export default class DrawingRequestEdit extends Component {
    constructor(props) {
        TempData = []
        super(props);
        this.state = {
            isLoading: true,
            loading: true,
            dataMass: false,
            docName: 'Choose file',
            dataSource: {},
            docbase64: '',
            file: '',
            Type: '',
            SelectFile: '',
            mvisible: false,

            modalVisible: false,
            sono: [],
            sonoName: '',
            sonoId: '',

            selectedItem: '',
            sort_direction: 'DESC',
            name: '',
            description: '',

            drgType: [],
            drgTypeName: '',
            drgTypeId: '',
            checkVisible: false,
            msg: "",
        };
    }





    componentDidMount() {

        this.drg_get_data()

    }

    componentWillUnmount() {
        AsyncStorage.setItem('removeDigi', "0");
    }


    drg_get_data = () => {


        AsyncStorage.getItem('id').then(id => {
            AsyncStorage.getItem('token').then(token => {
                AsyncStorage.getItem('branch_id').then(branch_id => {
                    var Request = {
                        token: token,
                        id: id,
                    };
                    console.log(API.drg_get_data);
                    console.log('Request', JSON.stringify(Request));
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            timeout(
                                15000,
                                fetch(API.drg_get_data, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(Request),
                                })
                                    .then(res => {
                                        if (res.status == 200) {

                                            res.json().then(res => {

                                                if (res.status == "success") {
                                                    console.log('drg_get_data ', res);
                                                    this.setState({
                                                        loading: false,
                                                        drgType: res.dropdown,
                                                        sono: res.calls,
                                                        loading1: false,
                                                    });
                                                } else if (res.status == 'failed') {

                                                    this.setState({loading: false, loading1: false});
                                                    AsyncStorage.removeItem('id');
                                                    AsyncStorage.removeItem('username');
                                                    AsyncStorage.removeItem('name');
                                                    AsyncStorage.removeItem('email');
                                                    AsyncStorage.removeItem('branch_id');
                                                    AsyncStorage.removeItem('type_id');
                                                    AsyncStorage.removeItem('digit_password');
                                                    AsyncStorage.removeItem('password');
                                                    AsyncStorage.removeItem('customer_master');
                                                    AsyncStorage.removeItem('join_call');
                                                    AsyncStorage.setItem('removeDigi', "0")
                                                    const resetAction = StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate({routeName: 'Login'}),
                                                        ],
                                                    });
                                                    this.props.navigation.dispatch(resetAction);
                                                } else {
                                                    this.setState({
                                                        loading: false,
                                                        loading1: false,
                                                        message: res.message,
                                                    });
                                                    setTimeout(() => {
                                                        Toast.show(res.message, Toast.SHORT, );
                                                    }, 50);
                                                }
                                            });
                                        } else {
                                            AsyncStorage.removeItem('id');
                                            AsyncStorage.removeItem('username');
                                            AsyncStorage.removeItem('password');
                                            this.setState({loading: false, loading1: false, });

                                            const resetAction = StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({routeName: "Login"})
                                                ]
                                            });
                                            this.props.navigation.dispatch(resetAction);

                                        }
                                    })
                                    .catch(e => {
                                        NetInfo.fetch().then(state => {
                                            if (!state.isConnected) {
                                                Toast.show(
                                                    'Please Check your internet connection',
                                                    Toast.SHORT,
                                                    
                                                );
                                                this.props.navigation.goBack();
                                            } else {
                                                this.setState({loading: false, loading1: false});
                                                console.log(e);
                                                Toast.show(
                                                    'Something went wrong...',
                                                    Toast.SHORT,
                                                    
                                                );

                                            }
                                        })

                                    }),
                            ).catch(e => {
                                console.log(e);
                                this.setState({loading: false, loading1: false});
                                Toast.show(
                                    'Please Check your internet connection',
                                    Toast.SHORT,
                                    
                                );
                            });
                        } else {
                            this.setState({loading: false, loading1: false});
                            Toast.show(
                                'Please Check your internet connection',
                                Toast.SHORT,
                                
                            );
                            this.props.navigation.goBack();
                        }

                    });
                });
            });
        });
    };


    DrawingRequestUpdate = () => {
        if (this.state.file == '') {
            Toast.show('Select File', Toast.SHORT, );
          }
           else {
        this.setState({loading: true, submit2: true});

        AsyncStorage.getItem('id').then(id => {
            AsyncStorage.getItem('token').then(token => {
                AsyncStorage.getItem('branch_id').then(branch_id => {
                    // var Request = {
                    //   token: token,
                    //   id: id,
                    //   branch_id:branch_id,
                    //   Drawing_id: this.props.navigation.state.params.item.id,
                    //   file:RNFetchBlob.wrap(this.state.docbase64),
                    //   name:this.state.namem,
                    //   description:this.state.description
                    // };

                    let formdata = new FormData()

                    formdata.append("token", token)
                    formdata.append("id", id)
                    formdata.append("type", this.state.drgTypeId)
                    formdata.append("so", this.state.sonoId)
                    formdata.append("file1", this.state.file)

                    console.log('form', formdata);
                    console.log('Request', JSON.stringify(formdata));
                    console.log('Api', API.drg_data_uploads_file);
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            timeout(
                                15000,
                                fetch(API.drg_data_uploads_file, {
                                    method: 'POST',
                                    headers: {
                                        //        'application':'x-www-form-urlencoded'
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    body: formdata
                                })
                                    .then(res => {
                                        if (res.status == 200) {
                                            console.log(res);
                                            this.setState({loading: false, loading1: false});
                                            res.json().then(res => {
                                                console.log(
                                                    'drg_data_uploads_file:::  ',
                                                    res,
                                                );

                                                if (res.status == 'success') {

                                                    setTimeout(() => {
                                                        Toast.show(
                                                            res.message,
                                                            Toast.SHORT,
                                                            
                                                        );
                                                    }, 50);
                                                    this.props.navigation.goBack();
                                                    this.setState({loading: false, loading1: false, checkVisible: false,file:''});
                                                } else if (res.status == 'failed') {
                                                    AsyncStorage.removeItem('id');
                                                    AsyncStorage.removeItem('username');
                                                    AsyncStorage.removeItem('name');
                                                    AsyncStorage.removeItem('email');
                                                    AsyncStorage.removeItem('branch_id');
                                                    AsyncStorage.removeItem('type_id');
                                                    AsyncStorage.removeItem('digit_password');
                                                    AsyncStorage.removeItem('password');
                                                    AsyncStorage.removeItem('customer_master');
                                                    AsyncStorage.removeItem('join_call');
                                                    AsyncStorage.setItem('removeDigi', "0")
                                                    const resetAction = StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate({routeName: 'Login'}),
                                                        ],
                                                    });
                                                    this.props.navigation.dispatch(resetAction);
                                                    this.setState({loading: false, loading1: false, submit2: false});
                                                } else {
                                                    this.setState({
                                                        loading: false,
                                                        loading1: false,
                                                        submit2: false,
                                                        message: res.message,
                                                    });
                                                    setTimeout(() => {
                                                        Toast.show(
                                                            res.message,
                                                            Toast.SHORT,
                                                            
                                                        );
                                                    }, 50);
                                                }
                                            });
                                        } else {
                                            AsyncStorage.removeItem('id');
                                            AsyncStorage.removeItem('username');
                                            AsyncStorage.removeItem('password');


                                            const resetAction = StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({routeName: "Login"})
                                                ]
                                            });
                                            this.props.navigation.dispatch(resetAction);
                                            this.setState({loading: false, loading1: false, submit2: false});

                                        }
                                    })
                                    .catch(e => {
                                        this.setState({loading: false, loading1: false, submit2: false});
                                        console.log(e);
                                        Toast.show(
                                            'Something went wrong...',
                                            Toast.SHORT,
                                            
                                        );
                                    }),
                            ).catch(e => {
                                console.log(e);
                                this.setState({loading: false, loading1: false, submit2: false});
                                Toast.show(
                                    'Please Check your internet connection',
                                    Toast.SHORT,
                                    
                                );
                            });
                        } else {
                            this.setState({loading: false, loading1: false, submit2: false});
                            Toast.show(
                                'Please Check your internet connection',
                                Toast.SHORT,
                                
                            );
                        }
                    });
                });
            });
        });
    }
    };



    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }



    async upload() {
        AsyncStorage.setItem('removeDigi', "1");
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],

            });
            //Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);

            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);


            this.setState({file: res}, () => {
                console.log('res  res', res);
            })
            let path =
                Platform.OS === 'ios'
                    ? decodeURI(res.uri.replace('file://', ''))
                    : decodeURI(res.uri);
            var tp = mime.lookup(path);
            console.log(tp);

            RNFetchBlob.fs.readFile(path, 'base64').then(encoded => {

                // console.log('encoded', encoded);
                this.setState({docbase64: encoded});
                setTimeout(() => {
                    AsyncStorage.setItem('removeDigi', "0")
                }, 500);
                this.setState({docName: res.name, type: tp}), () => {
                    // console.log('encoded', encoded);

                };
                // Android
            });
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                setTimeout(() => {
                    Toast.show('Canceled by user..!', Toast.SHORT, );
                }, 50);
            } else {
                //For Unknown Error
                setTimeout(() => {
                    Toast.show(JSON.stringify(err), Toast.SHORT, );
                }, 50);
                this.refs.toastWithStyle.show(JSON.stringify(err), 1500);

                throw err;
            }
        }

        //   DocumentPicker.show({
        //       filetype: [DocumentPickerUtil.images(),
        //                  DocumentPickerUtil.pdf()],
        //     },(error,res) => {
        //       if(res){

        //         console.log(res);
        //         let path = (Platform.OS === 'ios')
        //          ? decodeURI(res.uri.replace('file://', ''))
        //          : decodeURI(res.uri)
        // var tp = mime.lookup(path);
        //      RNFetchBlob.fs.readFile(path, 'base64')
        //     .then((encoded) => {
        //         this.setState({docbase64: encoded})
        //         this.setState({docName: res.fileName, typea: tp});
        //         // Android

        //     })

        //       } else {
        //         //this.refs.toastWithStyle.show("Something went wrong..Please try again..", 1500);
        //       }

        //     });
    }



    checkbtn = () => {
        AsyncStorage.getItem('id').then(id => {
            AsyncStorage.getItem('token').then(token => {
                AsyncStorage.getItem('branch_id').then(branch_id => {
                    var Request = {
                        token: token,
                        id: id,
                        type: this.state.drgTypeId,
                        so: this.state.sonoName,
                    };
                    console.log(API.drg_data_check);
                    console.log('Request', JSON.stringify(Request));
                    NetInfo.fetch().then(state => {
                        if (state.isConnected) {
                            timeout(
                                15000,
                                fetch(API.drg_data_check, {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(Request),
                                })
                                    .then(res => {
                                        if (res.status == 200) {

                                            res.json().then(res => {

                                                if (res.status == "success") {
                                                    console.log('drg_data_check ', res);
                                                    this.setState({
                                                        loading: false,
                                                        loading1: false,
                                                    }, () => {
                                                        if (res.view == 1) {
                                                            this.setState({msg: res.message, checkVisible: false})
                                                        } else {
                                                            this.setState({msg: res.message, checkVisible: true})
                                                        }
                                                    });

                                                } else if (res.status == 'failed') {

                                                    this.setState({loading: false, loading1: false});
                                                    AsyncStorage.removeItem('id');
                                                    AsyncStorage.removeItem('username');
                                                    AsyncStorage.removeItem('name');
                                                    AsyncStorage.removeItem('email');
                                                    AsyncStorage.removeItem('branch_id');
                                                    AsyncStorage.removeItem('type_id');
                                                    AsyncStorage.removeItem('digit_password');
                                                    AsyncStorage.removeItem('password');
                                                    AsyncStorage.removeItem('customer_master');
                                                    AsyncStorage.removeItem('join_call');
                                                    AsyncStorage.setItem('removeDigi', "0")
                                                    const resetAction = StackActions.reset({
                                                        index: 0,
                                                        actions: [
                                                            NavigationActions.navigate({routeName: 'Login'}),
                                                        ],
                                                    });
                                                    this.props.navigation.dispatch(resetAction);
                                                } else {
                                                    this.setState({
                                                        loading: false,
                                                        loading1: false,
                                                        message: res.message,
                                                    });
                                                    setTimeout(() => {
                                                        Toast.show(res.message, Toast.SHORT, );
                                                    }, 50);
                                                }
                                            });
                                        } else {
                                            AsyncStorage.removeItem('id');
                                            AsyncStorage.removeItem('username');
                                            AsyncStorage.removeItem('password');
                                            this.setState({loading: false, loading1: false, });

                                            const resetAction = StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({routeName: "Login"})
                                                ]
                                            });
                                            this.props.navigation.dispatch(resetAction);

                                        }
                                    })
                                    .catch(e => {
                                        NetInfo.fetch().then(state => {
                                            if (!state.isConnected) {
                                                Toast.show(
                                                    'Please Check your internet connection',
                                                    Toast.SHORT,
                                                    
                                                );
                                                this.props.navigation.goBack();
                                            } else {
                                                this.setState({loading: false, loading1: false});
                                                console.log(e);
                                                Toast.show(
                                                    'Something went wrong...',
                                                    Toast.SHORT,
                                                    
                                                );

                                            }
                                        })

                                    }),
                            ).catch(e => {
                                console.log(e);
                                this.setState({loading: false, loading1: false});
                                Toast.show(
                                    'Please Check your internet connection',
                                    Toast.SHORT,
                                    
                                );
                            });
                        } else {
                            this.setState({loading: false, loading1: false});
                            Toast.show(
                                'Please Check your internet connection',
                                Toast.SHORT,
                                
                            );
                            this.props.navigation.goBack();
                        }

                    });
                });
            });
        });
    }


    _handleDrawer = () => {
        this.props.navigation.openDrawer();
    };

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 0,
                    width: '100%',
                    backgroundColor: Colors.white,
                }}
            />
        );
    };

    render() {
        const {navigate} = this.props.navigation;

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: Colors.primary}}>
                <StatusBar
                    hidden={false}
                    barStyle="dark-content"
                    backgroundColor={Colors.primary}
                />
                <BackHeader
                    backIcon={require('../../../images/Left_arrow.png')}
                    pageTitle="Add Drawing File"
                    back={() => {
                        this.props.navigation.goBack();
                    }}
                />
                <Loader loading={this.state.loading} />
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : null}
                        style={{flex: 1, backgroundColor: Colors.white}}>

                        <ScrollView style={{paddingHorizontal: 10, paddingVertical: 10, }}>


                            <View
                                style={{
                                    flex: 1,
                                    marginBottom: 10,
                                    flexDirection: 'column',
                                    backgroundColor: Colors.white,
                                    borderWidth: 1,
                                    paddingBottom: 10,
                                    borderTopLeftRadius: 5,
                                    paddingHorizontal: 10,
                                    // borderLeftWidth: 6,
                                    // borderLeftColor: Colors.medium_gray,
                                    borderBottomLeftRadius: 5,
                                    borderColor: Colors.light_gray,
                                    shadowOffset: {width: 0, height: 5},
                                    shadowColor: Colors.medium_gray,
                                    shadowOpacity: 0.8,
                                    elevation: 3,
                                }}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        width: width * 0.95,
                                        overflow: 'hidden',
                                    }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            paddingBottom: 8,
                                        }}>

                                        <View style={styles.textInputView}>

                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={styles.labela}>Drg Type</Text>

                                                <Text style={styles.required}>*</Text>
                                            </View>

                                            <View
                                                style={{
                                                    paddingHorizontal: 10,
                                                    height: 42,
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-start',
                                                    backgroundColor: Colors.white,
                                                    borderWidth: 1,
                                                    width: '90%',
                                                    borderRadius: 4,

                                                    borderColor: Colors.medium_gray,
                                                }}>
                                                <View>
                                                    <Dropdown
                                                        containerStyle={{
                                                            width: width * 0.8,

                                                            alignSelf: 'flex-start',
                                                            paddingBottom: 15,
                                                        }}
                                                        inputContainerStyle={{ borderBottomColor: 'transparent'}}
                                                        fontSize={15}
                                                        itemTextStyle={{fontFamily: Fonts.regular, color: Colors.primary}}
                                                        itemColor={Colors.black}
                                                        fontFamily={Fonts.regular}
                                                        selectedItemColor={Colors.black}
                                                        
                                                        // valueExtractor={({id}) => id}
                                                        // labelExtractor={({name}) => name}
                                                        textColor={this.state.drgTypeName ? Colors.black : Colors.dark_gray}
                                                        value={this.state.drgTypeName ? this.state.drgTypeName : 'Select Drg Type'}
                                                        onChangeText={value => {
                                                            console.log(value,);
                                                            for (let i = 0; i < this.state.drgType.length; i++) {
                                                                if (value == this.state.drgType[i].value) {
                                                                    this.setState({drgTypeName: value, drgTypeId: this.state.drgType[i].id}, () => {
                                                                        if(this.state.sonoName){
                                                                            return false
                                                                        }else{
                                                                            this.checkbtn()
                                                                        }
                                                                    });
                                                                }

                                                            }
                                                        }}
                                                        data={this.state.drgType}
                                                    />
                                                </View>
                                            </View>
                                        </View>



                                        <View style={styles.textInputView}>

                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={styles.labela}>SO No.</Text>

                                                <Text style={styles.required}>*</Text>
                                            </View>

                                            <View
                                                style={{
                                                    paddingHorizontal: 10,
                                                    height: 42,
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-start',
                                                    backgroundColor: Colors.white,
                                                    borderWidth: 1,
                                                    width: '90%',
                                                    borderRadius: 4,

                                                    borderColor: Colors.medium_gray,
                                                }}>
                                                <View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.onShowVendor()
                                                        }}
                                                        style={{
                                                            width: width * 0.8,

                                                            justifyContent: 'center',
                                                            alignItems: 'flex-start',
                                                        }}>
                                                        <Text style={{color:this.state.drgTypeName ? Colors.black : Colors.dark_gray,fontFamily:Fonts.regular}}>{this.state.sonoName ? this.state.sonoName : 'Select SO No'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>





                                        <View>

                                            <Text style={styles.labela}>Upload File <Text style={styles.required}>*</Text></Text>

                                            <TouchableOpacity
                                                style={{
                                                    width: '90%',
                                                    borderRadius: 4,
                                                    borderColor: Colors.medium_gray,
                                                    borderWidth: 1,
                                                    marginHorizontal: 0,
                                                }}
                                                onPress={() => this.upload()}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: Colors.primary,
                                                            fontSize: 16,
                                                            fontFamily: Fonts.medium,
                                                            flex: 1,
                                                            padding: 10,
                                                        }}>
                                                        {this.state.docName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>


                                        </View>



                                        <UserModal
                                            visible={this.state.mvisible}
                                            onSelect={this.onSelectVendor}
                                            onCancel={this.onCancelVendor}
                                            options={this.state.sono}
                                            navigation={this.state.navigation}
                                        />

                                    </View>

                                </View>
                            </View>
                            {this.state.checkVisible ? null : 
                                <Text
                                    style={{
                                        fontSize: 18,
                                        textAlign:'left',
                                        paddingHorizontal:2,
                                        color: Colors.red,
                                        fontFamily: Fonts.bold,
                                    }}>{this.state.msg}</Text>
                            }

                            <TouchableOpacity
                                activeOpacity={this.state.checkVisible ? 0.4 : 1}
                                style={styles.btn} onPress={() => {
                                    this.state.checkVisible ? this.DrawingRequestUpdate() : null
                                }}>
                                <View style={{
                                    backgroundColor: this.state.checkVisible ? undefined : "rgba(255, 255, 255, 0.6)", width: width * 0.8,
                                    height: width * 0.12,
                                    alignItems: 'center',
                                    //  borderWidth:1,
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}>

                                    <ImageBackground
                                        resizeMode="contain"
                                        style={{height: 40, width: 40, marginRight: 10, alignItems: 'center', justifyContent: 'center', }}
                                        source={require('../../../images/fill.png')}>
                                        <Image style={{height: 30, width: 30, tintColor: Colors.primary}} source={require('../../../images/tick.png')} />
                                    </ImageBackground>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: Colors.white,
                                                fontFamily: Fonts.medium,
                                            }}>

                                            Update
                      </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>



                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        );
    }
    onShowVendor = () => {
        this.setState({mvisible: true});
    };
    onSelectVendor = (id, name) => {
        console.log(id, name);

        this.setState({
            sonoName: name,
            sonoId: id,
            mvisible: false,
        }, () => {
            this.checkbtn()
        });
    };
    onCancelVendor = () => {
        this.setState({
            mvisible: false,
        });
    };
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,


        backgroundColor: '#f1f1f1',
    },
    btn: {
        paddingVertical: 5,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
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
    required: {
        marginTop: 15,
        color: 'red',
        fontSize: 14,
        paddingLeft: 3,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    },
    textInput: {
        marginTop: 2,
        paddingVertical: Platform.OS == 'ios' ? 6 : 6,
        fontSize: 16,
        flex: 1,
        fontFamily: Fonts.medium,
        paddingHorizontal: 5,
    },
    label: {
        padding: 2,
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.dark_gray,
        width: width * 0.3,
        paddingLeft: 15,
    },
    value: {
        padding: 2,
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.primary,
    },
    RightAbsoluteButton: {
        overflow: 'hidden',
        width: 120,
        height: 60,
        position: 'absolute',
        bottom: -3,
        alignSelf: 'center',
        right: -45,
        borderTopLeftRadius: 120,
        borderBottomRightRadius: 120,
        backgroundColor: Colors.primary,
    },
    absoluteView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 30,
        backgroundColor: 'transparent',
    },
    whiteImage: {
        tintColor: Colors.white,
        alignSelf: 'center',
        height: 30,
        width: 30,
    },
    rowItem: {flex: 1, flexDirection: 'row', paddingVertical: 2},
    labela: {
        marginTop: 15,
        color: Colors.primary,
        fontSize: 14,
        paddingVertical: 3,
        fontFamily: Fonts.medium,
    }, textInputView: {
        flexDirection: 'column',
    },
    btn: {
        alignSelf: 'center',
        flexDirection: 'row',
        width: width * 0.8,
        height: width * 0.12,
        alignItems: 'center',
        //  borderWidth:1,
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginVertical: 30,
    },
});
