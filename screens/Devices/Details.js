import React from 'react';
import { Dimensions, StyleSheet, SafeAreaView, ScrollView, View, Text, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import CustomContributionGraph from '../../components/chart/details/heatMap'
import CustomLineChart from '../../components/chart/details/lineChart'
import CustomBarChart from '../../components/chart/details/stackedBarChart'
import { Bar } from 'react-native-progress';
// import {BarChart} from 'react-native-chart-kit'

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      back_to_map:this.props.navigation.state.params.back_to_map ? this.props.navigation.state.params.back_to_map : "",
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
        />);
    }
    if(type == "temp"){
      return (
        <CustomLineChart
            data={this.state.data_temp}
            bezier={true}
            type={"temp"}
        />);
    }
    
  }

  display_line_chart_bezier(){
    return (
      <CustomLineChart
          data={this.state.data_redox}
          bezier={false}
          type={"redox"}
      />);
  }

  display_bar_chart(){
    return (
      <CustomBarChart
                data={this.state.data_turbidity}
      />);
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
        <View style={styles.viewDate}>
          <Text>Choose date :</Text>
          <TouchableHighlight onPress={this._openModalDay}>
            <View style={styles.viewValueDate}>
              <Text style={styles.valueDate}>{this.state.day}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._openModalMonth}>
            <View style={styles.viewValueDate}>
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
          <Text style={{fontSize:40}}>{this.state.floater_name}</Text>
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
                <Text style={{ fontSize:20, marginLeft:15, marginRight:15 }}>Generate weekly report</Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
          {this.state.back_to_map != "" &&
            <View>
              <TouchableOpacity onPress={() => this._map()} style={{alignItems:'center', justifyContent:'center', backgroundColor:"white", height:40}}>
                <Text>Back to map</Text>
              </TouchableOpacity>
            </View>
          }
        <Modal isVisible={this.state.isMonthModalVisible} onBackdropPress={()=>this._closeModalMonth()} style={styles.modal}>
          <View style={styles.viewModal}>
            <ScrollView style={styles.viewScrollView}>
              
              {all_month.map(month => 
                <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_month(month)}>
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
                  <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_day(day)}>
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
                  <TouchableOpacity style={styles.touchableModal} onPress={() => this._set_year(year)}>
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
      height:80,
      width:90,
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
      backgroundColor: '#f8faaf',
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
