import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/fundo-ipb2.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError } from '../../Common'
import Item from '../../components/Item';

const initialState = { 
    showModal: false,
    membros: []
}

export default class Membresia extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadMembros()
    }

    handleLogout = () =>{
        this.context.logout();   
    }

    loadMembros = async () => {
        try{
            const res = await api.get(`/membresia?id_usuario=${this.context.user.id}`)
            this.setState({ membros: res.data.data })
        }catch(e) {
            showError(e)
        }
    }

    addMembresia = async newMembro => {
        if(!newMembro.nome || !newMembro.nome.trim()){
            Alert.alert('Dados Inválidos', 'Nome não informado!')
            return
        }
        if(!newMembro.quantidade || !newMembro.quantidade.trim()){
            Alert.alert('Dados Inválidos', 'Quantidade não informada!')
            return
        }
        
        try {
            await api.post(`/membresia`, {
                nome: newMembro.nome,
                quantidade: newMembro.quantidade,
                id_usuario: newMembro.id_usuario
            })

            this.setState({ showModal: false }, this.loadMembros)

        } catch (error) {
            showError(error)
        }

    }

    deleteMembresia = async membroId => {
        try {
            await api.delete(`/membresia/${membroId}?id_usuario=${this.context.user.id}`)
            this.loadMembros()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <AddModal isVisible={this.state.showModal} tituloHeader={"Nova membresia"} dataSelect={["Primeiro Domingo", "Segundo Domingo", "Terceiro Domingo", "Quarto Domingo", "Comungantes", "Não Comungantes"]} onCancel={() => { this.setState({showModal:false}) }} onSave={this.addMembresia}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Membresias</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.membros} keyExtractor={item => `${item.id}`} renderItem={({item}) => <Item {...item} textoPosQtd={"membros"} onDelete={this.deleteMembresia}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.setState({ showModal: true })} activeOpacity={0.7}>
                    <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background:{
        flex: 2
    },
    taskList: {
        flex: 6
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 40,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
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