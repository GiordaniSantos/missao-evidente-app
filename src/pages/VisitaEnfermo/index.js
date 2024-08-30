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
    enfermoBuscado: [],
    enfermos: []
}

class VisitaEnfermo extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasEnfermos()
    }

    loadVisitasEnfermos = async () => {
        try{
            const res = await api.get(`/enfermo`)
            this.setState({ enfermos: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaEnfermo = async () => {
        try {
            await api.post(`/enfermo`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasEnfermos()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateEnfermo = async enfermo => {
        try {
            await api.put(`/enfermo/${enfermo.id}`, {
                created_at: enfermo.date,
                nome: enfermo.nome,
                id_usuario: enfermo.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadVisitasEnfermos)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaEnfermo = async enfermoId => {
        try {
            await api.delete(`/enfermo/${enfermoId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasEnfermos()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEnfermo = async id => {
        try {
            const res = await api.get(`/enfermo/${id}`)
            this.setState({ enfermoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEnfermo(id)
        this.setState({ showModal: true })
    }


    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.enfermoBuscado} tituloHeader={"Editar Data de Visita ao Enfermo"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEnfermo}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.enfermos} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaEnfermo}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaEnfermo()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(VisitaEnfermo)