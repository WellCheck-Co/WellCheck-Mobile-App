import React from 'react';
import { Text, View, StyleSheet, Alert, Dimensions  } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Modal from 'react-native-modal';


export default class AddFloaterByQrcode extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      // mail:this.props.navigation.state.params.mail,
      // token: this.props.navigation.state.params.token,
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

  _sendInfo = () => {
    fetch('http://51.158.114.39:8081/addpoint/',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "mail":this.state.mail,
        "token":this.state.token,
        "key":this.state.id,
        "sig_id":this.state.sig_id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson["succes"] == false){
        Alert.alert(responseJson['error'])
        this.setState({
          error: true
        })
        this._map()
      }if (responseJson["succes"] == true){
        Alert.alert("Device added")
        this._map()
      }
    })
    .catch((error) => {
    });
  }

  _map = () => {
      this.props.navigation.navigate('Map', {token:this.state.token, mail:this.state.mail });
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
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned} style={StyleSheet.absoluteFillObject, styles.camera}>
        <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this._closeModal()} style={{ backgroundColor:'white', borderRadius:30, maxHeight:Dimensions.get('window').height / 2}}>
          <View style={{ alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:40 }}>Floater added</Text>
          </View>
        </Modal>
      </BarCodeScanner>
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
  camera: {
    height:'100%',
    marginBottom:0
  },
})
