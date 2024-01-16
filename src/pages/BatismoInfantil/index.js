import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import api from '../../services/api';
import { showError } from '../../Common'
import ItemVisita from '../../components/ItemVisita';
import EditModal from '../../components/EditModal';
import Alert from '../../components/SweetAlert';

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
            Alert('Adicionado com Sucesso');
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
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadBatismoInfantil)

        } catch (error) {
            showError(error)
        }

    }

    deleteBatismoInfantil = async crenteId => {
        try {
            await api.delete(`/batismo-infantil/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
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
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.batismoInfantilBuscado} tituloHeader={"Editar Data de Batismo Infantil"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateBatismoInfantil}/>
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
        flex: 1,
        backgroundColor: '#f8f9fc',
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