
import 'react-native-gesture-handler';

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Dimensions,
  YellowBox,
  Modal,
  Keyboard,
  ScrollView,
  AppState,
} from 'react-native';

const width = Dimensions.get('window').width;

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Warning: Encountered two children with the same key',
  'Warning: Each child is an array',
  'Class RCTCxxModule',
]);

import Icon from 'react-native-vector-icons/Ionicons';

import {
  createAppContainer,
} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';


import Splash from './src/screen/Splash';
import Login from './src/screen/Login';
import Home from './src/screen/Home';
import Sidebar from './src/components/Sidebar';
import Notifications from './src/screen/Notification';
import ViewAllNoti from './src/screen/ViewAllNoti';
import updaytesignature from './src/screen/CallWorks/updaytesignature';
import ChangePassword from './src/screen/ChangePassword';

import Maintenance from './src/screen/Maintenance';
import ManageLeaves from './src/screen/ManageLeaves';
import EditApproved from './src/screen/Leave/EditApproved';
import EditPending from './src/screen/Leave/EditPending';
import EditRejected from './src/screen/Leave/EditRejected';

import ViewDrawingMasterMain from './src/screen/Master/DrawingRequest/ViewDrawingMasterMain';
import Engineersignature from './src/screen/Engineersignature';

import StartEndWork from './src/screen/StartEndWork';
import DrawingRequest from './src/screen/DrawingRequest';
import DrawingRequestEngineer from './src/screen/DrawingRequestEngineer';
import DrawingMaster from './src/screen/DrawingMaster';
import SpareRecommended from './src/screen/Spare';
import CustomerFeedback from './src/screen/CustomerFeedback';
import DrawingRequestEdit from './src/screen/DrawingRequestEdit';
import Reports from './src/screen/Reports';
import ViewAssigned from './src/screen/Call/ViewAssigned';

import UserMaster from './src/screen/Master/UserMaster/UserMaster';
import UploadEX from './src/screen/Master/SpareMaster/UploadEX';
import SpareMaster from './src/screen/Master/SpareMaster/SpareMaster';
import AddSpareMaster from './src/screen/Master/SpareMaster/AddSpareMaster';
import AddUserMaster from './src/screen/Master/UserMaster/AddUserMaster';
import DrawingMasterMain from './src/screen/Master/DrawingRequest/DrawingMasterMain';
import AddDrawing from './src/screen/Master/DrawingRequest/AddDrawing';
import CustomerMaster from './src/screen/Master/CustomerMaster/CustomerMaster';
import AddCustomerMaster from './src/screen/Master/CustomerMaster/AddCustomerMaster';

import VendorMaster from './src/screen/Master/VendorMaster/VendorMaster';
import AddVendorMaster from './src/screen/Master/VendorMaster/AddVendorMaster';
import DrawingMasterView from './src/screen/DrawingMasterView';
import PendingDetail from './src/screen/Call/PendingDetail';
import Updatesingnatures from './src/screen/CallWorks/updaytesignature';
import EditAssigned from './src/screen/Call/EditAssigned';
import ViewPdf from './src/screen/ViewPdf';
import ViewCompleted from './src/screen/Call/ViewCompleted';
import CallManagement from './src/screen/CallManagement';
import EmpPending from './src/screen/CallWorks/EmpPending';
import EmpRunning from './src/screen/CallWorks/EmpRunning';
import EmpCompleted from './src/screen/CallWorks/EmpCompleted';
import CompleteWorkDetail from './src/screen/CallWorks/CompleteWorkDetail';
import SendSMS from './src/screen/SendSMS';
import SendSMSLogin from './src/screen/SendSMSLogin';
import CompleteWorkDetail_Next from './src/screen/CallWorks/CompleteWorkDetail_Next';
import EmpOffline from './src/screen/CallWorks/EmpOffline';
import SpareRequired from './src/screen/SpareRequired';
import BranchTransfer from './src/screen/Call/BranchTransfer';
import StartWork from './src/screen/StartWork';
import EndWork from './src/screen/EndWork';
import DayEnd from './src/screen/DayEnd';
import  TakeVideo from  './src/components/TakeVideo';

import  ResetPassword from  './src/screen/ResetPassword';
import  ChangePin from  './src/screen/ChangePin';

export const GMMDrawer = createDrawerNavigator(
  {
    Home: {
      screen: Home,

      navigationOptions: {
        drawerLabel: 'GMMPfaudler',
        drawerIcon: ({tintColor}) => (
          <Icon name="ios-home" size={24} style={{color: tintColor}} />
        ),
      },
    },

    ManageLeaves: {screen: ManageLeaves},
    StartEndWork: {screen: StartEndWork},
    DrawingRequest: {screen: DrawingRequest},
    DrawingRequestEngineer: {screen: DrawingRequestEngineer},
    ChangePin: {screen: ChangePin},
    SpareRecommended: {screen: SpareRecommended},
    CustomerFeedback: {screen: CustomerFeedback},
    Reports: {screen: Reports},
    ChangePassword: {screen: ChangePassword},
    VendorMaster: {screen: VendorMaster},
    Engineersignature: {screen: Engineersignature},
    UserMaster: {screen: UserMaster},
    CustomerMaster: {screen: CustomerMaster},
    SpareMaster: {screen: SpareMaster},
    DrawingMasterMain: {screen: DrawingMasterMain},
    CallManagement: {screen: CallManagement},
    SendSMS: {screen: SendSMS},
    SpareRequired: {screen: SpareRequired},
    StartWork:{screen:StartWork},
    EndWork:{screen:EndWork},
    DayEnd:{screen:DayEnd},
    
  },
  {
    initialRouteName: 'Home',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerPosition: 'left',
    drawerWidth: width * 0.8,
    contentOptions: {
      activeTintColor: '#e60000',
      activeBackgroundColor: 'purple',
      style: {
        marginVertical: 0,
      },
      labelStyle: {
        //fontSize: 18,
        backgroundColor: 'transparent',
      },
    },
    contentComponent: (props, tintColor) => <Sidebar {...props} />,
  },
);

const Application = createStackNavigator(
  {
    
    Splash: {screen: Splash},
   
    Login: {screen: Login},
   
    Home: {
      screen: GMMDrawer,
      navigationOptions: {
        header: null,
      },
    },
    Maintenance: {
      screen: Maintenance,
      navigationOptions: {
        header: null,
      },
    },

    // ManageLeaves: {screen: ManageLeaves},
    StartEndWork: {screen: StartEndWork},
   
   
    Notifications: {screen: Notifications},
    DrawingRequest: {screen: DrawingRequest},
  
    DrawingRequestEngineer:{
      screen:DrawingRequestEngineer,
      navigationOptions: {
        header: null,
      },
    },
    SpareRecommended: {screen: SpareRecommended},
    CustomerFeedback: {screen: CustomerFeedback},
    Reports: {screen: Reports},
    DrawingMasterMain: {screen: DrawingMasterMain},
    
    UserMaster: {screen: UserMaster},
    AddUserMaster: {screen: AddUserMaster},
    AddCustomerMaster: {screen: AddCustomerMaster},
    AddVendorMaster: {screen: AddVendorMaster},
    SpareRequired: {screen: SpareRequired},
    CustomerMaster: {screen: CustomerMaster},
    SpareMaster: {screen: SpareMaster},
    AddSpareMaster: {screen: AddSpareMaster},
    DrawingMasterMain: {screen: DrawingMasterMain},
    ChangePassword: {screen: ChangePassword},
    ChangePassword: {screen: ChangePassword},
    StartWork:{screen:StartWork},
    EndWork:{screen:EndWork},
    DayEnd:{screen:DayEnd},
    
    TakeVideo:{
      screen:TakeVideo,
      navigationOptions: {
        header: null,
      },
    },
    VendorMaster: {
      screen: VendorMaster,
      navigationOptions: {
        header: null,
      },
    },

    EmpOffline: {
      screen: EmpOffline,
      navigationOptions: {
        header: null,
      },
    },

    Updatesingnatures: {
      screen: Updatesingnatures,
      navigationOptions: {
        header: null,
      },
    },

    UploadEX: {
      screen: UploadEX,
      navigationOptions: {
        header: null,
      },
    },

    SendSMS: {
      screen: SendSMS,
      navigationOptions: {
        header: null,
      },
    },

    BranchTransfer: {
      screen: BranchTransfer,
      navigationOptions: {
        header: null,
      },
    },

    SendSMSLogin: {
      screen: SendSMSLogin,
      navigationOptions: {
        header: null,
      },
    },
    ViewDrawingMasterMain: {
      screen: ViewDrawingMasterMain,
      navigationOptions: {
        header: null,
      },
    },
    AddDrawing: {
      screen: AddDrawing,
      navigationOptions: {
        header: null,
      },
    },

    EditApproved: {
      screen: EditApproved,
      navigationOptions: {
        header: null,
      },
    },

    EditPending: {
      screen: EditPending,
      navigationOptions: {
        header: null,
      },
    },

    EditRejected: {
      screen: EditRejected,
      navigationOptions: {
        header: null,
      },
    },

    DrawingRequestEdit: {
      screen: DrawingRequestEdit,
      navigationOptions: {
        header: null,
      },
    },
    DrawingMaster: {
      screen: DrawingMaster,
      navigationOptions: {
        header: null,
      },
    },
    DrawingMasterView: {
      screen: DrawingMasterView,
      navigationOptions: {
        header: null,
      },
    },
    PendingDetail: {
      screen: PendingDetail,
      navigationOptions: {
        header: null,
      },
    },
    ViewAllNoti: {
      screen: ViewAllNoti,
      navigationOptions: {
        header: null,
      },
    },

    ChangePin: {
      screen: ChangePin,
      navigationOptions: {
        header: null,
      },
    },



    CallManagement: {
      screen: CallManagement,
      navigationOptions: {
        header: null,
      },
    },

    ViewCompleted: {
      screen: ViewCompleted,
      navigationOptions: {
        header: null,
      },
    },

    EditAssigned: {
      screen: EditAssigned,
      navigationOptions: {
        header: null,
      },
    },

    ViewPdf: {
      screen: ViewPdf,
      navigationOptions: {
        header: null,
      },
    },

    EmpPending: {
      screen: EmpPending,
      navigationOptions: {
        header: null,
      },
    },
    EmpRunning: {
      screen: EmpRunning,
      navigationOptions: {
        header: null,
      },
    },
    EmpCompleted: {
      screen: EmpCompleted,
      navigationOptions: {
        header: null,
      },
    },
    CompleteWorkDetail: {
      screen: CompleteWorkDetail,
      navigationOptions: {
        header: null,
      },
    },
    ViewAssigned: {
      screen: ViewAssigned,
      navigationOptions: {
        header: null,
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        header: null,
      },
    },

    
    CompleteWorkDetail_Next: {
      screen: CompleteWorkDetail_Next,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    navigationOptions: {
      headerMode: 'none',
    },
  },
);
const AppNavigator = createAppContainer(Application);
export default AppNavigator