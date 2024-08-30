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
    estudoBuscado: [],
    estudo: []
}

class Estudo extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadEstudo()
    }

    loadEstudo = async () => {
        try{
            const res = await api.get(`/estudo`)
            this.setState({ estudo: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    updateEstudo = async estudo => {
        try {
            await api.put(`/estudo/${estudo.id}`, {
                created_at: estudo.date,
                nome: estudo.nome,
                id_usuario: estudo.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadEstudo)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    addEstudo = async () => {
        try {
            await api.post(`/estudo`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadEstudo()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteEstudo = async crenteId => {
        try {
            await api.delete(`/estudo/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadEstudo()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarEstudo = async id => {
        try {
            const res = await api.get(`/estudo/${id}`)
            this.setState({ estudoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarEstudo(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado}  withNome={true} placeHolderCampoNome={"Assunto do Estudo"} itemBuscado={this.state.estudoBuscado} tituloHeader={"Editar Data de Estudo"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateEstudo}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudo} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Assunto: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudo}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addEstudo()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(Estudo)