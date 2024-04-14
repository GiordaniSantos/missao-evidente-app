import 'react-native-gesture-handler';
import React, {Component} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from "./contexts/auth"; 

import { Routes } from "./routes";

export default class App extends Component {
    render(){
        return (
            <NavigationContainer>
                <AuthProvider>
                    <Routes/>
                </AuthProvider>
            </NavigationContainer>
        )
    }
}
