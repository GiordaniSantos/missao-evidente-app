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
    estudoBuscado: [],
    estudo: []
}

export default class Estudo extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadEstudo()
    }

    loadEstudo = async () => {
        try{
            const res = await api.get(`/estudo?id_usuario=${this.context.user.id}`)
            this.setState({ estudo: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    updateEstudo = async estudo => {
        try {
            await api.put(`/estudo/${estudo.id}?id_usuario=${estudo.id_usuario}`, {
                created_at: estudo.date,
                id_usuario: estudo.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadEstudo)

        } catch (error) {
            showError(error)
        }

    }

    addEstudo = async id_usuario => {
        try {
            await api.post(`/estudo`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadEstudo()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteEstudo = async crenteId => {
        try {
            await api.delete(`/estudo/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadEstudo()
        } catch (error) {
            showError(error)
        }
    }

    buscarEstudo = async id => {
        try {
            const res = await api.get(`/estudo/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ estudoBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarEstudo(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.estudoBuscado} tituloHeader={"Editar Data de Estudo"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEstudo}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Estudos</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudo} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudo}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addEstudo(this.context.user.id)} activeOpacity={0.7}>
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