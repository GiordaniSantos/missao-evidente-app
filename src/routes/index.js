import React, {useEffect, useState} from 'react'
import NetInfo from "@react-native-community/netinfo"
import { useDispatch, useSelector } from 'react-redux';
import { verifyUserLogged } from '../store/actions/user';
import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import NoInternet from '../pages/NoInternet'
import Splash from '../pages/Splash';

export function Routes() {
  const [connState, setConnState] = useState(0);
  const dispatch = useDispatch();
  const isLoadingSplashScreen = useSelector(state => state.user.splashScreen);
  const userId = useSelector(state => state.user.id);

  useEffect(() => {
    dispatch(verifyUserLogged());

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

  if(connState && !connState.isConnected){
    return(
      <NoInternet />
    )
  }
    
  if(isLoadingSplashScreen){
    return(
      <Splash />
    )
  }
  
  return userId ? <AppRoutes/> : <AuthRoutes/>
}

