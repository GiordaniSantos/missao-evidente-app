import React, {Component} from 'react';
import SignIn from "../pages/SignIn";

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AuthStack = createNativeStackNavigator();

export default class AuthRoutes extends Component {
    render() {
        return(
            <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                <AuthStack.Screen name='SignIn' component={SignIn} />
            </AuthStack.Navigator>
        )
    }
};
