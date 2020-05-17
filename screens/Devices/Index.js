import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import Home from './Home'
import Details from './Details'
import AddFloaterByQrCode from './AddFloaterByQrCode'

const navDev = createStackNavigator({
        Home: { screen: Home },
        Details: { screen: Details },
        AddFloaterByQrCode: { screen: AddFloaterByQrCode }
    },
    {
        headerMode: 'none'
    }
);
  
const NavDev = createAppContainer(navDev);
  
export default class DeviceIndex extends React.Component {
    render() {
        return (
            <NavDev/>
        );
    }
}