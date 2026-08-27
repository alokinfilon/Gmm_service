import { StyleSheet, Dimensions } from 'react-native'
import Fonts from '../common/Fonts'
import Colors from '../common/Colors'


const { width, height } = Dimensions.get('window')

const optionStyle = {
  flex: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee'
}

const optionTextStyle = {
  flex: 1,
  textAlign: 'left',
  color: '#000',
  fontSize: 18,

}

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',

    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTextStyle: {
    flex: 0,
    color: '#fff',
    fontSize: 20,
    marginBottom: 15
  },
  listContainer: {
    flex: 1,
   paddingTop:10, 
    width: width ,
    maxHeight: height ,
    backgroundColor: '#fff',
    borderRadius: 5,
    
  },
  cancelContainer: {
    top:30,
    right:10,

    position:'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:15,
  },
  cancelButton: {


    backgroundColor: 'transparent',
    paddingVertical: 20,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    paddingHorizontal: 20,
    // borderRadius: 10,
    // borderWidth:1,
    // borderColor:'#e3202d'
  },
  cancelButtonText: {
    // textAlign: 'center',
    // fontSize: 18,
    // color: "#fff"
  },
  filterTextInputContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius:5,
    marginHorizontal:10,
  },
  filterTextInput: {
    fontFamily:Fonts.regular,
    fontSize:18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 0,
    
  },
  categoryStyle: {
    ...optionStyle
  },
  categoryTextStyle: {
    ...optionTextStyle,
    color: '#999',
    fontStyle: 'italic',
    fontSize: 16
  },
  optionStyle: {
    ...optionStyle
  },
  optionStyleLastChild: {
    borderBottomWidth: 0
  },
  optionTextStyle: {
   
    ...optionTextStyle
  },
  selectedOptionStyle: {
    ...optionStyle
  },
  selectedOptionStyleLastChild: {
    borderBottomWidth: 0
  },
  selectedOptionTextStyle: {
    ...optionTextStyle,
    fontFamily: Fonts.bold,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  noResultsText: {
    flex: 1,
    textAlign: 'center',
    color: '#ccc',
    fontFamily:Fonts.mediumitalic,
    fontSize: 18
  }
})
