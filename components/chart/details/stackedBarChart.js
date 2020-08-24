import React, { Component } from 'react';
import { BarChart } from 'react-native-chart-kit'
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomBarChart extends Component{

    static propTypes = {
        data : PropTypes.object.isRequired,
    }

    render() {
        const chartConfig = {
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#0098EB",
            backgroundGradientTo: "#c2c8cf",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }

        const screenWidth = Dimensions.get("window").width;
      
        return (
            <View style={styles.container}>
                <View style={styles.viewText}>
                    <Text>Turbidity</Text>
                </View>
                <BarChart
                    style={{ borderRadius: 10 }}
                    data={this.props.data}
                    width={screenWidth -50}
                    height={250}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                />
                {/* <StackedBarChart
                    style={{ borderRadius: 10 }}
                    data={this.props.data}
                    width={screenWidth - 50}
                    height={220}
                    chartConfig={chartConfig}
                /> */}
            </View>
        );
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