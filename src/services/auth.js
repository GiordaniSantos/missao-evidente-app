import api from "./api";
import { showError } from '../Common'

export async function signIn(email, password){
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
        showError(e)
    }
}