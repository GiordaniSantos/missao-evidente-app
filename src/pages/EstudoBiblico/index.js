import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/fundo-ipb3.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError } from '../../Common'
import ItemVisita from '../../components/ItemVisita';

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    estudoBiblico: []
}

export default class EstudoBiblico extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadEstudoBiblico()
    }

    loadEstudoBiblico = async () => {
        try{
            const res = await api.get(`/estudo-biblico?id_usuario=${this.context.user.id}`)
            this.setState({ estudoBiblico: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addEstudoBiblico = async id_usuario => {
        try {
            await api.post(`/estudo-biblico`, {
                id_usuario: id_usuario
            })

            this.loadEstudoBiblico()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteEstudoBiblico = async EstudoBiblicoId => {
        try {
            await api.delete(`/estudo-biblico/${EstudoBiblicoId}?id_usuario=${this.context.user.id}`)
            this.loadEstudoBiblico()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Estudos Biblicos</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.estudoBiblico} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} textoAntesHora={"Realizado no dia"} onDelete={this.deleteEstudoBiblico}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addEstudoBiblico(this.context.user.id)} activeOpacity={0.7}>
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
        fontSize: 28,
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