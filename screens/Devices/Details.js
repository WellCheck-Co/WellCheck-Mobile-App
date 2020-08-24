import React from 'react';
import { Dimensions, StyleSheet, SafeAreaView, ScrollView, View, Text, TouchableHighlight, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import CustomContributionGraph from '../../components/chart/details/heatMap'
import CustomLineChart from '../../components/chart/details/lineChart'
import CustomBarChart from '../../components/chart/details/stackedBarChart'
import { Bar } from 'react-native-progress';
import { SvgXml } from "react-native-svg";

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      back_to_map:this.props.navigation.state.params.back_to_map ? this.props.navigation.state.params.back_to_map : "",
      back_to_devices:this.props.navigation.state.params.back_to_devices ? this.props.navigation.state.params.back_to_devices : "",
      floater_id:this.props.navigation.state.params.floater_id,
      floater_data:{},
      floater_name:this.props.navigation.state.params.floater_name,
      bar_color:null,
      floater_score:null,
      isMonthModalVisible:false,
      isDayModalVisible:false,
      isYearModalVisible:false,
      year : 'Year',
      month : 'Month',
      day : 'Day',
      data_heatmap: null,
      data_ph: {
        labels:[],
        datasets:[{
          data:[]
        }]
      },
      data_temp: {
        labels:[],
        datasets:[{
          data:[]
        }]
      },
      data_turbidity:{
        labels:[],
        datasets:[{
          data:[]
        }]
      },
      data_redox:{
        labels:[],
        datasets:[{
          data:[]
        }]
      },
    };
  }

  getColorFromNote(noteOn100) {
    return "hsl("+ noteOn100 +", 100%, 40%)";
  }

  _request_get_all_floater_infos = async () => {
    try {
        const response = await fetch('https://api.wellcheck.fr/point/infos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token':global.infos.api_token,
                'usrtoken':global.infos.user_token,
            },
            body: JSON.stringify({
              id_point:this.state.floater_id
            })
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({error:true})
        }
        if (responseJson["succes"] == true) {
            this.setState({floater_score:responseJson['data']['data'][['data'].length-1]['data']['data']['note'], floater_data:responseJson['data'], bar_color:this.getColorFromNote(responseJson['data']['data'][['data'].length-1]['data']['data']['note']*10)})
            this.fill_data()
        }
    }
    catch (error) {
        this.setState({
            error:'Cann\'t connect to server'
        })
    }        
  }

  _map(){
    this.props.navigation.navigate('WCMap')
  }

  _devices(){
    this.props.navigation.navigate('Home')
  }

  fill_data(){
    // this.fill_heatmap()
    this.fill_ph()
    this.fill_temp()
    this.fill_redox()
    this.fill_turbidity()
    this.forceUpdate()
  }

  fill_ph(){
    this.state.floater_data['data'].map(report =>
      {
        this.state.data_ph.labels.push(new Date(report['date'] / 1000).toLocaleDateString("en-US"))
        this.state.data_ph.datasets[0].data.push(report["data"]['data']['ph'])
      })
  }

  fill_temp(){
    this.state.floater_data['data'].map(report =>
      {
        this.state.data_temp.labels.push(new Date(report['date'] / 1000).toLocaleDateString("en-US"))
        this.state.data_temp.datasets[0].data.push(report["data"]['data']['temp'])
      })
  }

  fill_turbidity(){
    this.state.floater_data['data'].map(report =>
      {
        this.state.data_turbidity.labels.push(new Date(report['date'] / 1000).toLocaleDateString("en-US"))
        this.state.data_turbidity.datasets[0].data.push(report["data"]['data']['turbidity'])
      })
  }
  fill_redox(){
    this.state.floater_data['data'].map(report =>
      {
        this.state.data_redox.labels.push(new Date(report['date'] / 1000).toLocaleDateString("en-US"))
        this.state.data_redox.datasets[0].data.push(report["data"]['data']['redox'])
      })
  }

  componentDidMount(){
    console.disableYellowBox = true;
    this._request_get_all_floater_infos()
  }

  _openModalMonth = () => {
    this.setState({
      isMonthModalVisible:true
    })
  }

  _closeModalMonth = () => {
    this.setState({
      isMonthModalVisible:false
    })
  }

  _set_month(month) {
    this.setState({
      month:month,
    })
    this._closeModalMonth()
  }

  _openModalDay = () => {
    this.setState({
      isDayModalVisible:true
    })
  }

  _closeModalDay = () => {
    this.setState({
      isDayModalVisible:false
    })
  }

  _set_day(day) {
    this.setState({
      day:day,
    })
    this._closeModalDay()
  }

  _openModalYear = () => {
    this.setState({
      isYearModalVisible:true
    })
  }

  _closeModalYear = () => {
    this.setState({
      isYearModalVisible:false
    })
  }

  _set_year(year) {
    this.setState({
      year:year,
    })
    this._closeModalYear()
  }

  display_pie_chart(type){
    if(type == "ph"){
      return (
        <CustomLineChart
            data={this.state.data_ph}
            bezier={true}
            type={"pH"}
            key={1}
        />);
    }
    if(type == "temp"){
      return (
        <CustomLineChart
            data={this.state.data_temp}
            bezier={true}
            type={"temp"}
            key={2}
        />);
    }
    
  }

  display_line_chart_bezier(){
    return (
      <CustomLineChart
          data={this.state.data_redox}
          bezier={false}
          type={"redox"}
          key={3}
      />);
  }

  display_bar_chart(){
    return (
      <CustomBarChart
          data={this.state.data_turbidity}
          key={4}
      />);
  }

  buildsvg(choice, note) {
    const label = {
        'test': '#ff970f',
        'your':'#1C94FE',
        'shared': '#79befa',
    };

    const basenote = [
        ["#ff4444", "#aa0000"],
        ["#ffff0f", "#ff970f"],
        ["#03ff00", "#039900"]
    ];


    let svg = '\
      <svg height="558pt" viewBox="0 0 558 558" width="558pt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
          <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="558" y1="279" y2="279">\
              <stop offset="0" stop-color="' + basenote[Math.floor(note / 7)][0] + '"/>\
              <stop offset="1" stop-color="' + basenote[Math.floor(note / 7)][1] + '"/>\
          </linearGradient>\
          <circle cx="279" cy="279" r="279" fill="' + label[choice] + '"/>\
          <path d="m279, 279m -250, 0a 250,250 0 1,0 500,0 a 250,250 0 1,0 -500,0" fill="url(#a)"/>\
          <path d="m425.960938 106.542969c-14.636719 0-26.5 11.863281-26.5 26.496093 0 1.726563.171874 3.414063.484374 5.046876l-36.210937 36.210937c-13.574219-8.984375-29.84375-13.367187-47.089844-12.472656-24.167969 1.257812-48.273437 12.789062-69.71875 33.351562-.664062.640625-1.324219 1.285157-1.984375 1.945313-32.925781 32.925781-62.105468 70.882812-80.0625 104.136718-23.480468 43.492188-22.882812 70.320313-15.035156 86.6875l-33.90625 33.90625c-5.859375 5.855469-5.859375 15.351563 0 21.210938 2.929688 2.929688 6.765625 4.394531 10.605469 4.394531 3.839843 0 7.679687-1.464843 10.605469-4.394531l34.121093-34.121094c6.136719 2.8125 13.636719 4.609375 22.824219 4.609375 18.851562 0 44.742188-7.539062 80.207031-29.214843 7.066407-4.320313 9.292969-13.554688 4.972657-20.621094-4.320313-7.070313-13.550782-9.300782-20.621094-4.976563-37.941406 23.195313-68.242188 30.867188-79.078125 20.03125-9.128907-9.128906-4.753907-32.777343 11.703125-63.257812 13.46875-24.949219 34.78125-53.933594 58.882812-80.402344l73.957032 73.957031c-5.660157 5.128906-11.488282 10.167969-17.449219 15.085938-6.390625 5.273437-7.296875 14.726562-2.027344 21.117187 5.273437 6.390625 14.726563 7.296875 21.117187 2.027344 12.796876-10.558594 25.03125-21.65625 36.367188-32.992187.664062-.664063 1.320312-1.332032 1.949219-1.992188 20.558593-21.4375 32.089843-45.542969 33.347656-69.707031.894531-17.257813-3.488281-33.519531-12.472656-47.09375l36.382812-36.382813c1.503907.261719 3.046875.410156 4.628907.410156 14.632812 0 26.496093-11.863281 26.496093-26.5 0-14.632812-11.863281-26.496093-26.496093-26.496093zm-58.5 134.503906c-.8125 15.679687-8.359376 31.867187-21.871094 47.0625l-74.457032-74.453125c15.191407-13.507812 31.382813-21.058594 47.066407-21.871094 13.664062-.707031 26.183593 3.796875 35.402343 12.679688.183594.207031.359376.421875.558594.621094.199219.199218.414063.375.621094.558593 8.882812 9.21875 13.390625 21.75 12.679688 35.402344zm0 0" fill="#fff"/>\
      </svg>\
      '
    
    return <SvgXml xml={svg} width="50" height="50"/>;
  }

  render() {
    const heatmap_data = [
        { date: "2017-01-02", count: 1 },
        { date: "2017-01-03", count: 2 },
        { date: "2017-01-04", count: 3 },
        { date: "2017-01-05", count: 4 },
        { date: "2017-01-06", count: 5 },
        { date: "2017-01-30", count: 2 },
        { date: "2017-01-31", count: 3 },
        { date: "2017-03-01", count: 2 },
        { date: "2017-04-02", count: 4 },
        { date: "2017-03-05", count: 2 },
        { date: "2017-02-30", count: 4 }
    ];

    const all_days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
    const all_month = ['January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December']
    const ten_years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029']
    
    return (
      <SafeAreaView style={styles.container}>
        {this.state.back_to_map != "" &&
            <View  style={{backgroundColor:"#8c8c8c"}} >
              <TouchableOpacity onPress={() => this._map()}>
                <Image source={require('../../assets/images/logo/back_page.png')} style={{height: 30, width: 30, justifyContent: 'flex-start', marginLeft:30, marginTop: 10}}/>
              </TouchableOpacity>
            </View>
          }
          {this.state.back_to_devices != "" &&
            <View  style={{backgroundColor:"#8c8c8c"}} >
              <TouchableOpacity onPress={() => this._devices()}>
                <Image source={require('../../assets/images/logo/back_page.png')} style={{height: 30, width: 30, justifyContent: 'flex-start', marginLeft:30, marginTop: 10}}/>
              </TouchableOpacity>
            </View>
          }
        <View style={styles.viewDate}>
          <Text>Choose date :</Text>
          <TouchableHighlight onPress={this._openModalDay}>
            <View style={styles.viewValueDate}>
              <Text style={styles.valueDate}>{this.state.day}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._openModalMonth}>
            <View style={styles.viewValueDateMonth}>
              <Text style={styles.valueDate}>{this.state.month}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._openModalYear}>
            <View style={styles.viewValueDate}>
              <Text style={styles.valueDate}>{this.state.year}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{justifyContent:'center', alignItems:'center'}}>
            {
              this.state.data_redox.labels.length == 0 ?
                <ActivityIndicator size="large" color="#0098EB" />
              :
              <View style={{marginTop:10}}>
                <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',flexWrap:'wrap'}}>
                  <Text style={{fontWeight: "bold"}}>Score: </Text>
                  <Text>{this.state.floater_score} / 20</Text>
                </View>
                <Bar progress={this.state.floater_score} borderWidth={0} color={this.state.bar_color} style={{backgroundColor: "darkgray"}} />
              </View>
            }
          </View>
          <View style={{justifyContent:'space-around', alignItems:'center', flexDirection:"row", marginTop:10, marginBottom:10, }}>
            <Text style={{fontSize:30}}>{this.state.floater_name}</Text>
            {this.buildsvg('test', this.state.floater_score)}
          </View>
        
        <ScrollView>
          <View>
            <CustomContributionGraph
                data={heatmap_data}
            />
            {
              this.state.data_redox.labels.length == 0?
                <ActivityIndicator size="large" color="#0098EB" />
            :
              this.display_line_chart_bezier()
            }
            {
              this.state.data_ph.labels.length == 0?
                <ActivityIndicator size="large" color="#0098EB" />
            :
                this.display_pie_chart("ph")
            }
            {
              this.state.data_turbidity.labels.length == 0?
                <ActivityIndicator size="large" color="#0098EB" />
            :
                this.display_bar_chart()
            }
            {
              this.state.data_temp.labels.length == 0?
                <ActivityIndicator size="large" color="#0098EB" />
            :
                this.display_pie_chart("temp")
            }
            <View>
            <TouchableOpacity onPress={() => this._details()}>
              <View style={styles.view_touchable}>
                <Text style={{ fontSize:20, marginLeft:15, marginRight:15, color:"white" }}>Generate weekly report</Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Modal isVisible={this.state.isMonthModalVisible} onBackdropPress={()=>this._closeModalMonth()} style={styles.modal}>
          <View style={styles.viewModal}>
            <ScrollView style={styles.viewScrollView}>
              
              {all_month.map(month => 
                <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_month(month)} key={month}>
                    <Text style={styles.valueDate}>{month}</Text>
                </TouchableOpacity>
              )}
              
            </ScrollView>
          </View>
        </Modal>
        <Modal isVisible={this.state.isDayModalVisible} onBackdropPress={()=>this._closeModalDay()} style={styles.modal}>
          <View style={styles.viewModal}>
            <ScrollView style={styles.viewScrollView}>
              {all_days.map(day => 
                  <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_day(day)} key={day}>
                      <Text style={styles.valueDate}>{day}</Text>
                  </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </Modal>
        <Modal isVisible={this.state.isYearModalVisible} onBackdropPress={()=>this._closeModalYear()} style={styles.modal}>
          <View style={styles.viewModal}>
            <ScrollView style={styles.viewScrollView}>
              {ten_years.map(year => 
                  <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_year(year)} key={year}>
                      <Text style={styles.valueDate}>{year}</Text>
                  </TouchableOpacity>
              )}
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
    viewDate: {
        flexDirection:'row', 
        flexWrap:'wrap', 
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor:'#8c8c8c'
    },
    viewValueDate:{
      height:50,
      width:80,
      alignItems:'center',
      justifyContent:'center'
    },
    viewValueDateMonth:{
      height:50,
      width:110,
      alignItems:'center',
      justifyContent:'center'
    },
    valueDate:{
      fontSize:20,
      color:'white'
    },
    view_touchable: {
      height: 50,
      marginTop: 30,
      backgroundColor: '#6b8af2',
      marginBottom:30,
      justifyContent:'center',
      alignItems:'center',
    },
    touchableModal:{
      width:180,
      height:70,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#1C90FF',
      marginTop:1
    },
    viewModal:{
      alignItems:'center',
      justifyContent: 'center'
    },
    viewScrollView:{
      marginTop:10,
      marginBottom:10
    },
    modal:{
      backgroundColor:'white',
      borderRadius:30,
      maxHeight:Dimensions.get('window').height / 3
    }
});
