import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import api from '../../services/api';
import ItemVisita from '../../components/ItemVisita';
import EditModal from '../../components/EditModal';
import Alert from '../../components/SweetAlert';
import { connect } from 'react-redux';
import { fetchRelatorios, setParamsDefaultRelatorio } from '../../store/actions/dashboard';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    loadingItemBuscado: false,
    crenteBuscado: [],
    crentes: []
}

class VisitaCrente extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasCrentes()
    }

    loadVisitasCrentes = async () => {
        try{
            const res = await api.get(`/crente`)
            this.setState({ crentes: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaCrente = async () => {
        try {
            await api.post(`/crente`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasCrentes()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateCrente = async crente => {
        try {
            await api.put(`/crente/${crente.id}?id_usuario=${crente.id_usuario}`, {
                created_at: crente.date,
                nome: crente.nome,
                id_usuario: crente.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadVisitasCrentes)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaCrente = async crenteId => {
        try {
            await api.delete(`/crente/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasCrentes()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarCrente = async id => {
        try {
            const res = await api.get(`/crente/${id}`)
            this.setState({ crenteBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarCrente(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.crenteBuscado} tituloHeader={"Editar Data de Visita ao Crente"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateCrente}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.crentes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} textoPosQtd={"crentes"} onDelete={this.deleteVisitaCrente}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaCrente()} activeOpacity={0.7}>
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

const mapDispatchToProps = dispatch => {
    return {
        loadRelatorios: () => {
            dispatch(fetchRelatorios())
            dispatch(setParamsDefaultRelatorio())
        }
    }
}

export default connect(null, mapDispatchToProps)(VisitaCrente)