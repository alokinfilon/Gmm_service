call_type == "1" ? "Online" : "Offline"




// "1"    home
// "2"    password

// "7"    Drawing Master
// "8"    Vendor Master
// "9"    Customer Master

// "12"   Pending Calls
// "13"   Assigned Calls

//
// "14"   Pending Leaves
// "15"   Approved Leaves
// "16"   Rejected Leaves

// "17"  Drawing Request

// "19"  Call Calendar

// "20"  Completed Calls

// "21"  Leave Calendar

// "22"  Start/End Work

// 7221 n 9095   rajesh	9909248150 
// nimesh	9825048799

// Following issue, I face while using service app.


// done  ---------------------------------------------------------------------------------

//1 Not able to do log in at once, We need to log in multiple times

//2 Many users already do start work but not its come in Start/End Work. It should be available there.

//3 After Day end, users are still able to log in. We need to think for login after do endwork.

//5 Show all fields in a list view which are available in Drawing Master

//6 Add Mo No & Email field in Send SMS page/screen, This will help users to identify/verify contact details

//7 Change Date and Time field to Requested Date/Time in Spare Recommended page. 

//10 Put Status field in Detail page for all (Pending,Assign, Complete,All Call)

// not-done ---------------------------------------------------------------------------------

//4 Spare Required notification not coming to the Manager.

//8 If we click on any notification, It just redirects to the application, Not for a specific call that was selected.

//11 Many Calls’s status is Generated but its showing in Completed Page




//12 In Any Download Excel(Pending/Assign/All), Date format not coming in data, it just showing text.
//9 I have not seen any message/Alert in Manager’s login(Web), In mobile not all notification but some notification are visible.




{/* <View style={styles.rowItem}>
<Text style={styles.label}>
 Status.</Text>
<View style={{ flex: 1, flexDirection: 'column' }}>
  <Text style={styles.value}>{this.state.dataSource.status == 1 ? 'Running' :'Pending' }</Text>
</View>
</View>


The manager should have an option to put the drawing in a call even before a drawing request is sent by an engineer. Keep this functinality as is it, just add option in drawing request.

Many notification not coming in mobile application.


*/}