import React, {Component, useContext} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/today.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError, showSuccess } from '../../Common'
import ItemVisita from '../../components/ItemVisita';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    crentes: []
}

export default class VisitaCrente extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasCrentes()
    }

    loadVisitasCrentes = async () => {
        try{
            const res = await api.get(`/crente?id_usuario=${this.context.user.id}`)
            this.setState({ crentes: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaCrente = async id_usuario => {
        try {
            await api.post(`/crente`, {
                id_usuario: id_usuario
            })

            this.loadVisitasCrentes()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteVisitaCrente = async crenteId => {
        try {
            await api.delete(`/crente/${crenteId}?id_usuario=${this.context.user.id}`)
            this.loadVisitasCrentes()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon  name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Visitas aos Crentes</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.crentes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} textoPosQtd={"crentes"} onDelete={this.deleteVisitaCrente}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaCrente(this.context.user.id)} activeOpacity={0.7}>
                    <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background:{
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 40,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10

    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})