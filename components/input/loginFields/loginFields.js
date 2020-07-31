import React, { Component } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Header } from 'react-navigation';
import Modal from 'react-native-modal';

export default class LoginFields extends Component {

    constructor(props){
        super(props);
        this.state = {
            isModalVisible:false,
            error:false,
        };
        this.field = {
            mail:""
        }
    }

    static propTypes = {
        setMail : PropTypes.any,
        setPassword : PropTypes.any,
        setPassword2 : PropTypes.any,
        page : PropTypes.string,
    }

    _sendNewPass = () => {
        //On le fait avec le field pour le new pass
        this.setState({
            error:true
        })
    }
  
    _openModal = () => {
      this.setState({
        isModalVisible:true
      })
    }
  
    _closeModal = () => {
      this.setState({
        isModalVisible:false
      })
    }

    render() {
        if(this.props.page == "Login"){
            return (
                <KeyboardAvoidingView
                    keyboardVerticalOffset = {Header.HEIGHT + 20}
                    style = {{ flex: 1, marginTop:'50%' }}
                    behavior = "padding" >

                    <View style={{ justifyContent:'center', alignItems:'center' }}>
                        <View style={styles.viewInput}>
                            <Text style={styles.textNameField}>E-mail address :</Text>
                            <View style={styles.viewTextInput}>
                                <TextInput
                                    textAlign={'left'}
                                    onChangeText={(text) => this.props.setMail(text)}
                                    style={styles.textInput}/>
                            </View>
                        </View>
                        <View style={styles.viewInput}>
                            <Text style={styles.textNameField}>Password :</Text>
                            <View style={styles.viewTextInput}>
                                <TextInput
                                    secureTextEntry={true}
                                    textAlign={'left'}
                                    onChangeText={(text) => this.props.setPassword(text)}
                                    style={styles.textInput}/>
                            </View>
                        </View>
                        <View style={{alignSelf: 'flex-end', marginRight:'10%',marginTop:10}}>
                            <TouchableOpacity onPress={() => this._openModal()}>
                                <Text style={{color:'black'}}>password forgotten ?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Modal isVisible={this.state.isModalVisible} onBackdropPress={()=>this._closeModal()} style={{ backgroundColor:'white', borderRadius:20 ,maxHeight:Dimensions.get('window').height / 5}}>
                            <View style={{ alignItems:'center', justifyContent:'center' }}>
                                <Text style={{fontSize:25}}>Mail address</Text>
                                <View style={{flexDirection:'row', flexWrap:'wrap', marginTop:20}}>
                                    <View style={styles.viewTextInput}>
                                        <TextInput
                                            textAlign={'left'}
                                            onChangeText={(text) => this.field.mail = text}
                                            style={{width:200, height:30, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius:5}}/>
                                    </View>
                                    <TouchableOpacity style={{borderRadius:5, width:60, height:30, alignItems:'center', justifyContent:'center', backgroundColor:'#1C90FF', marginTop:1}} onPress={() => this._sendNewPass()}>
                                        <Text style={{ fontSize:10, color:'white' }}>Send</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                {
                                        this.state.error
                                    ?
                                        <View>
                                            <Text style={{color:'red'}}>Can not send email, contact us at hello@wellcheck.fr</Text>
                                        </View>
                                    :
                                        null
                                }
                                </View>
                            </View>
                        </Modal>
                    </View>
                </KeyboardAvoidingView>
            );
        }else if (this.props.page == "Register"){
            return (
                <KeyboardAvoidingView
                    keyboardVerticalOffset = {Header.HEIGHT + 20}
                    style = {{ flex: 1, marginTop:'40%' }}
                    behavior = "padding" >
                    <View style={{ justifyContent:'center', alignItems:'center' }}>
                        <View style={styles.viewInput}>
                            <Text style={styles.textNameField}>E-mail address :</Text>
                            <View style={styles.viewTextInput}>
                                <TextInput
                                    textAlign={'left'}
                                    onChangeText={(text) => this.props.setMail(text)}
                                    style={styles.textInput}/>
                            </View>
                        </View>

                        <View style={styles.viewInput}>
                            <Text style={styles.textNameField}>Password :</Text>
                            <View style={styles.viewTextInput}>
                                <TextInput
                                    secureTextEntry={true}
                                    textAlign={'left'}
                                    onChangeText={(text) => this.props.setPassword(text)}
                                    style={styles.textInput}/>
                            </View>
                        </View>

                        <View style={styles.viewInput}>
                            <Text style={{}}>Confirm password :</Text>
                            <View  style={styles.viewTextInput}>
                                <TextInput
                                    secureTextEntry={true}
                                    textAlign={'left'}
                                    onChangeText={(text) => this.props.setPassword2(text)}
                                    style={styles.textInput}/>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            );
        }
    }
}

const styles = StyleSheet.create({
    viewTextInput :{
        color:'white',
        marginLeft:10,
        marginRight:10,
    },

    viewInput:{
        borderRadius:2,
        height:55,
        marginTop:10,
        width: '80%',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },

    textNameField:{
        color:'black',
        marginLeft:2
    },

    textInput:{
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginBottom:10,
        color:'white'
    }
})