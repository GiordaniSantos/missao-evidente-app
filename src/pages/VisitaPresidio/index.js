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

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    presidioBuscado: [],
    presidios: []
}

export default class VisitaPresidio extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasPresidios()
    }

    loadVisitasPresidios = async () => {
        try{
            const res = await api.get(`/presidio?id_usuario=${this.context.user.id}`)
            this.setState({ presidios: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaPresidio = async id_usuario => {
        try {
            await api.post(`/presidio`, {
                id_usuario: id_usuario
            })

            this.loadVisitasPresidios()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    updatePresidio = async presidio => {
        try {
            await api.put(`/presidio/${presidio.id}?id_usuario=${presidio.id_usuario}`, {
                created_at: presidio.date,
                id_usuario: presidio.id_usuario
            })

            this.setState({ showModal: false }, this.loadVisitasPresidios)

        } catch (error) {
            showError(error)
        }

    }

    deleteVisitaPresidio = async presidioId => {
        try {
            await api.delete(`/presidio/${presidioId}?id_usuario=${this.context.user.id}`)
            this.loadVisitasPresidios()
        } catch (error) {
            showError(error)
        }
    }

    buscarPresidio = async id => {
        try {
            const res = await api.get(`/presidio/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ presidioBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarPresidio(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.presidioBuscado} tituloHeader={"Editar Data de Visita ao Presidio"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updatePresidio}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Visitas aos Presidios</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.presidios} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaPresidio}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaPresidio(this.context.user.id)} activeOpacity={0.7}>
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