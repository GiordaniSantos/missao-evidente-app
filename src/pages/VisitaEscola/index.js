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
    escolaBuscado: [],
    escola: []
}

class VisitaEscola extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasEscolas()
    }

    loadVisitasEscolas = async () => {
        try{
            const res = await api.get(`/escola`)
            this.setState({ escola: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    updateEscola = async escola => {
        try {
            await api.put(`/escola/${escola.id}`, {
                created_at: escola.date,
                nome: escola.nome,
                id_usuario: escola.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadVisitasEscolas)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    addVisitaEscola = async () => {
        try {
            await api.post(`/escola`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasEscolas()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaEscola = async escolaId => {
        try {
            await api.delete(`/escola/${escolaId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasEscolas()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEscola = async id => {
        try {
            const res = await api.get(`/escola/${id}`)
            this.setState({ escolaBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEscola(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.escolaBuscado} tituloHeader={"Editar Data de Visita à Escola"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEscola}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.escola} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaEscola}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaEscola()} activeOpacity={0.7}>
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

const mapDispatchToProps = dispatch => {
    return {
        loadRelatorios: () => {
            dispatch(fetchRelatorios())
            dispatch(setParamsDefaultRelatorio())
        }
    }
}

export default connect(null, mapDispatchToProps)(VisitaEscola)