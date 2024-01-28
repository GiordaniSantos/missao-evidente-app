import React, {Component, useContext} from 'react'
import { View, ActivityIndicator, StatusBar } from 'react-native'
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
                    <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.24)" animated />
                    <ActivityIndicator size="large" style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }} color="#0f5d39" />
                </View>
            )
        }

        
        return this.context.logado ? <AppRoutes/> : <AuthRoutes/>
    }
}

