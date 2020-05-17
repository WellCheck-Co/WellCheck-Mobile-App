import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import LogoWellCheckTop from '../components/images/logoWellCheckTop/logoWellCheckTop';
import LoginFields from '../components/input/loginFields/loginFields';
import BottomLoginButtons from '../components/touchableOpacity/login/bottomLoginButtons/bottomLoginButtons';

export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      error:"",
      mail:"",
      password:""
    };
  }

  set_mail = (email) => {
    this.setState({mail:email})   
  }
  set_password = (pass) => {
    this.setState({password:pass})
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.body}>

            <LogoWellCheckTop/>
            <LoginFields 
              page="Login"
              setMail={this.set_mail.bind(this)}
              setPassword={this.set_password.bind(this)}
            />
            <BottomLoginButtons 
              page="Login" 
              navigation={this.props.navigation}
              mail={this.state.mail}
              password={this.state.password}
            />

          </View>
      </View>
      );
  }

}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    marginTop: Constants.statusBarHeight
  },

  body : {
    height:'100%', 
    width:'100%'
  }
})
