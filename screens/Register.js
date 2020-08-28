import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import LogoWellCheckTop from '../components/images/logoWellCheckTop/logoWellCheckTop';
import LoginFields from '../components/input/loginFields/loginFields';
import BottomLoginButtons from '../components/touchableOpacity/login/bottomLoginButtons/bottomLoginButtons';

export default class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mail:"",
      password:"",
      password2:"",
    };
  }

  set_mail = (email) => {
    this.setState({mail:email})
  }
  set_password = (pass) => {
    this.setState({password:pass})
  }
  set_password2 = (pass) => {
    this.setState({password2:pass})
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.body}>
            
            <LogoWellCheckTop/>
            <LoginFields 
              page="Register"
              setMail={this.set_mail.bind(this)}
              setPassword={this.set_password.bind(this)}
              setPassword2={this.set_password2.bind(this)}
            />
            <BottomLoginButtons
              page="Register"
              navigation={this.props.navigation}
              mail={this.state.mail}
              password={this.state.password}
              password2={this.state.password2}
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
    width:'100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }
})
