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
    presidioBuscado: [],
    presidios: []
}

class VisitaPresidio extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasPresidios()
    }

    loadVisitasPresidios = async () => {
        try{
            const res = await api.get(`/presidio`)
            this.setState({ presidios: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaPresidio = async () => {
        try {
            await api.post(`/presidio`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasPresidios()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updatePresidio = async presidio => {
        try {
            await api.put(`/presidio/${presidio.id}`, {
                created_at: presidio.date,
                nome: presidio.nome,
                id_usuario: presidio.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadVisitasPresidios)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaPresidio = async presidioId => {
        try {
            await api.delete(`/presidio/${presidioId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasPresidios()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarPresidio = async id => {
        try {
            const res = await api.get(`/presidio/${id}`)
            this.setState({ presidioBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarPresidio(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.presidioBuscado} tituloHeader={"Editar Data de Visita ao Presidio"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updatePresidio}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.presidios} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaPresidio}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaPresidio()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(VisitaPresidio)