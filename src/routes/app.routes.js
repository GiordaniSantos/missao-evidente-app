import React, {Component, useContext} from 'react';
import Membresia from "../pages/Membresia";
import { AuthContext } from '../contexts/auth';

import { createDrawerNavigator,  DrawerContentScrollView,DrawerItemList, DrawerItem } from '@react-navigation/drawer';


function CustomDrawerContent(props) {
    context = useContext(AuthContext);
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Teste"
          onPress={() => {
            props.navigation.navigate('Membresias');
          }}
        />
        <DrawerItem
          label="Sair"
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
                <Drawer.Screen name="Membresias" component={Membresia} />
            </Drawer.Navigator>
        )
    }
}
