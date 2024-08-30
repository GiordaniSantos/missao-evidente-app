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
    sermaoBuscado: [],
    sermao: []
}

class Sermao extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadSermao()
    }

    loadSermao = async () => {
        try{
            const res = await api.get(`/sermao`)
            this.setState({ sermao: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addSermao = async () => {
        try {
            await api.post(`/sermao`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadSermao()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateSermao = async sermao => {
        try {
            await api.put(`/sermao/${sermao.id}`, {
                created_at: sermao.date,
                nome: sermao.nome,
                id_usuario: sermao.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadSermao)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteSermao = async crenteId => {
        try {
            await api.delete(`/sermao/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadSermao()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarSermao = async id => {
        try {
            const res = await api.get(`/sermao/${id}`)
            this.setState({ sermaoBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
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
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.sermaoBuscado} withNome={true} placeHolderCampoNome={"Assunto do Sermão"} tituloHeader={"Editar Data de Sermão"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSermao}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.sermao} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Assunto: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSermao}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSermao()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(Sermao)