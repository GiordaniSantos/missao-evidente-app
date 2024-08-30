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
    estudoBiblicoBuscado: [],
    estudoBiblico: []
}

class EstudoBiblico extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadEstudoBiblico()
    }

    loadEstudoBiblico = async () => {
        try{
            const res = await api.get(`/estudo-biblico`)
            this.setState({ estudoBiblico: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addEstudoBiblico = async () => {
        try {
            await api.post(`/estudo-biblico`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadEstudoBiblico()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateEstudoBiblico = async estudoBiblico => {
        try {
            await api.put(`/estudo-biblico/${estudoBiblico.id}`, {
                created_at: estudoBiblico.date,
                nome: estudoBiblico.nome,
                id_usuario: estudoBiblico.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadEstudoBiblico)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteEstudoBiblico = async EstudoBiblicoId => {
        try {
            await api.delete(`/estudo-biblico/${EstudoBiblicoId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadEstudoBiblico()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEstudoBiblico = async id => {
        try {
            const res = await api.get(`/estudo-biblico/${id}`)
            this.setState({ estudoBiblicoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEstudoBiblico(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.estudoBiblicoBuscado} withNome={true} placeHolderCampoNome={"Assunto do Estudo Bíblico"} tituloHeader={"Editar Data de Estudo Biblico"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEstudoBiblico}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudoBiblico} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Assunto: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudoBiblico}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addEstudoBiblico()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(EstudoBiblico)