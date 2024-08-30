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
    santaCeiaBuscado: [],
    santaCeia: []
}

class SantaCeia extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadSantaCeia()
    }

    loadSantaCeia = async () => {
        try{
            const res = await api.get(`/santa-ceia`)
            this.setState({ santaCeia: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addSantaCeia = async () => {
        try {
            await api.post(`/santa-ceia`)
            Alert('Adicionado com Sucesso', 'success');
            this.loadSantaCeia()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateSantaCeia = async santaCeia => {
        try {
            await api.put(`/santa-ceia/${santaCeia.id}`, {
                created_at: santaCeia.date,
                id_usuario: santaCeia.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadSantaCeia)

        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteSantaCeia = async crenteId => {
        try {
            await api.delete(`/santa-ceia/${crenteId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadSantaCeia()
            this.props.loadRelatorios()
        } catch (error) {
            Alert(e.response.data.message, 'error');
        }
    }

    buscarSantaCeia = async id => {
        try {
            const res = await api.get(`/santa-ceia/${id}`)
            this.setState({ santaCeiaBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarSantaCeia(id)
        this.setState({ showModal: true })
    }

    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} itemBuscado={this.state.santaCeiaBuscado} tituloHeader={"Editar Data de Santa Ceia"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateSantaCeia}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.santaCeia} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} icon={"atoPastoral"} textoAntesHora={"Realizado no dia"} onDelete={this.deleteSantaCeia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addSantaCeia()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(SantaCeia)