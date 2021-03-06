import React, { Component } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomLineChart extends Component{

    static propTypes = {
        data : PropTypes.Array,
        bezier : PropTypes.bool,
    }

    render() {
        const chartConfig = {
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#0098EB",
            backgroundGradientTo: "#c2c8cf",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }

        const screenWidth = Dimensions.get("window").width;
        
        if(this.props.bezier == true){
            return (
                <View style={styles.container}>
                    <View style={styles.viewText}>
                        <Text>pH</Text>
                    </View>
                    <LineChart
                        style={{borderRadius: 10}}
                        data={this.props.data}
                        width={screenWidth - 50}
                        height={250}
                        chartConfig={chartConfig}
                        bezier
                        verticalLabelRotation={15}
                    />
                </View>
            );
        }
        else{
            return (
                <View style={styles.container}>
                    <View style={styles.viewText}>
                        <Text>Score</Text>
                    </View>
                    <LineChart
                        style={{borderRadius: 10}}
                        data={this.props.data}
                        width={screenWidth - 50}
                        height={250}
                        chartConfig={chartConfig}
                        verticalLabelRotation={15}
                    />
                </View>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F2F2F2',
        marginTop: 20
    },
    viewText:{
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center', 
        justifyContent:'center'
    },
})