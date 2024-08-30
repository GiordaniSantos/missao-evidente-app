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
    bencaoNupcialBuscado: [],
    bencaoNupcial: []
}

class BencaoNupcial extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadBencaoNupcial()
    }

    loadBencaoNupcial = async () => {
        try{
            const res = await api.get(`/bencao-nupcial`)
            this.setState({ bencaoNupcial: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addBencaoNupcial = async () => {
        try {
            await api.post(`/bencao-nupcial`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadBencaoNupcial()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateBencaoNupcial = async bencaoNupcial => {
        try {
            await api.put(`/bencao-nupcial/${bencaoNupcial.id}`, {
                created_at: bencaoNupcial.date,
                nome: bencaoNupcial.nome,
                id_usuario: bencaoNupcial.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadBencaoNupcial)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteBencaoNupcial = async crenteId => {
        try {
            await api.delete(`/bencao-nupcial/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadBencaoNupcial()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarBencaoNupcial = async id => {
        try {
            const res = await api.get(`/bencao-nupcial/${id}`)
            this.setState({ bencaoNupcialBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarBencaoNupcial(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.bencaoNupcialBuscado} withNome={true} placeHolderCampoNome={"Nome"} tituloHeader={"Editar Data de Bencão Nupcial"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateBencaoNupcial}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.bencaoNupcial} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoNome={"Nome: "} textoAntesHora={"Realizado no dia"} onDelete={this.deleteBencaoNupcial}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addBencaoNupcial()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(BencaoNupcial)