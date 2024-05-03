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
    naoComunganteBuscado: [],
    naoComungantes: []
}

export default class NaoComungante extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadNaoComungantes()
    }

    loadNaoComungantes = async () => {
        try{
            const res = await api.get(`/nao-comungante?id_usuario=${this.context.user.id}`)
            this.setState({ naoComungantes: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaNaoComungante = async id_usuario => {
        try {
            await api.post(`/nao-comungante`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.loadNaoComungantes()

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateNaoComungante = async naocomungante => {
        try {
            await api.put(`/nao-comungante/${naocomungante.id}?id_usuario=${naocomungante.id_usuario}`, {
                created_at: naocomungante.date,
                quantidade: naocomungante.quantidade,
                id_usuario: naocomungante.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadNaoComungantes)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaNaoComungante = async naocomunganteId => {
        try {
            await api.delete(`/nao-comungante/${naocomunganteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadNaoComungantes()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarNaoComungante = async id => {
        try {
            const res = await api.get(`/nao-comungante/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ naoComunganteBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarNaoComungante(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModalFrequencia isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.naoComunganteBuscado} tituloHeader={"Editar Quantidade de Não Comungantes"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateNaoComungante}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.naoComungantes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemFrequencia {...item} openModal={this.abrirModal} textoAntesQtd={"Não Comungantes: "} icon={"user-times"} onDelete={this.deleteVisitaNaoComungante}/>} />
                </View>
                {this.state.naoComungantes.length == 0 && 
                    <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaNaoComungante(this.context.user.id)} activeOpacity={0.7}>
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