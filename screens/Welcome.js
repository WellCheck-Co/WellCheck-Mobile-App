import React from 'react';
import { Text, View, Button, StyleSheet, ImageBackground, Alert, Image, TouchableOpacity } from 'react-native';

export default class Welcome extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      error: false,
    }
  }

  request_get_token = async () => {
    try {
      const response = await fetch('https://api.wellcheck.fr/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "pass": "password",
            })
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({
              error:'Cann\'t get token'
            })
        }
        if (responseJson["succes"] == true) {
              global.infos.api_token = responseJson["data"]["token"];
        }
    }
    catch (error) {
      console.log(error)
      this.setState({
        error:'Cann\'t connect to server'
      })
    } 
  }

  _login () {
    if(!this.state.error && global.infos.api_token != "")
      this.props.navigation.navigate('Login')
    else
      this.request_get_token()
  }

  _register () {
    if(!this.state.error && global.infos.api_token != "")
      this.props.navigation.navigate('Register')
    else
      this.request_get_token()
  }


  componentDidMount(){
    this.request_get_token();
  }

  render() {
    return (
      <View style={styles.view}>
            <Image source={require('../assets/images/logo/wellcheck_logo.png')} style={styles.logoImage} />
            <View>
                <TouchableOpacity
                      style={styles.button}
                      underlayColor='#fff'
                      onPress={() => this._login()}>
                      <Text style={styles.textButton}>Already have an account</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                      style={styles.button}
                      underlayColor='#fff'
                      onPress={() => this._register()}>
                      <Text style={styles.textButton}>Create an account</Text>
                </TouchableOpacity>
            </View>
              {
                this.state.error
                ?
                  <View>
                    <Text style={{color:'red'}}>{this.state.error}</Text>
                  </View>
                :
                  null
              }
      </View>
      );
  }
}

const styles = StyleSheet.create({

  logoImage:{
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
   button: {
     margin:10,
     color: 'white',
     backgroundColor: '#008ae6',
     padding:10,
   },
   backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
  },
  textButton: {
    fontSize: 15,
    color:'white',
  },
  view:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})
