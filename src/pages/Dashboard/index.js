import React, {Component, useContext} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/today.jpg'
import Icon from 'react-native-vector-icons/FontAwesome5'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError, showSuccess } from '../../Common'
import ItemVisita from '../../components/ItemVisita';
import SelectDropdown from 'react-native-select-dropdown'

const initialState = { 
    showDoneTasks: true,
    showModal: false,
    crentes: []
}

export default class Dashboard extends Component {
    state = {...initialState}

    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadVisitasCrentes()
    }

    loadVisitasCrentes = async () => {
        try{
            const res = await api.get(`/crente?id_usuario=${this.context.user.id}`)
            this.setState({ crentes: res.data.data })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    addVisitaCrente = async id_usuario => {
        try {
            await api.post(`/crente`, {
                id_usuario: id_usuario
            })

            this.loadVisitasCrentes()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    deleteVisitaCrente = async crenteId => {
        try {
            await api.delete(`/crente/${crenteId}?id_usuario=${this.context.user.id}`)
            this.loadVisitasCrentes()
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
                        <Text style={styles.title}>Dashboard</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                    <View style={styles.iconBar}>
                        <SelectDropdown
                        data={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                        buttonStyle={styles.dropdown2BtnStyle}
                        buttonTextStyle={styles.dropdown2BtnTxtStyle}
                        renderDropdownIcon={isOpened => {
                            return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                        }}
                        defaultButtonText='Selecione'
                        defaultValueByIndex={1}
                        onSelect={(selectedItem, index) => {
                            this.setState({ nome: selectedItem })
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            return item
                        }}
                        dropdownIconPosition={'right'}
                        dropdownStyle={styles.dropdown2DropdownStyle}
                        rowStyle={styles.dropdown2RowStyle}
                        rowTextStyle={styles.dropdown2RowTxtStyle}
                        />
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <View style={{borderLeftColor: '#1cc88a', borderLeftWidth: 2}}>
                        <View style={{}}>
                            <View style={{alignItems: 'center'}}>
                                <View>
                                    <Text>Crentes</Text>
                                    <Text>7 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={21} style={{color:'black'}} name={'cross'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => this.addVisitaCrente(this.context.user.id)} activeOpacity={0.7}>
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
    dropdown2BtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#444',
        borderRadius: 8,
      },
      dropdown2BtnTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
      },
      dropdown2DropdownStyle: {
        backgroundColor: '#444',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      },
      dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
      dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    background:{
        flex: 2,
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: '#015b41',
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        height: 100,
        width: 150,
        marginTop: 18
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 30,
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
        height: 100,
        width: 150,
        marginTop: Platform.OS === 'ios' ? 40 : 35,
        marginRight: 30,
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