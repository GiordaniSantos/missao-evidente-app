import React, { useEffect, useState } from 'react';
import Welcome from '../pages/welcome';
import SignIn from "../pages/SignIn";
import SignUp from '../pages/SignUp';
import { Linking } from 'react-native';
import ModifyPassword from '../pages/ModifyPassword';
import RequestPassword from '../pages/RequestPassword';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const AuthStack = createNativeStackNavigator();

const AuthRoutes = () => {
    const navigation = useNavigation();
    const [initialURL, setInitialURL] = useState(null);

    useEffect(() => {
        const handleOpenURL = (event) => {
            const url = event.url;
            if(event.url){
                const urlParts = url.split('?');
                if (urlParts.length > 1) {
                    const queryParams = urlParts[1].split('&');
                    let token;
                    for (let param of queryParams) {
                        if (param.startsWith('token=')) {
                            token = param.split('=')[1];
                            break;
                        }
                    }
                    if (url.startsWith('missaoevidente://missaoevidenteapp.com.br/modify-password')) {
                        navigation.navigate('Redefinir Senha', { token: token });
                    }
                }
            }
        };

        Linking.getInitialURL().then((url) => {
            setInitialURL(url);
            handleOpenURL({ url });
        });

        const urlListener = Linking.addEventListener('url', handleOpenURL);

        return () => {
            urlListener.remove();
        };
    }, []);

    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }}/>
            <AuthStack.Screen name='Entrar' component={SignIn} />
            <AuthStack.Screen name='Redefinição de Senha' component={RequestPassword} />
            <AuthStack.Screen name='Registre-se' component={SignUp} />
            <AuthStack.Screen name='Redefinir Senha' component={ModifyPassword} />
        </AuthStack.Navigator>
    );
};

export default AuthRoutes;