import React, {Component, useContext} from 'react';
import Membresia from "../pages/Membresia";
import AtosPastorais from '../pages/AtosPastorais';
import Pregacao from '../pages/Pregacao';
import VisitaCrente from '../pages/VisitaCrente';
import VisitaNaoCrente from '../pages/VisitaNaoCrente';
import VisitaPresidio from '../pages/VisitaPresidio';
import VisitaEnfermo from '../pages/VisitaEnfermo';
import { AuthContext } from '../contexts/auth';
import { Text, View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import CommonStyles from '../CommonStyles';

import { createDrawerNavigator,  DrawerContentScrollView,DrawerItemList, DrawerItem } from '@react-navigation/drawer';


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
        <DrawerItemList {...props} />
        <DrawerItem
          label="Sair"
          icon={config => <Icon size={23} name={'sign-out-alt'}></Icon>}
          onPress={context.logout}
        />
      </View>
    </DrawerContentScrollView>
  );
}
  
const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  userArea:{
    marginTop: 15,
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
    fontSize: 15
  }
})

const Drawer = createDrawerNavigator();

export default class AppRoutes extends Component{
    render(){
        return(
            <Drawer.Navigator screenOptions={{
              drawerActiveBackgroundColor: '#015b41',
              drawerActiveTintColor: '#fff'
              }} 
              initialRouteName="Membresias" drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Membresias" component={Membresia} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'users'}></Icon>
                }} />
                <Drawer.Screen name="Atos Pastorais" component={AtosPastorais} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'user-tie'}></Icon>
                }}  />
                  <Drawer.Screen name="Pregações" component={Pregacao} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'bible'}></Icon>
                }}  />
                  <Drawer.Screen name="Visitas aos Crentes" component={VisitaCrente} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'cross'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Não Crentes" component={VisitaNaoCrente} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'heart-broken'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Presídios" component={VisitaPresidio} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'user-lock'}></Icon>
                }}  />
                <Drawer.Screen name="Visitas aos Enfermos" component={VisitaEnfermo} options={{
                    drawerIcon: ({color}) => 
                    <Icon size={23} style={{color:color}} name={'syringe'}></Icon>
                }}  />
            </Drawer.Navigator>
        )
    }
}
