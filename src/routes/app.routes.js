import React, {Component, useContext} from 'react';
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
import { AuthContext } from '../contexts/auth';
import { Text, View, StyleSheet, Button, StatusBar, Pressable, Modal, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import CommonStyles from '../CommonStyles';
import Web from '../pages/Web';
import { createDrawerNavigator,  DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

//estilizando o menu
//items, itemList do Drawer.screens e items
function CustomDrawerContent(props) {
  const [isShowAtoPastoral,showAtoPastoral] = React.useState(false)
  const [isShowPregacao,showPregacao] = React.useState(false)
  const [isShowVisitacao,showVisitacao] = React.useState(false)

  //contexto
  context = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <StatusBar backgroundColor="rgb(255, 255, 255)" barStyle="dark-content"/>
      <View style={styles.container}>
        <View style={styles.userArea}>
          {/*<Image  styles={styles.user} />*/}
          <Text style={styles.nome}>{context.user.name}</Text>
          <Text style={styles.email}>{context.user.email}</Text>
        </View>
        <DrawerItem
          label="Início"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          labelStyle={{marginLeft:-9}}
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Início'
          )}
          icon={({color}) => 
            <Icon size={21} name={'home'} style={{color:color}}></Icon>
          }
          onPress={() => {
            {showAtoPastoral(false)}
            {showPregacao(false)}
            {showVisitacao(false)}
            props.navigation.navigate("Início");
          }}
        />
        <DrawerItem
          label="Relatório Anual"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          labelStyle={{marginLeft:-9}}
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Relatorio Anual'
          )}
          icon={({color}) => 
            <Icon size={21} name={'chart-bar'} style={{color:color}}></Icon>
          }
          onPress={() => {
            {showAtoPastoral(false)}
            {showPregacao(false)}
            {showVisitacao(false)}
            props.navigation.navigate("Relatorio Anual");
          }}
        />
        <DrawerItem
          label="Membresia"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          labelStyle={{marginLeft:-9}}
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Membresia aos Domingos'
          )}
          icon={({color}) => 
            <Icon size={21} name={'users'} style={{color:color}}></Icon>
          }
          onPress={() => {
            {showAtoPastoral(false)}
            {showPregacao(false)}
            {showVisitacao(false)}
            props.navigation.navigate("Membresia aos Domingos");
          }}
        />
        {isShowAtoPastoral ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Ato Pastoral"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#015b41'
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
            <DrawerItem
              label="Estudo"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Estudo'
              )}
              icon={({color}) => 
                <Icon size={21} name={'book'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showPregacao(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Estudo");
              }}
            />
            <DrawerItem
              label="Sermão"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Sermão'
              )}
              icon={({color}) => 
                <Icon size={21} name={'user-tie'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showPregacao(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Sermão");
              }}
            />
            <DrawerItem
              label="Estudo Biblico"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -3}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Aprendizados Biblicos'
              )}
              icon={({color}) => 
                <Icon size={21} name={'bible'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showPregacao(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Aprendizados Biblicos");
              }}
            />
            <DrawerItem
              label="Discipulado"
              activeBackgroundColor='#015b41'
              labelStyle={{marginLeft: -10}}
              drawerLabelStyle={{marginLeft: -3}}
              style={{marginLeft:20, marginRight:20}}
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Discipulado'
              )}
              icon={({color}) =>
                <Icon size={21} name={'people-arrows'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showPregacao(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Discipulado");
              }}
            />
          </View>
        ):null}
        {isShowAtoPastoral || isShowPregacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Pregação"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#015b41'
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
            <DrawerItem
              label="Batismo Infantil"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Batismo Infantil'
              )}
              icon={({color}) => 
                <Icon size={21} name={'child'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Batismo Infantil");
              }}
            />
            <DrawerItem
              label="Batismo e Profissão de Fé"
              labelStyle={{marginLeft: -15}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Batismo e Profissão de Fé'
              )}
              icon={({color}) => 
                <Icon size={21} name={'praying-hands'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Batismo e Profissão de Fé");
              }}
            />
            <DrawerItem
              label="Benção Nupcial"
              labelStyle={{marginLeft: -13}}
              drawerLabelStyle={{marginLeft: -3}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Benção Nupcial'
              )}
              icon={({color}) => <Icon size={21} name={'hand-holding-heart'} style={{color:color}}></Icon>}
              onPress={() => {
                {showAtoPastoral(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Benção Nupcial");
              }}
            />
            <DrawerItem
              label="Santa Ceia"
              activeBackgroundColor='#015b41'
              style={{marginLeft:20, marginRight:20}}
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Santa Ceia'
              )}
              icon={({color}) => 
                <Icon size={21} name={'wine-glass-alt'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showVisitacao(false)}
                props.navigation.navigate("Santa Ceia");
              }}
            />
          </View>
        ):null}
        {isShowPregacao || isShowVisitacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Visitação"
          labelStyle={{marginLeft: -2}}
          drawerLabelStyle={{marginLeft: -2}}
          activeBackgroundColor='#015b41'
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
            <DrawerItem
              label="Visitas aos Crentes"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas aos Crentes'
              )}
              icon={({color}) => 
                <Icon size={21} name={'cross'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas aos Crentes");
              }}
            />
            <DrawerItem
              label="Visitas aos Não Crentes"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas aos Não Crentes'
              )}
              icon={({color}) => 
                <Icon size={21} name={'heart-broken'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas aos Não Crentes");
              }}
            />
            <DrawerItem
              label="Visitas aos Presídios"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas aos Presídios'
              )}
              icon={({color}) => 
                <Icon size={21} name={'user-lock'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas aos Presídios");
              }}
            />
           <DrawerItem
              label="Visitas aos Enfermos"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas aos Enfermos'
              )}
              icon={({color}) => <Icon size={21} name={'syringe'} style={{color:color}}></Icon>}
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas aos Enfermos");
              }}
            />
            <DrawerItem
              label="Visitas aos Hospitais"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas aos Hospitais'
              )}
              icon={({color}) => 
                <Icon size={21} name={'hospital'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas aos Hospitais");
              }}
            />
            <DrawerItem
              label="Visitas às Escolas"
              labelStyle={{marginLeft: -5}}
              drawerLabelStyle={{marginLeft: -5}}
              style={{marginLeft:20, marginRight:20}}
              activeBackgroundColor='#015b41'
              activeTintColor='#fff'
              focused={getActiveRouteState(
                props.state.routes,
                props.state.index,
                'Visitas às Escolas'
              )}
              icon={({color}) => 
                <Icon size={21} name={'school'} style={{color:color}}></Icon>
              }
              onPress={() => {
                {showAtoPastoral(false)}
                {showPregacao(false)}
                props.navigation.navigate("Visitas às Escolas");
              }}
            />
          </View>
        ):null}
        {isShowVisitacao ? ( <View style={{borderTopColor: '#cfcfcf',borderTopWidth: 1,}}></View> ) : null}
        <DrawerItem
          label="Ir para o Site"
          icon={({color}) => 
            <Icon size={21} name={'chrome'} style={{color:color}}></Icon>
          }
          onPress={() => {
            {showAtoPastoral(false)}
            {showPregacao(false)}
            {showVisitacao(false)}
            props.navigation.navigate("Site");
          }}
        />
        <DrawerItem
          label="Sair"
          icon={config => <Icon size={21} name={'sign-out-alt'}></Icon>}
          onPress={context.logout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

//vejo qual rota está selecionado para estilizar o drawer item
const getActiveRouteState = function (routes, index, name) {
  return routes[index].name.toLowerCase().indexOf(name.toLowerCase()) >= 0;
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
          drawerActiveBackgroundColor: '#015b41',
          drawerActiveTintColor: '#fff',
          headerTitleStyle:{
            fontSize:16
          },
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <TouchableOpacity onPress={this.toggleModal} activeOpacity={0.1}>
                <Icon size={24} style={{color: '#000'}} name={'question-circle'}></Icon>
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
                          <View style={{textAlign:'justify'}}>
                            <Text>
                              Navegue pelo menu à esquerda para começar a utilizar os recursos. {'\n'}{'\n'}
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
        <Drawer.Screen name="Início" component={Dashboard} options={{
          drawerItemStyle:{
            height:0
          },
        }} />
         <Drawer.Screen name="Relatorio Anual" component={RelatorioAnual} options={{
          drawerItemStyle:{
            height:0
          },
        }} />
        <Drawer.Screen name="Membresia aos Domingos" component={Membresia} options={{
          drawerItemStyle:{
            height:0
          },
        }} />
        <Drawer.Screen name="Batismo Infantil" component={BatismoInfantil} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Batismo e Profissão de Fé" component={BatismoProfissaoFe} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Estudo" component={Estudo} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Sermão" component={Sermao} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Aprendizados Biblicos" component={EstudoBiblico} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Discipulado" component={Discipulado} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Benção Nupcial" component={BencaoNupcial} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Santa Ceia" component={SantaCeia} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Site" component={Web} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas aos Crentes" component={VisitaCrente} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas aos Não Crentes" component={VisitaNaoCrente} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas aos Presídios" component={VisitaPresidio} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas aos Enfermos" component={VisitaEnfermo} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas aos Hospitais" component={VisitaHospital} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
        <Drawer.Screen name="Visitas às Escolas" component={VisitaEscola} options={{
          drawerItemStyle:{
            height:0
          },
        }}  />
      </Drawer.Navigator>
    )
  }
}



const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  userArea:{
    marginTop: 13,
    marginLeft: 15,
    marginBottom: 15
  },
  user:{
    width: 55,
    height: 55,
  },
  nome:{
    fontFamily: CommonStyles.fontFamily,
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold'
  },
  email:{
    fontFamily: CommonStyles.fontFamily,
    fontSize: 14
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
  },
})