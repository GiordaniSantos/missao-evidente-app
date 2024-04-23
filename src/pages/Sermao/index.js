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
    loadingItemBuscado: false,
    sermaoBuscado: [],
    sermao: []
}

export default class Sermao extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadSermao()
    }

    loadSermao = async () => {
        try{
            const res = await api.get(`/sermao?id_usuario=${this.context.user.id}`)
            this.setState({ sermao: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addSermao = async id_usuario => {
        try {
            await api.post(`/sermao`, {
                id_usuario: id_usuario
            })
            Alert('Adicionado com Sucesso');
            this.loadSermao()

        } catch (error) {
            showError(error)
        }

    }

    updateSermao = async sermao => {
        try {
            await api.put(`/sermao/${sermao.id}?id_usuario=${sermao.id_usuario}`, {
                created_at: sermao.date,
                id_usuario: sermao.id_usuario
            })
            Alert('Atualizado com Sucesso');
            this.setState({ showModal: false }, this.loadSermao)

        } catch (error) {
            showError(error)
        }

    }

    deleteSermao = async crenteId => {
        try {
            await api.delete(`/sermao/${crenteId}?id_usuario=${this.context.user.id}`)
            Alert('Deletado com Sucesso');
            this.loadSermao()
        } catch (error) {
            showError(error)
        }
    }

    buscarSermao = async id => {
        try {
            const res = await api.get(`/sermao/${id}?id_usuario=${this.context.user.id}`)
            this.setState({ sermaoBuscado: res.data, loadingItemBuscado: false })
        } catch (error) {
            showError(error)
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarSermao(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.sermaoBuscado} tituloHeader={"Editar Data de Sermão"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSermao}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.sermao} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSermao}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSermao(this.context.user.id)} activeOpacity={0.7}>
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