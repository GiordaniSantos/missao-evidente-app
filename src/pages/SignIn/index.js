import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native'
import image from '../../../assets/imgs/logo-menu.png'
import CommonStyles from '../../CommonStyles'
import AuthInput from '../../components/AuthInput'
import { AuthContext } from '../../contexts/auth'


const initialState = {
    email: '',
    password: '',
}

export default class SignIn extends Component {
    static contextType = AuthContext;

    state = {
        ...initialState
    }

    handleSignIn = () => {
        this.context.signIn(this.state.email, this.state.password);   
    }

    render() {
        const { navigation } = this.props;

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

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
                    <AuthInput 
                        icon='lock' 
                        placeholder='Senha' 
                        value={this.state.password} 
                        secureTextEntry={true} style={styles.input} 
                        onChangeText={textSenha => this.setState({ password: textSenha })} />

                    <TouchableOpacity onPress={this.handleSignIn} disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Registre-se')}>
                    <Text style={styles.buttonText}>
                        Ainda não possui conta?
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Redefinição de Senha')}>
                    <Text style={styles.buttonText}>
                        Esqueceu sua senha?
                    </Text>
                </TouchableOpacity>
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