import React, {Component, useContext} from 'react';
import {View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, ScrollView} from 'react-native'
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
                <View style={styles.background}>
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
                </View>
                
                <View style={styles.taskList}>
                    <View style={[styles.card, styles.elevation]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={styles.titleVisita}>Crentes</Text>
                                    <Text style={styles.numeroVisita}>7 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'cross'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, styles.elevation, {borderLeftColor:'#4e73df'}]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={[styles.titleVisita, {color: '#4e73df'}]}>Não Crentes</Text>
                                    <Text style={styles.numeroVisita}>4 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'heart-broken'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, styles.elevation, {borderLeftColor:'#d55b2a'}]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={[styles.titleVisita, {color: '#d55b2a'}]}>Presídios</Text>
                                    <Text style={styles.numeroVisita}>7 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'user-lock'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, styles.elevation, {borderLeftColor: '#99443b'}]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={[styles.titleVisita, {color: '#99443b'}]}>Enfermos</Text>
                                    <Text style={styles.numeroVisita}>8 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'syringe'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, styles.elevation, {borderLeftColor: '#f6c23e'}]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={[styles.titleVisita, {color: '#f6c23e'}]}>Hospitais</Text>
                                    <Text style={styles.numeroVisita}>3 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'hospital'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, styles.elevation, {borderLeftColor: '#85102f'}]}>
                        <View style={styles.cardBody}>
                            <View style={styles.itens}>
                                <View>
                                    <Text style={[styles.titleVisita, {color:'#85102f'}]}>Escolas</Text>
                                    <Text style={styles.numeroVisita}>2 visitas</Text>
                                </View>
                                <View>
                                    <Icon size={32} style={styles.iconVisita} name={'school'}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fc',
    },
    dropdown2BtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#0a251b',
        borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: '#0a251b',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: {backgroundColor: '#0a251b', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    background:{
        flex: 2,
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: '#015b41'
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69)',
    },
    card:{
        height:90,
        backgroundColor: '#fff',
        borderTopColor: '#e3e6f0',
        borderBottomColor: '#e3e6f0',
        borderRightColor: '#e3e6f0',
        borderWidth: 1,
        margin: 10,
        borderLeftColor: '#1cc88a',
        borderLeftWidth: 4,
        width: 185,
        borderRadius: 5,
      
    },
    cardBody:{
        padding: 20
    },
    itens:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleVisita:{
        fontSize: 11,
        color: '#1cc88a',
        fontWeight: '700',
    },
    numeroVisita:{
        color: '#5a5c69',
        fontWeight: '700',
        fontSize: 20
    },
    iconVisita:{
        color: '#dddfeb',
        fontWeight: '900',
        fontSize: 32
    },
    taskList: {
        flex: 7,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    titleBar: {
        flex: 1,
        height: 100,
        width: 150,
        marginTop: 18,
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 30,
        marginLeft: 20,
        marginBottom: 20,
        color: 'black'
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 17,
        marginLeft: 20,
        marginBottom: 30,
        color: 'black'
    },
    iconBar: {
        height: 100,
        width: 150,
        marginTop: Platform.OS === 'ios' ? 40 : 35,
        marginRight: 30,
    },
})