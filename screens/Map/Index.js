import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import WCMap from './WCMap'
import Details from '../Devices/Details'

const navMap = createStackNavigator({
        WCMap: { screen: WCMap },
        Details: { screen: Details },
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        initialRouteName: 'WCMap'
    }
);
  
const NavMap = createAppContainer(navMap);
  
export default class MapIndex extends React.Component {
    render() {
        return (
            <NavMap/>
        );
    }
}