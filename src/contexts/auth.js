import React, { createContext, useState, useEffect, useContext, Component } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as auth from "../services/auth";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({children}) {
        
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false); //mudar pra true depois
    

    useEffect(()=> {
        async function loadStoragedData() {
            const storageUser = await AsyncStorage.getItem('@RNAuth:user')
            const storageToken = await AsyncStorage.getItem('@RNAuth:token')
            
            //ver erro loading depois
            if(storageUser && storageToken){
                api.defaults.headers.Authorization = `Bearer ${storageToken}`

                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
        }   
        loadStoragedData()
    }, [])

    async function signIn(email, password) {
        const response = await auth.signIn(email, password);
        
        setUser(response.user)

        api.defaults.headers.Authorization = `Bearer ${response.token}`

        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user))
        await AsyncStorage.setItem('@RNAuth:token', response.token)
    }

    function logout() {
        AsyncStorage.clear().then(()=>{
            setUser(null);
        });
    }

   
    return( 
        <AuthContext.Provider value={{ logado: !!user, user, signIn, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
    
}

export function useAuth() {
    const context = useContext(AuthContext)

    return context
}