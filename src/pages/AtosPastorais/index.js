import React, {Component, useContext} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/today.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError, showSuccess } from '../../Common'
import Item from '../../components/Item';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    atos: []
}

export default class AtosPastorais extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadAtos()
    }

    handleLogout = () =>{
        this.context.logout();   
    }

    loadAtos = async () => {
        try{
            const res = await api.get(`/ato-pastoral?id_usuario=${this.context.user.id}`)
            this.setState({ atos: res.data.data })
        }catch(e) {
            showError(e)
        }
    }

    addAtoPastoral = async newAto => {
        if(!newAto.nome || !newAto.nome.trim()){
            Alert.alert('Dados Inválidos', 'Nome não informado!')
            return
        }
        if(!newAto.quantidade || !newAto.quantidade.trim()){
            Alert.alert('Dados Inválidos', 'Quantidade não informada!')
            return
        }
        
        try {
            await api.post(`/ato-pastoral`, {
                nome: newAto.nome,
                quantidade: newAto.quantidade,
                id_usuario: newAto.id_usuario
            })

            this.setState({ showModal: false }, this.loadAtos)

        } catch (error) {
            showError(error)
        }

    }

    deleteAtoPastoral = async membroId => {
        try {
            await api.delete(`/ato-pastoral/${membroId}?id_usuario=${this.context.user.id}`)
            this.loadAtos()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <AddModal isVisible={this.state.showModal} tituloHeader={"Novo Ato Pastoral"} dataSelect={["Batismo Infantil", "Batismo e Profissão de Fé", "Benção Nupcial", "Santa Ceia"]} onCancel={() => { this.setState({showModal:false}) }} onSave={this.addAtoPastoral}/>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon  name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Atos Pastorais</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.atos} keyExtractor={item => `${item.id}`} renderItem={({item}) => <Item {...item} textoPosQtd={""} onDelete={this.deleteAtoPastoral}/>} />
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
        flex: 3
    },
    taskList: {
        flex: 7
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
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10

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