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
            Alert(e.response.data.message, 'error');
        }
    }

    updateEstudo = async estudo => {
        try {
            await api.put(`/estudo/${estudo.id}?id_usuario=${estudo.id_usuario}`, {
                created_at: estudo.date,
                nome: estudo.nome,
                id_usuario: estudo.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadEstudo)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    addEstudo = async id_usuario => {
        try {
            await api.post(`/estudo`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.loadEstudo()

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteEstudo = async crenteId => {
        try {
            await api.delete(`/estudo/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadEstudo()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEstudo = async id => {
        try {
            const res = await api.get(`/estudo/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ estudoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEstudo(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado}  withNome={true} placeHolderCampoNome={"Assunto do Estudo"} itemBuscado={this.state.estudoBuscado} tituloHeader={"Editar Data de Estudo"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEstudo}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudo} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Assunto: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudo}/>} />
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