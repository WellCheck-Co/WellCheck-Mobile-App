import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Register from './screens/Register'
import ForgetPassword from './screens/ForgetPassword'
import tabBar from './screens/NavigationBar' 
import Details from './screens/Devices/Details'

global.infos = {api_token: "", user_token: ""};

const navDec = createStackNavigator({
  Welcome: { screen: Welcome },
  Login: { screen:Login },
  Register: { screen:Register },
  ForgetPassword: { screen:ForgetPassword },
  Devices: { screen:Details },
  Home: { screen:tabBar}
},
{
  headerMode: 'none'
});

const Nav = createAppContainer(navDec);

export default class App extends React.Component {
  render() {
    return (
        <Nav/>
      );
  }
}
