import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, TextInput, Text} from 'react-native'
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import api from '../../services/api';
import Item from '../../components/Item';
import Alert from '../../components/SweetAlert';
import EditModalMembresia from '../../components/EditModalMembresia';
import { connect } from 'react-redux';
import { fetchRelatorios, setParamsDefaultRelatorio } from '../../store/actions/dashboard';

const initialState = { 
    showModal: false,
    showModalEdit: false,
    loadingItemBuscado: false,
    comunganteId: null,
    comunganteQtd: 0,
    naoComunganteId: null,
    naoComunganteQtd: 0,
    membresiaBuscado: [],
    membros: []
}

class Membresia extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadMembros()
        this.loadComungante()
        this.loadNaoComungante()
    }

    loadComungante = async () => {
        try{
            const res = await api.get(`/comungante`)
            if(res.data){
                this.setState({ comunganteQtd: res.data.quantidade, comunganteId: res.data.id })
            }
        }catch(e) {
            Alert(e.response.data.message, 'error');
        } 
    }

    updateOrCreateComungante = async () => {
        const comungante = {
            id: this.state.comunganteId,
            quantidade: this.state.comunganteQtd,
            id_usuario: this.props.userId
        }
        if(this.state.comunganteId ){
            this.updateComungante(comungante)
        }else{
            this.addComungante(comungante)
        }
    }

    updateComungante = async comungante => {
        try {
            await api.put(`/comungante/${comungante.id}?id_usuario=${comungante.id_usuario}`, {
                id_usuario: this.props.userId,
                quantidade: comungante.quantidade
            })
            this.loadComungante()
            Alert('Atualizado', 'success');
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addComungante = async comungante => {
        try {
            await api.post(`/comungante`, {
                id_usuario: this.props.userId,
                quantidade: comungante.quantidade
            })
            this.loadComungante()
            Alert('Atualizado', 'success');
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }


    loadNaoComungante = async () => {
        try{
            const res = await api.get(`/nao-comungante`)
            if(res.data){
                this.setState({ naoComunganteQtd: res.data.quantidade, naoComunganteId: res.data.id })
            }
        }catch(e) {
            Alert(e.response.data.message, 'error');
        } 
    }

    updateOrCreateNaoComungante = async () => {
        const naoComungante = {
            id: this.state.naoComunganteId,
            quantidade: this.state.naoComunganteQtd,
            id_usuario: this.props.userId
        }
        if(this.state.naoComunganteId ){
            this.updateNaoComungante(naoComungante)
        }else{
            this.addNaoComungante(naoComungante)
        }
    }

    updateNaoComungante = async naoComungante => {
        try {
            await api.put(`/nao-comungante/${naoComungante.id}?id_usuario=${naoComungante.id_usuario}`, {
                id_usuario: this.props.userId,
                quantidade: naoComungante.quantidade
            })
            this.loadNaoComungante()
            Alert('Atualizado', 'success');
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    addNaoComungante = async naoComungante => {
        try {
            await api.post(`/nao-comungante`, {
                id_usuario: this.props.userId,
                quantidade: naoComungante.quantidade
            })
            this.loadNaoComungante()
            Alert('Atualizado', 'success');
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    loadMembros = async () => {
        try{
            const res = await api.get(`/membresia`)
            this.setState({ membros: res.data.data })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    updateMembresia = async membresia => {
        try {
            await api.put(`/membresia/${membresia.id}?id_usuario=${membresia.id_usuario}`, {
                nome: membresia.nome,
                quantidade: membresia.quantidade,
                created_at: membresia.date,
                id_usuario: membresia.id_usuario
            })
            Alert('Atualizado com Sucesso', 'success');
            this.setState({ showModalEdit: false }, this.loadMembros)
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    buscarMembresia = async id => {
        try {
            const res = await api.get(`/membresia/${id}`)
            this.setState({ membresiaBuscado: res.data, loadingItemBuscado: false })
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    abrirModal = async id => {
        this.setState({ loadingItemBuscado: true })
        this.buscarMembresia(id)
        this.setState({ showModalEdit: true })
    }

    addMembresia = async newMembro => {
        if(!newMembro.nome || !newMembro.nome.trim()){
            Alert('Dados Inválidos, Informe um nome!', 'error');
            return
        }
        if(!newMembro.quantidade || !newMembro.quantidade.trim()){
            Alert('Dados Inválidos, Informe a Quantidade!', 'error');
            return
        }
        
        try {
            await api.post(`/membresia`, {
                nome: newMembro.nome,
                quantidade: newMembro.quantidade,
                id_usuario: newMembro.id_usuario
            })
            Alert('Adicionado com Sucesso', 'success');
            this.setState({ showModal: false }, this.loadMembros)
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }

    }

    deleteMembresia = async membroId => {
        try {
            await api.delete(`/membresia/${membroId}`)
            Alert('Deletado com Sucesso', 'success');
            this.loadMembros()
            this.props.loadRelatorios()
        } catch (e) {
            Alert(e.response.data.message, 'error');
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <AddModal isVisible={this.state.showModal} tituloHeader={"Nova membresia"} dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo"]} onCancel={() => { this.setState({showModal:false}) }} onSave={this.addMembresia}/>
                <EditModalMembresia isVisible={this.state.showModalEdit} loading={this.state.loadingItemBuscado} itemBuscado={this.state.membresiaBuscado}  dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo"]} tituloHeader={"Editar Membresia"} onCancel={() => { this.setState({showModalEdit:false}) }} onUpdate={this.updateMembresia}/>
                <View style={styles.containerInputs}>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Text style={[styles.label, {width: 110}]}>Comungantes</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Digite a quantidade"
                            value={this.state.comunganteQtd.toString()}
                            onChangeText={(text) => this.setState({ comunganteQtd: text })}
                        />
                        <TouchableOpacity onPress={this.updateOrCreateComungante} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Atualizar Comungante</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Text style={[styles.label, {width: 140}]}>Não Comungantes</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Digite a quantidade"
                            value={this.state.naoComunganteQtd.toString()}
                            onChangeText={(text) => this.setState({ naoComunganteQtd: text })}
                        />
                        <TouchableOpacity onPress={this.updateOrCreateNaoComungante} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Atualizar Não Comungante</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.taskList}>
                    <FlatList data={this.state.membros} keyExtractor={item => `${item.id}`} renderItem={({item}) => <Item {...item} openModal={this.abrirModal} textoPosQtd={"membros"} onDelete={this.deleteMembresia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.setState({ showModal: true })} activeOpacity={0.7}>
                    <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#0f5d39",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10
    },
    appButtonText: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "bold",
        textAlign: 'center',
        textTransform: "uppercase"
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fc',
    },
    containerInputs: {
        flexDirection: 'row'
    },
    taskList: {
        flex: 1,
        marginBottom: 20
    },
    label: {
        fontSize: 15,
        marginBottom: -10,
        marginLeft: 10,
        backgroundColor: '#f8f9fc',
        width: 150,
        textAlign: 'center',
        zIndex: 1
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 15,
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
    },
})

const mapStateToProps = ({ user }) => {
    return {
        userId: user.id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadRelatorios: () => {
            dispatch(fetchRelatorios())
            dispatch(setParamsDefaultRelatorio())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Membresia)