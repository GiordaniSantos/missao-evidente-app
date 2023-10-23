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
    batismoInfantilBuscado: [],
    batismoInfantil: []
}

export default class BatismoInfantil extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadBatismoInfantil()
    }

    loadBatismoInfantil = async () => {
        try{
            const res = await api.get(`/batismo-infantil?id_usuario=${this.context.user.id}`)
            this.setState({ batismoInfantil: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addBatismoInfantil = async id_usuario => {
        try {
            await api.post(`/batismo-infantil`, {
                id_usuario: id_usuario
            })

            this.loadBatismoInfantil()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    updateBatismoInfantil = async batismoInfantil => {
        try {
            await api.put(`/batismo-infantil/${batismoInfantil.id}?id_usuario=${batismoInfantil.id_usuario}`, {
                created_at: batismoInfantil.date,
                id_usuario: batismoInfantil.id_usuario
            })

            this.setState({ showModal: false }, this.loadBatismoInfantil)

        } catch (error) {
            showError(error)
        }

    }

    deleteBatismoInfantil = async crenteId => {
        try {
            await api.delete(`/batismo-infantil/${crenteId}?id_usuario=${this.context.user.id}`)
            this.loadBatismoInfantil()
        } catch (error) {
            showError(error)
        }
    }

    buscarBatismoInfantil = async id => {
        try {
            const res = await api.get(`/batismo-infantil/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ batismoInfantilBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarBatismoInfantil(id)
        this.setState({ showModal: true })
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.batismoInfantilBuscado} tituloHeader={"Editar Data de Batismo Infantil"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateBatismoInfantil}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Batismo Infantil</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.batismoInfantil} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Realizado no dia"} onDelete={this.deleteBatismoInfantil}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addBatismoInfantil(this.context.user.id)} activeOpacity={0.7}>
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