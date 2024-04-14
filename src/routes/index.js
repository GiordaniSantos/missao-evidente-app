import React, {useContext, useEffect, useState} from 'react'
import { View, ActivityIndicator, StatusBar } from 'react-native'
import { AuthContext } from '../contexts/auth'
import NetInfo from "@react-native-community/netinfo"
import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import NoInternet from '../pages/NoInternet'

export function Routes() {
  const context = useContext(AuthContext)
  const [connState, setConnState] = useState(0);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      setConnState(state);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setConnState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  //console.warn = () => {};

  if(connState && !connState.isConnected){
    return(
      <NoInternet />
    )
  }
    
  if(context.loading){
    return(
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0.24)" animated />
        <ActivityIndicator size="large" style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }} color="#0f5d39" />
      </View>
    )
  }

  return context.logado ? <AppRoutes/> : <AuthRoutes/>
}

