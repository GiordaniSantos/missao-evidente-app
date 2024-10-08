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
    hospitalBuscado: [],
    hospital: []
}

class VisitaHospital extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadVisitasHospital()
    }

    loadVisitasHospital = async () => {
        try{
            const res = await api.get(`/hospital`)
            this.setState({ hospital: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addVisitaHospital = async () => {
        try {
            await api.post(`/hospital`)
          
            Alert('Adicionado com Sucesso', 'success');
            this.loadVisitasHospital()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    updateHospital = async hospital => {
        try {
            await api.put(`/hospital/${hospital.id}`, {
                created_at: hospital.date,
                nome: hospital.nome,
                id_usuario: hospital.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');

            this.setState({ showModal: false }, this.loadVisitasHospital)
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteVisitaHospital = async hospitalId => {
        try {
            await api.delete(`/hospital/${hospitalId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadVisitasHospital()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    
    buscarHospital = async id => {
        try {
            const res = await api.get(`/hospital/${id}`)
            this.setState({ hospitalBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarHospital(id)
        this.setState({ showModal: true })
    }


    render(){
        return (
            <View style={styles.container}>
                <EditModal isVisible={this.state.showModal} loading={this.state.loadingItemBuscado} withNome={true} itemBuscado={this.state.hospitalBuscado} tituloHeader={"Editar Data de Visita ao Hospital"} onCancel={() => { this.setState({showModal:false}) }} onUpdate={this.updateHospital}/>
                <View style={styles.taskList}>
                    <FlatList data={this.state.hospital} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} openModal={this.abrirModal} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaHospital}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaHospital()} activeOpacity={0.7}>
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

export default connect(null, mapDispatchToProps)(VisitaHospital)