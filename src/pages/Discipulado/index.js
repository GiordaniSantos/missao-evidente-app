import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import api from '../../services/api';
import ItemVisita from '../../components/ItemVisita';
import EditModal from '../../components/EditModal';
import Alert from '../../components/SweetAlert';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    loadingItemBuscado: false,
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
            Alert(e.response.data.message, 'error');
        }
    }

    addDiscipulado = async id_usuario => {
        try {
            await api.post(`/discipulado`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.loadDiscipulado()

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateDiscipulado = async discipulado => {
        try {
            await api.put(`/discipulado/${discipulado.id}?id_usuario=${discipulado.id_usuario}`, {
                created_at: discipulado.date,
                nome: discipulado.nome,
                id_usuario: discipulado.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadDiscipulado)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteDiscipulado = async discipuladoId => {
        try {
            await api.delete(`/discipulado/${discipuladoId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadDiscipulado()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarDiscipulado = async id => {
        try {
            const res = await api.get(`/discipulado/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ discipuladoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarDiscipulado(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.discipuladoBuscado} withNome={true} placeHolderCampoNome={"Nome do Discipulado"} tituloHeader={"Editar Data de Discipulado"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateDiscipulado}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.discipulado} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Nome: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteDiscipulado}/>} />
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