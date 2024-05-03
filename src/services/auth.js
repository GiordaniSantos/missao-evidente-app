import api from "./api";
import Alert from "../components/SweetAlert";

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
        Alert(e.response.data.message, 'error');
    }
}