
import React, { Component } from 'react';

import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    ImageBackground
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-simple-toast';
import Colors from '../common/Colors';
import BackHeader from '../components/BackHeader';
import AsyncStorage from '@react-native-community/async-storage';
var isImageFLat = [];

export default class TakeVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {

            refresh: false,
            CameraModalVisible: false,

            isRecording: false,
            save: false,
            flesh: false,
            retake: true,
            modal: true,
            cambtn: true
        }
    }

    componentDidMount() {

        isImageFLat = []
        AsyncStorage.getItem('TakeImage').then(val => {
            console.log('Logic here', JSON.parse(val) ? JSON.parse(val) : 'null');

            //
            {
                JSON.parse(val) ?
                    //  isImageFLat.push([].concat.apply([], JSON.parse(val).flat()))
                    isImageFLat = JSON.parse(val)
                    // JSON.parse(val)
                    : isImageFLat = []
            }

        })
        //  console.log(isImageFLat);

        this.takePicture.bind(this)
    }

    render() {
        const { navigate } = this.props.navigation;
        return (

            <View style={{
                flex: 1,
                flexDirection: 'column'
            }}>
                <BackHeader
                    backIcon={require('../images/Left_arrow.png')}
                    pageTitle="Images/Video"
                    back={() => {
                        this.props.navigation.goBack();

                    }}
                />

                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                />

                {this.state.isRecording ?
                    <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', marginTop: 10 }}>
                        <TouchableOpacity style={{
                            height: 60, width: 60, backgroundColor: Colors.primary, justifyContent: 'center',
                            alignItems: 'center', borderRadius: 30
                        }}
                            onPress={this.stopRecord.bind(this)}
                        >
                            <ImageBackground
                                resizeMode="contain"
                                style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', }}
                                source={require('../images/fill.png')}>

                                <Image
                                    style={{ height: 32, width: 32, tintColor: Colors.primary }}
                                    source={require('../images/pause_icon.png')} />

                                {/* <Text style={styles.flipText}> stop </Text> */}

                            </ImageBackground>

                            {/* <VideoRecorder ref={(ref) => { this.videoRecorder = ref; }} /> */}


                        </TouchableOpacity>
                    </View>

                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View>
                            {this.state.cambtn ?
                                <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', marginTop: 10 }}>
                                    <TouchableOpacity style={{
                                        height: 60, width: 60, backgroundColor: Colors.primary, justifyContent: 'center',
                                        alignItems: 'center', borderRadius: 30
                                    }} onPress={this.takePicture.bind(this)}>
                                        <ImageBackground
                                            resizeMode="contain"
                                            style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', }}
                                            source={require('../images/fill.png')}>
                                            <Image style={{ height: 25, width: 25, tintColor: Colors.primary }}
                                                source={require('../images/photo-camera.png')} />
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>

                        <View >

                            <View style={{ position: 'absolute', bottom: 10, alignSelf: 'center', marginTop: 10 }}>


                                {this.state.isRecording ? null

                                    : <TouchableOpacity style={{
                                        height: 60, width: 60, backgroundColor: Colors.primary, justifyContent: 'center',
                                        alignItems: 'center', borderRadius: 30
                                    }}
                                        onPress={this.takeRecord.bind(this)}
                                    >
                                        <ImageBackground
                                            resizeMode="contain"
                                            style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center', }}
                                            source={require('../images/fill.png')}>



                                            <Image
                                                style={{ height: 36, width: 36, tintColor: Colors.primary }}
                                                source={require('../images/play_circle.png')} />

                                        </ImageBackground>

                                        {/* <VideoRecorder ref={(ref) => { this.videoRecorder = ref; }} /> */}


                                    </TouchableOpacity>}


                                {/* <TouchableOpacity 
                                        onPress={this.stopRecordingVideo}
                                        style={{height:20  , width: 20 , backgroundColor:Colors.primary}}/>  */}
                            </View>





                        </View>
                    </View>
                }

            </View>
        )
    }
    Time = () => {

        // console.log('Time',Time,'this.state.Time',this.state.Time,"Time",min+":"+sec);

        // this.setState({Time: this.state.Time + 1});
        //   var min=Math.floor(this.state.Time/60)
        //   var sec=Math.floor(this.state.Time-min*60)

        //   this.setState({showTime:min+":"+sec})
    }

    // save =() =>{
    //     this.camera.stopRecording()

    //     this.props.navigation.goBack();
    // }

    //  remuve = () =>{

    //       this.camera.resumePreview()
    //      this.setState({retake:true,recording:true})

    //  }

    takeRecord = async () => {
        if (this.camera && !this.state.recording) {

            if (this.camera) {
                this.setState({ isRecording: true, cambtn: false });
                var date = new Date();
                const options = {
                    // path: "/storage/emulated/0/DCIM/Camera/" + Math.floor(date.getTime() + date.getSeconds() / 2) + ".mp4",
                    quality: '480p',
                    maxDuration: 3600,
                maxFileSize: 100000000 * 1024 * 1024
                };
                let result = null;
                console.log('option',options);
                try {
                    result = await this.camera.recordAsync(options);

                    var video1 = result.uri
                    var name11 = video1.split('.');
                    var object = {
                        uri: result.uri, name: result.uri,
                        type: 'video/' + name11[1],
                        
                    };
                    this.setState({ cambtn: true });

                    isImageFLat.push(object)
                    AsyncStorage.setItem('TakeImage', JSON.stringify(isImageFLat))

                    // RNFetchBlob.fs
                    //     .readFile(result.uri, "base64")

                    //     .then(data => {
                    //         console.log("base64", data);
                    //         var obj = {
                    //             type: 'mp4',
                    //             videourl: result.uri,
                    //             base64: data,
                    //             visible: true
                    //         }
                    //         isImageFLat.push(obj)
                    //         AsyncStorage.setItem('TakeImage', JSON.stringify(isImageFLat))
                    //         console.log('isImageFLat', isImageFLat);
                    //     })

                }
                catch (err) {
                    console.log("VIDEO RECORD FAIL", err.message, err);

                    Toast.show(err.message.toString(), Toast.LONG, )

                }
                setTimeout(() => {
                    this.setState({ recording: false });
                }, 500);
            }

        }
    }

    stopRecord = () => {

        if (this.camera) {
            // clearInterval(Time);
            this.setState({ isRecording: false });
            this.camera.stopRecording()
            // })
            this.props.navigation.goBack();
        }
    }

    takePicture = async () => {
        this.setState({ cambtn: false })

        if (this.camera) {
            const options = { quality: 0.5 };
            const data = await this.camera.takePictureAsync(options);
            console.log("data", data);

            var imgPath = data.uri
            var nameImage = imgPath.split('.');


            var object =
            {
                uri: data.uri,
                name: nameImage[1],
                type: 'image/' + nameImage[2]
            };

            isImageFLat.push(object)

            AsyncStorage.setItem('TakeImage', JSON.stringify(isImageFLat))
            this.props.navigation.goBack();
            setTimeout(() => {
                this.setState({ cambtn: true })
                console.log(isImageFLat, 'isImageFLat');

            }, 100);


            // ImageResizer.createResizedImage(data.uri, 400, 300, 'JPEG', 100)
            //     .then(response => {
            //         RNFetchBlob.fs
            //             .readFile(response.path, "base64")
            //             .then(data => {

            //                 // console.log('data', data);
            //                 // AsyncStorage.removeItem('TakeImage')
            //                 if (this.state.modal) {

            //                     var obj = {
            //                         type: 'jpg',
            //                         base64: data,

            //                     }
            //                     isImageFLat.push(obj)

            //                     AsyncStorage.setItem('TakeImage', JSON.stringify(isImageFLat))
            //                     this.props.navigation.goBack();
            //                     setTimeout(() => {
            //                         this.setState({ cambtn: true })
            //                         console.log(isImageFLat, 'isImageFLat');

            //                     }, 100);

            //                 }

            //             })
            //             .catch(err => {
            //                 Toast.show(err.toString(), Toast.SHORT, );
            //                 this.props.navigation.goBack();
            //                 this.setState({ cambtn: true })
            //             });
            //     })

            //     .catch(err => {
            //         Toast.show(err.toString(), Toast.SHORT, );
            //         this.props.navigation.goBack();
            //         this.setState({ cambtn: true })
            //     });

        }
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 10,
        //  margin: 10,
        backgroundColor: '#f1f1f1',
    },
    ModalInsideView: {
        flexDirection: 'row',

        backgroundColor: "#fff",
        height: 140,
        width: '85%',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fff'

    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});