import React, {Component} from 'react';
import Dashboard from "../pages/Dashboard";

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AppStack = createNativeStackNavigator();

export default class AppRoutes extends Component{
    render(){
        return(
            <AppStack.Navigator>
                <AppStack.Screen name='Dashboard' component={Dashboard} />
            </AppStack.Navigator>
        )
    }
}
