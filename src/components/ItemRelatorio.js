import React from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import  Icon  from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import CommonStyles from '../CommonStyles'

export default props => {
    moment.locale('pt-br')
    
    return (
        <View>
            <View style={styles.container}>
                <View>
                    <Text style={[styles.text]}><Text style={{color: props.cor}}>{props.nome}</Text>: {props.quantidade} pessoas</Text>
                    <Text style={styles.text}>(Registro criado em {moment(props.created_at).format('DD/MM/YYYY')})</Text>
                </View>
            </View>
        </View>
    )
}   

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",

        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF'
    },
    text:{
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.secondary,
        fontSize: 14,
        marginLeft: 0,
        marginBottom: 7,
        color: '#585b58'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 33,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: CommonStyles.fontFamily,
        color: CommonStyles.colors.subText,
        fontSize: 12
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center'
    },
    excludeText: {
        fontFamily: CommonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})