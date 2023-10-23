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
    sermaoBuscado: [],
    sermao: []
}

export default class Sermao extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadSermao()
    }

    loadSermao = async () => {
        try{
            const res = await api.get(`/sermao?id_usuario=${this.context.user.id}`)
            this.setState({ sermao: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addSermao = async id_usuario => {
        try {
            await api.post(`/sermao`, {
                id_usuario: id_usuario
            })

            this.loadSermao()

        } catch (error) {
            showError(error)
        }

    }

    updateSermao = async sermao => {
        try {
            await api.put(`/sermao/${sermao.id}?id_usuario=${sermao.id_usuario}`, {
                created_at: sermao.date,
                id_usuario: sermao.id_usuario
            })

            this.setState({ showModal: false }, this.loadSermao)

        } catch (error) {
            showError(error)
        }

    }

    deleteSermao = async crenteId => {
        try {
            await api.delete(`/sermao/${crenteId}?id_usuario=${this.context.user.id}`)
            this.loadSermao()
        } catch (error) {
            showError(error)
        }
    }

    buscarSermao = async id => {
        try {
            const res = await api.get(`/sermao/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ sermaoBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarSermao(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.sermaoBuscado} tituloHeader={"Editar Data de Sermão"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSermao}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Sermões</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.sermao} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSermao}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSermao(this.context.user.id)} activeOpacity={0.7}>
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