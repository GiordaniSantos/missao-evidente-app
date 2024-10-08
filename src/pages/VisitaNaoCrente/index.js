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
    naoCrenteBuscado: [],
    naoCrentes: []
}

class VisitaNaoCrente extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasNaoCrentes()
    }

    loadVisitasNaoCrentes = async () => {
        try{
            const res = await api.get(`/incredulo`)
            this.setState({ naoCrentes: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    updateNaoCrente = async naoCrente => {
        try {
            await api.put(`/incredulo/${naoCrente.id}?id_usuario=${naoCrente.id_usuario}`, {
                created_at: naoCrente.date,
                nome: naoCrente.nome,
                id_usuario: naoCrente.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadVisitasNaoCrentes)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    addVisitaNaoCrente = async () => {
        try {
            await api.post(`/incredulo`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasNaoCrentes()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaNaoCrente = async crenteId => {
        try {
            await api.delete(`/incredulo/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasNaoCrentes()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarNaoCrente = async id => {
        try {
            const res = await api.get(`/incredulo/${id}`)
            this.setState({ naoCrenteBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
             Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarNaoCrente(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.naoCrenteBuscado} tituloHeader={"Editar Data de Visita ao Não Crente"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateNaoCrente}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.naoCrentes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaNaoCrente}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaNaoCrente()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(VisitaNaoCrente)