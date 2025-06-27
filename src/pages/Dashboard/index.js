import React, { useState, useEffect, useCallback } from 'react';
import {View, RefreshControl, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Alert from '../../components/SweetAlert';
import { useSelector, useDispatch } from 'react-redux'
import { closeSplashScreen } from '../../store/actions/user';
import { fetchRelatorios } from '../../store/actions/dashboard';
import { setRefreshingRelatorio } from '../../store/actions/dashboard';
import { setParamsMesRelatorio, setParamsAnoRelatorio } from '../../store/actions/dashboard';
import SelectDropdown from 'react-native-select-dropdown'
import ItemRelatorio from '../../components/ItemRelatorio';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';

import FileViewer from "react-native-file-viewer";
import CardRelatorio from '../../components/CardRelatorio';

const date = new Date();

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const Dashboard = ({ navigation }) => {
    const dashboardData = useSelector(state => state.dashboard);
    const dispatch = useDispatch();

    const currentYear = date.getFullYear();

    const [localRefreshing, setLocalRefreshing] = useState(false);

    const generateYears = useCallback(() => {
        const years = [];
        for (let i = currentYear - 5; i <= currentYear; i++) {
            years.push(String(i));
        }
        return years;
    }, [currentYear]);
    const yearsData = generateYears();

    useEffect(() => {
        dispatch(fetchRelatorios(dashboardData.mes, dashboardData.ano));
        // dispatch(closeSplashScreen());
    }, [dispatch, dashboardData.mes, dashboardData.ano]);

    /*componentDidUpdate = prevProps => {
        if(prevProps.data != this.props.data){
            this.setState({
                mes: date.getMonth()+1,
                ano: date.getFullYear()
            })
        }
    }*/

    const onRefresh = useCallback(() => {
        setLocalRefreshing(true);
        dispatch(setRefreshingRelatorio());
        dispatch(fetchRelatorios(dashboardData.mes, dashboardData.ano)).finally(() => {
            setLocalRefreshing(false);
        });
    }, [dispatch, dashboardData.mes, dashboardData.ano]);

    const obterNomeMes = useCallback((numeroMes) => {
        return meses[numeroMes - 1];
    }, []);

    loadingRequest = async () => {
        if(dashboardData.loading){
            return ( <ActivityIndicator size="large" color="#00ff00" /> )
        }
    }

    const getDataToExport = useCallback(() => {
        let data = [
            { Menu: 'Visitação', Submenu: 'Visitas aos Crentes', Valor: dashboardData.visitaCrente },
            { Menu: 'Visitação', Submenu: 'Visitas aos Não Crentes', Valor: dashboardData.visitaNaoCrente },
            { Menu: 'Visitação', Submenu: 'Visitas aos Presídios', Valor: dashboardData.visitaPresidio },
            { Menu: 'Visitação', Submenu: 'Visitas aos Enfermos', Valor: dashboardData.visitaEnfermo },
            { Menu: 'Visitação', Submenu: 'Visitas aos Hospitais', Valor: dashboardData.visitaHospital },
            { Menu: 'Visitação', Submenu: 'Visitas às Escolas', Valor: dashboardData.visitaEscola },
            { Menu: 'Ministração', Submenu: 'Estudos', Valor: dashboardData.estudos },
            { Menu: 'Ministração', Submenu: 'Sermões', Valor: dashboardData.sermoes },
            { Menu: 'Ministração', Submenu: 'Estudos Biblicos', Valor: dashboardData.estudosBiblicos },
            { Menu: 'Ministração', Submenu: 'Discipulados', Valor: dashboardData.discipulados },
            { Menu: 'Ato Pastoral', Submenu: 'Batismos Infantis', Valor: dashboardData.batismosInfantis},
            { Menu: 'Ato Pastoral', Submenu: 'Batismos/Prof. Fé', Valor: dashboardData.batismosProfissoes},
            { Menu: 'Ato Pastoral', Submenu: 'Benções Nupciais', Valor: dashboardData.bencoesNupciais},
            { Menu: 'Ato Pastoral', Submenu: 'Santas Ceias', Valor: dashboardData.santasCeias},
            { Menu: 'Frequência', Submenu: 'Comungantes', Valor: dashboardData.comungante},
            { Menu: 'Frequência', Submenu: 'Não Comungantes', Valor: dashboardData.naoComungante},
        ];

        if (Array.isArray(dashboardData.membresias)) {
            dashboardData.membresias.forEach((item) => {
                let itemFormatado = {
                    Menu: 'Frequência',
                    Submenu: item.nome,
                    Valor: item.quantidade,
                };
                data.push(itemFormatado);
            });
        }
        
        let headers = [
            { header: 'Menu', key: 'Menu' },
            { header: 'Submenu', key: 'Submenu' },
            { header: 'Valor', key: 'Valor' },
        ];
        
        return { headers, data };
    }, [dashboardData]);
    
    const exportData = useCallback(async () => {
        const filePath = `${RNFS.DocumentDirectoryPath}/relatorio-${obterNomeMes(dashboardData.mes)}-${dashboardData.ano}.xlsx`;

        const { headers, data } = getDataToExport();
            
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data, { header: headers.map(h => h.key) });

            ws['!cols'] = [{wch:10},{wch:20},{wch:5}];

            XLSX.utils.book_append_sheet(wb, ws, "Relatório");
            const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

            await RNFS.writeFile(filePath, wbout, 'ascii');
            
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                 FileViewer.open(filePath)
                    .then(() => {
                        //console.log('Arquivo aberto com sucesso!');
                    })
                    .catch((error) => {
                        Alert(error.message === "No app associated with this mime type" ? "Nenhum aplicativo encontrado para abrir o arquivo em formato Excel." : error.message, 'error');
                        //console.error('Erro ao abrir arquivo:', error);
                    });
            } else {
                Alert("Funcionalidade de abrir arquivo não disponível nesta plataforma.", 'info');
                //console.log("Arquivo salvo em:", filePath);
            }
           
        } catch (e) {
            Alert(e.message, 'error');
            //console.error('Erro ao exportar dados:', e);
        }
    }, [dashboardData.mes, dashboardData.ano, obterNomeMes, getDataToExport]);

    if (dashboardData.loading && !localRefreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0f5d39" />
                <Text style={{ marginTop: 10 }}>Carregando relatórios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={localRefreshing || dashboardData.refresh} onRefresh={onRefresh} />}>
                <View style={styles.headerExcel}>
                    <TouchableOpacity style={styles.buttonOpacityExcel} onPress={exportData}>
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
                            defaultValueByIndex={dashboardData.mes - 1}
                            onSelect={(selectedItem, index) => {
                               // dispatch(setParamsMesRelatorio(index + 1));
                                dispatch(fetchRelatorios(index + 1, dashboardData.ano));
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdown2DropdownStyle}
                            rowStyle={styles.dropdown2RowStyle}
                            rowTextStyle={styles.dropdown2RowTxtStyle}
                        />
                    </View>
                    <View style={styles.secondSelectButton}>
                        <SelectDropdown
                            data={yearsData}
                            buttonStyle={[styles.dropdown2BtnStyle, styles.elevation]}
                            buttonTextStyle={styles.dropdown2BtnTxtStyle}
                            statusBarTranslucent={true}
                            renderDropdownIcon={isOpened => {
                                return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                            }}
                            defaultButtonText='Selecione'
                            defaultValue={dashboardData.ano}
                            onSelect={(selectedItem, index) => {
                                //dispatch(setParamsAnoRelatorio(selectedItem));
                                dispatch(fetchRelatorios(dashboardData.mes, selectedItem));
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdown2DropdownStyle}
                            rowStyle={styles.dropdown2RowStyle}
                            rowTextStyle={styles.dropdown2RowTxtStyle}
                        />
                    </View>
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Crentes"
                        value={dashboardData.visitaCrente}
                        isVisita={true}
                        iconName="cross"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Crentes')}
                    />
                    <CardRelatorio
                        title="Não Crentes"
                        value={dashboardData.visitaNaoCrente}
                        isVisita={true}
                        iconName="heart-broken"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Não Crentes')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Presídios"
                        value={dashboardData.visitaPresidio}
                        isVisita={true}
                        iconName="user-lock"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Presídios')}
                    />
                    <CardRelatorio
                        title="Enfermos"
                        value={dashboardData.visitaEnfermo}
                        isVisita={true}
                        iconName="syringe"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Enfermos')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Hospitais"
                        value={dashboardData.visitaHospital}
                        isVisita={true}
                        iconName="hospital"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Hospitais')}
                    />
                    <CardRelatorio
                        title="Escolas"
                        value={dashboardData.visitaEscola}
                        isVisita={true}
                        iconName="school"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas às Escolas')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos"
                        value={dashboardData.estudos}
                        iconName="book"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos')}
                    />
                    <CardRelatorio
                        title="Sermões"
                        value={dashboardData.sermoes}
                        iconName="user-tie"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Sermões')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos Biblicos"
                        value={dashboardData.estudosBiblicos}
                        iconName="bible"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos Biblicos')}
                    />
                    <CardRelatorio
                        title="Discipulados"
                        value={dashboardData.discipulados}
                        iconName="people-arrows"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Discipulados')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Batismos Infantis"
                        value={dashboardData.batismosInfantis}
                        iconName="child"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos Infantis')}
                    />
                    <CardRelatorio
                        title="Batismos/Prof. Fé"
                        value={dashboardData.batismosProfissoes}
                        iconName="praying-hands"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos e Profissões de Fé')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Benções Nupciais"
                        value={dashboardData.bencoesNupciais}
                        iconName="hand-holding-heart"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Benções Nupciais')}
                    />
                    <CardRelatorio
                        title="Santas Ceias"
                        value={dashboardData.santasCeias}
                        iconName="wine-glass-alt"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Santas Ceias')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Comungantes"
                        value={dashboardData.comungante}
                        iconName="users"
                        iconColor="#015b41"
                        onPress={() => navigation.navigate('Frequência aos Domingos')}
                    />
                    <CardRelatorio
                        title="Não Comungantes"
                        value={dashboardData.naoComungante}
                        iconName="user-times"
                        iconColor="#015b41"
                        onPress={() => navigation.navigate('Frequência aos Domingos')}
                    />
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
                                {dashboardData.loading && <ActivityIndicator style={{justifyContent: 'center', marginTop: 80}} size="large" color="#015b41" />}
                                {dashboardData.membresias && dashboardData.membresias.length != 0 ? Array.from(dashboardData.membresias).map((item, index)=> 
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
    
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    sectionMembresia:{
        flex: 1,
    }
})

export default Dashboard;