import React, {Component} from 'react';
import Welcome from '../pages/welcome';
import SignIn from "../pages/SignIn";
import SignUp from '../pages/SignUp';

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AuthStack = createNativeStackNavigator();

export default class AuthRoutes extends Component {
    render() {
        return(
            <AuthStack.Navigator>
                <AuthStack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }}/>
                <AuthStack.Screen name='Entrar' component={SignIn} />
                <AuthStack.Screen name='Registre-se' component={SignUp} />
            </AuthStack.Navigator>
        )
    }
};
