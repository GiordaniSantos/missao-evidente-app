import React, {Component} from 'react';
import {View, StyleSheet, Text, StatusBar, Image} from 'react-native'
import image from '../../../assets/imgs/logo-menu.png'

export default class NoInternet extends Component {
    render(){
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.24)" animated />
                <View style={styles.containerLogo}>
                    <Image source={image} style={styles.logo} />
                </View>
                <View style={[styles.box, styles.elevation]}>
                    <Text style={styles.title}>Sem Internet</Text>
                    <Text>Por favor, verifique sua conexão com a internet.</Text>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#0f5d39',
    },
    containerLogo:{
        alignItems: 'center',
        marginTop: -50
    },
    logo:{
        width: 120,
        height: 120,
    },
    box: {
        alignItems: 'center',
        marginTop: -5,
        height:130,
        backgroundColor: '#fff',
        borderTopColor: '#e3e6f0',
        borderBottomColor: '#e3e6f0',
        borderRightColor: '#e3e6f0',
        borderLeftColor: '#e3e6f0',
        borderWidth: 1,
        margin: 10,
        padding: 15,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69)',
    },
})