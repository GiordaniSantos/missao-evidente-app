import React, {Component} from 'react';
import {View, RefreshControl, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import api from '../../services/api';
import Alert from '../../components/SweetAlert';
import SelectDropdown from 'react-native-select-dropdown'

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
    ano: date.getFullYear(),
    membresias: 0,
}

export default class RelatorioAnual extends Component {
    state = {...initialState}

    componentDidMount = async () => {
        this.loadRelatorios(this.state.ano)
    }

    onRefresh = () => {
        this.setState({ refresh: true })
        this.loadRelatorios(this.state.ano)
    }
   
    loadRelatorios = async ( ano=this.state.ano ) => {
        try{
            const res = await api.get(`/relatorio-anual?ano=${ano}`)
            
            this.setState({ membresias: res.data.membresias })
            this.setState({ visitaCrente: res.data.crentes })
            this.setState({ visitaNaoCrente: res.data.incredulos })
            this.setState({ visitaPresidio: res.data.presidios })
            this.setState({ visitaEnfermo: res.data.enfermos })
            this.setState({ visitaHospital: res.data.hospitais })
            this.setState({ visitaEscola: res.data.escolas })
            this.setState({ batismosInfantis: res.data.batismosInfantis })
            this.setState({ batismosProfissoes: res.data.batismosProfissoes })
            this.setState({ bencoesNupciais: res.data.bencoesNupciais })
            this.setState({ santasCeias: res.data.santasCeias })
            this.setState({ estudos: res.data.estudos })
            this.setState({ sermoes: res.data.sermoes })
            this.setState({ estudosBiblicos: res.data.estudosBiblicos })
            this.setState({ discipulados: res.data.discipulados })
            this.setState({ loading: false })
            this.setState({ refresh: false })
        }catch(e) {
            Alert(e.response.data.message, 'error');
        }
    }

    render(){
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />}>
                    <View style={styles.header}>
                
                        <View style={styles.iconBar}>
                            <SelectDropdown
                                data={['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']}
                                buttonStyle={[styles.dropdown2BtnStyle, styles.elevation]}
                                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                                statusBarTranslucent={true}
                                renderDropdownIcon={isOpened => {
                                    return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                                }}
                                defaultButtonText='Selecione'
                                defaultValue={this.state.ano}
                                onSelect={(selectedItem, index) => {
                                    this.setState({ano: selectedItem})
                                    this.loadRelatorios(selectedItem)
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
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas aos Crentes')} activeOpacity={0.4}>
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
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor:'#f6c23e'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas aos Não Crentes')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#f6c23e'}]}>Não Crentes</Text>
                                            <Text style={styles.numeroVisita}>{this.state.visitaNaoCrente} visitas</Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'heart-broken'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor:'#f6c23e'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas aos Presídios')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#f6c23e'}]}>Presídios</Text>
                                            <Text style={styles.numeroVisita}>{this.state.visitaPresidio} visitas</Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'user-lock'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#f6c23e'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas aos Enfermos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#f6c23e'}]}>Enfermos</Text>
                                            <Text style={styles.numeroVisita}>{this.state.visitaEnfermo} visitas</Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'syringe'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#f6c23e'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas aos Hospitais')} activeOpacity={0.4}>
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
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#f6c23e'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Visitas às Escolas')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#f6c23e'}]}>Escolas</Text>
                                            <Text style={styles.numeroVisita}>{this.state.visitaEscola} visitas</Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'school'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#4e73df'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Estudos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#4e73df'}]}>Estudos</Text>
                                            <Text style={styles.numeroVisita}>{this.state.estudos} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'book'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#4e73df'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Sermões')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#4e73df'}]}>Sermões</Text>
                                            <Text style={styles.numeroVisita}>{this.state.sermoes} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'user-tie'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#4e73df'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Estudos Biblicos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#4e73df'}]}>Estudos Biblicos</Text>
                                            <Text style={styles.numeroVisita}>{this.state.estudosBiblicos} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'bible'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#4e73df'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Discipulados')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#4e73df'}]}>Discipulados</Text>
                                            <Text style={styles.numeroVisita}>{this.state.discipulados} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'people-arrows'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#85102f'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Batismos Infantis')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#85102f'}]}>Batismos Infantis</Text>
                                            <Text style={styles.numeroVisita}>{this.state.batismosInfantis} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'child'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#85102f'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Batismos e Profissões de Fé')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#85102f'}]}>Batismos/Prof. Fé</Text>
                                            <Text style={styles.numeroVisita}>{this.state.batismosProfissoes} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'praying-hands'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#85102f'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Benções Nupciais')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#85102f'}]}>Benções Nupciais</Text>
                                            <Text style={styles.numeroVisita}>{this.state.bencoesNupciais} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'hand-holding-heart'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#85102f'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Santas Ceias')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#85102f'}]}>Santas Ceias</Text>
                                            <Text style={styles.numeroVisita}>{this.state.santasCeias} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'wine-glass-alt'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowCards}>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#211f11'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Frequência aos Domingos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#211f11'}]}>Média de Membros aos Domingos</Text>
                                            <Text style={styles.numeroVisita}>{this.state.membresias}</Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'users'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
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
        backgroundColor: '#0f5d39',
        borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: '#0f5d39',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: {backgroundColor: '#0f5d39', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    header:{
        flex: 1,
        justifyContent: "center",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69)',
    },
    rowCards:{
        display: 'flex', 
        flexDirection: 'row'
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
        borderLeftColor: '#f6c23e',
        borderLeftWidth: 4,
        flex: 1,
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
        flex: 1,
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
        color: '#f6c23e',
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
    iconBar: {
        width: '100%',
    },
})