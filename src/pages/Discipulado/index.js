import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
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

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    discipuladoBuscado: [],
    discipulado: []
}

export default class Discipulado extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadDiscipulado()
    }

    loadDiscipulado = async () => {
        try{
            const res = await api.get(`/discipulado?id_usuario=${this.context.user.id}`)
            this.setState({ discipulado: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addDiscipulado = async id_usuario => {
        try {
            await api.post(`/discipulado`, {
                id_usuario: id_usuario
            })

            this.loadDiscipulado()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    updateDiscipulado = async discipulado => {
        try {
            await api.put(`/discipulado/${discipulado.id}?id_usuario=${discipulado.id_usuario}`, {
                created_at: discipulado.date,
                id_usuario: discipulado.id_usuario
            })

            this.setState({ showModal: false }, this.loadDiscipulado)

        } catch (error) {
            showError(error)
        }

    }

    deleteDiscipulado = async discipuladoId => {
        try {
            await api.delete(`/discipulado/${discipuladoId}?id_usuario=${this.context.user.id}`)
            this.loadDiscipulado()
        } catch (error) {
            showError(error)
        }
    }

    buscarDiscipulado = async id => {
        try {
            const res = await api.get(`/discipulado/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ discipuladoBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarDiscipulado(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.discipuladoBuscado} tituloHeader={"Editar Data de Discipulado"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateDiscipulado}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Discipulados</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.discipulado} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Realizado no dia"} onDelete={this.deleteDiscipulado}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addDiscipulado(this.context.user.id)} activeOpacity={0.7}>
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
        fontSize: 28,
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