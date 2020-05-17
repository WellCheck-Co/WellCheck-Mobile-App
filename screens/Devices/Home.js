import React from 'react';
import { Dimensions, StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, Image, Button, TextInput, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import CustomPieChart from '../../components/chart/devices/pieChart'
import FloaterState from '../../components/touchableOpacity/devices/floaterState/floaterState'
import FloaterStateForShare from '../../components/touchableOpacity/devices/floaterState/floaterStateForShare'
import { HitTestResultTypes } from 'expo/build/AR';

export default class Devices extends React.Component {

  constructor(props) {
      super(props);
      this.field = {
          sigfox_id: '',
          all_floaters_data:{},
      };
      this.state = {
        isModalAddFloaterVisible:false,
        isModalShareFloaterVisible:false,
        error:null,
        error_share:null,
        view:"own",
        polluted_devices:0,
        clean_devices:0,
        without_data_devices:0,
        shared_polluted_devices:0,
        shared_clean_devices:0,
        shared_without_data_devices:0,
        floater_selected_for_share:[],
        email_for_share:null,
      }
  }

  componentDidMount(){
    this._request_get_all_floater_infos()
  }

  addFLoaterSelectedForShare(id){
    this.state.floater_selected_for_share.push(id);
    console.log(this.state.floater_selected_for_share)
  }

  removeFLoaterSelectedForShare(id){
    for(var i in this.state.floater_selected_for_share){
      if(this.state.floater_selected_for_share[i]==id){
        this.state.floater_selected_for_share.splice(i,1);
          break;
      }
    }
  }

  _request_share_floater_by_mail = async () => {
    try {
      const response = await fetch('https://api.wellcheck.fr/point/share/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'token':global.infos.api_token,
              'usrtoken':global.infos.user_token,
          },
          body: JSON.stringify({
            "id_points":this.state.floater_selected_for_share,
            "email":this.state.email_for_share,
          })
      });
      const responseJson = await response.json();
      if (responseJson["succes"] == false) {
        console.log(responseJson)
          this.setState({error_share:true})
      }
      if (responseJson["succes"] == true) {
        this.forceUpdate()
        this._closeModalShareFloater()
      }
  }
  catch (error) {
      this.setState({
          error:'Cann\'t connect to server'
      })
  }
  }

  _request_get_all_floater_infos = async () => {
    try {
        const response = await fetch('https://api.wellcheck.fr/points/infos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token':global.infos.api_token,
                'usrtoken':global.infos.user_token,
            },
            body: JSON.stringify({})
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({error:responseJson['error']})
            console.log(responseJson)
        }
        if (responseJson["succes"] == true) {
            this.setState({all_floaters_data:responseJson['data']['points']})
            this._fill_data_pi_chart_proprietary()
            this._fill_data_pi_chart_shared()
        }
    }
    catch (error) {
      console.log(error)
        this.setState({
            error:'Cann\'t connect to server'
        })
    }        
  }

  _fill_data_pi_chart_proprietary(){
    this.setState({clean_devices:0, polluted_devices:0, without_data_devices:0})
    this.state.all_floaters_data.proprietary.map(floater =>
      {
        if(floater['data'].length > 0)
          floater['data'][floater['data'].length-1]["data"]["data"]['note'] >= 10 ? this.setState({clean_devices:this.state.clean_devices+1}) : this.setState({polluted_devices:this.state.polluted_devices+1})
        else
          this.setState({without_data_devices:this.state.without_data_devices+1})
      }
    )
  }

  _fill_data_pi_chart_shared(){
    this.setState({shared_clean_devices:0, shared_polluted_devices:0, shared_without_data_devices:0})
    this.state.all_floaters_data.shared.map(floater =>
      {
        if(floater['data'].length > 0)
          floater['data'][floater['data'].length-1]["data"]["data"]['note'] >= 10 ? this.setState({clean_devices:this.state.share_clean_devices+1}) : this.setState({polluted_devices:this.state.shared_polluted_devices+1})
        else
          this.setState({shared_without_data_devices:this.state.shared_without_data_devices+1})
      } 
    )
  }

  _display_prorietary_floaters(){
    return (
      this.state.all_floaters_data.proprietary.map(floater => 
        {
          if(floater['data'].length > 0){
            return (
              <FloaterState
                point_img={floater['data'][floater['data'].length-1]["data"]["data"]['note'] >= 10 ? "blue" : "red"}
                name={floater["name"]}
                location={"long: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lon']+"   lat: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lat']}
                owner="me"
                id={floater['id']}
                navigation={this.props.navigation.navigate}
              />);
        }else{
            return(
              <FloaterState
                point_img={"green"}
                name={floater["name"]}
                location={"long: undefined   lat: undefined"}
                owner="me"
                id={floater['id']}
                navigation={this.props.navigation.navigate}
              />);
          }
        }
      )
    );
  }

  _display_prorietary_floaters_for_share(){
    return (
      this.state.all_floaters_data.proprietary.map(floater => 
        {
          if(floater['data'].length > 0){
            return (
              <FloaterStateForShare
                point_img={floater['data'][floater['data'].length-1]["data"]["data"]['note'] >= 10 ? "blue" : "red"}
                name={floater["name"]}
                location={"long: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lon']+"   lat: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lat']}
                selected={this.addFLoaterSelectedForShare.bind(this)}
                removed={this.removeFLoaterSelectedForShare.bind(this)}
                device_id={floater['id']}
              />);
        }else{
            return(
              <FloaterStateForShare
                point_img={"green"}
                name={floater["name"]}
                location={"long: undefined   lat: undefined"}
                selected={this.addFLoaterSelectedForShare.bind(this)}
                removed={this.removeFLoaterSelectedForShare.bind(this)}
                device_id={floater['id']}
              />);
          }
        }
      )
    );
  }

  _display_shared_floaters(){
    return (
      this.state.all_floaters_data.shared.map(floater => 
        {
          if(floater['data'].length > 0){
            return (
              <FloaterState
                point_img={floater['data'][floater['data'].length-1]["data"]["data"]['note'] >= 10 ? "blue" : "red"}
                name={floater["name"]}
                location={"long: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lon']+"   lat: "+floater['data'][floater['data'].length-1]["data"]["pos"]['lat']}
                owner="me"
                id={floater['id']}
                navigation={this.props.navigation.navigate}
              />);
          }
          else{
            return(
              <FloaterState
                point_img={"green"}
                name={floater["name"]}
                location={"long: undefined   lat: undefined"}
                owner="me"
                id={floater['id']}
                navigation={this.props.navigation.navigate}
              />);
          }
        }
      )
    );
  }

  _request_add_point = async () => {
    try {
        const response = await fetch('https://api.wellcheck.fr/point/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token':global.infos.api_token,
                'usrtoken':global.infos.user_token,
            },
            body: JSON.stringify({
                "id_sig":this.field.sigfox_id
            })
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({error:responseJson['error']})
        }
        if (responseJson["succes"] == true) {
            this._closeModalAddFloater()
            this._request_get_all_floater_infos()
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

  _details = () => {
    this.props.navigation.navigate('Details');
  }

  _add_floater_by_qr_code = () => {
    this.props.navigation.navigate('AddFloaterByQrCode');
    this._closeModalAddFloater();
  }

  _openModal_add_floater = () => {
    this.setState({
      isModalAddFloaterVisible:true
    })
  }

  _openModal_share_floater = () => {
    this.setState({
      isModalShareFloaterVisible:true
    })
  }

  _closeModalAddFloater = () => {
    this.setState({
      isModalAddFloaterVisible:false
    })
    this.field.sigfox_id = ''
  }

  _closeModalShareFloater = () =>{
    this.setState({isModalShareFloaterVisible:false})
  }


  render() {
    const pie_chart_data =
    [
      {
        name: "Clean",
        population: this.state.clean_devices,
        color: "#0098EB",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Polluted",
        population: this.state.polluted_devices,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Without data",
        population: this.state.without_data_devices,
        color: "#aab938",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }
    ];

    const pie_chart_data_shared =
    [
      {
        name: "Clean",
        population: this.state.shared_clean_devices,
        color: "#0098EB",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Polluted",
        population: this.state.shared_polluted_devices,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Without data",
        population: this.state.shared_without_data_devices,
        color: "#aab938",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }
    ];


    return (
      <SafeAreaView style={styles.container}>
        {
          this.state.view == "own" ?
            <CustomPieChart data={pie_chart_data}/>
            :
            <CustomPieChart data={pie_chart_data_shared}/>
        }

        <View style={styles.viewTypeDevice}>
            <View style={this.state.view =="own" ? styles.button_selected : styles.button}>
                <Button
                    type="Solid Button"
                    title="My devices"
                    onPress={() => this.setState({view:"own"})}/>
            </View>
            <View style={this.state.view =="shared" ? styles.button_selected : styles.button}>
                <Button
                    type="Solid Button"
                    title="Shared"
                    onPress={() => this.setState({view:"shared"})}/>
            </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {
            this.state.view == "own" ?
              <TouchableOpacity onPress={()=>this._openModal_add_floater()}>
                <View style={styles.view_touchable_logo_plus}>
                  <Image source={require('../../assets/images/logo/logo_plus.png')} style={styles.img_logo_plus} />
                </View>
              </TouchableOpacity>
          :
              <TouchableOpacity onPress={()=>this._openModal_share_floater()}>
                <View style={styles.view_touchable_logo_plus}>
                  <Image source={require('../../assets/images/logo/logo_plus.png')} style={styles.img_logo_plus} />
                </View>
              </TouchableOpacity>
          }
          {
            this.state.view == "own" ?
              this.state.all_floaters_data ?
              this._display_prorietary_floaters()
              :
              <View style={{justifyContent:'center', alignItems:'center', marginTop:'10%', height:200}}><ActivityIndicator size="large" color="#0098EB" /></View>
            :
              this.state.all_floaters_data ?
              this._display_shared_floaters()
              :
              <View style={{justifyContent:'center', alignItems:'center', marginTop:'10%', height:200}}><ActivityIndicator size="large" color="#0098EB" /></View>
          }

        </ScrollView>


        <Modal isVisible={this.state.isModalAddFloaterVisible} onBackdropPress={()=>this._closeModalAddFloater()} style={{ backgroundColor:'white', borderRadius:30 ,maxHeight:Dimensions.get('window').height / 3}}>
          <View style={{ alignItems:'center', justifyContent: 'center' }}>
            <TouchableOpacity style={{ width:180, height:70, alignItems:'center', justifyContent:'center', backgroundColor:'#1C90FF'}} onPress={() => this._add_floater_by_qr_code()}>
                <Text style={{ fontSize:20, color:'white' }}>By QR Code</Text>
            </TouchableOpacity>
            <Text style={{ marginTop:10, fontSize:15 }}>OR</Text>
            <TextInput
              secureTextEntry={false}
              textAlign={'center'}
              placeholder='By Sigfox ID'
              onChangeText={(text) => this.field.sigfox_id = text}
              style={{borderBottomColor: 'grey', borderWidth: 1, marginTop:10, color:'black', width:180, height:50, fontSize: 20 }}
            />
            <TouchableOpacity style={{ width:180, height:20, alignItems:'center', backgroundColor:'#1C90FF'}} onPress={() => this._request_add_point()}>
              <Text style={{ fontSize:10, color:'white' }}>Send</Text>
            </TouchableOpacity>
            {
                    this.state.error
                ?
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'red'}}>{this.state.error}</Text>
                    </View>
                :
                    null
            }
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalShareFloaterVisible} onBackdropPress={()=>this._closeModalShareFloater()} style={{ backgroundColor:'white', borderRadius:30 ,maxHeight:Dimensions.get('window').height /2}}>
          <View style={{ alignItems:'center',}}>
            <View style={{marginBottom:'5%',alignItems:'center', justifyContent:'center',}}>
              <Text style={{fontSize:30}}>Share floater</Text>
              <TextInput
                secureTextEntry={false}
                textAlign={'center'}
                placeholder='Enter an Email'
                onChangeText={(text) => this.state.email_for_share = text}
                style={{borderBottomColor: 'grey', borderWidth: 1, color:'black', width:250, height:50, fontSize: 20 }}
              />
              <TouchableOpacity style={{ width:250, height:20, alignItems:'center', justifyContent:'center', backgroundColor:'#1C90FF'}} onPress={() => this._request_share_floater_by_mail()}>
                <Text style={{ fontSize:10, color:'white' }}>Send</Text>
              </TouchableOpacity>
              {
                    this.state.error_share
                ?
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'red'}}>Cannot find this mail address</Text>
                    </View>
                :
                    null
            }
            </View>
            <ScrollView>
            {
              this.state.all_floaters_data ?
                this._display_prorietary_floaters_for_share()
              :
                <ActivityIndicator size="large" color="#0098EB" />
            }
            </ScrollView>
          </View>
        </Modal>


      </SafeAreaView> 
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    marginTop:20,
    marginHorizontal: 20,
    marginBottom:10,
  },
  view_touchable_logo_plus: {
    height: 80,
    marginTop: 10,
    backgroundColor: '#6e6e6e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img_logo_plus: {
    height:50,
    width:50,
  },
  viewTypeDevice:{
    marginTop:20,
    flexDirection:'row',

  },
  button: {
    width:'30%',
    marginLeft:'13%',
  },
  button_selected: {
    width:'30%',
    marginLeft:'13%',
    borderWidth:3,
    borderRadius:5,
  },
});
