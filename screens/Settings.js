import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Constants from 'expo-constants';

export default class Settings extends React.Component {

  _export_data_from_user = () => {
  
  }

  _tou = () => {
  
  }

  _about = () => {
  
  }

  render (){
    return (
      <View style={{ marginTop: Constants.statusBarHeight, }}>
        <View style={{ justifyContent:'center', alignItems:'center', height:200 }}>
          <Image source={require('../assets/images/logo/logo_params_gris_80.png')} style={ styles.logoImage } />
        </View>
        <KeyboardAvoidingView style={{ marginLeft:30, marginRight:30 }} behavior="padding">
        {/* <ScrollView style={{ marginLeft:20, marginRight:20 }}> */}
          <TouchableOpacity onPress={() => this._export_data_from_user()}>
            <View style={styles.viewScrollView}>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> • Export my data</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._tou()}>
            <View style={styles.viewScrollView}>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> • Terms of Use</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._about()}>
            <View style={styles.viewScrollView}>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> • About WellCheck</Text>
            </View>
          </TouchableOpacity>
        {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </View>
    )
  };
};


const styles = StyleSheet.create({

  logoImage:{
    height: 100,
    width: 100,
  },

  viewScrollView:{
    marginTop:10,
    backgroundColor:'#e6e6e6',
  }
})
