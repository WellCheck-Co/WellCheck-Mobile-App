import React from 'react';
import { Text, View, StyleSheet, Alert, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';


export default class AddFloaterByQrcode extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      id:0,
      sig_id:"",
      isModalVisible:false
    };
  }


  _openModal = () => {
    this.setState({
      isModalVisible:true
    })
  }

  _closeModal = () => {
    this.setState({
      isModalVisible:false
    })
    this.field.sigfox_id = ''
  }

  _sendInfo = async () => {
    try {
      const response = await fetch('https://api.wellcheck.fr/point/add/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'token':global.infos.api_token,
              'usrtoken':global.infos.user_token,
          },
          body: JSON.stringify({
              "id_sigfox":this.state.sig_id,
              "lat":Math.random() * (45.5 - 50) + 45.5,
              "lng":Math.random() * (2 - 3) + 2
          })
      });
      const responseJson = await response.json();
      if (responseJson["succes"] == false) {
        Alert.alert(responseJson['error'])
        this.setState({
          error: true
        })
        this._map()
      }
      if (responseJson["succes"] == true) {
        Alert.alert("Device added")
        this._map()
      }
    }catch (error) {
      console.log(error)
      this.setState({
          error:'Cann\'t connect to server'
      })
    }
  }

  _map = () => {
      this.props.navigation.navigate('Home');
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _addFloater = () => {
    this.props.navigation.navigate('AddFloater')
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;
    if (hasCameraPermission === false) {
      this._addFloater()
    }
    return (
      <View style={{height:"100%", width:"100%", marginTop:Constants.statusBarHeight, alignItems:'center', justifyContent:'center'}}>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned} style={{height:"70%", width:"90%"}}>
          {/* <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this._closeModal()} style={{ backgroundColor:'white', borderRadius:30, maxHeight:Dimensions.get('window').height / 3}}>
            <View style={{ alignItems:'center', justifyContent:'center' }}>
              <Text style={{ fontSize:40 }}>Floater added</Text>
            </View>
          </Modal> */}
        </BarCodeScanner>
      </View>
      );
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    this._openModal();
    data = data.split(';');
    this.state.id = data[1]
    this.state.sig_id = data[0]
    this._sendInfo()
  };
}

const styles = StyleSheet.create({
})
