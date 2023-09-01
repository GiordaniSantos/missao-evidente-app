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
import Discipulado from '../pages/Discipulado';
import { AuthContext } from '../contexts/auth';
import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import CommonStyles from '../CommonStyles';
import Modal from "react-native-modal";

import { createDrawerNavigator,  DrawerContentScrollView,DrawerItemList, DrawerItem } from '@react-navigation/drawer';

//estilizando o menu
//items, itemList do Drawer.screens e items
function CustomDrawerContent(props) {
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
          label="Dashboard"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          labelStyle={{marginLeft:-9}}
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Dashboard'
          )}
          icon={({color}) => <Icon size={21} name={'chart-bar'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Dashboard");
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
          icon={({color}) => <Icon size={21} name={'users'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Membresia aos Domingos");
          }}
        />
        <View style={{
          borderTopColor: '#cfcfcf',
          borderTopWidth: 1,
        }}></View>
        <DrawerItem
          label="Estudo"
          labelStyle={{marginLeft: -5}}
          drawerLabelStyle={{marginLeft: -5}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Estudo'
          )}
          icon={({color}) => <Icon size={21} name={'book'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Estudo");
          }}
        />
        <DrawerItem
          label="Sermão"
          labelStyle={{marginLeft: -5}}
          drawerLabelStyle={{marginLeft: -5}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Sermão'
          )}
          icon={({color}) => <Icon size={21} name={'user-tie'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Sermão");
          }}
        />
        <DrawerItem
          label="Estudo Biblico"
          labelStyle={{marginLeft: -5}}
          drawerLabelStyle={{marginLeft: -3}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Aprendizados Biblicos'
          )}
          icon={({color}) => <Icon size={21} name={'bible'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Aprendizados Biblicos");
          }}
        />
        <DrawerItem
          label="Discipulado"
          activeBackgroundColor='#015b41'
          labelStyle={{marginLeft: -10}}
          drawerLabelStyle={{marginLeft: -3}}
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Discipulado'
          )}
          icon={({color}) => <Icon size={21} name={'people-arrows'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Discipulado");
          }}
        />
        <View style={{
          borderTopColor: '#cfcfcf',
          borderTopWidth: 1,
        }}></View>
        <View style={{
          borderTopColor: '#cfcfcf',
          borderTopWidth: 1,
        }}></View>
        <DrawerItem
          label="Batismo Infantil"
          labelStyle={{marginLeft: -5}}
          drawerLabelStyle={{marginLeft: -5}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Batismo Infantil'
          )}
          icon={({color}) => <Icon size={21} name={'child'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Batismo Infantil");
          }}
        />
        <DrawerItem
          label="Batismo e Profissão de Fé"
          labelStyle={{marginLeft: -15}}
          drawerLabelStyle={{marginLeft: -5}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Batismo e Profissão de Fé'
          )}
          icon={({color}) => <Icon size={21} name={'praying-hands'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Batismo e Profissão de Fé");
          }}
        />
        <DrawerItem
          label="Benção Nupcial"
          labelStyle={{marginLeft: -13}}
          drawerLabelStyle={{marginLeft: -3}}
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Benção Nupcial'
          )}
          icon={({color}) => <Icon size={21} name={'hand-holding-heart'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Benção Nupcial");
          }}
        />
        <DrawerItem
          label="Santa Ceia"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Santa Ceia'
          )}
          icon={({color}) => <Icon size={21} name={'wine-glass-alt'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Santa Ceia");
          }}
        />
        <View style={{
          borderTopColor: '#cfcfcf',
          borderTopWidth: 1,
        }}></View>
        <DrawerItemList {...props} />
        <View style={{
          borderTopColor: '#cfcfcf',
          borderTopWidth: 1,
        }}></View>
        <DrawerItem
          label="Ir para o Site"
          icon={({color}) => <Icon size={21} name={'chrome'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Membresias");
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
  }
})

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
            <Drawer.Navigator screenOptions={{
              drawerActiveBackgroundColor: '#015b41',
              drawerActiveTintColor: '#fff',
              headerTitleStyle:{
                fontSize:16
              },
              headerRight: () => (
                <View style={{marginRight: 10}}>
                  <Icon size={24} style={{color: '#000'}} name={'question-circle'} onPress={this.toggleModal}></Icon>
                  <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.toggleModal(false)}>
                    <View style={{ flex: 1 }}>
                      <View style={{backgroundColor: 'white'}}> 
                        <Text>Hello!</Text>

                        <Button title="Fechar" onPress={this.toggleModal} />
                      </View>
                    </View>
                  </Modal>
                </View>
              )
              }} 
              initialRouteName="Dashboard" drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Dashboard" component={Dashboard} options={{
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
                  <Drawer.Screen name="Visitas aos Crentes" component={VisitaCrente} options={{
                    drawerItemStyle:{
                      marginTop: -73
                    },
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'cross'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Não Crentes" component={VisitaNaoCrente} options={{
                    labelStyle:{marginLeft: -15},
                    drawerLabelStyle:{
                      marginLeft: -5
                    },
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'heart-broken'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Presídios" component={VisitaPresidio} options={{
                    drawerLabelStyle:{
                      marginLeft: -9
                    },
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'user-lock'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Enfermos" component={VisitaEnfermo} options={{
                    drawerLabelStyle:{
                      marginLeft: -3
                    },
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'syringe'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Hospitais" component={VisitaHospital} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'hospital'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas às Escolas" component={VisitaEscola} options={{
                    drawerLabelStyle:{
                      marginLeft: -6
                    },
                    drawerIcon: ({color}) => 
                    <Icon size={21} style={{color:color}} name={'school'}></Icon>
                }}  />
            </Drawer.Navigator>
        )
    }
}
