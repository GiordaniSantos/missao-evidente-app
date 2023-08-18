import React, { Component } from 'react'
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import api from '../../services/api'

import backgroundImage from '../../../assets/imgs/map.png'
import CommonStyles from '../../CommonStyles'
import AuthInput from '../../components/AuthInput'
import { AuthContext } from '../../contexts/auth'

import { showError, showSuccess } from '../../Common'

const initialState = { 
    name: '',
    email: 'giordani.santos.silveira@gmail.com',
    password: 'Dani@war13',
    confirmPassword: '',
    telaCriacao: false,
    user: {}
}

export default class SignIn extends Component {
    static contextType = AuthContext;

    state = {
        ...initialState
    }

    signinOrSiginUp = () => {
        if(this.state.telaCriacao){
            this.cadastrarUsuario()
        } else {
            this.handleSignIn()
        }
    }

    handleSignIn = () => {
        this.context.signIn(this.state.email, this.state.password);   
    }

    cadastrarUsuario = async () => {
        try{
            await api.post(`/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            })

            showSuccess('Usuário cadastrado com sucesso!')
            this.setState({ ...initialState })
        } catch(e) {
            showError(e)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if(this.state.telaCriacao){
            validations.push(this.state.name && this.state.name.trim().length >= 3)
        }

        const validForm = validations.reduce((total, atual) => total && atual)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Missão Evidente</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>{this.state.telaCriacao ? 'Crie a sua conta' : 'Informe seus dados'}</Text>
                    {this.state.telaCriacao && 
                    <AuthInput 
                        icon='user' 
                        placeholder='Nome' 
                        value={this.state.name} 
                        style={styles.input} 
                        onChangeText={textName => this.setState({ name: textName })} />}
                    <AuthInput 
                        icon='at'
                        placeholder='E-mail' 
                        value={this.state.email} 
                        style={styles.input} 
                        onChangeText={textEmail => this.setState({ email: textEmail })} />
                    <AuthInput 
                        icon='lock' 
                        placeholder='Senha' 
                        value={this.state.password} 
                        secureTextEntry={true} style={styles.input} 
                        onChangeText={textSenha => this.setState({ password: textSenha })} />

                    <TouchableOpacity onPress={this.signinOrSiginUp} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.telaCriacao ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ telaCriacao: !this.state.telaCriacao })}>
                    <Text style={styles.buttonText}>
                        {this.state.telaCriacao ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.secondary,
        fontSize: 30,
        marginBottom: 10
    }, 
    subTitle: {
        fontFamily: CommonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(6, 3, 21, .99)',
        
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },
    buttonText: {
        fontFamily: CommonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})