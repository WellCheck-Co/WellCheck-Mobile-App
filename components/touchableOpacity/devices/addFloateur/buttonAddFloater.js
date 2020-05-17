// import React, { Component } from 'react';
// import { StyleSheet, View, Modal, TouchableOpacity, Image, Dimensions, Text, TextInput } from 'react-native';
// // import PropTypes from 'prop-types';
// // import { useNavigation as Navigation } from '@react-navigation/native';

// export default class ButtonAddFloater extends Component{

//     constructor(props){
//         super(props);
//         this.state = {
//             api_token:this.props.api_token,
//             isModalVisible:false
//         };
//     }

//     static propTypes = {

//     }

//     _add_floater_by_id = () => {
//         this.navigation.navigate('AddFloaterById');
//     }

//     _add_floater_by_qr_code = () => {
//         this.navigation.navigate('AddFloaterByQrCode');
//         this._closeModal();
//     }
  
//     _openModal = () => {
//         this.setState({
//             isModalVisible:true
//         })
//     }
  
//     _closeModal = () => {
//         this.setState({
//             isModalVisible:false
//         })
//         this.field.sigfox_id = ''
//     }

//     render() {
//         return (
                
//                 <TouchableOpacity onPress={()=>this._openModal()}>
//                     <View style={styles.view_touchable_logo_plus}>
//                         <Image source={require('../../../../assets/images/logo/logo_plus.png')} style={styles.img_logo_plus} />
//                     </View>
//                 </TouchableOpacity>
//                 <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this._closeModal()} style={{ backgroundColor:'white', borderRadius:30 ,maxHeight:Dimensions.get('window').height / 3}}>
//                     <View style={{ alignItems:'center', justifyContent: 'center' }}>
//                         <TouchableOpacity style={{ width:180, height:70, alignItems:'center', justifyContent:'center', backgroundColor:'#1C90FF'}} onPress={() => this._add_floater_by_qr_code()}>
//                             <Text style={{ fontSize:20, color:'white' }}>By QR Code</Text>
//                         </TouchableOpacity>
//                         <Text style={{ marginTop:10, fontSize:15 }}>OR</Text>
//                         <TextInput
//                             secureTextEntry={false}
//                             textAlign={'center'}
//                             placeholder='By Sigfox ID'
//                             onChangeText={(text) => this.field.sigfox_id = text}
//                             style={{borderBottomColor: 'grey', borderWidth: 1, marginTop:10, color:'black', width:180, height:50, fontSize: 20 }}
//                         />
//                         <TouchableOpacity style={{ width:180, height:20, alignItems:'center', justifyContent:'center', backgroundColor:'#1C90FF'}} onPress={() => this._add_floater_by_qr_code()}>
//                             <Text style={{ fontSize:10, color:'white' }}>Send</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </Modal>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     view_touchable_logo_plus: {
//         height: 80,
//         marginTop: 10,
//         backgroundColor: '#6e6e6e',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     img_logo_plus: {
//         height:50,
//         width:50,
//     }
// })