import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, StatusBar, Image } from 'react-native'
import image from '../../assets/imgs/logo-menu.png'

import CommonStyles from '../CommonStyles'


export default class Welcome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { navigation } = this.props;
        
        return (
            <View style={styles.mainContainer}>
                <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
                <Image source={image} style={styles.logo} />
                <Text style={[styles.title, styles.elevation]}>Missão Evidente</Text>
                <View style={styles.formContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Entrar')}>
                        <View style={[styles.button]}>
                            <Text style={styles.buttonText}>
                                Entrar
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Registre-se')}>
                        <View style={[styles.button]}>
                            <Text style={styles.buttonText}>
                                Registre-se
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f5d39'
    },
    logo: {
        width: 190,
        height: 190,
        marginBottom: -25
    },
    title: {
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.secondary,
        fontSize: 26,
        fontWeight: 'bold',
        borderRadius: 8,
        marginBottom: 20,
        zIndex:1
    }, 
    formContainer: {
        padding: 15,
        width: '90%',
        borderRadius: 10
    },
    button: {
        backgroundColor: '#FFF',
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7,
        marginBottom: -5
    },
    buttonText: {
        fontFamily: CommonStyles.fontFamily,
        color: '#0f5d39',
        //textTransform: 'uppercase',
        fontSize: 20
    },
    elevation: {
        elevation: 18,
        shadowColor: '#3a3b45',
    },
})