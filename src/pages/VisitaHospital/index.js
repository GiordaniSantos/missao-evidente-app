import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native'
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
    hospital: []
}

export default class VisitaHospital extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasHospital()
    }

    loadVisitasHospital = async () => {
        try{
            const res = await api.get(`/hospital?id_usuario=${this.context.user.id}`)
            this.setState({ hospital: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaHospital = async id_usuario => {
        try {
            await api.post(`/hospital`, {
                id_usuario: id_usuario
            })

            this.loadVisitasHospital()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteVisitaHospital = async hospitalId => {
        try {
            await api.delete(`/hospital/${hospitalId}?id_usuario=${this.context.user.id}`)
            this.loadVisitasHospital()
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
                        <Text style={styles.title}>Visitas aos Hospitais</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.hospital} keyExtractor={item => `${item.id}`} renderItem={({item}) => <ItemVisita {...item} textoAntesHora={"Visita realizada no dia"} onDelete={this.deleteVisitaHospital}/>} />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaHospital(this.context.user.id)} activeOpacity={0.7}>
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
        fontSize: 26,
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