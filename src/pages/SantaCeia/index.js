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
    santaCeiaBuscado: [],
    santaCeia: []
}

export default class SantaCeia extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadSantaCeia()
    }

    loadSantaCeia = async () => {
        try{
            const res = await api.get(`/santa-ceia?id_usuario=${this.context.user.id}`)
            this.setState({ santaCeia: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addSantaCeia = async id_usuario => {
        try {
            await api.post(`/santa-ceia`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadSantaCeia()

        } catch (error) {
            showError(error)
        }

    }

    updateSantaCeia = async santaCeia => {
        try {
            await api.put(`/santa-ceia/${santaCeia.id}?id_usuario=${santaCeia.id_usuario}`, {
                created_at: santaCeia.date,
                id_usuario: santaCeia.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadSantaCeia)

        } catch (error) {
            showError(error)
        }

    }

    deleteSantaCeia = async crenteId => {
        try {
            await api.delete(`/santa-ceia/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadSantaCeia()
        } catch (error) {
            showError(error)
        }
    }

    buscarSantaCeia = async id => {
        try {
            const res = await api.get(`/santa-ceia/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ santaCeiaBuscado: res.data })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.buscarSantaCeia(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} itemBuscado={this.state.santaCeiaBuscado} tituloHeader={"Editar Data de Santa Ceia"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSantaCeia}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.santaCeia} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSantaCeia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSantaCeia(this.context.user.id)} activeOpacity={0.7}>
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