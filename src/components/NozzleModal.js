import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, View, FlatList, TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


import styles from './modalStyle';


import Colors from '../common/Colors';



export default class NozzleModal extends Component {
  constructor (props, ctx) {
    super(props, ctx)

    this.state = {
      filter: '',
      loading: false,
      ds: props.options,
      noResult:"No data found"
    }
  }
  componentWillReceiveProps (newProps) {
    if ((!this.props.visible && newProps.visible) || (this.props.options !== newProps.options)) {
      this.setState({
        filter: '',
        ds: newProps.options,
      })
    }
  }

  render () {
    const {
      title,
      titleTextStyle,
      overlayStyle,
      cancelContainerStyle,
      renderList,
      keyExtractor,
      renderCancelButton,
      visible,
      modal,
      onCancel
    } = this.props

    const renderedTitle = (!title) ? null : (
      <Text style={titleTextStyle || styles.titleTextStyle}>{title}</Text>
    )

    return (
      <Modal
        onRequestClose={onCancel}
        {...modal}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
      >
        
        <View style={overlayStyle || styles.overlay}>
       
       
          {renderedTitle}
          {(renderList || this.renderList)()}

        </View>
      </Modal>
    )
  }

  renderList = () => {
    const {
      showFilter,
      autoFocus,
      listContainerStyle,
      androidUnderlineColor,
      placeholderText,
      placeholderTextColor,
      filterTextInputContainerStyle,
      filterTextInputStyle,
    } = this.props;

    const filter = (!showFilter) ? null : (
      <View style={filterTextInputContainerStyle || styles.filterTextInputContainer}>
        <TextInput
          onChangeText={this.onFilterChange}
          autoCorrect={false}
          blurOnSubmit={true}
          autoFocus={true}
          autoCapitalize="none"
          underlineColorAndroid={androidUnderlineColor}
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholderText}
          style={filterTextInputStyle || styles.filterTextInput} />
      </View>
    )

    return (
      <View style={listContainerStyle || styles.listContainer}>
        {(this.renderCancelButton || this.renderCancelButton)()}
        {filter}
        {this.renderOptionList()}
      </View>
    )
  }

  renderOptionList = () => {
    const {
      noResultsText,
      flatListViewProps,
      keyExtractor,
      keyboardShouldPersistTaps
    } = this.props

    const { ds } = this.state
    if(this.state.loading) {
        return(
            <View style={styles.noResults}>
            <ActivityIndicator size="large" color={Colors.primary} animating={this.state.loading} />
            </View>
        )
            }
    else if (ds.length == 0) {
      return (
       
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{this.state.noResult}</Text>
            </View>
         
      )
    } else {
      return (
        <FlatList
          keyExtractor={keyExtractor||this.keyExtractor}
          {...flatListViewProps}
          data={ds}
          renderItem={(item)=> this.renderOption(item.item)}
          keyboardShouldPersistTaps={true}
        />
      )
    }
  }

  renderOption = (item) => {
   
    
    const {
      selectedOption,
      renderOption,
        optionTextStyle,
      selectedOptionTextStyle
    } = this.props

    const { id, name } = item

    let style = styles.optionStyle
    let textStyle = optionTextStyle||styles.optionTextStyle

    if (id === selectedOption) {
      style = styles.selectedOptionStyle
      textStyle = selectedOptionTextStyle ||styles.selectedOptionTextStyle
    }
    if (renderOption) {
      return renderOption(item, id === selectedOption)
    } else {
      return (
<View>
       
        <TouchableOpacity activeOpacity={0.7}
         style={[style, {flexDirection:'row', flex:1,  paddingHorizontal:20 }]}
          onPress={() => this.props.onSelect(id, name)}
        >
         <Text style={textStyle}>{name}</Text>

          {/* <Text style={textStyle}>{name}<Text style={{fontFamily: 'Nunito-mediumItalic', fontSize:18, }}>{item.category}</Text></Text>
          */}

        </TouchableOpacity>



</View>
      )
    }
  }
  keyExtractor = (item, index) => item.id;

  renderCancelButton = () => {
    const {
      cancelButtonStyle,
      cancelButtonTextStyle,
      cancelButtonText
    } = this.props

    return (
      <TouchableOpacity onPress={this.props.onCancel}
        activeOpacity={0.7}
        style={cancelButtonStyle || styles.cancelButton}
      >

    <Icon name="times" color={Colors.primary} size={35} />
      </TouchableOpacity>
    )
  }

  onFilterChange = (text) => {
    const { options } = this.props

    // if(text.length < 3){
    //     Toast.show(
    //         "Please enter 2 or more characters",
    //         Toast.SHORT,
    //         
    //       );
    // } else{
    //     this.searchAPI(text);
    // }
       
    const filter = text.toLowerCase()

    // apply filter to incoming data
    const filtered = (!filter.length)
      ? options
      : options.filter(({ searchKey, name, id }) => (
        0 <= name.toLowerCase().indexOf(filter) ||
          (searchKey && 0 <= searchKey.toLowerCase().indexOf(filter))
      ))

    this.setState({
      filter: text.toLowerCase(),
      ds: filtered
    })
  }
}

NozzleModal.propTypes = {
  options: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  placeholderText: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  androidUnderlineColor: PropTypes.string,
  cancelButtonText: PropTypes.string,
  title: PropTypes.string,
  noResultsText: PropTypes.string,
  visible: PropTypes.bool,
  showFilter: PropTypes.bool,
  modal: PropTypes.object,
  selectedOption: PropTypes.string,
  renderOption: PropTypes.func,
  renderCancelButton: PropTypes.func,
  renderList: PropTypes.func,
  flatListViewProps: PropTypes.object,
  filterTextInputContainerStyle: PropTypes.any,
  filterTextInputStyle: PropTypes.any,
  cancelContainerStyle: PropTypes.any,
  cancelButtonStyle: PropTypes.any,
  cancelButtonTextStyle: PropTypes.any,
  titleTextStyle: PropTypes.any,
  overlayStyle: PropTypes.any,
  listContainerStyle: PropTypes.any,
  optionTextStyle:PropTypes.any,
  selectedOptionTextStyle:PropTypes.any,
  keyboardShouldPersistTaps: PropTypes.string
}

NozzleModal.defaultProps = {
  placeholderText: 'Search...',
  placeholderTextColor: '#ccc',
  androidUnderlineColor: 'rgba(0,0,0,0)',
  cancelButtonText: 'Close',
  noResultsText: 'No matches',
  visible: false,
  showFilter: true,
  keyboardShouldPersistTaps: 'never'
}
