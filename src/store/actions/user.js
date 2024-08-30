import { USER_LOGGED_IN, USER_LOGGED_OUT, LOADING_USER, USER_LOADED, INIT_SPLASH_SCREEN, CLOSE_SPLASH_SCREEN } from "./actionTypes";
import { setMessage } from "./message";
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from "../../services/api";
import { fetchRelatorios } from "./dashboard";

export const userLogged = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export const logout = () => {
    AsyncStorage.clear()
    return {
        type: USER_LOGGED_OUT
    }
}

export const createUser = user => {
    return async dispatch => {
        dispatch(loadingUser())
        try{
            await api.post(`/signup`, {
                name: user.name,
                email: user.email,
                password: user.password,
            })

            dispatch(setMessage({
                type: 'success',
                text: 'Usuário cadastrado com sucesso! Lembre-se de utilizar um email válido para caso precise utilizar a recuperação de senha.'
            }))

            dispatch(login(user))
        } catch(e) {
            dispatch(setMessage({
                type: 'error',
                text: e.response.data.message
            }))
            dispatch(userLoaded())
        }
    }
}

export const loadingUser = () => {
    return {
        type: LOADING_USER
    }
}

export const userLoaded = () => {
    return {
        type: USER_LOADED
    }
}

export const initSplashScreen = () => {
    return {
        type: INIT_SPLASH_SCREEN
    }
}

export const closeSplashScreen = () => {
    return {
        type: CLOSE_SPLASH_SCREEN
    }
}

export const login = user => {
    return async dispatch => {
        dispatch(loadingUser())
        try{
            const res =  await api.post(
                '/login',
                {
                    email: user.email,
                    password: user.password
                }  
            );    
            
            if(res.data.user){
                api.defaults.headers.Authorization = `Bearer ${res.data.token}`
                api.defaults.params = { id_usuario: res.data.user.id }
                await AsyncStorage.setItem('@MEAuth:user', JSON.stringify(res.data.user))
                await AsyncStorage.setItem('@MEAuth:token', res.data.token)
                dispatch(userLogged(res.data.user))
                dispatch(userLoaded())
            }
        }catch(e){
            dispatch(setMessage({
                type: 'error',
                text: e.response.data.message
            }))
            dispatch(userLoaded())
        }
    }
}

export const verifyUserLogged = () => {
    return async dispatch => {
        const storageUser = await AsyncStorage.getItem('@MEAuth:user')
        const storageToken = await AsyncStorage.getItem('@MEAuth:token')
        
        if(storageUser && storageToken){
            dispatch(initSplashScreen())
            const user = JSON.parse(storageUser);
            api.defaults.headers.Authorization = `Bearer ${storageToken}`
            api.defaults.params = { id_usuario: user.id }
            dispatch(userLogged(user))
            dispatch(fetchRelatorios())
        }else{
            setTimeout(
                () => {dispatch(closeSplashScreen())},
                1000
            )
        }
    }
}