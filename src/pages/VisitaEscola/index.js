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
    escolaBuscado: [],
    escola: []
}

export default class VisitaEscola extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasEscolas()
    }

    loadVisitasEscolas = async () => {
        try{
            const res = await api.get(`/escola?id_usuario=${this.context.user.id}`)
            this.setState({ escola: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    updateEscola = async escola => {
        try {
            await api.put(`/escola/${escola.id}?id_usuario=${escola.id_usuario}`, {
                created_at: escola.date,
                id_usuario: escola.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadVisitasEscolas)

        } catch (error) {
            showError(error)
        }

    }

    addVisitaEscola = async id_usuario => {
        try {
            await api.post(`/escola`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadVisitasEscolas()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteVisitaEscola = async escolaId => {
        try {
            await api.delete(`/escola/${escolaId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadVisitasEscolas()
        } catch (error) {
            showError(error)
        }
    }

    buscarEscola = async id => {
        try {
            const res = await api.get(`/escola/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ escolaBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarEscola(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.escolaBuscado} tituloHeader={"Editar Data de Visita à Escola"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEscola}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Visitas às Escolas</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.escola} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaEscola}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaEscola(this.context.user.id)} activeOpacity={0.7}>
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