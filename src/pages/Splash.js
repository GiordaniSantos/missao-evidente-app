import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native'

export default class Splash extends Component { 
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#0f5d39" barStyle="light-content" />
                <Image source={require('../../assets/imgs/logo-menu.png')} style={styles.image}/>
                <Text style={styles.header}>Missão Evidente</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f5d39'
    },
    image: {
        height: 200,
        width: 200,
        resizeMode: 'contain'
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF'
    }
})