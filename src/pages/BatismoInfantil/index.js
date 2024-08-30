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
    batismoInfantilBuscado: [],
    batismoInfantil: []
}

class BatismoInfantil extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadBatismoInfantil()
    }

    loadBatismoInfantil = async () => {
        try{
            const res = await api.get(`/batismo-infantil`)
            this.setState({ batismoInfantil: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addBatismoInfantil = async () => {
        try {
            await api.post(`/batismo-infantil`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadBatismoInfantil()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateBatismoInfantil = async batismoInfantil => {
        try {
            await api.put(`/batismo-infantil/${batismoInfantil.id}`, {
                created_at: batismoInfantil.date,
                nome: batismoInfantil.nome,
                id_usuario: batismoInfantil.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadBatismoInfantil)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteBatismoInfantil = async crenteId => {
        try {
            await api.delete(`/batismo-infantil/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadBatismoInfantil()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarBatismoInfantil = async id => {
        try {
            const res = await api.get(`/batismo-infantil/${id}`)
            this.setState({ batismoInfantilBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarBatismoInfantil(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.batismoInfantilBuscado} withNome={true} placeHolderCampoNome={"Nome"} tituloHeader={"Editar Data de Batismo Infantil"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateBatismoInfantil}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.batismoInfantil} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Nome: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteBatismoInfantil}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addBatismoInfantil()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(BatismoInfantil)