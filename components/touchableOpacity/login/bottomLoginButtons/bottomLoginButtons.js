import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button } from 'react-native';
import PropTypes from 'prop-types';

export default class BottomLoginButtons extends Component{

    constructor(props){
        super(props);
        this.state = {
            error:"",
        };
    }

    static propTypes = {
        page : PropTypes.string,
        navigation : PropTypes.any,
        mail : PropTypes.string,
        password : PropTypes.string,
        password2: PropTypes.string,
    }

    _map = () => {
        this.props.navigation.navigate('Home')
    }

    _register = () => {
        this.props.navigation.navigate('Register')
    }

    _login = () => {
        this.props.navigation.navigate('Login')
    }

    _request_signin = async () => {
        try {
            const response = await fetch('https://api.wellcheck.fr/signin/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token':global.infos.api_token
                },
                body: JSON.stringify({
                    "email":this.props.mail,
                    "password1": this.props.password,
                })
            });
            const responseJson = await response.json();
            console.log(responseJson)
            if (responseJson["succes"] == false) {
                this.setState({
                    error:'This account does not exists'
                })
            }
            if (responseJson["succes"] == true) {
                global.infos.user_token = responseJson['data']['usrtoken'];
                this._map()
            }
        }
        catch (error) {
            this.setState({
                error:'Cann\'t connect to server'
            })
        }        
    }

    _request_signup = async () => {
        try {
            const response = await fetch('https://api.wellcheck.fr/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token':global.infos.api_token
                },
                body: JSON.stringify({
                    "email":this.props.mail,
                    "password1": this.props.password,
                    "password2": this.props.password2
                })
            });
            const responseJson = await response.json();
            if (responseJson["succes"] == false) {
              this.setState({
                error:'Cannot create this account'
              })
              console.log(responseJson)
            }
            if (responseJson["succes"] == true) {
                this.setState({error:'Mail sent'})
            }
        }
        catch (error) {
            console.log(error)
            this.setState({
                error:'Cann\'t connect to server'
            })
        }        
    }

    render(){
        if(this.props.page == "Register"){
            return (
                <View style={styles.viewRedirectButton}>
                    <View style={styles.redirectButton}>
                    {
                            this.state.error
                        ?
                            <View>
                                <Text style={{color:'red'}}>{this.state.error}</Text>
                            </View>
                        :
                            null
                    }
                    </View>
                    <View style={styles.redirectButton}>
                        <View style={styles.button}>
                            <Button
                                type="Solid Button"
                                title="Create my account"
                                onPress={() => this._request_signup()}/>
                        </View>
                    </View>
                    <View style={styles.redirectButton}>
                        <TouchableOpacity onPress={() => this._login()}>
                            <Text style={{color:'black'}}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else if(this.props.page == "Login"){
            return (
                <View style={styles.viewRedirectButton}>
                    <View style={styles.redirectButton}>
                    {
                            this.state.error
                        ?
                            <View>
                                <Text style={{color:'red'}}>{this.state.error}</Text>
                            </View>
                        :
                            null
                    }
                    </View>
                    <View style={styles.redirectButton}>
                        <View style={styles.button}>
                            <Button
                                type="Solid Button"
                                title="Sign In"
                                onPress={() => this._request_signin()}
                            />
                        </View>
                    </View>
                    <View style={styles.redirectButton}>
                        <TouchableOpacity onPress={() => this._register()}>
                            <Text style={{color:'black'}}>Create my account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }        
    }
}

const styles = StyleSheet.create({
    viewRedirectButton:{
        marginBottom:'5%',
    },

    redirectButton:{
        width: '100%',
        alignItems: 'center',
        marginBottom:10,
    },

    button: {
        marginTop:15,
        width:'55%',
        color: 'white',
    },
})