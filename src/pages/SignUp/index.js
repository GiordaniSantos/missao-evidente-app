import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, Linking } from 'react-native'
import api from '../../services/api'

import image from '../../../assets/imgs/logo-menu.png'
import backgroundImage from '../../../assets/imgs/map.png'
import CommonStyles from '../../CommonStyles'
import AuthInput from '../../components/AuthInput'
import { AuthContext } from '../../contexts/auth'

import Alert from '../../components/SweetAlert';

const initialState = { 
    name: '',
    email: '',
    password: '',
}

export default class SignUp extends Component {
    static contextType = AuthContext;

    state = {
        ...initialState
    }

    cadastrarUsuario = async () => {
        try{
            await api.post(`/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            })

            Alert('Usuário cadastrado com sucesso! Lembre-se de utilizar um email válido para caso precise utilizar a recuperação de senha.', 'success');
            this.context.signIn(this.state.email, this.state.password); 
            this.setState({ ...initialState })
        } catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    render() {
        const { navigation } = this.props;

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)
        validations.push(this.state.name && this.state.name.trim().length >= 3)

        const validForm = validations.reduce((total, atual) => total && atual)

        return (
            <View style={styles.background}>
                <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
                <Image source={image} style={styles.logo} />
                <View style={styles.formContainer}>
                    <AuthInput 
                        icon='user' 
                        placeholder='Nome' 
                        value={this.state.name} 
                        style={styles.input} 
                        onChangeText={textName => this.setState({ name: textName })} />
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

                    <TouchableOpacity onPress={this.cadastrarUsuario} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                Registrar
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Entrar')}>
                    <Text style={styles.buttonText}>
                        Já possui conta?
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.secondary,
        fontSize: 26,
        backgroundColor: '#015b41',
        borderRadius: 8,
        paddingTop:20,
        paddingLeft:45,
        paddingRight:45,
        paddingBottom:20,
        marginBottom: -40,
        zIndex:1
    }, 
    subTitle: {
        fontFamily: CommonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10
    },
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