import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, ActivityIndicator, TextInput } from 'react-native';
import Constants from 'expo-constants';
import LogoWellCheckTop from '../components/images/logoWellCheckTop/logoWellCheckTop';

export default class Settings extends React.Component {

  constructor(props) {
    super(props),
    this.state = {
      view_change_firstname: false,
      view_change_lastname: false,
      view_change_email: false,
      view_change_phone:false,
      user_info:null,
    }
  }

  componentDidMount() {
    this._get_user_info();
  }

  _export_data_from_user = () => {
  
  }

  _tou = () => {
  
  }

  _about = () => {
  
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

  render (){

    let save;
    if (this.state.view_change_email || this.state.view_change_firstname || this.state.view_change_lastname || this.state.view_change_phone) {
      save = <View style={{alignItems:'center', justifyContent:'center', marginTop:30 }}><TouchableOpacity style={{ borderRadius:10, alignItems:'center', justifyContent:'center', width:200,  height:40, backgroundColor:'#1C90FF'}} onPress={() => this._send()}><Text style={{ fontSize:10, color:'white' }}>Send</Text></TouchableOpacity></View>
    }

    return (
      <View style={{ marginTop: Constants.statusBarHeight, }}>
        <ScrollView>
          <View style={{ justifyContent:'center', alignItems:'center', height:200 }}>
            <Image source={require('../assets/images/logo/logo_params_gris_80.png')} style={ styles.logoImage } />
          </View>
          {this.state.user_info?
            <View style={{marginBottom:20}}>
              <View style={{ justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize: 30 }}>{this.state.user_info['firstname'] == "Enter your first name" || this.state.user_info['lastname'] == "Enter your last name" ? "Profile" : this.state.user_info['firstname'] + " " + this.state.user_info['lastname']}</Text>
                <Text style={{ fontSize: 10 }}>Creation date : {new Date(this.state.user_info['date'] / 1000).toLocaleDateString("en-US")}</Text>
              </View>
              <KeyboardAvoidingView style={{ marginLeft:30, marginRight:30 }} behavior="padding">
                <View style={{marginTop:"10%"}}>
                  <View style={styles.viewScrollViewName}>
                    <Image source={require('../assets/images/profil/avatar.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_firstname ? this.setState({view_change_firstname:false}) : this.setState({view_change_firstname:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> First name</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_firstname != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['firstname'] = text} placeholder={" " + this.state.user_info['firstname']}/>
                        </View>
                      :
                        null
                      }
                      <TouchableOpacity onPress={() => this.state.view_change_lastname ? this.setState({view_change_lastname:false}) : this.setState({view_change_lastname:true})}>
                        <View style={{flexDirection:"row", borderTopWidth:1, borderColor:"#e8e8e8"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Last name</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_lastname != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['lastname'] = text} placeholder={" " + this.state.user_info['lastname']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  <View style={styles.viewScrollViewProfile}>
                    <Image source={require('../assets/images/profil/arobase.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_email ? this.setState({view_change_email:false}) : this.setState({view_change_email:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Email</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_email != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['email'] = text} placeholder={" " + this.state.user_info['email']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  <View style={styles.viewScrollViewProfile}>
                    <Image source={require('../assets/images/profil/phone.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_phone ? this.setState({view_change_phone:false}) : this.setState({view_change_phone:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Phone number</Text>

                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_phone != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['phone'] = text} placeholder={" " + this.state.user_info['phone']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  { save }


                  <View style={{marginTop:"20%"}}>
                    <View style={styles.viewScrollViewName}>
                      <Image source={require('../assets/images/profil/data.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                      <View style={{alignItems:"stretch", width:"80%"}}>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row", borderBottomWidth:1, borderColor:"#e8e8e8"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }}> Export my data</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row"}}>
                              <Text style={{ fontSize: 20, color: '#636363' }}> Delete my data</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.viewScrollViewName}>
                      <Image source={require('../assets/images/profil/test1_last_logo.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                      <View style={{alignItems:"stretch", width:"80%"}}>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row", borderBottomWidth:1, borderColor:"#e8e8e8"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }}> Terms of Use</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }}> About WellCheck</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            :
            <View style={{marginTop:"20%"}}>
              <ActivityIndicator size="large" color="#0098EB" />
            </View>
          }
        </ScrollView>
      </View>
    )
  };
};


const styles = StyleSheet.create({

  logoImage:{
    height: 100,
    width: 100,
  },

  viewScrollViewSettings:{
    marginTop:10,
    backgroundColor:'#e6e6e6',
    borderRadius:10
  },

  viewScrollViewName:{
    marginTop:10,
    backgroundColor:'#f0f0f0',
    borderRadius:8,
    borderWidth:2,
    borderColor:'#e8e8e8',
    alignItems:'center',
    flexDirection:"row"
  },

  viewScrollViewProfile:{
    marginTop:10,
    backgroundColor:'#f0f0f0',
    borderRadius:8,
    borderWidth:2,
    borderColor:'#e8e8e8',
    alignItems:'center',
    flexDirection:"row"
  },
})
