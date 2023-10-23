import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/fundo-ipb3.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError } from '../../Common'
import ItemVisita from '../../components/ItemVisita';
import EditModal from '../../components/EditModal';
import Alert from '../../components/SweetAlert';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    enfermoBuscado: [],
    enfermos: []
}

export default class VisitaEnfermo extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasEnfermos()
    }

    loadVisitasEnfermos = async () => {
        try{
            const res = await api.get(`/enfermo?id_usuario=${this.context.user.id}`)
            this.setState({ enfermos: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaEnfermo = async id_usuario => {
        try {
            await api.post(`/enfermo`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadVisitasEnfermos()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    updateEnfermo = async enfermo => {
        try {
            await api.put(`/enfermo/${enfermo.id}?id_usuario=${enfermo.id_usuario}`, {
                created_at: enfermo.date,
                id_usuario: enfermo.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadVisitasEnfermos)

        } catch (error) {
            showError(error)
        }

    }

    deleteVisitaEnfermo = async enfermoId => {
        try {
            await api.delete(`/enfermo/${enfermoId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadVisitasEnfermos()
        } catch (error) {
            showError(error)
        }
    }

    buscarEnfermo = async id => {
        try {
            const res = await api.get(`/enfermo/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ enfermoBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarEnfermo(id)
        this.setState({ showModal: true })
    }


    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.enfermoBuscado} tituloHeader={"Editar Data de Visita ao Enfermo"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEnfermo}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Visitas aos Enfermos</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.enfermos} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaEnfermo}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaEnfermo(this.context.user.id)} activeOpacity={0.7}>
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
        flex: 2
    },
    taskList: {
        flex: 6
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 26,
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