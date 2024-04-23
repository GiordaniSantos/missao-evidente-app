import React from 'react'
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import  Icon  from 'react-native-vector-icons/FontAwesome'
import IconCheck from 'react-native-vector-icons/FontAwesome5'

import CommonStyles from '../CommonStyles'

export default props => {
    resultadoData = props.created_at.split(" ")
    let nameIcon = null
    if(props.icon == "atoPastoral"){
        nameIcon = "check"
    }else{
        nameIcon = "user-check"
    }

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => props.openModal(props.id)}>
                <Icon name='edit' size={30} color='#FFF'/>
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name='trash' size={20} color='#FFF'style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }
    
    return (
        <GestureHandlerRootView>
            <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent} onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
                <View style={styles.container}>
                    <View style={styles.cheackContainer}>
                        <View style={styles.done}>
                            <IconCheck name={nameIcon} size={17} color='#FFF'></IconCheck>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.desc}>{props.textoAntesHora} {resultadoData[0]}</Text>
                        <Text style={styles.date}>às {resultadoData[1]}h</Text>
                        <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                            {props.nome && <Text numberOfLines={3} style={styles.date}>Visitado: {props.nome}</Text> }
                        </View>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}   

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderTopColor: '#e3e6f0',
        borderBottomColor: '#e3e6f0',
        borderRightColor: '#e3e6f0',
        borderLeftColor: '#e3e6f0',
        borderWidth: 1,
    },
    cheackContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 30,
        width: 30,
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
        fontSize: 12,
        flex: 1
    },
    right: {
        backgroundColor: '#4D7031',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingHorizontal: 20,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        marginTop: 10,
        marginLeft: -13,
        marginRight: 10
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
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