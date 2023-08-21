import React, {Component, useContext} from 'react';
import Membresia from "../pages/Membresia";
import AtosPastorais from '../pages/AtosPastorais';
import Pregacao from '../pages/Pregacao';
import VisitaCrente from '../pages/VisitaCrente';
import VisitaNaoCrente from '../pages/VisitaNaoCrente';
import VisitaPresidio from '../pages/VisitaPresidio';
import VisitaEnfermo from '../pages/VisitaEnfermo';
import VisitaHospital from '../pages/VisitaHospital';
import VisitaEscola from '../pages/VisitaEscola';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../contexts/auth';
import { Text, View, StyleSheet, Button } from 'react-native';
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
          icon={({color}) => <Icon size={21} name={'digital-tachograph'} style={{color:color}}></Icon>}
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
        <DrawerItem
          label="Atos Pastorais"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Atos Pastorais'
          )}
          icon={({color}) => <Icon size={21} name={'user-tie'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Atos Pastorais");
          }}
        />
        <DrawerItem
          label="Pregações"
          activeBackgroundColor='#015b41'
          activeTintColor='#fff'
          focused={getActiveRouteState(
            props.state.routes,
            props.state.index,
            'Pregações'
          )}
          icon={({color}) => <Icon size={21} name={'bible'} style={{color:color}}></Icon>}
          onPress={() => {
            props.navigation.navigate("Pregações");
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
                  <Icon size={24} style={{color: '#015b41'}} name={'question-circle'} onPress={this.toggleModal}></Icon>
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
                <Drawer.Screen name="Atos Pastorais" component={AtosPastorais} options={{
                    drawerItemStyle:{
                      height:0
                    },
                }}  />
                <Drawer.Screen name="Pregações" component={Pregacao} options={{
                  drawerItemStyle:{
                    height:0
                  },
                }}  />
                  <Drawer.Screen name="Visitas aos Crentes" component={VisitaCrente} options={{
                    drawerItemStyle:{
                      marginTop: -20
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
