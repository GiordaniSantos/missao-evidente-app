import React, {Component, useContext} from 'react';
import {View, RefreshControl, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Platform, Alert, ScrollView} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import todayImage from '../../../assets/imgs/today.jpg'
import Icon from 'react-native-vector-icons/FontAwesome5'
import IconRefresh from 'react-native-vector-icons/FontAwesome'
import AddModal from '../../components/AddModal';
import moment from 'moment'
import 'moment/locale/pt-br'
import api from '../../services/api';
import { showError, showSuccess } from '../../Common'
import ItemVisita from '../../components/ItemVisita';
import SelectDropdown from 'react-native-select-dropdown'
import ItemRelatorio from '../../components/ItemRelatorio';

const date = new Date();

const initialState = { 
    visitaCrente: 0,
    visitaNaoCrente: 0,
    visitaPresidio: 0,
    visitaEnfermo: 0,
    visitaHospital: 0,
    visitaEscola: 0,
    batismosInfantis: 0,
    batismosProfissoes: 0,
    bencoesNupciais: 0,
    santasCeias: 0,
    estudos: 0,
    sermoes: 0,
    estudosBiblicos: 0,
    discipulados: 0,
    loading: true,
    refresh: false,
    mes: date.getMonth()+1,
    membresias: {},
}



export default class Dashboard extends Component {
    state = {...initialState}
    static contextType = AuthContext;

    componentDidMount = async () => {
        this.loadRelatorios()
    }

    onRefresh = () => {
        this.setState({ refresh: true })
        this.loadRelatorios()
    }
   
    loadRelatorios = async ( mes=date.getMonth()+1 ) => {
        try{
            const res = await api.get(`/dashboard?id_usuario=${this.context.user.id}&mes=${mes}`)
            
            this.setState({ membresias: res.data[0].membresias })
            this.setState({ visitaCrente: res.data[1].crentes })
            this.setState({ visitaNaoCrente: res.data[2].incredulos })
            this.setState({ visitaPresidio: res.data[3].presidios })
            this.setState({ visitaEnfermo: res.data[4].enfermos })
            this.setState({ visitaHospital: res.data[5].hospitais })
            this.setState({ visitaEscola: res.data[6].escolas })
            this.setState({ batismosInfantis: res.data[7].batismoInfantil })
            this.setState({ batismosProfissoes: res.data[8].batismoProfissao })
            this.setState({ bencoesNupciais: res.data[9].bencaoNupcial })
            this.setState({ santasCeias: res.data[10].santaCeia })
            this.setState({ estudos: res.data[11].estudo })
            this.setState({ sermoes: res.data[12].sermao })
            this.setState({ estudosBiblicos: res.data[13].estudoBiblico })
            this.setState({ discipulados: res.data[14].discipulado })
            this.setState({ loading: false })
            this.setState({ refresh: false })
        }catch(e) {
            console.log(e)
            showError(e)
        }
    }

    loadingRequest = async () => {
        if(this.state.loading){
            return ( <ActivityIndicator size="large" color="#00ff00" /> )
        }
    }

    addVisitaCrente = async id_usuario => {
        try {
            await api.post(`/crente`, {
                id_usuario: id_usuario
            })

            this.loadRelatorios()

        } catch (error) {
            console.log(error)
            showError(error)
        }

    }

    alterarMes = (mes) => {
        this.setState({mes})
        this.loadRelatorios()
    }

    deleteVisitaCrente = async crenteId => {
        try {
            await api.delete(`/crente/${crenteId}?id_usuario=${this.context.user.id}`)
            this.loadRelatorios()
        } catch (error) {
            showError(error)
        }
    }

    render(){
        const today = moment().locale('pt-BR').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />}>
                    <View style={styles.header}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>Dashboard</Text>
                            <Text style={styles.subtitle}>{today}</Text>
                        </View>
                        <View style={styles.iconBar}>
                            <View style={{alignItems: 'flex-end', marginBottom: 12}}>
                                <TouchableOpacity onPress={() => this.loadRelatorios(this.state.mes)} activeOpacity={0.1}>
                                    <IconRefresh name={'refresh'} color={'#585b58'} size={18} />
                                </TouchableOpacity>
                            </View>
                            <SelectDropdown
                            data={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                            buttonStyle={[styles.dropdown2BtnStyle, styles.elevation]}
                            buttonTextStyle={styles.dropdown2BtnTxtStyle}
                            renderDropdownIcon={isOpened => {
                                return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                            }}
                            defaultButtonText='Selecione'
                            defaultValueByIndex={date.getMonth()}
                            onSelect={(selectedItem, index) => {
                                this.setState({mes: index+1})
                                this.loadRelatorios(index+1)
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
                    <View style={styles.bodyVisitas}>
                        <View style={[styles.card, styles.elevation]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={styles.titleVisita}>Crentes</Text>
                                        <Text style={styles.numeroVisita}>{this.state.visitaCrente} visitas</Text>
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
                                        <Text style={styles.numeroVisita}>{this.state.visitaNaoCrente} visitas</Text>
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
                                        <Text style={styles.numeroVisita}>{this.state.visitaPresidio} visitas</Text>
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
                                        <Text style={styles.numeroVisita}>{this.state.visitaEnfermo} visitas</Text>
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
                                        <Text style={styles.numeroVisita}>{this.state.visitaHospital} visitas</Text>
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
                                        <Text style={styles.numeroVisita}>{this.state.visitaEscola} visitas</Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'school'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#d15268'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color: '#d15268'}]}>Estudo</Text>
                                        <Text style={styles.numeroVisita}>{this.state.estudos} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'book'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#1f1956'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color:'#1f1956'}]}>Sermão</Text>
                                        <Text style={styles.numeroVisita}>{this.state.sermoes} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'user-tie'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#d27322'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color: '#d27322'}]}>Estudo Biblico</Text>
                                        <Text style={styles.numeroVisita}>{this.state.estudosBiblicos} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'bible'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#2ddfae'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color:'#2ddfae'}]}>Discipulado</Text>
                                        <Text style={styles.numeroVisita}>{this.state.discipulados} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'people-arrows'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#359d93'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color: '#359d93'}]}>Batismo Infantil</Text>
                                        <Text style={styles.numeroVisita}>{this.state.batismosInfantis} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'child'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#909274'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color:'#909274'}]}>Batismo/Prof. Fé</Text>
                                        <Text style={styles.numeroVisita}>{this.state.batismosProfissoes} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'praying-hands'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#211f11'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color: '#211f11'}]}>Benção Nupcial</Text>
                                        <Text style={styles.numeroVisita}>{this.state.bencoesNupciais} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'hand-holding-heart'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#338767'}]}>
                            <View style={styles.cardBody}>
                                <View style={styles.itens}>
                                    <View>
                                        <Text style={[styles.titleVisita, {color:'#338767'}]}>Santa Ceia</Text>
                                        <Text style={styles.numeroVisita}>{this.state.santasCeias} </Text>
                                    </View>
                                    <View>
                                        <Icon size={32} style={styles.iconVisita} name={'wine-glass-alt'}></Icon>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.acoes}>
                        <View style={styles.cardMembros}>
                            <View style={styles.cardHeader}>
                                <Text style={{color: '#015b41'}}>
                                    Membresia aos Domingos
                                </Text>
                            </View>
                            <View style={styles.cardBody}>
                                <View style={{width: '100%', height: 'auto'}}>
                                    {this.state.loading && <ActivityIndicator style={{justifyContent: 'center', marginTop: 80}} size="large" color="#015b41" />}
                                    {this.state.membresias && this.state.membresias.length != 0 ? Array.from(this.state.membresias).map((item, index)=> 
                                        (
                                        <View key={index}>
                                            <ItemRelatorio {...item} cor="#015b41"/>
                                        </View>
                                        )
                                    ) : (
                                        <Text style={{fontSize: 20, color: '#585b58', textAlign: 'center', marginTop: 80}}>Nenhum resultado encontrado!</Text>
                                        )
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
        backgroundColor: '#134b36',
        borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: '#134b36',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: {backgroundColor: '#134b36', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    header:{
        height: 115,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69)',
    },
    acoes:{
        
    },
    cardHeader:{
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#f8f9fc',
        borderBottomColor: '#e3e6f0',
        borderBottomWidth: 1
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
        width: '44%',
        borderRadius: 5,
      
    },
    cardMembros:{
        minHeight: 300,
        height:'auto',
        backgroundColor: '#fff',
        borderTopColor: '#e3e6f0',
        borderBottomColor: '#e3e6f0',
        borderRightColor: '#e3e6f0',
        borderWidth: 1,
        margin: 10,
        borderLeftColor: '#e3e6f0',
        width: '93%',
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
    bodyVisitas: {
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
        marginBottom: 7,
        color: '#585b58'
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 17,
        marginLeft: 20,
        marginBottom: 30,
        color: 'black',
        fontWeight: '400',
        color: '#585b58'
    },
    iconBar: {
        height: 100,
        width: 150,
        marginTop: Platform.OS === 'ios' ? 40 : 15,
        marginRight: 20,
    },
})