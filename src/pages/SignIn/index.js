import React, { Component } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native'
import image from '../../../assets/imgs/logo-menu.png'
import CommonStyles from '../../CommonStyles'
import { connect } from 'react-redux'
import { login } from '../../store/actions/user'
import AuthInput from '../../components/AuthInput'


const initialState = {
    email: '',
    password: '',
}

class SignIn extends Component {

    state = {
        ...initialState
    }

    handleSignIn = () => {
        this.props.onLogin({ ...this.state })
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
                            {this.props.isLoading ? <ActivityIndicator size="small" color="#fff" style={{marginLeft: -20, marginRight: 15}} /> : null }
                            <Text style={styles.buttonText}>
                                {this.props.isLoading ? 'Entrando' : 'Entrar'}
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
        flexDirection: 'row',
        justifyContent: 'center',
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

const mapStateToProps = ({ user }) => {
    return {
        isLoading: user.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogin: user => dispatch(login(user))
    }
}

//export default Login
export default connect(mapStateToProps, mapDispatchToProps)(SignIn)