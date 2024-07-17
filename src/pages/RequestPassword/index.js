import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native'
import api from '../../services/api'
import image from '../../../assets/imgs/logo-menu.png'
import CommonStyles from '../../CommonStyles'
import AuthInput from '../../components/AuthInput'
import { AuthContext } from '../../contexts/auth'

import Alert from '../../components/SweetAlert';

const initialState = {
    email: '',
}

export default class RequestPassword extends Component {
    static contextType = AuthContext;

    state = {
        ...initialState
    }

    solicitarRedefinicao = async () => {
        try{
            await api.post(`/password/reset`, {
                email: this.state.email,
            })

            Alert('Email enviado com sucesso! Siga as instruções do email.', 'success');
            this.setState({ ...initialState })
        } catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))

        const validForm = validations.reduce((total, atual) => total && atual)

        return (
            <View style={styles.background}>
                <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
                <Image source={image} style={styles.logo} />
                <View style={styles.formContainer}>
                    <AuthInput 
                        icon='at'
                        placeholder='E-mail' 
                        value={this.state.email} 
                        style={styles.input} 
                        onChangeText={textEmail => this.setState({ email: textEmail })} />

                    <TouchableOpacity onPress={this.solicitarRedefinicao} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                Enviar link para redefinição
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        width: 190,
        height: 190,
        marginBottom: -15
    },
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f5d39',
        
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        width: '90%',
        borderRadius: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#015b41',
        marginTop: 25,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: CommonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    },
    elevation: {
        elevation: 18,
        shadowColor: '#3a3b45',
    },
})