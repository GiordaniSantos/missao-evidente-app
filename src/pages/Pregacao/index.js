import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/fundo-ipb.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError } from '../../Common'
import Item from '../../components/Item';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    pregacoes: []
}

export default class Pregacao extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadPregacoes()
    }

    handleLogout = () =>{
        this.context.logout();   
    }

    loadPregacoes = async () => {
        try{
            const res = await api.get(`/pregacao?id_usuario=${this.context.user.id}`)
            this.setState({ pregacoes: res.data.data })
        }catch(e) {
            showError(e)
        }
    }

    addPregacao = async newPregacao => {
        if(!newPregacao.nome || !newPregacao.nome.trim()){
            Alert.alert('Dados Inválidos', 'Nome não informado!')
            return
        }
        if(!newPregacao.quantidade || !newPregacao.quantidade.trim()){
            Alert.alert('Dados Inválidos', 'Quantidade não informada!')
            return
        }
        
        try {
            await api.post(`/pregacao`, {
                nome: newPregacao.nome,
                quantidade: newPregacao.quantidade,
                id_usuario: newPregacao.id_usuario
            })

            this.setState({ showModal: false }, this.loadPregacoes)

        } catch (error) {
            showError(error)
        }

    }

    deletePregacao = async pregacaoId => {
        try {
            await api.delete(`/pregacao/${pregacaoId}?id_usuario=${this.context.user.id}`)
            this.loadPregacoes()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <AddModal isVisible={this.state.showModal} tituloHeader={"Nova pregação"} dataSelect={["Estudos", "Sermões", "Estudos Bíblicos", "Discipulados"]} onCancel={() => { this.setState({showModal:false}) }} onSave={this.addPregacao}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Pregações</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.pregacoes} keyExtractor={item => `${item.id}`} renderItem={({item}) => <Item {...item} textoPosQtd={""} onDelete={this.deletePregacao}/>} />
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