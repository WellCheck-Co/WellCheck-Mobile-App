import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class FloaterStateForShare extends Component{

    constructor(props){
        super(props);
        this.state = {
            api_token:this.props.api_token,
            pressStatus:false,
        };
    }

    static propTypes = {
        point_img : PropTypes.string,
        name : PropTypes.string,
        location : PropTypes.string,
        device_id : PropTypes.string,
        selected : PropTypes.any,
        removed : PropTypes.any,
    }

    changeStatePressStatus(id){
        if(this.state.pressStatus == false){
            this.setState({pressStatus:true})
            this.props.selected(id)
        }
        else if(this.state.pressStatus == true){
            this.setState({pressStatus:false})
            this.props.removed(id)
        }
    }

    render(){
          if (this.props.point_img == "blue") {
            return (
                <TouchableOpacity onPress={() => this.changeStatePressStatus(this.props.device_id)}>
                    <View style={this.state.pressStatus ? styles.view_touchable_pressed : styles.view_touchable}>
                        <View style={styles.view_point_name}>
                            <Image source={require("../../../../assets/images/points/point_bleu.png")} style={styles.img_point_bleu} />
                            <Text style={styles.device_name_text}>{this.props.name}</Text>
                        </View>
                        <Text style={styles.location_text}>{this.props.location}</Text>
                    </View>
                </TouchableOpacity>
            );
          }
          else if (this.props.point_img == "red") {
            return (
                <TouchableOpacity onPress={() => this.changeStatePressStatus(this.props.device_id)}>
                    <View style={this.state.pressStatus ? styles.view_touchable_pressed : styles.view_touchable}>
                        <View style={styles.view_point_name}>
                            <Image source={require("../../../../assets/images/points/point_rouge.png")} style={styles.img_point_rouge} />
                            <Text style={styles.device_name_text}>{this.props.name}</Text>
                        </View>
                        <Text style={styles.location_text}>{this.props.location}</Text>
                    </View>
                </TouchableOpacity>
            );
          }
          else if (this.props.point_img == "grey") {
            return (
                <TouchableOpacity onPress={() => this.changeStatePressStatus(this.props.device_id)}>
                    <View style={this.state.pressStatus ? styles.view_touchable_pressed : styles.view_touchable}>
                        <View style={styles.view_point_name}>
                            <Image source={require("../../../../assets/images/points/point_gris.png")} style={styles.img_point_bleu} />
                            <Text style={styles.device_name_text}>{this.props.name}</Text>
                        </View>
                        <Text style={styles.location_text}>{this.props.location}</Text>
                    </View>
                </TouchableOpacity>
              );
          }
    }
}

const styles = StyleSheet.create({
    view_touchable: {
      height: 60,
      marginTop: 10,
      backgroundColor: '#E2E4E6',
      width:200,
    },
    view_touchable_pressed:{
        height: 60,
        marginTop: 10,
        backgroundColor: '#E2E4E6',
        width:200,
        borderWidth:3,
        borderColor:'#2dcf27',
        borderRadius:10
    },
    view_point_name: {
      flexDirection:'row',
      flexWrap:'wrap',
      alignItems:'center',
    },
    img_point_rouge: {
      height:15,
      width:15,
      marginLeft:10
    },
    img_point_bleu: {
      height:13,
      width:13,
      marginLeft:10,
    },
    location_text: {
      fontSize: 10,
      marginLeft:10,
    },
    device_name_text: {
      fontSize:25,
      marginLeft: '20%',
      justifyContent:'center',
      alignItems:'center',
    }
});