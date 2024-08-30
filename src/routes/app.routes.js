import React, {Component} from 'react';
import { logout } from '../store/actions/user';
import { useDispatch } from 'react-redux';
import Membresia from "../pages/Membresia";
import VisitaCrente from '../pages/VisitaCrente';
import VisitaNaoCrente from '../pages/VisitaNaoCrente';
import VisitaPresidio from '../pages/VisitaPresidio';
import VisitaEnfermo from '../pages/VisitaEnfermo';
import VisitaHospital from '../pages/VisitaHospital';
import VisitaEscola from '../pages/VisitaEscola';
import Dashboard from '../pages/Dashboard';
import BatismoInfantil from '../pages/BatismoInfantil';
import BatismoProfissaoFe from '../pages/BatismoProfissaoFe';
import BencaoNupcial from '../pages/BencaoNupcial';
import SantaCeia from '../pages/SantaCeia';
import Estudo from '../pages/Estudo';
import Sermao from '../pages/Sermao';
import EstudoBiblico from '../pages/EstudoBiblico';
import RelatorioAnual from '../pages/RelatorioAnual';
import Discipulado from '../pages/Discipulado';
import Conta from '../pages/Conta';
import { Text, View, StyleSheet, StatusBar, Modal, TouchableOpacity, Image, TouchableWithoutFeedback, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import CommonStyles from '../CommonStyles';
import image from '../../assets/imgs/logo-menu.png'
import { createDrawerNavigator,  DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const routes = [
  { name: 'Início', component: Dashboard },
  { name: 'Relatório Anual', component: RelatorioAnual },
  { name: 'Frequência aos Domingos', component: Membresia },
  { name: 'Estudos', component: Estudo },
  { name: 'Sermões', component: Sermao },
  { name: 'Estudos Biblicos', component: EstudoBiblico },
  { name: 'Discipulados', component: Discipulado },
  { name: 'Batismos Infantis', component: BatismoInfantil },
  { name: 'Batismos e Profissões de Fé', component: BatismoProfissaoFe },
  { name: 'Benções Nupciais', component: BencaoNupcial },
  { name: 'Santas Ceias', component: SantaCeia },
  { name: 'Visitas aos Crentes', component: VisitaCrente },
  { name: 'Visitas aos Não Crentes', component: VisitaNaoCrente },
  { name: 'Visitas aos Presídios', component: VisitaPresidio },
  { name: 'Visitas aos Enfermos', component: VisitaEnfermo },
  { name: 'Visitas aos Hospitais', component: VisitaHospital },
  { name: 'Visitas às Escolas', component: VisitaEscola },
  { name: 'Conta', component: Conta },
];

const routesDrawerItem = [
  { name: 'Início', labelStyle: {marginLeft: -9}, icon: 'home' },
  { name: 'Relatório Anual', labelStyle: {marginLeft: -9}, icon: 'chart-bar' },
  { name: 'Frequência aos Domingos', labelStyle: {marginLeft: -9}, icon: 'calendar-check' },
]

const routesMinistracaoDrawerItem = [
  { name: 'Estudos', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'book' },
  { name: 'Sermões', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'user-tie' },
  { name: 'Estudos Biblicos', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -3}, style: {marginLeft: 20, marginRight: 20}, icon: 'bible' },
  { name: 'Discipulados', labelStyle: {marginLeft: -10}, drawerLabelStyle: {marginLeft: -3}, style: {marginLeft: 20, marginRight: 20}, icon: 'people-arrows' },
]

const routesAtoPastoralDrawerItem = [
  { name: 'Batismos Infantis', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'child' },
  { name: 'Batismos e Profissões de Fé', labelStyle: {marginLeft: -15}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'praying-hands' },
  { name: 'Benções Nupciais', labelStyle: {marginLeft: -13}, drawerLabelStyle: {marginLeft: -3}, style: {marginLeft: 20, marginRight: 20}, icon: 'hand-holding-heart' },
  { name: 'Santas Ceias', labelStyle: {}, drawerLabelStyle: {}, style: {marginLeft: 20, marginRight: 20}, icon: 'wine-glass-alt' },
]

const routesVisitacaoDrawerItem = [
  { name: 'Visitas aos Crentes', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'cross' },
  { name: 'Visitas aos Não Crentes', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'heart-broken' },
  { name: 'Visitas aos Presídios', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'user-lock' },
  { name: 'Visitas aos Enfermos', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'syringe' },
  { name: 'Visitas aos Hospitais', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'hospital' },
  { name: 'Visitas às Escolas', labelStyle: {marginLeft: -5}, drawerLabelStyle: {marginLeft: -5}, style: {marginLeft: 20, marginRight: 20}, icon: 'school' },
]


//estilizando o menu
//items, itemList do Drawer.screens e items
function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const currentRoute = navigation.getCurrentRoute();
  const dispatch = useDispatch();
  
  const [isShowAtoPastoral,showAtoPastoral] = React.useState(false)
  const [isShowPregacao,showPregacao] = React.useState(false)
  const [isShowVisitacao,showVisitacao] = React.useState(false)

  const routeMap = {
    'Visitas aos Crentes': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Visitas aos Não Crentes': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Visitas aos Presídios': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Visitas aos Enfermos': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Visitas aos Hospitais': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Visitas às Escolas': { showVisitacao: true, showAtoPastoral: false, showPregacao: false },
    'Estudos': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
    'Sermões': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
    'Estudos Biblicos': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
    'Discipulados': { showAtoPastoral: true, showPregacao: false, showVisitacao: false },
    'Batismos Infantis': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
    'Batismos e Profissões de Fé': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
    'Benções Nupciais': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
    'Santas Ceias': { showPregacao: true, showAtoPastoral: false, showVisitacao: false },
    'Início': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
    'Relatório Anual': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
    'Frequência aos Domingos': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
    'Conta': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
    'Ir para o Site': { showPregacao: false, showAtoPastoral: false, showVisitacao: false },
  };

  React.useEffect(() => {
    if (currentRoute) {
      const routeConfig = routeMap[currentRoute.name];
      if (routeConfig) {
        showVisitacao(routeConfig.showVisitacao);
        showAtoPastoral(routeConfig.showAtoPastoral);
        showPregacao(routeConfig.showPregacao);
      }
    }
  }, [currentRoute]);

  return (
    <DrawerContentScrollView {...props}>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.24)" animated />
      <View style={styles.container}>
        <View style={styles.userArea}>
          <Image source={image} style={styles.user} />
          <Text style={styles.title}>Missão Evidente</Text>
        </View>
        {routesDrawerItem.map((route, index) => (
          <DrawerItem
            label={route.name}
            key={index}
            activeBackgroundColor='#0f5d39'
            activeTintColor='#fff'
            labelStyle={route.labelStyle}
            focused={
              getActiveRouteState(props.state.routes, props.state.index, route.name)
            }
            icon={({color}) => 
              <Icon size={21} name={route.icon} style={{color:color}}></Icon>
            }
            onPress={() => navigation.navigate(route.name)}
          />
        ))}
        {isShowAtoPastoral ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Ministração"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#0f5d39'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Ato Pastoral'
          )}
          icon={({color}) => 
            <Icon size={23} name={isShowAtoPastoral ? 'angle-up' : 'angle-down'} style={{color:color, marginLeft: 4}}></Icon>
          }
          onPress={()=>
            {showAtoPastoral(!isShowAtoPastoral)}
          }
        />
        {isShowAtoPastoral ? (
          <View>
            {routesMinistracaoDrawerItem.map((route, index) => (
              <DrawerItem
                label={route.name}
                key={index}
                activeBackgroundColor='#0f5d39'
                activeTintColor='#fff'
                labelStyle={route.labelStyle}
                drawerLabelStyle={route.drawerLabelStyle}
                style={route.style}
                focused={
                  getActiveRouteState(props.state.routes, props.state.index, route.name)
                }
                icon={({color}) => 
                  <Icon size={21} name={route.icon} style={{color:color}}></Icon>
                }
                onPress={() => navigation.navigate(route.name)}
              />
            ))}
          </View>
        ):null}
        {isShowAtoPastoral || isShowPregacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Ato Pastoral"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#0f5d39'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Pregação'
          )}
          icon={({color}) => 
            <Icon size={23} name={isShowPregacao ? 'angle-up' : 'angle-down'} style={{color:color, marginLeft: 4}}></Icon>
          }
          onPress={()=>
            {showPregacao(!isShowPregacao)}
          }
        />
        {isShowPregacao ? (
          <View>
            {routesAtoPastoralDrawerItem.map((route, index) => (
              <DrawerItem
                label={route.name}
                key={index}
                activeBackgroundColor='#0f5d39'
                activeTintColor='#fff'
                labelStyle={route.labelStyle}
                drawerLabelStyle={route.drawerLabelStyle}
                style={route.style}
                focused={
                  getActiveRouteState(props.state.routes, props.state.index, route.name)
                }
                icon={({color}) => 
                  <Icon size={21} name={route.icon} style={{color:color}}></Icon>
                }
                onPress={() => navigation.navigate(route.name)}
              />
            ))}
          </View>
        ):null}
        {isShowPregacao || isShowVisitacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Visitação"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#0f5d39'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Visitação'
          )}
          icon={({color}) => 
            <Icon size={23} name={isShowVisitacao ? 'angle-up' : 'angle-down'} style={{color:color, marginLeft: 4}}></Icon>
          }
          onPress={()=>
            {showVisitacao(!isShowVisitacao)}
          }
        />
        {isShowVisitacao ? (
          <View>
            {routesVisitacaoDrawerItem.map((route, index) => (
              <DrawerItem
                label={route.name}
                key={index}
                activeBackgroundColor='#0f5d39'
                activeTintColor='#fff'
                labelStyle={route.labelStyle}
                drawerLabelStyle={route.drawerLabelStyle}
                style={route.style}
                focused={
                  getActiveRouteState(props.state.routes, props.state.index, route.name)
                }
                icon={({color}) => 
                  <Icon size={21} name={route.icon} style={{color:color}}></Icon>
                }
                onPress={() => navigation.navigate(route.name)}
              />
            ))}
            
          </View>
        ):null}
        {isShowVisitacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Conta"
          icon={({color}) => 
            <Icon size={21} name={'user-circle'} style={{color:color}}></Icon>
          }
          onPress={() => {
            props.navigation.navigate("Conta");
          }}
        />
        <DrawerItem
          label="Ir para o Site"
          icon={({color}) => 
            <Icon size={21} name={'chrome'} style={{color:color}}></Icon>
          }
          onPress={() => {
            Linking.openURL('https://missaoevidente.com.br'); 
          }}
        />
        <DrawerItem
          label="Sair"
          icon={config => <Icon size={21} name={'sign-out-alt'}></Icon>}
          onPress={() => dispatch(logout())}
        />
      </View>
    </DrawerContentScrollView>
  );
}

//vejo qual rota está selecionado para estilizar o drawer item
const getActiveRouteState = function (routes, index, name) {
  return routes[index].name.trim().toLowerCase() === name.trim().toLowerCase();
};
  

const Drawer = createDrawerNavigator();

export default class AppRoutes extends Component{
  state = {
    isModalVisible:false
  }
  toggleModal = () =>{
    this.setState({isModalVisible: !this.state.isModalVisible});   
  }
  render(){
    return(
      <Drawer.Navigator 
        screenOptions={{
          drawerActiveBackgroundColor: '#0f5d39',
          drawerActiveTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#0f5d39',
          },
          headerTintColor: '#FFF',
          headerTitleStyle:{
            fontSize:16,
            color: '#fff'
          },
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.1}>
                <Icon size={24} style={{color: '#FFF'}} name={'question-circle'}></Icon>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isModalVisible}
                onRequestClose={() => {
                  this.toggleModal(false);
                }}>
                  <TouchableOpacity style={{flex:1}} activeOpacity={1}  onPress={() => this.toggleModal(false)} >
                    <View style={styles.centeredView}>
                      <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>Orientações de Uso</Text>
                          <View>
                            <Text>
                              Navegue pelo menu à esquerda para começar a utilizar os recursos. {'\n'}{'\n'}
                              Na tela inicial, arraste o dedo para baixo para manter os dados atualizados. {'\n'}{'\n'}
                              Para adicionar um registro basta tocar no círculo com ícone de +. {'\n'}{'\n'}
                              Para remover um registro deslize a caixa para à direita até o final. {'\n'}{'\n'}
                              Para editar um registro deslize a caixa para à esquerda e clique no ícone de editar.
                            </Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableOpacity>
              </Modal>
            </View>
          )
        }} 
        initialRouteName="Início" drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {routes.map((route, index) => (
          <Drawer.Screen key={index} name={route.name} component={route.component} options={{
            drawerItemStyle:{
              height:0
            },
          }}/>
        ))}
      </Drawer.Navigator>
    )
  }
}



const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  userArea:{
    marginTop: -500,
    paddingTop: 500,
    paddingBottom: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#0f5d39'
  },
  user:{
    width: 120,
    height: 120,
  },
  title:{
    marginTop: -18,
    marginBottom: 15,
    fontFamily: CommonStyles.fontFamily,
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
    color: '#FFF'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: -10,
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  },
})