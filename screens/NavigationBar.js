import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Devices from './Devices/Index';
import Profile from './Profile';
import WCMap from './Map/Index';
import Settings from './Settings';

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName={"Map"} barStyle={{ backgroundColor: 'white' }} activeColor={"dodgerblue"}>
                <Tab.Screen name="Devices" component={Devices} options={{
                tabBarIcon: ({ color }) => {
                    return <MaterialIcon name={"opacity"} size={25} color={color} />;
                }}} />
                <Tab.Screen name="Map" component={WCMap} options={{
                tabBarIcon: ({ color }) => {
                    return <MaterialIcon name={"map"} size={25} color={color} />;
                }}} />
                <Tab.Screen name="Profile" component={Profile} options={{
                tabBarIcon: ({ color }) => {
                    return <MaterialIcon name={"person"} size={25} color={color} />;
                }}} />
                <Tab.Screen name="Settings" component={Settings} options={{
                tabBarIcon: ({ color }) => {
                    return <MaterialIcon name={"settings"} size={25} color={color} />;
                }}} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
