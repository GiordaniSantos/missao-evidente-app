import React, {Component, useContext} from 'react';
import Membresia from "../pages/Membresia";
import AtosPastorais from '../pages/AtosPastorais';
import { AuthContext } from '../contexts/auth';
import Icon from 'react-native-vector-icons/FontAwesome5'

import { createDrawerNavigator,  DrawerContentScrollView,DrawerItemList, DrawerItem } from '@react-navigation/drawer';


function CustomDrawerContent(props) {
  context = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Pregação"
        icon={config => <Icon size={23} name={'bible'}></Icon>}
        onPress={() => {
          props.navigation.navigate('Membresias');
        }}
      />
      <DrawerItem
        label="Sair"
        icon={config => <Icon size={23} name={'sign-out-alt'}></Icon>}
        onPress={context.logout}
      />
    </DrawerContentScrollView>
  );
}
  

const Drawer = createDrawerNavigator();

export default class AppRoutes extends Component{
    render(){
        return(
            <Drawer.Navigator initialRouteName="Membresias" drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Membresias" component={Membresia} options={{
                    drawerIcon: config => 
                    <Icon size={23} name={'users'}></Icon>
                }} />
                <Drawer.Screen name="Atos Pastorais" component={AtosPastorais} options={{
                    drawerIcon: config => 
                    <Icon size={23} name={'user-tie'}></Icon>
                }}  />
            </Drawer.Navigator>
        )
    }
}
