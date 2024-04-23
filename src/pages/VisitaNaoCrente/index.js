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
    naoCrenteBuscado: [],
    naoCrentes: []
}

export default class VisitaNaoCrente extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasNaoCrentes()
    }

    loadVisitasNaoCrentes = async () => {
        try{
            const res = await api.get(`/incredulo?id_usuario=${this.context.user.id}`)
            this.setState({ naoCrentes: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    updateNaoCrente = async naoCrente => {
        try {
            await api.put(`/incredulo/${naoCrente.id}?id_usuario=${naoCrente.id_usuario}`, {
                created_at: naoCrente.date,
                nome: naoCrente.nome,
                id_usuario: naoCrente.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadVisitasNaoCrentes)

        } catch (error) {
            showError(error)
        }

    }

    addVisitaNaoCrente = async id_usuario => {
        try {
            await api.post(`/incredulo`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadVisitasNaoCrentes()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteVisitaNaoCrente = async crenteId => {
        try {
            await api.delete(`/incredulo/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadVisitasNaoCrentes()
        } catch (error) {
            showError(error)
        }
    }

    buscarNaoCrente = async id => {
        try {
            const res = await api.get(`/incredulo/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ naoCrenteBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarNaoCrente(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} withNome={true} itemBuscado={this.state.naoCrenteBuscado} tituloHeader={"Editar Data de Visita ao Não Crente"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateNaoCrente}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.naoCrentes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaNaoCrente}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaNaoCrente(this.context.user.id)} activeOpacity={0.7}>
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