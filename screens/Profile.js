import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { Header } from 'react-navigation';

export default class Settings extends React.Component {

  constructor(props) {
    super(props),
    this.state = {
      view_change_firstname: false,
      view_change_lastname: false,
      view_change_email: false,
      view_change_password: false,
      view_change_phone:false,
      user_info:null,
      first_name: null,
      last_name: null,
      phone_number: null,
      email: null,
      password: null,
    }
  }

  _get_user_info= async () => {
      try {
          const response = await fetch('https://api.wellcheck.fr/infos/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'token':global.infos.api_token,
                  'usrtoken':global.infos.user_token,
              },
          });
          const responseJson = await response.json();
          if (responseJson["succes"] == false) {
              this.setState({error:true})
          }
          if (responseJson["succes"] == true) {
              this.setState({user_info:responseJson['data']})
              if (responseJson['data']['firstname'] == null)
                this.state.user_info['firstname'] = "Enter your first name"
              if (responseJson['data']['lastname'] == null)
                this.state.user_info['lastname'] = "Enter your last name"
              if (responseJson['data']['phone'] == null)
                this.state.user_info['phone'] = "Enter your phone number"
          }
      }
      catch (error) {
          this.setState({
              error:'Cann\'t connect to server'
          })
      }        
    }
    componentDidMount(){
      this._get_user_info()
    }

  _send  = async () => {
      try {
          const response = await fetch('https://api.wellcheck.fr/updateinfos/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'token':global.infos.api_token,
                  'usrtoken':global.infos.user_token,
              },
              body: JSON.stringify({
                "firstname":this.state.user_info['firstname'] == "Enter your first name" ? "" : this.state.user_info['firstname'],
                "lastname":this.state.user_info['lastname'] == "Enter your last name" ? "" : this.state.user_info['lastname'],
                "phone":this.state.user_info['phone'] == "Enter your phone number" ? "" : this.state.user_info['phone'],
              })
          });
          const responseJson = await response.json();
          if (responseJson["succes"] == false) {
              console.log(responseJson)
              this.setState({error:true})
          }
          if (responseJson["succes"] == true) {
            this.forceUpdate()              
          }
      }
      catch (error) {
        console.log(error)
          this.setState({
              error:'Cann\'t connect to server'
          })
      }        
    }

  _display_input = (field) => {
    if (field == 'firstname' && this.state.view_change_firstname === false)
      this.setState({view_change_firstname: true})
    else
      this.setState({view_change_firstname: false})

    if (field == 'lastname' && this.state.view_change_lastname === false)
      this.setState({view_change_lastname: true})
    else
      this.setState({view_change_lastname: false})

    if (field == 'email' && this.state.view_change_email === false)
      this.setState({view_change_email: true})
    else
      this.setState({view_change_email: false})

    if (field == 'password' && this.state.view_change_password === false)
      this.setState({view_change_password: true})
    else
      this.setState({view_change_password: false})

    if (field == 'phone' && this.state.view_change_phone === false)
      this.setState({view_change_phone: true})
    else
      this.setState({view_change_phone: false})

    this.forceUpdate();
  }

  render (){

    let view_change_firstname = this.state.view_change_firstname === true ? <View style={{flexDirection:'row',flexWrap:'wrap', marginTop:5}}><TextInput style={ styles.viewTextInput } onChangeText={(text) => this.state.user_info['firstname'] = text} placeholder={this.state.user_info['firstname']} /></View> : <View></View>;
    let view_change_lastname = this.state.view_change_lastname === true ? <View style={{flexDirection:'row',flexWrap:'wrap', marginTop:5}}><TextInput style={ styles.viewTextInput } onChangeText={(text) => this.state.user_info['lastname'] = text} placeholder={this.state.user_info['lastname']}/></View> : <View></View>;
    let view_change_phone = this.state.view_change_phone === true ? <View style={{flexDirection:'row',flexWrap:'wrap', marginTop:5}}><TextInput style={ styles.viewTextInput }  onChangeText={(text) => this.state.user_info['phone'] = text} placeholder={this.state.user_info['phone']} /></View> : <View></View>;
    let view_change_email = this.state.view_change_email === true ? <View style={{flexDirection:'row',flexWrap:'wrap', marginTop:5}}><TextInput style={ styles.viewTextInput }  onChangeText={(text) => this.state.user_info['email'] = text} placeholder={this.state.user_info['email']}/></View> : <View></View>;
    let view_change_password = this.state.view_change_password === true ? <View style={{flexDirection:'row',flexWrap:'wrap', marginTop:5}}><TextInput style={ styles.viewTextInput }onChangeText={(text) => this.state.user_info['password'] = text} /></View> : <View></View>;

    let save
    if (this.state.view_change_email || this.state.view_change_password || this.state.view_change_firstname || this.state.view_change_lastname || this.state.view_change_phone) {
      save = <View style={{alignItems:'center', justifyContent:'center', marginTop:30 }}><TouchableOpacity style={{ borderRadius:10, alignItems:'center', justifyContent:'center', width:200,  height:40, backgroundColor:'#1C90FF'}} onPress={() => this._send()}><Text style={{ fontSize:10, color:'white' }}>Send</Text></TouchableOpacity></View>
    }
    
    return (
      <View style={{ marginTop: Constants.statusBarHeight, }}>
        {
          this.state.user_info?
          <View>
          <View style={{ justifyContent:'center', alignItems:'center', height:150}}>
          <Image source={require('../assets/images/logo/logo_avatar_profil.png')} style={ styles.logoImage } />
        </View>
        <View style={{ justifyContent:'center', alignItems:'center', marginTop:-20, }}>
          <Text style={{ fontSize: 30 }}>{this.state.user_info['firstname'] == "Enter your first name" ? null : this.state.user_info['firstname']} {this.state.user_info['lastname'] == "Enter your last name" ? null : this.state.user_info['lastname']}</Text>
          <Text style={{ fontSize: 10 }}>Creation date : {new Date(this.state.user_info['date'] / 1000).toLocaleDateString("en-US")}</Text>
        </View>
        <KeyboardAvoidingView keyboardVerticalOffset = {Header.HEIGHT + 20} style = {{ marginTop:10, marginLeft:30, marginRight:30, height:400 }} behavior = "padding" >
        <ScrollView>
          <TouchableOpacity onPress={() => this._display_input('email')}>
            <View style={styles.viewScrollView}>
              <Image source={require('../assets/images/profil/arobase.png')} style={{height:30, width:30, marginLeft:10, marginRight:10}}/>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> Email</Text>
            </View>
            { view_change_email }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._display_input('firstname')}>
            <View style={styles.viewScrollView}>
              <Image source={require('../assets/images/profil/profil.png')} style={{height:30, width:30, marginLeft:10, marginRight:10}}/>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> First name</Text>
            </View>
            { view_change_firstname }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._display_input('lastname')}>
            <View style={styles.viewScrollView}>
              <Image source={require('../assets/images/profil/profil.png')} style={{height:30, width:30, marginLeft:10, marginRight:10}}/>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> Last name</Text>
            </View>
            { view_change_lastname }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._display_input('phone')}>
            <View style={styles.viewScrollView}>
              <Image source={require('../assets/images/profil/phone.png')} style={{height:30, width:30, marginLeft:10, marginRight:10}}/>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> Phone number</Text>
            </View>
            { view_change_phone }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._display_input('password')}>
            <View style={styles.viewScrollView}>
              <Image source={require('../assets/images/profil/password.png')} style={{height:30, width:30, marginLeft:10, marginRight:10}}/>
              <Text style={{ fontSize: 20, color: '#1C90FF' }}> Password</Text>
            </View>
            { view_change_password }
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
        { save }
        </View>
            
          :
          <ActivityIndicator size="large" color="#0098EB" />
        }
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
    height:40,
    marginTop:10,
    backgroundColor:'#e6e6e6',
    borderRadius:15,
    borderWidth:2,
    borderColor:'#cfcfcf',
    flexDirection:'row',
    alignItems:'center',
  },

  viewTextInput : {
    marginLeft:20, 
    marginRight:20, 
    height: 30,
    width:'80%'
  }
})
