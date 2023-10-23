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
import Alert from '../../components/SweetAlert';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    santaCeiaBuscado: [],
    santaCeia: []
}

export default class SantaCeia extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadSantaCeia()
    }

    loadSantaCeia = async () => {
        try{
            const res = await api.get(`/santa-ceia?id_usuario=${this.context.user.id}`)
            this.setState({ santaCeia: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addSantaCeia = async id_usuario => {
        try {
            await api.post(`/santa-ceia`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadSantaCeia()

        } catch (error) {
            showError(error)
        }

    }

    updateSantaCeia = async santaCeia => {
        try {
            await api.put(`/santa-ceia/${santaCeia.id}?id_usuario=${santaCeia.id_usuario}`, {
                created_at: santaCeia.date,
                id_usuario: santaCeia.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadSantaCeia)

        } catch (error) {
            showError(error)
        }

    }

    deleteSantaCeia = async crenteId => {
        try {
            await api.delete(`/santa-ceia/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadSantaCeia()
        } catch (error) {
            showError(error)
        }
    }

    buscarSantaCeia = async id => {
        try {
            const res = await api.get(`/santa-ceia/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ santaCeiaBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarSantaCeia(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.santaCeiaBuscado} tituloHeader={"Editar Data de Santa Ceia"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSantaCeia}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Santa Ceia</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.santaCeia} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSantaCeia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSantaCeia(this.context.user.id)} activeOpacity={0.7}>
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