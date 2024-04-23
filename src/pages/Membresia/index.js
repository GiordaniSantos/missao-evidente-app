import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import api from '../../services/api';
import { showError } from '../../Common'
import Item from '../../components/Item';
import Alert from '../../components/SweetAlert';
import EditModalMembresia from '../../components/EditModalMembresia';

const initialState = { 
    showModal: false,
    showModalEdit: false,
    loadingItemBuscado: false,
    membresiaBuscado: [],
    membros: []
}

export default class Membresia extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadMembros()
    }

    handleLogout = () =>{
        this.context.logout();   
    }

    loadMembros = async () => {
        try{
            const res = await api.get(`/membresia?id_usuario=${this.context.user.id}`)
            this.setState({ membros: res.data.data })
        }catch(e) {
            showError(e.response.data.message)
        }
    }

    updateMembresia = async membresia => {
        try {
            await api.put(`/membresia/${membresia.id}?id_usuario=${membresia.id_usuario}`, {
                nome: membresia.nome,
                quantidade: membresia.quantidade,
                created_at: membresia.date,
                id_usuario: membresia.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModalEdit: false }, this.loadMembros)

        } catch (error) {
            showError(error)
        }

    }

    buscarMembresia = async id => {
        try {
            const res = await api.get(`/membresia/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ membresiaBuscado: res.data, loadingItemBuscado: false })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarMembresia(id)
        this.setState({ showModalEdit: true })
    }

    addMembresia = async newMembro => {
        if(!newMembro.nome || !newMembro.nome.trim()){
            showError("Dados Inválidos, Informe um nome!")
            return
        }
        if(!newMembro.quantidade || !newMembro.quantidade.trim()){
            showError('Dados Inválidos, Informe a Quantidade!')
            return
        }
        
        try {
            await api.post(`/membresia`, {
                nome: newMembro.nome,
                quantidade: newMembro.quantidade,
                id_usuario: newMembro.id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.setState({ showModal: false }, this.loadMembros)

        } catch (error) {
            showError(error)
        }

    }

    deleteMembresia = async membroId => {
        try {
            await api.delete(`/membresia/${membroId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadMembros()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <AddModal isVisible={this.state.showModal} tituloHeader={"Nova membresia"} dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo", "Comungantes", "Não Comungantes"]} onCancel={() => { this.setState({showModal:false}) }} onSave={this.addMembresia}/>
                <EditModalMembresia isVisible={this.state.showModalEdit} loading={this.state.loadingItemBuscado} itemBuscado={this.state.membresiaBuscado}  dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo", "Comungantes", "Não Comungantes"]} tituloHeader={"Editar Membresia"} onCancel={() => { this.setState({showModalEdit:false}) }} onUpdate={this.updateMembresia}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.membros} keyExtractor={item => `${item.id}`} renderItem={({item}) => <Item {...item} openModal={this.abrirModal} textoPosQtd={"membros"} onDelete={this.deleteMembresia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.setState({ showModal: true })} activeOpacity={0.7}>
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
    taskList: {

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
    },
})