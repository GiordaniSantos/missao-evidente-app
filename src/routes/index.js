import React, {Component, useContext} from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '../contexts/auth'
import { AuthContext } from '../contexts/auth'
    
//import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'

export default class Routes extends Component {
    static contextType = AuthContext;
    render(){
     

        if(this.context.loading){
            return(
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#999" />
                </View>
            )
        }

        
        return this.context.logado ? <AppRoutes/> : <AuthRoutes/>
    }
}

