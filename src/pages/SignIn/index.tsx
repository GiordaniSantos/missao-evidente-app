import React from 'react';
import { View, Button } from 'react-native'
import { useAuth } from '../../contexts/auth';
import axios from 'axios'

const SignIn: React.FC = () => {
    const { logado, user, signIn } = useAuth();

    //console.log(logado)
    //console.log(user)

    function handleSignIn(){
        signIn("giordani.santos.silveira@gmail.com", "Dani@war13");   
    }

    return(
    <View style={{flex:1, justifyContent: 'center'}}>
        <Button title='Sign in' onPress={handleSignIn}/>
    </View>
    )
};

export default SignIn;