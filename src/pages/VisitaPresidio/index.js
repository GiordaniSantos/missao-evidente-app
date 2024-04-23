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
    presidioBuscado: [],
    presidios: []
}

export default class VisitaPresidio extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasPresidios()
    }

    loadVisitasPresidios = async () => {
        try{
            const res = await api.get(`/presidio?id_usuario=${this.context.user.id}`)
            this.setState({ presidios: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaPresidio = async id_usuario => {
        try {
            await api.post(`/presidio`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadVisitasPresidios()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    updatePresidio = async presidio => {
        try {
            await api.put(`/presidio/${presidio.id}?id_usuario=${presidio.id_usuario}`, {
                created_at: presidio.date,
                nome: presidio.nome,
                id_usuario: presidio.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadVisitasPresidios)

        } catch (error) {
            showError(error.response.data.message)
        }

    }

    deleteVisitaPresidio = async presidioId => {
        try {
            await api.delete(`/presidio/${presidioId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadVisitasPresidios()
        } catch (error) {
            showError(error.response.data.message)
        }
    }

    buscarPresidio = async id => {
        try {
            const res = await api.get(`/presidio/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ presidioBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarPresidio(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} withNome={true} itemBuscado={this.state.presidioBuscado} tituloHeader={"Editar Data de Visita ao Presidio"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updatePresidio}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.presidios} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaPresidio}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaPresidio(this.context.user.id)} activeOpacity={0.7}>
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