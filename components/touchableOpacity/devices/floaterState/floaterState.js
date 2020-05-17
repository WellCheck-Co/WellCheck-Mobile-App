import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class FloaterState extends Component{

    constructor(props){
        super(props);
        this.state = {
            api_token:this.props.api_token,
        };
    }

    static propTypes = {
        point_img : PropTypes.string,
        name : PropTypes.string,
        location : PropTypes.string,
        owner : PropTypes.string,
        navigation : PropTypes.any,
        id : PropTypes.string,
    }

    _details = (floater_id, floater_name) => {
        this.props.navigation('Details', {floater_id:floater_id, floater_name:floater_name})
    }

    render(){
          if (this.props.point_img == "blue") {
            return (
            <TouchableOpacity onPress={() => this._details(this.props.id, this.props.name)}>
                <View style={styles.view_touchable}>
                    <View style={styles.view_point_name}>
                        <Image source={require("../../../../assets/images/points/point_bleu.png")} style={styles.img_point_bleu} />
                        <Text style={styles.device_name_text}>{this.props.name}</Text>
                    </View>
                    <Text style={styles.location_text}>{this.props.location}   |   Add by : {this.props.owner}</Text>
                </View>
            </TouchableOpacity>
            );
          }
          else if (this.props.point_img == "red") {
            return (
            <TouchableOpacity onPress={() => this._details(this.props.id)}>
                <View style={styles.view_touchable}>
                    <View style={styles.view_point_name}>
                        <Image source={require("../../../../assets/images/points/point_rouge.png")} style={styles.img_point_rouge} />
                        <Text style={styles.device_name_text}>{this.props.name}</Text>
                    </View>
                    <Text style={styles.location_text}>{this.props.location}   |   Add by : {this.props.owner}</Text>
                </View>
            </TouchableOpacity>
            );
          }
          else if (this.props.point_img == "green") {
            return (
                  <View style={styles.view_touchable}>
                      <View style={styles.view_point_name}>
                          <Image source={require("../../../../assets/images/points/point_vert.png")} style={styles.img_point_bleu} />
                          <Text style={styles.device_name_text}>{this.props.name}</Text>
                      </View>
                      <Text style={styles.location_text}>{this.props.location}   |   Add by : {this.props.owner}</Text>
                  </View>
              );
          }
    }
}

const styles = StyleSheet.create({
    view_touchable: {
      height: 60,
      marginTop: 10,
      backgroundColor: '#E2E4E6',
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
      marginLeft: 10
    }
});