import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import api from '../../services/api';
import Alert from '../../components/SweetAlert';
import ItemFrequencia from '../../components/ItemFrequencia';
import EditModalFrequencia from '../../components/EditModalFrequencia';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    loadingItemBuscado: false,
    comunganteBuscado: [],
    comungantes: []
}

export default class Comungante extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadComungantes()
    }

    loadComungantes = async () => {
        try{
            const res = await api.get(`/comungante?id_usuario=${this.context.user.id}`)
            this.setState({ comungantes: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaComungante = async id_usuario => {
        try {
            await api.post(`/comungante`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.loadComungantes()

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateComungante = async comungante => {
        try {
            await api.put(`/comungante/${comungante.id}?id_usuario=${comungante.id_usuario}`, {
                created_at: comungante.date,
                quantidade: comungante.quantidade,
                id_usuario: comungante.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadComungantes)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaComungante = async comunganteId => {
        try {
            await api.delete(`/comungante/${comunganteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadComungantes()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarComungante = async id => {
        try {
            const res = await api.get(`/comungante/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ comunganteBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarComungante(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModalFrequencia isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.comunganteBuscado} tituloHeader={"Editar Quantidade de Comungantes"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateComungante}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.comungantes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemFrequencia {...item} openModal={this.abrirModal} icon={"user-check"} textoAntesQtd={"Comungantes: "} onDelete={this.deleteVisitaComungante}/>} />
                </View>
                {this.state.comungantes.length == 0 && 
                    <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaComungante(this.context.user.id)} activeOpacity={0.7}>
                        <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                }
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