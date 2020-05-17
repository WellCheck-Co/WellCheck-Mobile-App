import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import LogoWellCheckTop from '../components/images/logoWellCheckTop/logoWellCheckTop';
import LoginFields from '../components/input/loginFields/loginFields';
import BottomLoginButtons from '../components/touchableOpacity/login/bottomLoginButtons/bottomLoginButtons';

export default class ForgetPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      api_token:this.props.navigation.state.params.api_token,
      error: false,
    };
    this.field = {
      mail:"user_mail",
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.body}>

            <LogoWellCheckTop/>
            <LoginFields 
              page="ForgetPassword"
              error={this.state.error}
              navigation={this.props.navigation.navigate}
            />
            <BottomLoginButtons 
              page="ForgetPassword"
              navigation={this.props.navigation.navigate} 
              api_token={this.state.api_token}
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
