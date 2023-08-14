import api from "../services/api";
import {Alert} from 'react-native'

interface Response {
    token: string;
    user: {
        name: string;
        email: string;
        id: number;
    }
}

export async function signIn(email: string, password: string): Promise<any>{
    try{
        const res =  await api.post(
            '/login',
            {
                email: email,
                password: password
            },
            {
                headers: {
                    'Accept': "application/json",
                    'Content-Type': 'multipart/form-data'
                }  
            }   
        );    
        return res.data;
    }catch(e){
        console.log(e)
    }
}