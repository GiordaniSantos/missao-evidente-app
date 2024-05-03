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
    estudoBiblicoBuscado: [],
    estudoBiblico: []
}

export default class EstudoBiblico extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadEstudoBiblico()
    }

    loadEstudoBiblico = async () => {
        try{
            const res = await api.get(`/estudo-biblico?id_usuario=${this.context.user.id}`)
            this.setState({ estudoBiblico: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addEstudoBiblico = async id_usuario => {
        try {
            await api.post(`/estudo-biblico`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.loadEstudoBiblico()

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateEstudoBiblico = async estudoBiblico => {
        try {
            await api.put(`/estudo-biblico/${estudoBiblico.id}?id_usuario=${estudoBiblico.id_usuario}`, {
                created_at: estudoBiblico.date,
                nome: estudoBiblico.nome,
                id_usuario: estudoBiblico.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadEstudoBiblico)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteEstudoBiblico = async EstudoBiblicoId => {
        try {
            await api.delete(`/estudo-biblico/${EstudoBiblicoId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadEstudoBiblico()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEstudoBiblico = async id => {
        try {
            const res = await api.get(`/estudo-biblico/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ estudoBiblicoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEstudoBiblico(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.estudoBiblicoBuscado} withNome={true} placeHolderCampoNome={"Assunto do Estudo Bíblico"} tituloHeader={"Editar Data de Estudo Biblico"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEstudoBiblico}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudoBiblico} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Assunto: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudoBiblico}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addEstudoBiblico(this.context.user.id)} activeOpacity={0.7}>
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