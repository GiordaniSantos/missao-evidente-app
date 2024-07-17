import React, { useState } from 'react'
import { Image, Text, StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native'
import api from '../../services/api'

import image from '../../../assets/imgs/logo-menu.png'
import CommonStyles from '../../CommonStyles'
import AuthInput from '../../components/AuthInput'
import { useNavigation } from '@react-navigation/native';
import Alert from '../../components/SweetAlert';

const ModifyPassword = ({ route }) => {
    const { params } = route;
    const token = params? params.token : null;

    const navigation = useNavigation();
  
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const redefinirSenha = async () => {
      try {
        await api.post(`/password/reset/${token}`, {
          password: newPassword,
          password_confirmation: confirmPassword
        });
  
        Alert('Senha redefinida com sucesso!', 'uccess');
        navigation.navigate('Entrar');
      } catch (e) {
        Alert(e.response.data.message, 'error');
      }
    };
  
    const validations = [
      newPassword && newPassword.length >= 6,
      confirmPassword === newPassword
    ];
  
    const validForm = validations.reduce((total, atual) => total && atual);
  
    return (
        <View style={styles.background}>
            <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
            <Image source={image} style={styles.logo} />
            <View style={styles.formContainer}>
            <AuthInput
                icon="lock"
                placeholder="Nova Senha"
                value={newPassword}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(textSenha) => setNewPassword(textSenha)}
            />
    
            <AuthInput
                icon="lock"
                placeholder="Confirmar Nova Senha"
                value={confirmPassword}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(textSenha) => setConfirmPassword(textSenha)}
            />
    
            <TouchableOpacity onPress={redefinirSenha} disabled={!validForm}>
                <View style={[styles.button, validForm? {} : { backgroundColor: '#AAA' }]}>
                <Text style={styles.buttonText}>Redefinir Senha</Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
};

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

export default ModifyPassword;