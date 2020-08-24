import React, { Component } from 'react';
import { ContributionGraph } from 'react-native-chart-kit'
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomContributionGraph extends Component{

    static propTypes = {
        data : PropTypes.array.isRequired,
    }

    render() {
        const chartConfig = {
            backgroundColor: "#e61300",
            backgroundGradientFrom: '#d6d6d6',
            backgroundGradientTo: "#d6d6d6",
            color: (opacity = 1) => `rgba(69, 68, 68, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(84, 84, 84, ${opacity})`,
        }

        const screenWidth = Dimensions.get("window").width;
      
        return (
            <View style={styles.container}>
                <View style={styles.viewText}>
                    <Text>Average</Text>
                </View>
                <ContributionGraph
                    values={this.props.data}
                    endDate={new Date("2017-04-01")}
                    numDays={105}
                    width={screenWidth - 50}
                    height={220}
                    chartConfig={chartConfig}
                    style={{ borderRadius:10}}
                />
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