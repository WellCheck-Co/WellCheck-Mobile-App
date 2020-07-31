import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { StyleSheet } from 'react-native';

export default class LogoWellCheckTop extends Component {
    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <Image source={require('../../../assets/images/logo/wellcheck_logo.png')} style={styles.logoImage}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logoImage:{
        marginTop:10,
        height:150,
        width:250,
    },
})