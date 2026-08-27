import React, { Component } from 'react';

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

  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
var width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../common/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../components/CustomButton';
import HexagonGray from '../../components/HexagonPrimary';
import Header from '../../components/Header';
import Fonts from '../../common/Fonts';
import BackHeader from '../../components/BackHeader';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import DocumentPicker from 'react-native-document-picker';
import HorizontalButton from '../../components/HorizontalButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LabelTextInput from '../../components/LabelTextInput';
import CheckBox from 'react-native-check-box'
// var checked=[];
var LocalStore = [];
var index1 = 1;
import Geolocation from '@react-native-community/geolocation';
let data1 = [{ value: 'Ahmedabad' }, { value: 'Surat' }, { value: 'Rajkot' }];
const radioItems = [
  {
    value: 1,
    label: "Vessel Jacketed",
    size: 20,
    color: Colors.primary,
    selected: true,
    // value: 'm'
  },
  {
    value: 0,
    label: "Vessel Un-Jacketed",
    color: Colors.primary,
    size: 20,
    selected: false,
    // value: 'f'
  },

];
export default class CompleteWorkDetail extends Component {
  constructor(props) {
    super(props);
    // checked=[];
    LocalStore = [];
    this.state = {
      isLoading: true,
      refresh: false,
      dataMass: false,
      docName: 'Choose file',
      dataSource: [{ call_id: '98989', company_name: 'GMM', date: '4/09/2019' }],
      modalVisible: false,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      date1: new Date(),
      date2: new Date(),
      date3: new Date(),
      TempDate1: new Date(),
      TempDate2: new Date(),
      TempDate3: new Date(),
      textInputs: [],
      vesselsize: '',
      oana: '',
      vesselno: '',
      vesselToCompound: '',
      vesselTobeRemoved: '',
      ImpellerAgitator: '',
      AnchorAgitator: '',
      BOValveType: '',
      single: '',
      twin: '',
      triple: '',
      top: '',
      middle: '',
      bottom: '',
      Vesseljacketed: '1',
      VesselUNjacketed: '0',
      gearbox: '',
      motor: '',
      meachseal1: '',
      meachseal2: '',
      stuffingbox: '',
      newUnused1: '',
      newUnused2: '',
      newUnused3: '',
      newUnused4: '',
      fullGlaze1: '',
      fullGlaze2: '',
      fullGlaze3: '',
      fullGlaze4: '',
      dull1: '',
      dull2: '',
      dull3: '',
      dull4: '',
      severeetchdamage1: '',
      severeetchdamage2: '',
      severeetchdamage3: '',
      severeetchdamage4: '',
      vesselEntered: '',
      inspectedfrommanway: '',
      visual: '',
      hvtestat5000valts: '',
      runtestfor15min: '',
      instructionby: '',
      description: '',

      checkData: [
        {
          value: 0,
          id: 0,
          check: false,
          name: 'Vessel to Compound'
        },
        {
          value: 0,
          id: 2,
          check: false,
          name: 'Vessel to be removed'
        },
        {
          value: 0,
          id: 3,
          check: false,
          name: 'Impeller Agitator'
        },
        {
          value: 0,
          id: 4,
          check: false,
          name: 'Anchor Agitator'
        },
        {
          value: 0,
          id: 5,
          check: false,
          name: 'B/O Valve Type'
        },

      ],

      GlassDataDetail: [
        {
          value: 0,
          check: false,
          name: 'Vessel to Compound'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to be removed'
        },
        {
          value: 0,
          check: false,
          name: 'Impeller Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Anchor Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to Compound'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to be removed'
        },
        {
          value: 0,
          check: false,
          name: 'Impeller Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Anchor Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to Compound'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to be removed'
        },
        {
          value: 0,
          check: false,
          name: 'Impeller Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Anchor Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to Compound'
        },
        {
          value: 0,
          check: false,
          name: 'Vessel to be removed'
        },
        {
          value: 0,
          check: false,
          name: 'Impeller Agitator'
        },
        {
          value: 0,
          check: false,
          name: 'Anchor Agitator'
        },


      ],

      GlassData: [
        {
          value: 0,
          check: false,
          name: 'Vessel Entered'
        },
        {
          value: 0,
          check: false,
          name: 'Inspected from Man-way'
        },
        {
          value: 0,
          check: false,
          name: 'Visual'
        },
        {
          value: 0,
          check: false,
          name: 'HV Test at 5000 Volts'
        },
        {
          value: 0,
          check: false,
          name: 'Run Test for 15 minutes (Water trial)'
        },


      ],
      cryLock: [
        {
          value: 0,
          check: false,
          name: 'Single'
        },
        {
          value: 0,
          check: false,
          name: 'Twin'
        },
        {
          value: 0,
          check: false,
          name: 'Triple'
        },

      ],
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


    AsyncStorage.getItem("ischeckData").then(CheckValue => {
      AsyncStorage.getItem("iscryLock").then(iscryLock => {
        AsyncStorage.getItem("isradioItems").then(isradioItems => {
          AsyncStorage.getItem("isGlassDataDetail").then(GlassDataDetail => {
            AsyncStorage.getItem("isGlassData").then(isGlassData => {
              AsyncStorage.getItem("two").then(two => {
                AsyncStorage.getItem("DateArray").then(DateArray => {


                  this.setState({ refresh: !this.state.refresh })
                  if (DateArray) {
                    console.log("DateArray", moment(JSON.parse(DateArray).TempDate3).format("YYYY-MM-DD"));

                    LocalStore.push(JSON.parse(two))
                  }
                  if (two) {
                    this.setState({
                      vesselsize: LocalStore[0].vs,
                      oana: LocalStore[0].on,
                      vesselno: LocalStore[0].vn,
                      data1: LocalStore[0].do,
                      TempDate1: JSON.parse(DateArray).TempDate1,
                      data2: LocalStore[0].vio,
                      TempDate2: JSON.parse(DateArray).TempDate2,

                      top: LocalStore[0].bt1,
                      middle: LocalStore[0].bt2,
                      bottom: LocalStore[0].bt3,

                      gearbox: LocalStore[0].gb,
                      motor: LocalStore[0].m,
                      meachseal1: LocalStore[0].ms1,
                      meachseal2: LocalStore[0].ms2,
                      stuffingbox: LocalStore[0].sb,

                      instructionby: LocalStore[0].ib,
                      date3: LocalStore[0].date3,
                      TempDate3: JSON.parse(DateArray).TempDate3,

                      description: LocalStore[0].xd
                    }, () => {
                      console.log(LocalStore[0].do, 'this.stat Date', this.state.date1);

                    })
                  }

                  this.setState({ refresh: !this.state.refresh })



                  if (JSON.parse(GlassDataDetail)) {
                    this.state.GlassDataDetail[0].check = JSON.parse(GlassDataDetail)[0].check
                    this.state.GlassDataDetail[1].check = JSON.parse(GlassDataDetail)[1].check
                    this.state.GlassDataDetail[2].check = JSON.parse(GlassDataDetail)[2].check
                    this.state.GlassDataDetail[3].check = JSON.parse(GlassDataDetail)[3].check
                    this.state.GlassDataDetail[4].check = JSON.parse(GlassDataDetail)[4].check
                    this.state.GlassDataDetail[5].check = JSON.parse(GlassDataDetail)[5].check
                    this.state.GlassDataDetail[6].check = JSON.parse(GlassDataDetail)[6].check
                    this.state.GlassDataDetail[7].check = JSON.parse(GlassDataDetail)[7].check
                    this.state.GlassDataDetail[8].check = JSON.parse(GlassDataDetail)[8].check
                    this.state.GlassDataDetail[9].check = JSON.parse(GlassDataDetail)[9].check
                    this.state.GlassDataDetail[10].check = JSON.parse(GlassDataDetail)[10].check
                    this.state.GlassDataDetail[11].check = JSON.parse(GlassDataDetail)[11].check
                    this.state.GlassDataDetail[12].check = JSON.parse(GlassDataDetail)[12].check
                    this.state.GlassDataDetail[13].check = JSON.parse(GlassDataDetail)[13].check
                    this.state.GlassDataDetail[14].check = JSON.parse(GlassDataDetail)[14].check
                    this.state.GlassDataDetail[15].check = JSON.parse(GlassDataDetail)[15].check

                    this.state.GlassDataDetail[0].value = JSON.parse(GlassDataDetail)[0].value
                    this.state.GlassDataDetail[1].value = JSON.parse(GlassDataDetail)[1].value
                    this.state.GlassDataDetail[2].value = JSON.parse(GlassDataDetail)[2].value
                    this.state.GlassDataDetail[3].value = JSON.parse(GlassDataDetail)[3].value
                    this.state.GlassDataDetail[4].value = JSON.parse(GlassDataDetail)[4].value
                    this.state.GlassDataDetail[5].value = JSON.parse(GlassDataDetail)[5].value
                    this.state.GlassDataDetail[6].value = JSON.parse(GlassDataDetail)[6].value
                    this.state.GlassDataDetail[7].value = JSON.parse(GlassDataDetail)[7].value
                    this.state.GlassDataDetail[8].value = JSON.parse(GlassDataDetail)[8].value
                    this.state.GlassDataDetail[9].value = JSON.parse(GlassDataDetail)[9].value
                    this.state.GlassDataDetail[10].value = JSON.parse(GlassDataDetail)[10].value
                    this.state.GlassDataDetail[11].value = JSON.parse(GlassDataDetail)[11].value
                    this.state.GlassDataDetail[12].value = JSON.parse(GlassDataDetail)[12].value
                    this.state.GlassDataDetail[13].value = JSON.parse(GlassDataDetail)[13].value
                    this.state.GlassDataDetail[14].value = JSON.parse(GlassDataDetail)[14].value
                    this.state.GlassDataDetail[15].value = JSON.parse(GlassDataDetail)[15].value

                    this.setState({
                      newUnused1: JSON.parse(GlassDataDetail)[0].value, newUnused2: JSON.parse(GlassDataDetail)[1].value, newUnused3: JSON.parse(GlassDataDetail)[2].value, newUnused4: JSON.parse(GlassDataDetail)[3].value,
                      fullGlaze1: JSON.parse(GlassDataDetail)[4].value, fullGlaze2: JSON.parse(GlassDataDetail)[5].value, fullGlaze3: JSON.parse(GlassDataDetail)[6].value, fullGlaze4: JSON.parse(GlassDataDetail)[7].value,
                      dull1: JSON.parse(GlassDataDetail)[8].value, dull2: JSON.parse(GlassDataDetail)[9].value, dull3: JSON.parse(GlassDataDetail)[10].value, dull4: JSON.parse(GlassDataDetail)[11].value,
                      severeetchdamage1: JSON.parse(GlassDataDetail)[12].value, severeetchdamage2: JSON.parse(GlassDataDetail)[13].value, severeetchdamage3: JSON.parse(GlassDataDetail)[14].value, severeetchdamage4: JSON.parse(GlassDataDetail)[15].value,
                      refresh: !this.state.refresh

                    })
                  }

                  if (JSON.parse(isGlassData)) {
                    this.state.GlassData[0].check = JSON.parse(isGlassData)[0].check
                    this.state.GlassData[1].check = JSON.parse(isGlassData)[1].check
                    this.state.GlassData[2].check = JSON.parse(isGlassData)[2].check
                    this.state.GlassData[3].check = JSON.parse(isGlassData)[3].check
                    this.state.GlassData[4].check = JSON.parse(isGlassData)[4].check

                    this.state.GlassData[0].value = JSON.parse(isGlassData)[0].value
                    this.state.GlassData[1].value = JSON.parse(isGlassData)[1].value
                    this.state.GlassData[2].value = JSON.parse(isGlassData)[2].value
                    this.state.GlassData[3].value = JSON.parse(isGlassData)[3].value
                    this.state.GlassData[4].value = JSON.parse(isGlassData)[4].value

                    this.setState({
                      vesselEntered: JSON.parse(isGlassData)[0].value, inspectedfrommanway: JSON.parse(isGlassData)[1].value,
                      visual: JSON.parse(isGlassData)[2].value, hvtestat5000valts: JSON.parse(isGlassData)[3].value,
                      runtestfor15min: JSON.parse(isGlassData)[4].value, refresh: !this.state.refresh
                    })
                  }

                  if (JSON.parse(CheckValue)) {
                    this.state.checkData[0].check = JSON.parse(CheckValue)[0].check
                    this.state.checkData[1].check = JSON.parse(CheckValue)[1].check
                    this.state.checkData[2].check = JSON.parse(CheckValue)[2].check
                    this.state.checkData[3].check = JSON.parse(CheckValue)[3].check
                    this.state.checkData[4].check = JSON.parse(CheckValue)[4].check

                    this.state.checkData[0].value = JSON.parse(CheckValue)[0].value
                    this.state.checkData[1].value = JSON.parse(CheckValue)[1].value
                    this.state.checkData[2].value = JSON.parse(CheckValue)[2].value
                    this.state.checkData[3].value = JSON.parse(CheckValue)[3].value
                    this.state.checkData[4].value = JSON.parse(CheckValue)[4].value


                    this.setState({
                      VesselToCompound: JSON.parse(CheckValue)[0].value, VesselTobeRemoved: JSON.parse(CheckValue)[1].value,
                      ImpellerAgitator: JSON.parse(CheckValue)[2].value, AnchorAgitator: JSON.parse(CheckValue)[3].value,
                      BOValveType: JSON.parse(CheckValue)[4].value, refresh: !this.state.refresh
                    })
                  }


                  if (JSON.parse(iscryLock)) {
                    this.state.cryLock[0].check = JSON.parse(iscryLock)[0].check
                    this.state.cryLock[1].check = JSON.parse(iscryLock)[1].check
                    this.state.cryLock[2].check = JSON.parse(iscryLock)[2].check

                    this.state.cryLock[0].value = JSON.parse(iscryLock)[0].value
                    this.state.cryLock[1].value = JSON.parse(iscryLock)[1].value
                    this.state.cryLock[2].value = JSON.parse(iscryLock)[2].value


                    this.setState({
                      single: JSON.parse(iscryLock)[0].value, twin: JSON.parse(iscryLock)[1].value,
                      triple: JSON.parse(iscryLock)[2].value, refresh: !this.state.refresh
                    })

                  }
                  if (JSON.parse(isradioItems)) {
                    radioItems[0].selected = JSON.parse(isradioItems)[0].selected
                    radioItems[1].selected = JSON.parse(isradioItems)[1].selected
                    radioItems[0].value = JSON.parse(isradioItems)[0].value
                    radioItems[1].value = JSON.parse(isradioItems)[1].value
                    this.state.Vesseljacketed = JSON.parse(isradioItems)[0].value
                    this.state.VesselUNjacketed = JSON.parse(isradioItems)[1].value
                  }

                  // {
                  //   radioItems.map(item => {
                  //     if (item.selected == true) {
                  //       this.setState({ selectedItem: item.value });
                  //     }
                  //   });
                  // }

                })
              })
            })
          })
        })
      })
    })
  }




  CompleteWorkDetail_Next = () => {

    // console.log(this.state.GlassData);


    AsyncStorage.setItem("ischeckData", JSON.stringify(this.state.checkData))
    AsyncStorage.setItem("iscryLock", JSON.stringify(this.state.cryLock))
    AsyncStorage.setItem("isradioItems", JSON.stringify(radioItems))
    AsyncStorage.setItem("isGlassDataDetail", JSON.stringify(this.state.GlassDataDetail))
    AsyncStorage.setItem("isGlassData", JSON.stringify(this.state.GlassData))


    AsyncStorage.getItem('signature').then(signature => {

      if (this.state.vesselsize == '') {
        Toast.show('Please enter Vessel Size', Toast.SHORT,);
      }
      else if (this.state.oana == '') {
        Toast.show('Please enter OA No', Toast.SHORT,);
      }

      else if (this.state.vesselno == '') {
        Toast.show('Please enter Vessel No', Toast.SHORT,);
      }

      else if (this.state.date1 == '') {
        Toast.show('Please Select Dispatched On Date', Toast.SHORT,);
      }

      else if (this.state.date2 == '') {
        Toast.show('Please Select Vessel Installed On Date', Toast.SHORT,);
      }

      else if (this.state.top == '') {
        Toast.show('Please enter Top', Toast.SHORT,);
      }

      else if (this.state.middle == '') {
        Toast.show('Please enter Middle', Toast.SHORT,);
      }

      else if (this.state.bottom == '') {
        Toast.show('Please enter Bottom', Toast.SHORT,);
      }
      else if (this.state.gearbox == '') {
        Toast.show('Please enter GearBox', Toast.SHORT,);
      }
      else if (this.state.motor == '') {
        Toast.show('Please enter Motor', Toast.SHORT,);
      }

      else if (this.state.meachseal1 == '') {
        Toast.show('Please enter Meach Seal i', Toast.SHORT,);
      }

      else if (this.state.meachseal2 == '') {
        Toast.show('Please enter Meach Seal ii', Toast.SHORT,);
      }

      else if (this.state.stuffingbox == '') {
        Toast.show('Please enter Stuffing Box', Toast.SHORT,);
      }
      else if (this.state.instructionby == '') {
        Toast.show('Please enter Instruction By', Toast.SHORT,);
      }
      else if (this.state.date3 == '') {
        Toast.show('Please Select Date', Toast.SHORT,);
      }
      else if (this.state.description == '') {
        Toast.show('Please Select Description', Toast.SHORT,);
      }

      else {

        var Request = {
          vs: this.state.vesselsize,
          on: this.state.oana,
          vn: this.state.vesselno,
          do: moment(this.state.date1).format("YYYY-MM-DD"),
          vio: moment(this.state.date2).format("YYYY-MM-DD"),
          vts: this.state.VesselToCompound,
          vr: this.state.VesselTobeRemoved,
          ia: this.state.ImpellerAgitator,
          aa: this.state.AnchorAgitator,
          bvt: this.state.BOValveType,
          crylock1: this.state.single,
          crylock2: this.state.twin,
          crylock3: this.state.triple,
          bt1: this.state.top,
          bt2: this.state.middle,
          bt3: this.state.bottom,
          vj: this.state.Vesseljacketed,
          vuj: this.state.VesselUNjacketed,
          gb: this.state.gearbox,
          m: this.state.motor,
          ms1: this.state.meachseal1,
          ms2: this.state.meachseal2,
          sb: this.state.stuffingbox,
          nu1: this.state.newUnused1,
          nu2: this.state.newUnused2,
          nu3: this.state.newUnused3,
          nu4: this.state.newUnused4,
          fg1: this.state.fullGlaze1,
          fg2: this.state.fullGlaze2,
          fg3: this.state.fullGlaze3,
          fg4: this.state.fullGlaze4,
          d1: this.state.dull1,
          d2: this.state.dull2,
          d3: this.state.dull3,
          d4: this.state.dull4,
          sed1: this.state.severeetchdamage1,
          sed2: this.state.severeetchdamage2,
          sed3: this.state.severeetchdamage3,
          sed4: this.state.severeetchdamage4,
          ve: this.state.vesselEntered,
          ifmw: this.state.inspectedfrommanway,
          v: this.state.visual,
          hta5v: this.state.hvtestat5000valts,
          rtf1m: this.state.runtestfor15min,
          ib: this.state.instructionby,
          date: moment(this.state.date3).format("YYYY-MM-DD"),
          ig: signature,
          xd: this.state.description,

        }

        var isDate = {
          TempDate1: this.state.TempDate1,
          TempDate2: this.state.TempDate2,
          TempDate3: this.state.TempDate3

        }

        // console.log('Reqiest', Request);

        AsyncStorage.setItem('DateArray', JSON.stringify(isDate))
        AsyncStorage.setItem('two', JSON.stringify(Request))

        this.props.navigation.navigate('CompleteWorkDetail_Next')
      }
    })

  }






  _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });
  _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
  _showDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: true });



  _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });
  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });
  _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });


  _handleDatePicked1 = date1 => {
    this.setState({ date1: date1, TempDate1: date1 });
    this._hideDateTimePicker1();
  };
  _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });



  _handleDatePicked2 = date2 => {
    this.setState({
      date2: date2, TempDate2: date2
    });
    this._hideDateTimePicker2();
  };
  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });



  _handleDatePicked3 = date3 => {
    this.setState({
      date3: date3, TempDate3: date3
    });
    this._hideDateTimePicker3();
  };
  _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });



  _checkTitle() {
    const { date } = this.state;

    if (date > moment()) {
      return moment(date).format('DD/MM/YYYY');
    }
    return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }


  changeActiveRadioButton(index) {
    radioItems.map(item => {
      item.selected = false;
      item.value = 0
    });
    radioItems[index].selected = true;
    radioItems[index].value = 1;


    console.log(radioItems);
    this.setState({ Vesseljacketed: radioItems[0].value, VesselUNjacketed: radioItems[1].value })

    this.setState({ refresh: !this.state.refresh });

  }

  onClick(item, index) {

    this.state.checkData[index].check = !this.state.checkData[index].check

    // checked.push(this.state.checkData)

    // console.log(this.state.checkData);

    // this.state.checkData[index].value = 1 
    if (this.state.checkData[index].check == true) {
      this.state.checkData[index].value = 1
    }
    else {
      this.state.checkData[index].value = 0
    }

    this.setState({ VesselToCompound: this.state.checkData[0].value, VesselTobeRemoved: this.state.checkData[1].value, ImpellerAgitator: this.state.checkData[2].value, AnchorAgitator: this.state.checkData[3].value, BOValveType: this.state.checkData[4].value })



    // console.log(item);

    this.setState({ refresh: !this.state.refresh })



  }


  onClickCryLock(item, index) {
    this.state.cryLock[index].check = !this.state.cryLock[index].check

    if (this.state.cryLock[index].check == true) {
      this.state.cryLock[index].value = 1
    }
    else {
      this.state.cryLock[index].value = 0
    }


    this.setState({ single: this.state.cryLock[0].value, twin: this.state.cryLock[1].value, triple: this.state.cryLock[2].value })


    this.setState({ refresh: !this.state.refresh })
  }

  onClickGlass(item, index) {
    this.state.GlassDataDetail[index].check = !this.state.GlassDataDetail[index].check

    if (this.state.GlassDataDetail[index].check == true) {
      this.state.GlassDataDetail[index].value = 1
    }
    else {
      this.state.GlassDataDetail[index].value = 0
    }

    this.setState({
      newUnused1: this.state.GlassDataDetail[0].value, newUnused2: this.state.GlassDataDetail[1].value, newUnused3: this.state.GlassDataDetail[2].value, newUnused4: this.state.GlassDataDetail[3].value,
      fullGlaze1: this.state.GlassDataDetail[4].value, fullGlaze2: this.state.GlassDataDetail[5].value, fullGlaze3: this.state.GlassDataDetail[6].value, fullGlaze4: this.state.GlassDataDetail[7].value,
      dull1: this.state.GlassDataDetail[8].value, dull2: this.state.GlassDataDetail[9].value, dull3: this.state.GlassDataDetail[10].value, dull4: this.state.GlassDataDetail[11].value,
      severeetchdamage1: this.state.GlassDataDetail[12].value, severeetchdamage2: this.state.GlassDataDetail[13].value, severeetchdamage3: this.state.GlassDataDetail[14].value, severeetchdamage4: this.state.GlassDataDetail[15].value,


    })
    this.setState({ refresh: !this.state.refresh })


  }

  onClickGlassDetail(item, index) {



    this.state.GlassData[index].check = !this.state.GlassData[index].check

    if (this.state.GlassData[index].check == true) {
      this.state.GlassData[index].value = 1
    }
    else {
      this.state.GlassData[index].value = 0
    }

    this.setState({
      vesselEntered: this.state.GlassData[0].value, inspectedfrommanway: this.state.GlassData[1].value, visual: this.state.GlassData[2].value, hvtestat5000valts: this.state.GlassData[3].value,
      runtestfor15min: this.state.GlassData[4].value
    })






    this.setState({ refresh: !this.state.refresh })
  }




  renderCheckBox() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.checkData}
        extraData={this.state.refresh}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}

        renderItem={({ item, index }) => (
          <CheckBox
            rightTextStyle={{
              fontFamily: Fonts.regular,

              color: item.check ? Colors.primary : Colors.dark_gray
            }}
            style={{
              flex: 1,
              // fontSize: 16,
              paddingVertical: 15,
              alignSelf: 'center',

              backgroundColor: "transparent"
            }}
            onClick={() => this.onClick(item, index)}

            isChecked={item.check}
            checkBoxColor={item.check ? Colors.primary : Colors.dark_gray}
            rightText={item.name}
          />
        )}
        keyExtractor={(item, index) => index}
      />
    );
  }


  renderGlassDetail() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.GlassData}
        extraData={this.state.refresh}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}

        renderItem={({ item, index }) => (
          <CheckBox
            rightTextStyle={{
              fontFamily: Fonts.regular,
              color: item.check ? Colors.primary : Colors.dark_gray
            }}
            style={{
              flex: 1,
              // fontSize: 16,
              paddingVertical: 15,
              alignSelf: 'center',

              backgroundColor: "transparent"
            }}
            onClick={() => this.onClickGlassDetail(item, index)}
            isChecked={item.check}
            checkBoxColor={item.check ? Colors.primary : Colors.dark_gray}
            rightText={item.name}
          />
        )}
        keyExtractor={(item, index) => index}
      />
    );
  }


  renderGlassCondition() {
    return (
      <View>
        <View style={styles.glassContainer}>
          <View style={styles.glassTextContainer}>
            <Text style={styles.glassText}>Vessel</Text>
          </View>
          <View style={styles.glassTextContainer}>
            <Text style={styles.glassText}>Main Cover</Text>
          </View>
          <View style={styles.glassTextContainer}>
            <Text style={styles.glassText}>Agitator</Text>
          </View>
          <View style={styles.glassTextContainer}>
            <Text style={styles.glassText}>Baffle/T.P.</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column', width: width * .3 }}>
            <View style={{
              flex: 1,
              paddingVertical: 15,
              backgroundColor: "transparent"
            }}>
              <Text style={styles.glassText}>New/Unused</Text>
            </View>
            <View style={{
              flex: 1,
              paddingVertical: 15,
              backgroundColor: "transparent"
            }}>
              <Text style={styles.glassText}>Full Glaze</Text>
            </View>
            <View style={{
              flex: 1,
              paddingVertical: 15,
              backgroundColor: "transparent"
            }}>
              <Text style={styles.glassText}>Dull</Text>
            </View>
            <View style={{
              flex: 1,
              paddingVertical: 15,
              backgroundColor: "transparent"
            }}>
              <Text style={styles.glassText}>Severe Etch/ damages</Text>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.GlassDataDetail}
            extraData={this.state.refresh}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}

            renderItem={({ item, index }) => (
              <View style={{ width: width * .14, }}>
                <CheckBox
                  rightTextStyle={{
                    fontFamily: Fonts.regular,
                    color: item.check ? Colors.primary : Colors.dark_gray
                  }}
                  style={{
                    padding: 1,

                    marginVertical: 15,
                    alignSelf: 'center',

                  }}
                  onClick={() => this.onClickGlass(item, index)}
                  isChecked={item.check}
                  checkBoxColor={item.check ? Colors.primary : Colors.dark_gray}

                />
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    );
  }


  Vessel = () => {
    return (



      <View
        style={{
          flex: 1,
          marginBottom: 10,
          flexDirection: 'column',
          backgroundColor: Colors.white,
          borderWidth: 1,
          paddingBottom: 10,
          borderTopLeftRadius: 5,
          // borderLeftWidth: 6,
          // borderLeftColor: Colors.medium_gray,
          borderBottomLeftRadius: 5,
          borderColor: Colors.light_gray,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: Colors.medium_gray,
          shadowOpacity: 0.8,
          elevation: 2,
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
            <Text
              style={{

                fontSize: 16,
                backgroundColor: Colors.light_gray,
                fontFamily: Fonts.medium,
                color: Colors.primary,
                paddingLeft: 15,
                padding: 10,
              }}>
              VESSEL DESCRIPTION
            </Text>

            <View style={{ paddingHorizontal: width * 0.05 }}>



              <LabelTextInput
                label="Vessel Size"
                editable={this.state.editPage}
                placeholder="Enter Vessel Size"
                returnKeyType="next"
                value={this.state.vesselsize}
                onChangeText={vesselsize => this.setState({ vesselsize })}
              />
              <LabelTextInput
                label="OA No."
                editable={this.state.editPage}
                placeholder="Enter OA No."
                returnKeyType="next"
                keyboardType={'visible-password'}
                value={this.state.oana}
                onChangeText={oana => this.setState({ oana })}
              />
              <LabelTextInput
                label="Vessel No."
                editable={this.state.editPage}
                placeholder="Enter Vessel No."
                returnKeyType="next"
                keyboardType={'visible-password'}
                value={this.state.vesselno}
                onChangeText={vesselno => this.setState({ vesselno })}
              />


              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.labela}>Dispatched On</Text>

                <Text style={styles.required}>*</Text>
              </View>

              <TouchableOpacity
                style={{
                  padding: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 10,

                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  backgroundColor: Colors.white,
                  borderWidth: 1,

                  borderRadius: 4,
                  paddingTop: 10,
                  borderColor: Colors.medium_gray,
                }}
                onPress={() => {
                  this._showDateTimePicker1();
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: Colors.black,
                  }}>
                  {moment(this.state.TempDate1).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>

              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.labela}>Vessel Installed On</Text>

                <Text style={styles.required}>*</Text>
              </View>

              <TouchableOpacity
                style={{
                  padding: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 10,

                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  backgroundColor: Colors.white,
                  borderWidth: 1,

                  borderRadius: 4,
                  paddingTop: 10,
                  borderColor: Colors.medium_gray,
                }}
                onPress={() => {
                  this._showDateTimePicker2();
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: Colors.black,
                  }}>
                  {moment(this.state.TempDate2).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>

              {this.renderCheckBox()}


              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.labela}>Crylock</Text>


              </View>
              {this.renderCryLockCheckBox()}

              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.labela}>Blade Type</Text>
              </View>
              <LabelTextInput
                label="Top"
                editable={this.state.editPage}
                placeholder="Enter Top"
                returnKeyType="next"
                value={this.state.top}
                onChangeText={top => this.setState({ top })}
              />

              <LabelTextInput
                label="Middle"
                editable={this.state.editPage}
                placeholder="Enter Middle"
                returnKeyType="next"
                value={this.state.middle}
                onChangeText={middle => this.setState({ middle })}
              />

              <LabelTextInput
                label="Bottom"
                editable={this.state.editPage}
                placeholder="Enter Bottom"
                returnKeyType="next"
                value={this.state.bottom}
                onChangeText={bottom => this.setState({ bottom })}
              />

              <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 20 }} refresh={this.state.refresh}>
                {radioItems.map((item, key) => (

                  <RadioButton
                    key={key}
                    button={item}
                    onClick={this.changeActiveRadioButton.bind(this, key)}
                  />

                ))}
              </View>
              <LabelTextInput
                label="GEAR BOX"
                editable={this.state.editPage}
                placeholder="Enter gear box"
                returnKeyType="next"
                value={this.state.gearbox}
                onChangeText={gearbox => this.setState({ gearbox })}
              />

              <LabelTextInput
                label="MOTOR"
                editable={this.state.editPage}
                placeholder="Enter motor"
                returnKeyType="next"
                value={this.state.motor}
                onChangeText={motor => this.setState({ motor })}
              />

              <LabelTextInput
                label="MECH SEAL I"
                editable={this.state.editPage}
                placeholder="Enter Mech Seal I"
                returnKeyType="next"
                value={this.state.meachseal1}
                onChangeText={meachseal1 => this.setState({ meachseal1 })}
              />
              <LabelTextInput
                label="MECH SEAL II"
                editable={this.state.editPage}
                placeholder="Enter Mech Seal II"
                returnKeyType="next"
                value={this.state.meachseal2}
                onChangeText={meachseal2 => this.setState({ meachseal2 })}
              />
              <LabelTextInput
                label="STUFFING BOX"
                editable={this.state.editPage}
                placeholder="Enter stuffing box"
                returnKeyType="next"
                value={this.state.stuffingbox}
                onChangeText={stuffingbox => this.setState({ stuffingbox })}
              />



            </View>
          </View>
        </View>
      </View>
    )
  }




  Glass = () => {
    return (



      <View
        style={{
          flex: 1,
          marginBottom: 10,
          flexDirection: 'column',
          backgroundColor: Colors.white,
          borderWidth: 1,
          paddingBottom: 10,
          borderTopLeftRadius: 5,
          // borderLeftWidth: 6,
          // borderLeftColor: Colors.medium_gray,
          borderBottomLeftRadius: 5,
          borderColor: Colors.light_gray,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: Colors.medium_gray,
          shadowOpacity: 0.8,
          elevation: 2,
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
            <Text
              style={{

                fontSize: 16,
                backgroundColor: Colors.light_gray,
                fontFamily: Fonts.medium,
                color: Colors.primary,
                paddingLeft: 15,
                padding: 10,
              }}>
              GLASS DESCRIPTION
            </Text>

            <View style={{ paddingHorizontal: width * 0.05 }}>




              {this.renderGlassCondition()}



              {this.renderGlassDetail()}
            </View>
          </View>
        </View>
      </View>
    )
  }



  Visit = () => {
    return (



      <View
        style={{
          flex: 1,
          marginBottom: 10,
          flexDirection: 'column',
          backgroundColor: Colors.white,
          borderWidth: 1,
          paddingBottom: 10,
          borderTopLeftRadius: 5,
          // borderLeftWidth: 6,
          // borderLeftColor: Colors.medium_gray,
          borderBottomLeftRadius: 5,
          borderColor: Colors.light_gray,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: Colors.medium_gray,
          shadowOpacity: 0.8,
          elevation: 2,
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
            <Text
              style={{

                fontSize: 16,
                backgroundColor: Colors.light_gray,
                fontFamily: Fonts.medium,
                color: Colors.primary,
                paddingLeft: 15,
                padding: 10,
              }}>
              VISIT REFERENCE
            </Text>

            <View style={{ paddingHorizontal: width * 0.05 }}>



              <LabelTextInput
                label="Instruction By"
                editable={this.state.editPage}
                placeholder="Enter Instruction By"
                returnKeyType="next"
                value={this.state.instructionby}
                onChangeText={instructionby => this.setState({ instructionby })}
              />




              <View
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.labela}>Date</Text>

                <Text style={styles.required}>*</Text>
              </View>

              <TouchableOpacity
                style={{
                  padding: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 10,

                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  backgroundColor: Colors.white,
                  borderWidth: 1,

                  borderRadius: 4,
                  paddingTop: 10,
                  borderColor: Colors.medium_gray,
                }}
                onPress={() => {
                  this._showDateTimePicker3();
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.regular,
                    color: Colors.black,
                  }}>
                  {moment(this.state.TempDate3).format('DD/MM/YYYY')}
                </Text>
              </TouchableOpacity>





            </View>
          </View>
        </View>
      </View>
    )
  }

  Engineersignature = () => {
    return (



      <View
        style={{
          flex: 1,
          marginBottom: 10,
          flexDirection: 'column',
          backgroundColor: Colors.white,
          borderWidth: 1,
          paddingBottom: 10,
          borderTopLeftRadius: 5,
          // borderLeftWidth: 6,
          // borderLeftColor: Colors.medium_gray,
          borderBottomLeftRadius: 5,
          borderColor: Colors.light_gray,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: Colors.medium_gray,
          shadowOpacity: 0.8,
          elevation: 2,
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
            <Text
              style={{

                fontSize: 16,
                backgroundColor: Colors.light_gray,
                fontFamily: Fonts.medium,
                color: Colors.primary,
                paddingLeft: 15,
                padding: 10,
              }}>
              Engineer signature
            </Text>

            <View style={{ height: 25 }}></View>
            <View style={{ height: 120, backgroundColor: 'blue', }}>


              <Image
                source={{
                  uri: 'data:image/png;base64,' + this.state.Engineersignature,
                }}
                style={{ height: '100%', width: '100%', backgroundColor: 'red' }}
              />


            </View>
          </View>
        </View>
      </View>
    )
  }

  Description = () => {
    return (



      <View
        style={{
          flex: 1,
          marginBottom: 10,
          flexDirection: 'column',
          backgroundColor: Colors.white,
          borderWidth: 1,
          paddingBottom: 10,
          borderTopLeftRadius: 5,
          // borderLeftWidth: 6,
          // borderLeftColor: Colors.medium_gray,
          borderBottomLeftRadius: 5,
          borderColor: Colors.light_gray,
          shadowOffset: { width: 0, height: 5 },
          shadowColor: Colors.medium_gray,
          shadowOpacity: 0.8,
          elevation: 2,
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
            <Text
              style={{

                fontSize: 16,
                backgroundColor: Colors.light_gray,
                fontFamily: Fonts.medium,
                color: Colors.primary,
                paddingLeft: 15,
                padding: 10,
              }}>
              DESCRIPTION, RECOMMENDATION & REPAIRS CARRIED OUT
            </Text>

            <View style={{ paddingHorizontal: width * 0.05 }}>



              <LabelTextInput
                label="Description"
                editable={this.state.editPage}
                placeholder="Enter Description"
                returnKeyType="next"
                multiline={true}
                value={this.state.description}
                onChangeText={description => this.setState({ description })}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderCryLockCheckBox() {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.cryLock}
        extraData={this.state.refresh}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}

        renderItem={({ item, index }) => (
          <CheckBox
            rightTextStyle={{
              fontFamily: Fonts.regular,
              color: item.check ? Colors.primary : Colors.dark_gray
            }}
            style={{
              flex: 1,
              // fontSize: 16,
              paddingVertical: 15,
              alignSelf: 'center',

              backgroundColor: "transparent"
            }}
            onClick={() => this.onClickCryLock(item, index)}
            isChecked={item.check}
            checkBoxColor={item.check ? Colors.primary : Colors.dark_gray}
            rightText={item.name}
          />
        )}
        keyExtractor={(item, index) => index}
      />
    );
  }

  delete = index => {
    console.log(index);

    this.state.textInputs.splice(parseInt(index), 1);

    console.log(this.state.textInputs);

    this.setState({ refresh: !this.state.refresh });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor={Colors.primary}
        />
        <BackHeader
          backIcon={require('../../images/Left_arrow.png')}
          pageTitle="Service Report"
          back={() => {
            this.props.navigation.goBack();
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{ flex: 1, backgroundColor: Colors.white }}>
          <ScrollView
            style={{ flex: 1, backgroundColor: '#f1f1f1' }}
            showsVerticalScrollIndicator={false}>
            <View style={styles.container} refresh={this.state.refresh}>


              {this.Vessel()}
              {this.Glass()}
              {this.Visit()}
              {/* {this.Engineersignature()} */}
              {this.Description()}




     





              <CustomButton
                iconName={require('../../images/right.png')}
                name="Next"
                onPress={() => {

                  // this.props.navigation.navigate('CompleteWorkDetail_Next')

                  this.CompleteWorkDetail_Next()

                }}
              />


            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={{
          height: 60,
          width: 80,
          position: "absolute",
          bottom: 90, right: 25,
        }}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '80%',
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 32,
              alignSelf: 'center',

              backgroundColor: Colors.primary, elevation: 4
            }}
            onPress={() => {
              this.props.navigation.navigate('TakeVideo')
            }}
          >
            <Image style={{ height: 38, width: 38, tintColor: 'white' }}
              source={require('../../images/At.png')}></Image>

          </TouchableOpacity>
          {/* <View style={{elevation:3,backgroundColor:'white',marginTop:2}}>
          <Text style={{fontSize:12,fontFamily:Fonts.medium,padding:0.5,marginLeft:4,alignItems:'center'}}>Attachment</Text> 
          </View> */}
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible1}
          onConfirm={this._handleDatePicked1}
          onCancel={this._hideDateTimePicker1}
          mode="date"
        //  datePickerModeAndroid = 'spinner'
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible2}
          onConfirm={this._handleDatePicked2}
          onCancel={this._hideDateTimePicker2}
          mode="date"
        //  datePickerModeAndroid = 'spinner'
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible3}
          onConfirm={this._handleDatePicked3}
          onCancel={this._hideDateTimePicker3}
          mode="date"
        //  datePickerModeAndroid = 'spinner'
        />
      </SafeAreaView>
    );
  }
}



class RadioButton extends Component {
  render() {
    return (

      <TouchableOpacity
        onPress={this.props.onClick}
        activeOpacity={0.8}
        style={[
          { flexDirection: "row", flex: 1, },
          styles.radioButton
        ]}
      >
        <View
          style={[
            styles.radioButtonHolder,
            {
              flexDirection: "column",
              height: this.props.button.size,
              width: this.props.button.size,
              borderColor: this.props.button.color
            }
          ]}
        >
          {this.props.button.selected ? (
            <View
              style={[
                styles.radioIcon,
                {
                  flexDirection: "row",
                  height: this.props.button.size / 2,
                  width: this.props.button.size / 2,
                  backgroundColor: Colors.primary
                }
              ]}
            />
          ) : null}
        </View>
        <Text style={[styles.labelX, { color: this.props.button.color }]}>
          {this.props.button.label}
        </Text>
      </TouchableOpacity>
    );
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
  btn: {
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
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
  rowItem: { flex: 1, flexDirection: 'row', paddingVertical: 2 },
  labela: {
    marginTop: 15,
    color: Colors.primary,
    fontSize: 14,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },

  required: {
    marginTop: 15,
    color: 'red',
    fontSize: 14,
    paddingLeft: 3,
    paddingVertical: 3,
    fontFamily: Fonts.medium,
  },
  textInputView: {
    flexDirection: 'column',
  },
  glassContainer: {
    flex: 1, flexDirection: 'row', paddingLeft: width * .3, paddingTop: 10,
  },
  glassTextContainer: {
    width: width * .15,
    backgroundColor: "transparent"
  },
  glassText: {
    fontSize: 13,
    fontFamily: Fonts.regular
  },
  radioButton: {
    //  flexDirection: 'row',
    margin: 0
  },

  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center"
  },

  radioIcon: {
    //  flexDirection:'row',
    borderRadius: 50
  },

  labelX: {
    top: 0,
    marginLeft: 10,
    fontSize: 14
  },

});
