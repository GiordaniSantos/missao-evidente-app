import React, {useState, useEffect, useCallback} from 'react';
import {View, RefreshControl, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import api from '../../services/api';
import Alert from '../../components/SweetAlert';
import SelectDropdown from 'react-native-select-dropdown'
import CardRelatorio from '../../components/CardRelatorio';

const RelatorioAnual = ({ navigation }) => {
    const currentYear = new Date().getFullYear();
    const [reportData, setReportData] = useState({
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
        membresias: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const generateYears = () => {
        const years = [];
        for (let i = currentYear - 5; i <= currentYear; i++) {
            years.push(String(i));
        }
        return years;
    };
    const yearsData = generateYears();

    const loadRelatorios = useCallback(async (year) => {
        setLoading(true);
        setRefreshing(true);
        try {
            const res = await api.get(`/relatorio-anual?ano=${year}`);
            const data = res.data;

            setReportData({
                visitaCrente: data.crentes,
                visitaNaoCrente: data.incredulos,
                visitaPresidio: data.presidios,
                visitaEnfermo: data.enfermos,
                visitaHospital: data.hospitais,
                visitaEscola: data.escolas,
                batismosInfantis: data.batismosInfantis,
                batismosProfissoes: data.batismosProfissoes,
                bencoesNupciais: data.bencoesNupciais,
                santasCeias: data.santasCeias,
                estudos: data.estudos,
                sermoes: data.sermoes,
                estudosBiblicos: data.estudosBiblicos,
                discipulados: data.discipulados,
                membresias: data.membresias,
            });
        } catch (e) {
            Alert(e.response?.data?.message || 'Erro ao carregar relatórios', 'error');
            setReportData({ ...Object.fromEntries(Object.keys(reportData).map(key => [key, 0])) });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadRelatorios(selectedYear);
    }, [selectedYear, loadRelatorios]);

    const handleRefresh = () => {
        loadRelatorios(selectedYear);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0f5d39" />
                <Text style={{ marginTop: 10 }}>Carregando relatórios...</Text>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
                <View style={styles.header}>
                    <View style={styles.iconBar}>
                        <SelectDropdown
                            data={yearsData}
                            buttonStyle={[styles.dropdown2BtnStyle, styles.elevation]}
                            buttonTextStyle={styles.dropdown2BtnTxtStyle}
                            statusBarTranslucent={true}
                            renderDropdownIcon={isOpened => {
                                return <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#fff'} size={18} />;
                            }}
                            defaultButtonText='Selecione'
                            defaultValue={selectedYear}
                            onSelect={(item) => {
                                setSelectedYear(Number(item));
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem}
                            rowTextForSelection={(item) => item}
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
                        value={reportData.visitaCrente}
                        isVisita={true}
                        iconName="cross"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Crentes')}
                    />
                    <CardRelatorio
                        title="Não Crentes"
                        value={reportData.visitaNaoCrente}
                        isVisita={true}
                        iconName="heart-broken"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Não Crentes')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Presídios"
                        value={reportData.visitaPresidio}
                        isVisita={true}
                        iconName="user-lock"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Presídios')}
                    />
                    <CardRelatorio
                        title="Enfermos"
                        value={reportData.visitaEnfermo}
                        isVisita={true}
                        iconName="syringe"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Enfermos')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Hospitais"
                        value={reportData.visitaHospital}
                        isVisita={true}
                        iconName="hospital"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas aos Hospitais')}
                    />
                    <CardRelatorio
                        title="Escolas"
                        value={reportData.visitaEscola}
                        isVisita={true}
                        iconName="school"
                        iconColor="#f6c23e"
                        onPress={() => navigation.navigate('Visitas às Escolas')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos"
                        value={reportData.estudos}
                        iconName="book"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos')}
                    />
                    <CardRelatorio
                        title="Sermões"
                        value={reportData.sermoes}
                        iconName="user-tie"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Sermões')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Estudos Biblicos"
                        value={reportData.estudosBiblicos}
                        iconName="bible"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Estudos Biblicos')}
                    />
                    <CardRelatorio
                        title="Discipulados"
                        value={reportData.discipulados}
                        iconName="people-arrows"
                        iconColor="#4e73df"
                        onPress={() => navigation.navigate('Discipulados')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Batismos Infantis"
                        value={reportData.batismosInfantis}
                        iconName="child"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos Infantis')}
                    />
                    <CardRelatorio
                        title="Batismos/Prof. Fé"
                        value={reportData.batismosProfissoes}
                        iconName="praying-hands"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Batismos e Profissões de Fé')}
                    />
                </View>
                <View style={styles.rowCards}>
                    <CardRelatorio
                        title="Benções Nupciais"
                        value={reportData.bencoesNupciais}
                        iconName="hand-holding-heart"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('Benções Nupciais')}
                    />
                    <CardRelatorio
                        title="Santas Ceias"
                        value={reportData.santasCeias}
                        iconName="wine-glass-alt"
                        iconColor="#85102f"
                        onPress={() => navigation.navigate('wine-glass-alt')}
                    />
                </View>
                <View style={styles.rowCards}>
                     <CardRelatorio
                        title="Média de Membros aos Domingos"
                        value={reportData.membresias}
                        iconName="users"
                        iconColor="#211f11"
                        onPress={() => navigation.navigate('Frequência aos Domingos')}
                    />
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
    iconBar: {
        width: '100%',
    },
})

export default RelatorioAnual;