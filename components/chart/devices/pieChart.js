import React, { Component } from 'react';
import { PieChart } from 'react-native-chart-kit'
import { StyleSheet, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomPieChart extends Component{

    static propTypes = {
        data : PropTypes.Array,
    }

    render() {
        const chartConfig = {
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#0098EB",
            backgroundGradientTo: "#c2c8cf",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }

        const width = Dimensions.get("window").width;
      
        return (
            <View style={styles.viewPieChart}>
                <PieChart
                    data={this.props.data}
                    width={width - 50}
                    height={130}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewPieChart:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#E2E4E6'
    },
})