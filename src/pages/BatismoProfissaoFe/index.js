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
    batismoProfissaoBuscado: [],
    batismoProfissao: []
}

class BatismoProfissaoFe extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadBatismoProfissao()
    }

    loadBatismoProfissao = async () => {
        try{
            const res = await api.get(`/batismo-profissao`)
            this.setState({ batismoProfissao: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addBatismoProfissao = async () => {
        try {
            await api.post(`/batismo-profissao`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadBatismoProfissao()
            this.props.loadRelatorios()
        } catch (error) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateBatismoProfissao = async batismoProfissao => {
        try {
            await api.put(`/batismo-profissao/${batismoProfissao.id}`, {
                created_at: batismoProfissao.date,
                nome: batismoProfissao.nome,
                id_usuario: batismoProfissao.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadBatismoProfissao)

        } catch (error) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteBatismoProfissao = async crenteId => {
        try {
            await api.delete(`/batismo-profissao/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadBatismoProfissao()
            this.props.loadRelatorios()
        } catch (error) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarBatismoProfissao = async id => {
        try {
            const res = await api.get(`/batismo-profissao/${id}`)
            this.setState({ batismoProfissaoBuscado: res.data, loadingItemBuscado: false })
        } catch (error) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarBatismoProfissao(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.batismoProfissaoBuscado} withNome={true} placeHolderCampoNome={"Nome"} tituloHeader={"Editar Data de Batismo/Profissão de Fé"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateBatismoProfissao}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.batismoProfissao} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Nome: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteBatismoProfissao}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addBatismoProfissao()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(BatismoProfissaoFe)