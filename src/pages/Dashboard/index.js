import React, {Component} from 'react';
import {View, RefreshControl, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import { AuthContext } from '../../contexts/auth';
import commonStyles from '../../CommonStyles';
import Icon from 'react-native-vector-icons/FontAwesome5'
import api from '../../services/api';
import Alert from '../../components/SweetAlert';
import SelectDropdown from 'react-native-select-dropdown'
import ItemRelatorio from '../../components/ItemRelatorio';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';

import FileViewer from "react-native-file-viewer";

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
    comungante: 0,
    naoComungante: 0,
    loading: true,
    refresh: false,
    mes: date.getMonth()+1,
    ano: date.getFullYear(),
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

    obterNomeMes = (numeroMes) => {
        const meses = [
            "janeiro", "fevereiro", "marco", "abril", "maio", "junho",
            "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];

        return meses[numeroMes - 1];
    }
   
    loadRelatorios = async ( mes=this.state.mes, ano=this.state.ano ) => {
        try{
            const res = await api.get(`/dashboard?id_usuario=${this.context.user.id}&mes=${mes}&ano=${ano}`)
            
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
            this.setState({ comungante: res.data.comungante })
            this.setState({ naoComungante: res.data.naoComungante })
            this.setState({ loading: false })
            this.setState({ refresh: false })
        }catch(e) {
            if(e.response.data.message == "Unauthenticated."){
                this.loadRelatorios()
            }else{
                Alert(e.response.data.message, 'error');
            }
        }
    }

    loadingRequest = async () => {
        if(this.state.loading){
            return ( <ActivityIndicator size="large" color="#00ff00" /> )
        }
    }

    getDataToExport = () => {
        let data = [
            { Menu: 'Visitação', Submenu: 'Visitas aos Crentes', Valor: this.state.visitaCrente },
            { Menu: 'Visitação', Submenu: 'Visitas aos Não Crentes', Valor: this.state.visitaNaoCrente },
            { Menu: 'Visitação', Submenu: 'Visitas aos Presídios', Valor: this.state.visitaPresidio },
            { Menu: 'Visitação', Submenu: 'Visitas aos Enfermos', Valor: this.state.visitaEnfermo },
            { Menu: 'Visitação', Submenu: 'Visitas aos Hospitais', Valor: this.state.visitaHospital },
            { Menu: 'Visitação', Submenu: 'Visitas às Escolas', Valor: this.state.visitaEscola },
            { Menu: 'Ministração', Submenu: 'Estudos', Valor: this.state.estudos },
            { Menu: 'Ministração', Submenu: 'Sermões', Valor: this.state.sermoes },
            { Menu: 'Ministração', Submenu: 'Estudos Biblicos', Valor: this.state.estudosBiblicos },
            { Menu: 'Ministração', Submenu: 'Discipulados', Valor: this.state.discipulados },
            { Menu: 'Ato Pastoral', Submenu: 'Batismos Infantis', Valor: this.state.batismosInfantis},
            { Menu: 'Ato Pastoral', Submenu: 'Batismos/Prof. Fé', Valor: this.state.batismosProfissoes},
            { Menu: 'Ato Pastoral', Submenu: 'Benções Nupciais', Valor: this.state.bencoesNupciais},
            { Menu: 'Ato Pastoral', Submenu: 'Santas Ceias', Valor: this.state.santasCeias},
            { Menu: 'Frequência', Submenu: 'Comungantes', Valor: this.state.comungante},
            { Menu: 'Frequência', Submenu: 'Não Comungantes', Valor: this.state.naoComungante},
        ]

        this.state.membresias.map((item, index) => {
            let itemFormatado = {
                Menu: 'Frequência',
                Submenu: item.nome,
                Valor: item.quantidade,
            }
            data.push(itemFormatado);
        });
        
        let headers = [
            { header: 'Menu', key: 'Menu' },
            { header: 'Submenu', key: 'Submenu' },
            { header: 'Valor', key: 'Valor' },
        ]
        
        return { headers, data }
    }
    
    exportData = async () => {
        await this.loadRelatorios()

        let filePath = RNFS.DocumentDirectoryPath + `/relatorio-${this.obterNomeMes(this.state.mes)}-${this.state.ano}.xlsx`;

        let { headers, data } = this.getDataToExport()
          
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(data, { header: headers.map(h => h.key) });

        ws['!cols'] = [{wch:10},{wch:20},{wch:5}]; //Define o tamanho das colunas

        XLSX.utils.book_append_sheet(wb, ws, "Users");
        const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });
        RNFS.writeFile(filePath, wbout, 'ascii')
            .then((r) => {
                //arquivo salvo
                FileViewer.open(filePath)
                    .then((res) => {
                        // Success arquivo aberto
                    })
                    .catch((error) => {
                        // Error ao abrir
                        Alert(error == "Error: No app associated with this mime type" ? "Nenhum aplicativo encontrado para abrir o arquivo em formato Excel." : error, 'error');
                    });
            })
            .catch((e) => {
                //erro ao salvar
                Alert(e.message, 'error');
            });
    }

    render(){
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />}>
                    <View style={styles.headerExcel}>
                        <TouchableOpacity style={styles.buttonOpacityExcel} onPress={this.exportData}>
                            <View style={styles.containerViewButtonExcel}>
                                <Icon name="file-excel" color="white" size={20} />
                                <Text style={styles.textButtonExcel}>Exportar para Excel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header}>
                        <View style={styles.firstSelectButton}>
                            <SelectDropdown
                                data={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                                buttonStyle={[styles.dropdown2BtnStyle, styles.elevation]}
                                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                                statusBarTranslucent={true}
                                renderDropdownIcon={isOpened => {
                                    return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                                }}
                                defaultButtonText='Selecione'
                                defaultValueByIndex={date.getMonth()}
                                onSelect={(selectedItem, index) => {
                                    this.setState({mes: index+1})
                                    this.loadRelatorios(index+1, this.state.ano)
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
                        <View style={styles.secondSelectButton}>
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
                                    this.loadRelatorios(this.state.mes, selectedItem)
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
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#015b41'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Frequência aos Domingos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color: '#015b41'}]}>Comungantes</Text>
                                            <Text style={styles.numeroVisita}>{this.state.comungante} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'users'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.card, styles.elevation, {borderLeftColor: '#015b41'}]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Frequência aos Domingos')} activeOpacity={0.4}>
                                <View style={styles.cardBody}>
                                    <View style={styles.itens}>
                                        <View>
                                            <Text style={[styles.titleVisita, {color:'#015b41'}]}>Não Comungantes</Text>
                                            <Text style={styles.numeroVisita}>{this.state.naoComungante} </Text>
                                        </View>
                                        <View>
                                            <Icon size={32} style={styles.iconVisita} name={'user-times'}></Icon>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.sectionMembresia}>
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
    rowCards:{
        display: 'flex', 
        flexDirection: 'row'
    },
    dropdown2RowStyle: {
        backgroundColor: '#0f5d39', 
        borderBottomColor: '#C5C5C5'
    },
    dropdown2RowTxtStyle: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headerExcel:{        
       marginTop:11,
       marginBottom: -4,
       marginLeft: 10,
       marginRight: 10
    },
    buttonOpacityExcel:{
        backgroundColor: '#0f5d39', 
        padding: 10, 
        borderRadius: 8
    },
    containerViewButtonExcel:{
        flexDirection: 'row', 
        alignItems: 'center', 
        textAlign: 'center', 
        justifyContent: 'center'
    },
    textButtonExcel:{
        color: 'white', 
        marginLeft: 6, 
        textAlign: 'center'
    },
    header:{
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: -35,
    },
    elevation: {
        elevation: 18,
        shadowColor: 'rgba(58,59,69)',
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

    firstSelectButton: {
        flex: 1,
        height: 100,
        width: 150,
        marginTop: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    secondSelectButton: {
        flex: 1,
        height: 100,
        width: 150,
        marginTop: 18,
        marginLeft: 10,
        marginRight: 10,
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
    sectionMembresia:{
        flex: 1,
    }
})